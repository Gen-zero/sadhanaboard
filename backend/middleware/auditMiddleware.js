/**
 * Audit Logging Middleware
 * Automatic request/response logging for compliance and monitoring
 */

const { getAuditLogService, EVENT_TYPES, SEVERITY_LEVELS } = require('../services/auditLogService');

/**
 * Main audit middleware
 * Logs all requests and responses
 */
function auditMiddleware(options = {}) {
  const auditLog = getAuditLogService(options);
  const excludePaths = options.excludePaths || ['/health', '/status'];
  const excludePatterns = options.excludePatterns || [/\/public\//, /\/assets\//];

  return async (req, res, next) => {
    // Skip excluded paths
    if (excludePaths.includes(req.path)) {
      return next();
    }

    // Skip excluded patterns
    if (excludePatterns.some(pattern => pattern.test(req.path))) {
      return next();
    }

    const startTime = Date.now();
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    // Capture response
    let responseData = null;
    let responseStatus = null;

    res.json = function(data) {
      responseData = data;
      responseStatus = res.statusCode;
      return originalJson(data);
    };

    res.send = function(data) {
      responseStatus = res.statusCode;
      return originalSend(data);
    };

    res.on('finish', async () => {
      const duration = Date.now() - startTime;

      // Determine event type and severity
      let eventType = 'REQUEST';
      let severity = SEVERITY_LEVELS.LOW;

      if (responseStatus >= 400) {
        if (responseStatus === 403) {
          eventType = EVENT_TYPES.SECURITY_PERMISSION_DENIED;
          severity = SEVERITY_LEVELS.MEDIUM;
        } else if (responseStatus === 401) {
          eventType = EVENT_TYPES.AUTH_FAILED;
          severity = SEVERITY_LEVELS.MEDIUM;
        } else if (responseStatus >= 500) {
          eventType = EVENT_TYPES.SYSTEM_ERROR;
          severity = SEVERITY_LEVELS.HIGH;
        }
      }

      // Log the request
      await auditLog.log(eventType, {
        userId: req.user?.id,
        username: req.user?.username,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        sessionId: req.sessionID,
        resource: req.path,
        action: req.method,
        status: responseStatus >= 400 ? 'failed' : 'success',
        severity,
        description: `${req.method} ${req.path}`,
        metadata: {
          method: req.method,
          path: req.path,
          statusCode: responseStatus,
          duration: `${duration}ms`,
          params: req.params,
          query: req.query,
        },
      });
    });

    next();
  };
}

/**
 * Log authentication events
 */
function logAuthEvents() {
  const auditLog = getAuditLogService();

  return async (req, res, next) => {
    // Capture login attempts
    const originalJson = res.json.bind(res);

    res.json = function(data) {
      if (req.path === '/auth/login' && res.statusCode === 200) {
        auditLog.logAuthAttempt(
          data.userId,
          req.body?.username || data.username,
          req.ip,
          true
        ).catch(err => console.error('Failed to log auth event:', err));
      }

      return originalJson(data);
    };

    next();
  };
}

/**
 * Log data mutations (create, update, delete)
 */
function logDataMutations() {
  const auditLog = getAuditLogService();

  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function(data) {
      if (req.user && res.statusCode < 400) {
        // Determine action
        let action = null;
        if (req.method === 'POST') action = 'create';
        if (req.method === 'PUT' || req.method === 'PATCH') action = 'update';
        if (req.method === 'DELETE') action = 'delete';

        if (action) {
          auditLog.logDataAccess(
            req.user.id,
            action,
            req.baseUrl,
            req.params?.id,
            req.ip,
            {
              resourceName: req.baseUrl.split('/').filter(Boolean)[1],
              changes: req.body,
            }
          ).catch(err => console.error('Failed to log data mutation:', err));
        }
      }

      return originalJson(data);
    };

    next();
  };
}

/**
 * Log security events (permission denials, rate limits, etc.)
 */
function logSecurityEvents() {
  const auditLog = getAuditLogService();

  return async (req, res, next) => {
    // Attach audit log to request
    req.auditLog = {
      logPermissionDenial: (action, resource) => {
        auditLog.logPermissionDenial(req.user?.id, req.ip, action, resource);
      },
      logRateLimit: (endpoint, limit, window) => {
        auditLog.logRateLimit(req.user?.id, req.ip, endpoint, limit, window);
      },
      logSecurityEvent: (eventType, details) => {
        auditLog.logSecurityEvent(eventType, req.user?.id, req.ip, details);
      },
    };

    next();
  };
}

/**
 * Log API key usage
 */
