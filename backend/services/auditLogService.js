/**
 * Audit Log Service
 * Comprehensive logging for security events, user actions, and compliance
 */

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

/**
 * Audit Event Types
 */
const EVENT_TYPES = {
  // Authentication events
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_FAILED: 'AUTH_FAILED',
  AUTH_TOKEN_REFRESH: 'AUTH_TOKEN_REFRESH',
  AUTH_PASSWORD_CHANGE: 'AUTH_PASSWORD_CHANGE',
  AUTH_2FA_ENABLE: 'AUTH_2FA_ENABLE',
  AUTH_2FA_DISABLE: 'AUTH_2FA_DISABLE',

  // User management events
  USER_CREATE: 'USER_CREATE',
  USER_UPDATE: 'USER_UPDATE',
  USER_DELETE: 'USER_DELETE',
  USER_ROLE_CHANGE: 'USER_ROLE_CHANGE',
  USER_SUSPEND: 'USER_SUSPEND',
  USER_ACTIVATE: 'USER_ACTIVATE',

  // Data access events
  DATA_READ: 'DATA_READ',
  DATA_CREATE: 'DATA_CREATE',
  DATA_UPDATE: 'DATA_UPDATE',
  DATA_DELETE: 'DATA_DELETE',
  DATA_EXPORT: 'DATA_EXPORT',

  // Security events
  SECURITY_PERMISSION_DENIED: 'SECURITY_PERMISSION_DENIED',
  SECURITY_RATE_LIMIT: 'SECURITY_RATE_LIMIT',
  SECURITY_SUSPICIOUS_ACTIVITY: 'SECURITY_SUSPICIOUS_ACTIVITY',
  SECURITY_API_KEY_USED: 'SECURITY_API_KEY_USED',

  // System events
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  SYSTEM_WARNING: 'SYSTEM_WARNING',
  SYSTEM_CONFIG_CHANGE: 'SYSTEM_CONFIG_CHANGE',
  SYSTEM_BACKUP: 'SYSTEM_BACKUP',
};

/**
 * Severity Levels
 */
const SEVERITY_LEVELS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

/**
 * Audit Log Service
 */
class AuditLogService extends EventEmitter {
  constructor(options = {}) {
    super();

    this.logsDirectory = options.logsDirectory || path.join(process.cwd(), 'logs', 'audit');
    this.maxLogSize = options.maxLogSize || 100 * 1024 * 1024; // 100MB
    this.retention = options.retention || 365; // days
    this.enableConsole = options.enableConsole !== false;
    this.enableFile = options.enableFile !== false;
    this.enableDatabase = options.enableDatabase || false;

    // Ensure logs directory exists
    if (this.enableFile && !fs.existsSync(this.logsDirectory)) {
      fs.mkdirSync(this.logsDirectory, { recursive: true });
    }

    // In-memory event queue for real-time processing
    this.eventQueue = [];
    this.maxQueueSize = options.maxQueueSize || 10000;

    // Suspicious activity tracking
    this.suspiciousActivityThresholds = options.suspiciousActivityThresholds || {
      failedLoginAttempts: 5,
      failedLoginWindow: 15 * 60 * 1000, // 15 minutes
      rapidDataAccess: 100, // requests per minute
      unusualTimeAccess: true, // Flag unusual hours
    };

    this.activityTracker = new Map();
  }

  /**
   * Log an audit event
   */
  async log(eventType, details = {}) {
    const event = {
      timestamp: new Date().toISOString(),
      eventType,
      userId: details.userId || null,
      username: details.username || null,
      ipAddress: details.ipAddress || null,
      userAgent: details.userAgent || null,
      severity: details.severity || SEVERITY_LEVELS.LOW,
      resource: details.resource || null,
      action: details.action || null,
      status: details.status || 'success',
      description: details.description || '',
      metadata: details.metadata || {},
      sessionId: details.sessionId || null,
      error: details.error || null,
    };

    // Check for suspicious activity
    const isSuspicious = await this._checkSuspiciousActivity(event);
    if (isSuspicious) {
      event.flagged = true;
      event.suspiciousReason = isSuspicious;
      event.severity = Math.max(event.severity, SEVERITY_LEVELS.HIGH);
    }

    // Add to queue
    this._addToQueue(event);

    // Log to different destinations
    if (this.enableConsole) {
      this._logToConsole(event);
    }

    if (this.enableFile) {
      await this._logToFile(event);
    }

    if (this.enableDatabase) {
      await this._logToDatabase(event);
    }

    // Emit event for real-time listeners
    this.emit('audit', event);

    return event;
  }

