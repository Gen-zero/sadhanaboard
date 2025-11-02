const adminAuthService = require('../services/adminAuthService');
const PermissionsService = require('../services/permissionsService');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const logAnalytics = require('../services/logAnalyticsService');
const alertService = require('../services/alertService');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Missing required environment variable JWT_SECRET for adminAuth middleware');
}
const ADMIN_COOKIE = 'admin_token';

// Session timeout configuration (1 hour default)
const SESSION_TIMEOUT_MINUTES = process.env.ADMIN_SESSION_TIMEOUT_MINUTES || 60;

// Inactivity timeout configuration (30 minutes default)
const INACTIVITY_TIMEOUT_MINUTES = process.env.ADMIN_INACTIVITY_TIMEOUT_MINUTES || 30;

// Activity tracking configuration
const ACTIVITY_TRACKING_ENABLED = process.env.ADMIN_ACTIVITY_TRACKING_ENABLED !== 'false';

function parseCookie(header) {
  if (!header) return {};
  return header.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    acc[decodeURIComponent(key)] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

function setAdminCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: SESSION_TIMEOUT_MINUTES * 60 * 1000 // Convert minutes to milliseconds
  });
}

// Enhanced admin logging function (backwards-compatible signature)
async function logAdminAction(userId, action, targetType = null, targetId = null, details = null, opts = {}) {
  try {
    const ip_address = (opts && opts.ip) || null;
    const user_agent = (opts && opts.userAgent) || null;
    const session_id = (opts && opts.sessionId) || null;
    const correlation_id = (opts && opts.correlationId) || null;
    const severity = (opts && opts.severity) || 'info';
    const category = (opts && opts.category) || null;
    const metadata = (opts && opts.metadata) || null;

    const entry = {
      admin_id: userId,
      action,
      target_type: targetType,
      target_id: targetId,
      details: details || null,
      severity,
      category,
      ip_address,
      user_agent,
      session_id,
      correlation_id,
      metadata
    };

  // Insert enriched log and capture inserted row
  const inserted = await logAnalytics.insertEnrichedLog(entry);

    // Run threat detection and evaluate alert rules in background (do not block)
    (async () => {
      try {
        const detection = await logAnalytics.detectSecurityThreats(entry);
        if (detection && detection.detected) {
          // create security event and trigger alert, correlate to inserted log
          const created = await logAnalytics.createSecurityEvent({ logId: inserted && inserted.id ? inserted.id : null, eventType: detection.rule || 'threat', threatLevel: detection.threatLevel || 'medium', detectionRule: detection.rule, correlation_id: inserted && inserted.correlation_id ? inserted.correlation_id : null });
          try { await alertService.evaluateAlertRules(entry); } catch (e) { console.error('Alert evaluation failed:', e); }
        } else {
          try { await alertService.evaluateAlertRules(entry); } catch (e) { /* best-effort */ }
        }
      } catch (e) { console.error('Threat detection background error:', e); }
    })();

  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}

// Function to check user activity and detect inactivity
async function checkUserActivity(userId) {
  try {
    // Get the last activity timestamp for the user
    const result = await db.query(
      `SELECT MAX(created_at) as last_activity 
       FROM admin_logs 
       WHERE admin_id = $1 AND action = 'USER_ACTIVITY'`,
      [userId]
    );
    
    if (result.rows.length > 0 && result.rows[0].last_activity) {
      const lastActivity = new Date(result.rows[0].last_activity);
      const now = new Date();
      const inactivityMinutes = (now - lastActivity) / (1000 * 60);
      
      return {
        lastActivity: lastActivity.toISOString(),
        inactivityMinutes: inactivityMinutes,
        isInactive: inactivityMinutes > INACTIVITY_TIMEOUT_MINUTES
      };
    }
    
    return {
      lastActivity: null,
      inactivityMinutes: 0,
      isInactive: false
    };
  } catch (error) {
    console.error('Failed to check user activity:', error);
    return {
      lastActivity: null,
      inactivityMinutes: 0,
      isInactive: false
    };
  }
}

const adminAuthenticate = (req, res, next) => {
  try {
    const cookies = req.cookies || parseCookie(req.headers.cookie || '');
    // Authorization header has priority
    let token = null;
    const authHeader = req.headers && (req.headers.authorization || req.headers.Authorization);
    if (authHeader && typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      token = cookies[ADMIN_COOKIE];
    }
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    
    // Check if token was issued too long ago (session timeout)
    if (decoded.iat) {
      const sessionAgeMinutes = (currentTime - decoded.iat) / 60;
      if (sessionAgeMinutes > SESSION_TIMEOUT_MINUTES) {
        return res.status(401).json({ message: 'Session expired. Please log in again.' });
      }
    }
    
    // Check for inactivity timeout if enabled
    if (ACTIVITY_TRACKING_ENABLED && INACTIVITY_TIMEOUT_MINUTES > 0) {
      // Check user activity in background (don't block the request)
      checkUserActivity(decoded.userId).then(activity => {
        if (activity.isInactive) {
          console.warn(`User ${decoded.userId} session timed out due to inactivity (${activity.inactivityMinutes} minutes)`);
        }
      }).catch(err => {
        console.error('Failed to check user activity for inactivity timeout:', err);
      });
    }
    
    // allow any role that marks admin intent, or explicit admin flag
    const allowedAdminRoles = ['admin', 'super_admin', 'moderator', 'content_manager', 'analyst'];
    if (!decoded || !decoded.admin || (!decoded.role && !decoded.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (decoded.role && !allowedAdminRoles.includes(decoded.role) && !decoded.admin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.user = { id: decoded.userId || 0, role: decoded.role || 'admin', username: decoded.username || null };
    // Attach both the raw logger and a request-bound secure logger that auto-injects context
    req.logAdminAction = logAdminAction;
    req.secureLog = (action, targetType = null, targetId = null, details = null, opts = {}) => {
      const ip = req.ip || req.headers['x-forwarded-for'] || (req.connection && req.connection.remoteAddress) || null;
      const ua = req.headers['user-agent'] || null;
      const sessionId = req.sessionID || (req.cookies && req.cookies['session_id']) || null;
      const correlationId = (opts && opts.correlationId) || require('uuid').v4();

      // best-effort UA parse and geo lookup without failing if packages not installed
      const metadata = opts.metadata || {};
      try {
        // UA parse
        let UAParser;
        try { UAParser = require('ua-parser-js'); } catch (e) { UAParser = null; }
        if (UAParser && ua) {
          try { metadata.user_agent_parsed = new UAParser(ua).getResult(); } catch (e) { /* ignore */ }
        }
        // geo lookup
        let geoip = null;
        try { geoip = require('geoip-lite'); } catch (e) { geoip = null; }
        if (geoip && ip) {
          try { metadata.geo_location = geoip.lookup(String(ip).split(',')[0]); } catch (e) { /* ignore */ }
        }
      } catch (e) { /* swallow enrichment errors */ }

      return req.logAdminAction(req.user.id, action, targetType, targetId, details, { ...opts, ip, userAgent: ua, sessionId, correlationId, metadata });
    };
    
    // Log user activity for monitoring
    if (ACTIVITY_TRACKING_ENABLED && typeof req.secureLog === 'function') {
      req.secureLog('USER_ACTIVITY', 'session', req.user.id, { 
        endpoint: req.originalUrl,
        method: req.method,
        userAgent: req.headers['user-agent']
      }, { category: 'activity' });
    }
    
    // Refresh inactivity window by re-issuing cookie with new expiry
    const refreshed = jwt.sign({ userId: req.user.id, username: req.user.username, role: req.user.role, admin: true }, JWT_SECRET, { expiresIn: `${SESSION_TIMEOUT_MINUTES}m` });
    if (typeof res.cookie === 'function') {
      setAdminCookie(res, refreshed);
    }
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// RBAC middleware functions
const requirePermission = (permission) => {
  return PermissionsService.checkPermission(permission);
};

const requireResourceAccess = (resource, action) => {
  return PermissionsService.checkResourceAccess(resource, action);
};

module.exports = { 
  adminAuthenticate, 
  setAdminCookie, 
  ADMIN_COOKIE, 
  logAdminAction,
  requirePermission,
  requireResourceAccess,
  checkUserActivity
};