function logApiKeyUsage() {
  const auditLog = getAuditLogService();

  return async (req, res, next) => {
    if (req.apiKey) {
      auditLog.log(EVENT_TYPES.SECURITY_API_KEY_USED, {
        apiKeyId: req.apiKey.id,
        ipAddress: req.ip,
        resource: req.path,
        action: req.method,
        status: 'success',
        description: `API key ${req.apiKey.id} used`,
        metadata: {
          endpoint: req.path,
          method: req.method,
        },
      }).catch(err => console.error('Failed to log API key usage:', err));
    }

    next();
  };
}

/**
 * Error logging middleware
 */
function logErrors(err, req, res, next) {
  const auditLog = getAuditLogService();

  const severity = err.statusCode >= 500 ? SEVERITY_LEVELS.HIGH : SEVERITY_LEVELS.MEDIUM;

  auditLog.log(EVENT_TYPES.SYSTEM_ERROR, {
    userId: req.user?.id,
    ipAddress: req.ip,
    resource: req.path,
    action: req.method,
    status: 'error',
    severity,
    description: err.message || 'Unhandled error',
    error: {
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
    },
  }).catch(err => console.error('Failed to log error:', err));

  // Continue with error handling
  next(err);
}

/**
 * Log user account changes
 */
function logAccountChanges() {
  const auditLog = getAuditLogService();

  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function(data) {
      if (req.user && res.statusCode < 400) {
        // Password change
        if (req.path.includes('password') && req.method === 'POST') {
          auditLog.log(EVENT_TYPES.AUTH_PASSWORD_CHANGE, {
            userId: req.user.id,
            ipAddress: req.ip,
            status: 'success',
            description: 'Password changed',
            severity: SEVERITY_LEVELS.MEDIUM,
          }).catch(err => console.error('Failed to log password change:', err));
        }

        // 2FA changes
        if (req.path.includes('2fa')) {
          const eventType = req.path.includes('enable') ? EVENT_TYPES.AUTH_2FA_ENABLE : EVENT_TYPES.AUTH_2FA_DISABLE;
          auditLog.log(eventType, {
            userId: req.user.id,
            ipAddress: req.ip,
            status: 'success',
            description: `2FA ${req.path.includes('enable') ? 'enabled' : 'disabled'}`,
            severity: SEVERITY_LEVELS.MEDIUM,
          }).catch(err => console.error('Failed to log 2FA change:', err));
        }
      }

      return originalJson(data);
    };

    next();
  };
}

/**
 * Middleware to get audit logs (requires admin)
 */
function getAuditLogs(req, res, next) {
  const auditLog = getAuditLogService();

  return async (req, res) => {
    try {
      const filters = {
        userId: req.query.userId,
        eventType: req.query.eventType,
        severity: req.query.severity ? parseInt(req.query.severity) : null,
        ipAddress: req.query.ipAddress,
        flagged: req.query.flagged === 'true',
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        limit: req.query.limit ? parseInt(req.query.limit) : 100,
        offset: req.query.offset ? parseInt(req.query.offset) : 0,
      };

      // Remove null filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === null || filters[key] === undefined) {
          delete filters[key];
        }
      });

      const logs = await auditLog.getLogs(filters);
      res.json(logs);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve audit logs',
        message: error.message,
      });
    }
  };
}

/**
 * Get audit statistics
 */
function getAuditStatistics(req, res, next) {
  const auditLog = getAuditLogService();

  return async (req, res) => {
    try {
      const days = req.query.days ? parseInt(req.query.days) : 7;
      const stats = await auditLog.getStatistics(days);
      res.json(stats);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve audit statistics',
        message: error.message,
      });
    }
  };
}

/**
 * Get suspicious activities
 */
function getSuspiciousActivities(req, res, next) {
  const auditLog = getAuditLogService();

  return async (req, res) => {
    try {
      const filters = {
        severity: req.query.severity ? parseInt(req.query.severity) : null,
        limit: req.query.limit ? parseInt(req.query.limit) : 100,
        offset: req.query.offset ? parseInt(req.query.offset) : 0,
      };

      const activities = await auditLog.getSuspiciousActivities(filters);
      res.json(activities);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve suspicious activities',
        message: error.message,
      });
    }
  };
}

/**
 * Get user activity
 */
function getUserActivity(req, res, next) {
  const auditLog = getAuditLogService();

  return async (req, res) => {
    try {
      const userId = req.params.userId || req.user?.id;
      const days = req.query.days ? parseInt(req.query.days) : 7;

      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }

      const activity = await auditLog.getUserActivity(userId, days);
      res.json(activity);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve user activity',
        message: error.message,
      });
    }
  };
}

module.exports = {
  auditMiddleware,
  logAuthEvents,
  logDataMutations,
  logSecurityEvents,
  logApiKeyUsage,
  logErrors,
  logAccountChanges,
  getAuditLogs,
  getAuditStatistics,
  getSuspiciousActivities,
  getUserActivity,
};
