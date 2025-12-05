const AdminLog = require('../schemas/AdminLog');
const SecurityEvent = require('../schemas/SecurityEvent');
const User = require('../schemas/User');
const { v4: uuidv4 } = require('uuid');

/**
 * Log analytics & threat detection service (rule-based, extendable)
 */

// Enhanced logging function with more detailed audit trails
async function insertEnrichedLog(entry) {
  try {
    const correlationId = entry.correlationId || uuidv4();
    const timestamp = entry.timestamp || new Date();

    const log = new AdminLog({
      adminId: entry.adminId,
      action: entry.action,
      targetType: entry.targetType,
      targetId: entry.targetId,
      details: entry.details || null,
      severity: entry.severity || 'info',
      category: entry.category || null,
      ipAddress: entry.ipAddress || null,
      userAgent: entry.userAgent || null,
      sessionId: entry.sessionId || null,
      correlationId,
      metadata: entry.metadata || null,
      createdAt: timestamp
    });

    const result = await log.save();
    return { id: result._id, correlationId };
  } catch (error) {
    console.error('Failed to insert enriched log:', error);
    return null;
  }
}

// Function to detect security threats based on log patterns
async function detectSecurityThreats(entry) {
  try {
    // Define threat detection rules
    const threatRules = [
      {
        name: 'multiple_failed_logins',
        description: 'Multiple failed login attempts',
        check: (log) => {
          return log.action === 'LOGIN_FAILED' && 
                 log.severity === 'warning';
        },
        threatLevel: 'medium'
      },
      {
        name: 'suspicious_activity',
        description: 'Suspicious administrative activity',
        check: (log) => {
          return log.category === 'security' && 
                 log.severity === 'high';
        },
        threatLevel: 'high'
      },
      {
        name: 'unusual_data_access',
        description: 'Unusual data access patterns',
        check: (log) => {
          return log.action === 'DATA_EXPORT' && 
                 log.category === 'data';
        },
        threatLevel: 'medium'
      }
    ];
    
    // Check each rule
    for (const rule of threatRules) {
      if (rule.check(entry)) {
        return {
          detected: true,
          rule: rule.name,
          description: rule.description,
          threatLevel: rule.threatLevel
        };
      }
    }
    
    // No threats detected
    return {
      detected: false
    };
  } catch (error) {
    console.error('Failed to detect security threats:', error);
    return {
      detected: false,
      error: error.message
    };
  }
}

// Function to create security events
async function createSecurityEvent(eventData) {
  try {
    const event = new SecurityEvent({
      eventType: eventData.eventType,
      threatLevel: eventData.threatLevel || 'medium',
      detectionRule: eventData.detectionRule || null,
      logId: eventData.logId || null,
      correlationId: eventData.correlationId || null
    });
    const result = await event.save();
    return result.toJSON();
  } catch (error) {
    console.error('Failed to create security event:', error);
    return null;
  }
}

// Function to get audit logs with filtering and pagination
async function getAuditLogs(filters = {}, limit = 50, offset = 0) {
  try {
    const query = {};

    if (filters.adminId) query.adminId = filters.adminId;
    if (filters.action) query.action = { $regex: filters.action, $options: 'i' };
    if (filters.targetType) query.targetType = filters.targetType;
    if (filters.severity) query.severity = filters.severity;
    if (filters.category) query.category = filters.category;

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    const [logs, total] = await Promise.all([
      AdminLog.find(query)
        .populate('adminId', 'displayName')
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(Number(offset))
        .lean(),
      AdminLog.countDocuments(query)
    ]);

    return {
      logs,
      total,
      limit: Number(limit),
      offset: Number(offset)
    };
  } catch (error) {
    console.error('Failed to get audit logs:', error);
    return {
      logs: [],
      total: 0,
      limit,
      offset
    };
  }
}

// Function to get security events
async function getSecurityEvents(limit = 50, offset = 0) {
  try {
    const [events, total] = await Promise.all([
      SecurityEvent.find()
        .populate('logId')
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(Number(offset))
        .lean(),
      SecurityEvent.countDocuments()
    ]);

    return {
      events,
      total,
      limit: Number(limit),
      offset: Number(offset)
    };
  } catch (error) {
    console.error('Failed to get security events:', error);
    return {
      events: [],
      total: 0,
      limit,
      offset
    };
  }
}

// Function to export logs
async function exportLogs(filters = {}, format = 'json') {
  try {
    const logs = await getAuditLogs(filters, 10000, 0); // Export up to 10,000 records
    
    if (format === 'csv') {
      // Convert to CSV format
      const csvHeaders = [
        'id', 'admin_id', 'admin_name', 'action', 'target_type', 'target_id', 
        'details', 'severity', 'category', 'ip_address', 'user_agent', 
        'session_id', 'correlation_id', 'created_at'
      ];
      
      const csvRows = logs.logs.map(log => {
        return csvHeaders.map(header => {
          let value = log[header];
          if (typeof value === 'object' && value !== null) {
            value = JSON.stringify(value);
          }
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',');
      });
      
      const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
      return {
        content: csvContent,
        contentType: 'text/csv',
        filename: `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
      };
    } else {
      // Default to JSON format
      const jsonContent = JSON.stringify(logs.logs, null, 2);
      return {
        content: jsonContent,
        contentType: 'application/json',
        filename: `audit-logs-${new Date().toISOString().split('T')[0]}.json`
      };
    }
  } catch (error) {
    console.error('Failed to export logs:', error);
    throw error;
  }
}

module.exports = {
  insertEnrichedLog,
  detectSecurityThreats,
  createSecurityEvent,
  getAuditLogs,
  getSecurityEvents,
  exportLogs
};