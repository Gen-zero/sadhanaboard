const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Log analytics & threat detection service (rule-based, extendable)
 */

// Enhanced logging function with more detailed audit trails
async function insertEnrichedLog(entry) {
  try {
    // Generate a correlation ID if not provided
    const correlation_id = entry.correlation_id || require('uuid').v4();
    
    // Add timestamp if not provided
    const timestamp = entry.timestamp || new Date().toISOString();
    
    // Insert the log entry
    const result = await db.query(
      `INSERT INTO admin_logs 
       (admin_id, action, target_type, target_id, details, severity, category, ip_address, user_agent, session_id, correlation_id, metadata, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id, correlation_id`,
      [
        entry.admin_id,
        entry.action,
        entry.target_type,
        entry.target_id,
        entry.details ? JSON.stringify(entry.details) : null,
        entry.severity || 'info',
        entry.category || null,
        entry.ip_address || null,
        entry.user_agent || null,
        entry.session_id || null,
        correlation_id,
        entry.metadata ? JSON.stringify(entry.metadata) : null,
        timestamp
      ]
    );
    
    // Return the inserted row for correlation
    return result.rows[0];
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
    const result = await db.query(
      `INSERT INTO security_events 
       (event_type, threat_level, detection_rule, log_id, correlation_id, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [
        eventData.eventType,
        eventData.threatLevel || 'medium',
        eventData.detectionRule || null,
        eventData.logId || null,
        eventData.correlation_id || null
      ]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Failed to create security event:', error);
    return null;
  }
}

// Function to get audit logs with filtering and pagination
async function getAuditLogs(filters = {}, limit = 50, offset = 0) {
  try {
    let whereClause = '';
    let params = [];
    let paramIndex = 1;
    
    // Build WHERE clause based on filters
    const filterConditions = [];
    
    if (filters.admin_id) {
      filterConditions.push(`admin_id = $${paramIndex}`);
      params.push(filters.admin_id);
      paramIndex++;
    }
    
    if (filters.action) {
      filterConditions.push(`action ILIKE $${paramIndex}`);
      params.push(`%${filters.action}%`);
      paramIndex++;
    }
    
    if (filters.target_type) {
      filterConditions.push(`target_type = $${paramIndex}`);
      params.push(filters.target_type);
      paramIndex++;
    }
    
    if (filters.severity) {
      filterConditions.push(`severity = $${paramIndex}`);
      params.push(filters.severity);
      paramIndex++;
    }
    
    if (filters.category) {
      filterConditions.push(`category = $${paramIndex}`);
      params.push(filters.category);
      paramIndex++;
    }
    
    if (filters.startDate) {
      filterConditions.push(`created_at >= $${paramIndex}`);
      params.push(filters.startDate);
      paramIndex++;
    }
    
    if (filters.endDate) {
      filterConditions.push(`created_at <= $${paramIndex}`);
      params.push(filters.endDate);
      paramIndex++;
    }
    
    if (filterConditions.length > 0) {
      whereClause = `WHERE ${filterConditions.join(' AND ')}`;
    }
    
    // Add limit and offset
    params.push(limit, offset);
    
    // Query for logs
    const logsQuery = `
      SELECT 
        al.id,
        al.admin_id,
        u.display_name as admin_name,
        al.action,
        al.target_type,
        al.target_id,
        al.details,
        al.severity,
        al.category,
        al.ip_address,
        al.user_agent,
        al.session_id,
        al.correlation_id,
        al.metadata,
        al.created_at
      FROM admin_logs al
      LEFT JOIN users u ON al.admin_id = u.id
      ${whereClause}
      ORDER BY al.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const countQuery = `
      SELECT COUNT(*) as total
      FROM admin_logs al
      ${whereClause}
    `;
    
    const logsResult = await db.query(logsQuery, params);
    const countResult = await db.query(countQuery, params.slice(0, params.length - 2));
    
    return {
      logs: logsResult.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset
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
    const result = await db.query(
      `SELECT 
         se.id,
         se.event_type,
         se.threat_level,
         se.detection_rule,
         se.log_id,
         se.correlation_id,
         se.created_at,
         al.action,
         al.admin_id,
         u.display_name as admin_name,
         al.ip_address,
         al.details
       FROM security_events se
       LEFT JOIN admin_logs al ON se.log_id = al.id
       LEFT JOIN users u ON al.admin_id = u.id
       ORDER BY se.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    const countResult = await db.query('SELECT COUNT(*) as total FROM security_events');
    
    return {
      events: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset
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