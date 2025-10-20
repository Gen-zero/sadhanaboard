const db = require('../config/db');
const notificationService = require('./notificationService');
const logAnalytics = require('./logAnalyticsService');

// In-memory suppression cache (simple placeholder)
const recentAlerts = new Map();

/**
 * Evaluate a rule condition object against a log entry.
 * Supports: matchAction, severity, ipRange, category, riskScoreThreshold,
 * regexPattern, timeWindow, userRole and combinedConditions (AND/OR).
 */
function evaluateCondition(logEntry, conditions) {
  if (!conditions || typeof conditions !== 'object') return false;

  // Combined conditions (recursive)
  if (conditions.combinedConditions) {
    const cc = conditions.combinedConditions;
    const sub = Array.isArray(cc.conditions) ? cc.conditions : [];
    if (cc.operator === 'AND') return sub.every(c => evaluateCondition(logEntry, c));
    if (cc.operator === 'OR') return sub.some(c => evaluateCondition(logEntry, c));
    return false;
  }

  let matched = true;

  try {
    if (conditions.matchAction && logEntry.action) {
      matched = matched && String(logEntry.action).toLowerCase().includes(String(conditions.matchAction).toLowerCase());
    }

    if (conditions.severity) {
      const sev = Array.isArray(conditions.severity) ? conditions.severity : [conditions.severity];
      matched = matched && sev.includes(logEntry.severity);
    }

    if (conditions.ipRange && logEntry.ip_address) {
      const ranges = Array.isArray(conditions.ipRange) ? conditions.ipRange : [conditions.ipRange];
      const ipMatched = ranges.some(range => {
        if (typeof range !== 'string') return false;
        if (range.includes('/')) {
          // Basic CIDR-ish prefix check: compare first 3 octets for /24, or first 2 for /16
          const [prefix, bits] = range.split('/');
          const octetsPrefix = prefix.split('.');
          const octetsIp = String(logEntry.ip_address).split('.');
          if (!octetsPrefix.length || !octetsIp.length) return false;
          if (Number(bits) >= 24) {
            return octetsIp.slice(0, 3).join('.') === octetsPrefix.slice(0, 3).join('.');
          }
          if (Number(bits) >= 16) {
            return octetsIp.slice(0, 2).join('.') === octetsPrefix.slice(0, 2).join('.');
          }
          return String(logEntry.ip_address).startsWith(prefix);
        }
        return String(logEntry.ip_address) === String(range);
      });
      matched = matched && ipMatched;
    }

    if (conditions.category) {
      const cats = Array.isArray(conditions.category) ? conditions.category : [conditions.category];
      matched = matched && cats.includes(logEntry.category);
    }

    if (typeof conditions.riskScoreThreshold !== 'undefined') {
      const score = Number(logEntry.risk_score || 0);
      matched = matched && (score >= Number(conditions.riskScoreThreshold));
    }

    if (conditions.regexPattern && conditions.regexPattern.field && conditions.regexPattern.pattern) {
      try {
        const field = conditions.regexPattern.field;
        const pattern = new RegExp(conditions.regexPattern.pattern, 'i');
        matched = matched && pattern.test(String(logEntry[field] || ''));
      } catch (e) {
        // invalid regex -> treat as non-match
        matched = false;
      }
    }

    if (conditions.timeWindow) {
      const start = Number(conditions.timeWindow.start || 0);
      const end = Number(conditions.timeWindow.end || 23);
      const ts = new Date(logEntry.created_at || Date.now()).getHours();
      matched = matched && (ts >= start && ts <= end);
    }

    if (conditions.userRole && logEntry.metadata && logEntry.metadata.role) {
      const roles = Array.isArray(conditions.userRole) ? conditions.userRole : [conditions.userRole];
      matched = matched && roles.includes(logEntry.metadata.role);
    }
  } catch (e) {
    // Any error while evaluating a condition should default to non-match for safety
    return false;
  }

  return matched;
}

module.exports = {
  async evaluateAlertRules(logEntry) {
    try {
      const res = await db.query(`SELECT * FROM log_alert_rules WHERE enabled = true`);
      const rules = res.rows || [];
      const triggered = [];
      for (const rule of rules) {
        const cond = rule.conditions || {};
        try {
          if (evaluateCondition(logEntry, cond)) {
            triggered.push({ rule, logEntry });
          }
        } catch (e) {
          // ignore bad rule condition parsing for safety
        }
      }
      // trigger alerts for each unique rule
      for (const t of triggered) {
        try {
          // use t.rule (the matched rule) for severity threshold
          const sev = (t.rule && t.rule.severity_threshold) || 'warn';
          await this.triggerAlert(t.rule.id, logEntry, sev);
        } catch (e) { console.error('triggerAlert error', e); }
      }
      return triggered.length > 0;
    } catch (e) {
      console.error('evaluateAlertRules error', e);
      return false;
    }
  },

  async triggerAlert(ruleId, logEntry, severity = 'warn') {
    try {
      // suppression key
      const key = `${ruleId}:${logEntry.correlation_id || logEntry.ip_address || 'global'}`;
      const last = recentAlerts.get(key) || 0;
      const now = Date.now();
      if (now - last < (60 * 1000)) return; // suppress duplicates within 60s
      recentAlerts.set(key, now);

      // create security event
      const sev = await logAnalytics.createSecurityEvent({ logId: logEntry.id, eventType: 'alert_trigger', threatLevel: severity, detectionRule: String(ruleId) });

      // notify channels: for now broadcast via Socket.IO if server attaches global io
      if (global.__ADMIN_IO__) {
        try { global.__ADMIN_IO__.to('admins').emit('security:alert', { event: sev, log: logEntry }); } catch (e) { console.error('socket emit failed', e); }
      }

      // send notifications via configured channels (placeholder)
      // load rule channels
      const r = await db.query('SELECT notification_channels FROM log_alert_rules WHERE id = $1', [ruleId]).catch(() => null);
      const channels = (r && r.rows && r.rows[0] && r.rows[0].notification_channels) || [];
      for (const ch of channels) {
        try {
          if (ch.type === 'email') {
            await notificationService.sendEmailAlert(ch.recipients || [], { ruleId, logEntry, severity });
          } else if (ch.type === 'webhook') {
            await notificationService.sendWebhookAlert(ch.url, { ruleId, logEntry, severity });
          }
        } catch (e) { console.error('notify channel failed', e); }
      }

    } catch (e) {
      console.error('triggerAlert error', e);
    }
  },

  async createAlertRule(ruleName, conditions, channels = [], createdBy = null) {
    try {
      const res = await db.query(`INSERT INTO log_alert_rules(rule_name, conditions, notification_channels, created_by) VALUES($1,$2,$3,$4) RETURNING *`, [ruleName, conditions, channels, createdBy]);
      return res.rows[0];
    } catch (e) {
      console.error('createAlertRule error', e);
      return null;
    }
  },

  async listAlertRules() {
    try {
      const res = await db.query('SELECT * FROM log_alert_rules ORDER BY id DESC');
      return res.rows;
    } catch (e) {
      console.error('listAlertRules error', e);
      return [];
    }
  }
};
