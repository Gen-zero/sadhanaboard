const db = require('../config/db');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// Store reference to io instance
let ioInstance = null;

// Function to set the io instance
function setIoInstance(io) {
  ioInstance = io;
}

async function createSystemAlert(alertType, severity, message, metricData) {
  try {
    const r = await db.query('INSERT INTO system_alerts (alert_type,severity,message,metric_data) VALUES ($1,$2,$3,$4) RETURNING *', [alertType, severity, message, JSON.stringify(metricData || {})]);
    const inserted = r.rows && r.rows[0];
    try { 
      if (ioInstance) {
        ioInstance.to('admins').emit('system:alert', inserted);
      }
    } catch (e) {
      logger.error('Failed to emit system alert via Socket.IO', e);
    }
    return inserted;
  } catch (e) { 
    logger.error('createSystemAlert', e); 
    throw e; 
  }
}

async function listSystemAlerts() {
  const r = await db.query('SELECT * FROM system_alerts ORDER BY created_at DESC LIMIT 200');
  return r.rows || [];
}

async function createSystemAlertRule(name, conditions, thresholds) {
  try {
    // Validate UUID format for id if provided
    const id = uuidv4();
    
    const r = await db.query(
      'INSERT INTO system_alert_rules (id, name, alert_type, conditions, thresholds, enabled, suppression_window, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *',
      [id, name, conditions.alert_type || 'system', JSON.stringify(conditions), JSON.stringify(thresholds || {}), true, 300]
    );
    
    const inserted = r.rows && r.rows[0];
    return { ok: true, rule: inserted };
  } catch (e) {
    logger.error('createSystemAlertRule', e);
    return { error: String(e) };
  }
}

async function updateSystemAlertRule(id, updates) {
  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid UUID format');
    }
    
    const r = await db.query(
      'UPDATE system_alert_rules SET name = $2, conditions = $3, thresholds = $4, enabled = $5, suppression_window = $6, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id, updates.name, JSON.stringify(updates.conditions || {}), JSON.stringify(updates.thresholds || {}), updates.enabled, updates.suppression_window || 300]
    );
    
    const updated = r.rows && r.rows[0];
    if (!updated) {
      return { error: 'Rule not found' };
    }
    
    return { ok: true, rule: updated };
  } catch (e) {
    logger.error('updateSystemAlertRule', e);
    return { error: String(e) };
  }
}

async function deleteSystemAlertRule(id) {
  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid UUID format');
    }
    
    await db.query('DELETE FROM system_alert_rules WHERE id = $1', [id]);
    return { ok: true };
  } catch (e) {
    logger.error('deleteSystemAlertRule', e);
    return { error: String(e) };
  }
}

async function resolveSystemAlert(id, resolvedBy = null) {
  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid UUID format');
    }
    
    await db.query('UPDATE system_alerts SET resolved = true, resolved_at = NOW(), resolved_by = $2 WHERE id = $1', [id, resolvedBy]);
    return { ok: true };
  } catch (e) { 
    logger.error('resolveSystemAlert', e);
    return { error: String(e) }; 
  }
}

async function listSystemAlertRules() {
  try {
    const r = await db.query('SELECT * FROM system_alert_rules ORDER BY created_at DESC');
    return r.rows || [];
  } catch (e) {
    logger.error('listSystemAlertRules', e);
    return [];
  }
}

module.exports = { 
  createSystemAlert, 
  listSystemAlerts, 
  createSystemAlertRule,
  updateSystemAlertRule,
  deleteSystemAlertRule,
  resolveSystemAlert,
  listSystemAlertRules,
  setIoInstance
};