  /**
   * Log authentication attempt
   */
  async logAuthAttempt(userId, username, ipAddress, success, reason = null) {
    const eventType = success ? EVENT_TYPES.AUTH_LOGIN : EVENT_TYPES.AUTH_FAILED;

    return this.log(eventType, {
      userId,
      username,
      ipAddress,
      status: success ? 'success' : 'failed',
      severity: success ? SEVERITY_LEVELS.LOW : SEVERITY_LEVELS.MEDIUM,
      description: success ? 'User login' : `Login failed: ${reason}`,
      metadata: { reason },
    });
  }

  /**
   * Log data access
   */
  async logDataAccess(userId, action, resource, resourceId, ipAddress, details = {}) {
    const actions = {
      'read': EVENT_TYPES.DATA_READ,
      'create': EVENT_TYPES.DATA_CREATE,
      'update': EVENT_TYPES.DATA_UPDATE,
      'delete': EVENT_TYPES.DATA_DELETE,
      'export': EVENT_TYPES.DATA_EXPORT,
    };

    return this.log(actions[action] || EVENT_TYPES.DATA_READ, {
      userId,
      ipAddress,
      resource,
      action,
      status: 'success',
      severity: action === 'delete' ? SEVERITY_LEVELS.HIGH : SEVERITY_LEVELS.LOW,
      description: `${action} operation on ${resource}`,
      metadata: { resourceId, ...details },
    });
  }

  /**
   * Log security event
   */
  async logSecurityEvent(eventType, userId, ipAddress, details = {}) {
    return this.log(eventType, {
      userId,
      ipAddress,
      severity: SEVERITY_LEVELS.HIGH,
      status: 'blocked',
      description: details.description || eventType,
      ...details,
    });
  }

  /**
   * Log permission denial
   */
  async logPermissionDenial(userId, ipAddress, action, resource) {
    return this.log(EVENT_TYPES.SECURITY_PERMISSION_DENIED, {
      userId,
      ipAddress,
      action,
      resource,
      severity: SEVERITY_LEVELS.MEDIUM,
      status: 'denied',
      description: `Permission denied for ${action} on ${resource}`,
    });
  }

  /**
   * Log rate limit hit
   */
  async logRateLimit(userId, ipAddress, endpoint, limit, window) {
    return this.log(EVENT_TYPES.SECURITY_RATE_LIMIT, {
      userId,
      ipAddress,
      resource: endpoint,
      severity: SEVERITY_LEVELS.MEDIUM,
      status: 'rate_limited',
      description: `Rate limit exceeded: ${limit} requests per ${window}`,
      metadata: { limit, window },
    });
  }

  /**
   * Log system event
   */
  async logSystemEvent(eventType, severity, description, metadata = {}) {
    return this.log(eventType, {
      severity,
      status: 'info',
      description,
      metadata,
    });
  }

  /**
   * Get audit logs with filtering
   */
  async getLogs(filters = {}) {
    let logs = [...this.eventQueue];

    // Apply filters
    if (filters.userId) {
      logs = logs.filter(log => log.userId === filters.userId);
    }

    if (filters.eventType) {
      logs = logs.filter(log => log.eventType === filters.eventType);
    }

    if (filters.severity) {
      logs = logs.filter(log => log.severity >= filters.severity);
    }

    if (filters.ipAddress) {
      logs = logs.filter(log => log.ipAddress === filters.ipAddress);
    }

    if (filters.flagged) {
      logs = logs.filter(log => log.flagged === filters.flagged);
    }

    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      logs = logs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= start && logDate <= end;
      });
    }

    // Sort by timestamp descending
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Pagination
    const limit = filters.limit || 100;
    const offset = filters.offset || 0;

    return {
      total: logs.length,
      logs: logs.slice(offset, offset + limit),
    };
  }

  /**
   * Get user activity summary
   */
  async getUserActivity(userId, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.getLogs({
      userId,
      startDate: startDate.toISOString(),
      endDate: new Date().toISOString(),
      limit: 10000,
    });

    const activity = {
      userId,
      period: `${days} days`,
      totalEvents: logs.total,
      eventsByType: {},
      lastLogin: null,
      loginCount: 0,
      failedLoginCount: 0,
      dataOperations: {
        create: 0,
        read: 0,
        update: 0,
        delete: 0,
      },
    };

    logs.logs.forEach(log => {
      // Count by event type
      activity.eventsByType[log.eventType] = (activity.eventsByType[log.eventType] || 0) + 1;

      // Track login info
      if (log.eventType === EVENT_TYPES.AUTH_LOGIN) {
        activity.loginCount++;
        if (!activity.lastLogin) {
          activity.lastLogin = log.timestamp;
        }
      } else if (log.eventType === EVENT_TYPES.AUTH_FAILED) {
        activity.failedLoginCount++;
      }

      // Count data operations
      if (log.eventType === EVENT_TYPES.DATA_CREATE) activity.dataOperations.create++;
      if (log.eventType === EVENT_TYPES.DATA_READ) activity.dataOperations.read++;
      if (log.eventType === EVENT_TYPES.DATA_UPDATE) activity.dataOperations.update++;
      if (log.eventType === EVENT_TYPES.DATA_DELETE) activity.dataOperations.delete++;
    });

    return activity;
  }

  /**
   * Get suspicious activities
   */
  async getSuspiciousActivities(filters = {}) {
    const limit = filters.limit || 100;
    const offset = filters.offset || 0;

    const result = await this.getLogs({
      flagged: true,
      severity: filters.severity || SEVERITY_LEVELS.MEDIUM,
      ...filters,
    });

    return {
      total: result.total,
      activities: result.logs.slice(offset, offset + limit),
    };
  }

  /**
   * Check for suspicious activity
   */
  async _checkSuspiciousActivity(event) {
    const key = event.userId || event.ipAddress;
    if (!key) return null;

    // Check failed login attempts
    if (event.eventType === EVENT_TYPES.AUTH_FAILED) {
      const attemptKey = `failed_login_${key}`;
      const attempts = this.activityTracker.get(attemptKey) || [];
      const now = Date.now();

      // Remove old attempts outside window
      const recentAttempts = attempts.filter(
        time => now - time < this.suspiciousActivityThresholds.failedLoginWindow
      );

      recentAttempts.push(now);
      this.activityTracker.set(attemptKey, recentAttempts);

      if (recentAttempts.length >= this.suspiciousActivityThresholds.failedLoginAttempts) {
        return `${recentAttempts.length} failed login attempts`;
      }
    }

    // Check for unusual access time
    if (this.suspiciousActivityThresholds.unusualTimeAccess) {
      const hour = new Date(event.timestamp).getHours();
      if (hour < 6 || hour > 22) {
        // Access outside business hours
        if (event.eventType === EVENT_TYPES.DATA_DELETE) {
          return 'Data deletion during unusual hours';
        }
      }
    }

    // Check rapid data access
    if (event.eventType === EVENT_TYPES.DATA_READ) {
      const accessKey = `rapid_access_${key}`;
      const accesses = this.activityTracker.get(accessKey) || [];
      const now = Date.now();
      const minute = 60 * 1000;

      const recentAccesses = accesses.filter(time => now - time < minute);
      recentAccesses.push(now);
      this.activityTracker.set(accessKey, recentAccesses);

      if (recentAccesses.length > this.suspiciousActivityThresholds.rapidDataAccess) {
        return `Rapid data access: ${recentAccesses.length} reads per minute`;
      }
    }

    return null;
  }

  /**
   * Add event to in-memory queue
   */
  _addToQueue(event) {
    this.eventQueue.push(event);

    // Keep queue size manageable
    if (this.eventQueue.length > this.maxQueueSize) {
      this.eventQueue = this.eventQueue.slice(-this.maxQueueSize);
    }
  }

  /**
   * Log to console
   */
  _logToConsole(event) {
    const color = {
      [SEVERITY_LEVELS.LOW]: '\x1b[32m', // Green
      [SEVERITY_LEVELS.MEDIUM]: '\x1b[33m', // Yellow
      [SEVERITY_LEVELS.HIGH]: '\x1b[31m', // Red
      [SEVERITY_LEVELS.CRITICAL]: '\x1b[35m', // Magenta
    }[event.severity] || '\x1b[0m';

    const reset = '\x1b[0m';

    const flag = event.flagged ? ' [FLAGGED]' : '';
    console.log(
      `${color}[${event.timestamp}] ${event.eventType}${flag} - ${event.description}${reset}`
    );
  }

  /**
   * Log to file
   */
  async _logToFile(event) {
    return new Promise((resolve, reject) => {
      const date = new Date(event.timestamp);
      const filename = `audit-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.log`;
      const filepath = path.join(this.logsDirectory, filename);

      const logLine = JSON.stringify(event) + '\n';

      fs.appendFile(filepath, logLine, (err) => {
        if (err) {
          console.error('Failed to write audit log:', err);
          reject(err);
        } else {
          // Check file size and rotate if needed
          fs.stat(filepath, (err, stats) => {
            if (!err && stats.size > this.maxLogSize) {
              this._rotateLogFile(filepath);
            }
            resolve();
          });
        }
      });
    });
  }

  /**
   * Rotate log file
   */
  _rotateLogFile(filepath) {
    const timestamp = Date.now();
    const rotatedPath = `${filepath}.${timestamp}`;
    fs.rename(filepath, rotatedPath, (err) => {
      if (err) console.error('Failed to rotate log file:', err);
    });
  }

  /**
   * Log to database (stub for integration)
   */
  async _logToDatabase(event) {
    // This would be implemented with actual database integration
    // For now, just a stub
    return Promise.resolve();
  }

  /**
   * Clean old logs
   */
  async cleanOldLogs() {
    const retentionMs = this.retention * 24 * 60 * 60 * 1000;
    const cutoffDate = new Date(Date.now() - retentionMs);

    this.eventQueue = this.eventQueue.filter(
      log => new Date(log.timestamp) > cutoffDate
    );

    if (this.enableFile) {
      // Clean old log files
      fs.readdir(this.logsDirectory, (err, files) => {
        if (err) return;

        files.forEach(file => {
          const filepath = path.join(this.logsDirectory, file);
          fs.stat(filepath, (err, stats) => {
            if (!err && stats.mtime < cutoffDate) {
              fs.unlink(filepath, (err) => {
                if (err) console.error('Failed to delete old log:', err);
              });
            }
          });
        });
      });
    }
  }

  /**
   * Get log statistics
   */
  async getStatistics(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.getLogs({
      startDate: startDate.toISOString(),
      endDate: new Date().toISOString(),
      limit: 10000,
    });

    const stats = {
      period: `${days} days`,
      totalEvents: logs.total,
      eventsByType: {},
      eventsBySeverity: {},
      flaggedCount: 0,
      failedAuthCount: 0,
      uniqueUsers: new Set(),
      uniqueIPs: new Set(),
    };

    logs.logs.forEach(log => {
      stats.eventsByType[log.eventType] = (stats.eventsByType[log.eventType] || 0) + 1;
      stats.eventsBySeverity[log.severity] = (stats.eventsBySeverity[log.severity] || 0) + 1;

      if (log.flagged) stats.flaggedCount++;
      if (log.eventType === EVENT_TYPES.AUTH_FAILED) stats.failedAuthCount++;
      if (log.userId) stats.uniqueUsers.add(log.userId);
      if (log.ipAddress) stats.uniqueIPs.add(log.ipAddress);
    });

    return {
      ...stats,
      uniqueUsers: stats.uniqueUsers.size,
      uniqueIPs: stats.uniqueIPs.size,
    };
  }
}

/**
 * Singleton instance
 */
let auditLogService = null;

function getAuditLogService(options) {
  if (!auditLogService) {
    auditLogService = new AuditLogService(options);
  }
  return auditLogService;
}

module.exports = {
  AuditLogService,
  getAuditLogService,
  EVENT_TYPES,
  SEVERITY_LEVELS,
};
