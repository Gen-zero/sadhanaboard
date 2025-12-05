const { SystemAlert, SystemAlertRule } = require('../models');
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
    const alert = new SystemAlert({
      alertType,
      severity,
      message,
      metricData: metricData || {}
    });
    await alert.save();
    const result = alert.toJSON();
    try {
      if (ioInstance) {
        ioInstance.to('admins').emit('system:alert', result);
      }
    } catch (e) {
      logger.error('Failed to emit system alert via Socket.IO', e);
    }
    return result;
  } catch (e) {
    logger.error('createSystemAlert', e);
    throw e;
  }
}

async function listSystemAlerts() {
  try {
    const alerts = await SystemAlert.find().sort({ createdAt: -1 }).limit(200).lean();
    return alerts || [];
  } catch (e) {
    logger.error('listSystemAlerts', e);
    return [];
  }
}

async function createSystemAlertRule(name, conditions, thresholds) {
  try {
    const rule = new SystemAlertRule({
      id: uuidv4(),
      name,
      alertType: conditions.alert_type || 'system',
      conditions,
      thresholds: thresholds || {},
      enabled: true,
      suppressionWindow: 300
    });
    await rule.save();
    return { ok: true, rule: rule.toJSON() };
  } catch (e) {
    logger.error('createSystemAlertRule', e);
    return { error: String(e) };
  }
}

async function updateSystemAlertRule(id, updates) {
  try {
    const rule = await SystemAlertRule.findByIdAndUpdate(id, {
      name: updates.name,
      conditions: updates.conditions || {},
      thresholds: updates.thresholds || {},
      enabled: updates.enabled,
      suppressionWindow: updates.suppressionWindow || 300
    }, { new: true }).lean();

    if (!rule) {
      return { error: 'Rule not found' };
    }
    return { ok: true, rule };
  } catch (e) {
    logger.error('updateSystemAlertRule', e);
    return { error: String(e) };
  }
}

async function deleteSystemAlertRule(id) {
  try {
    await SystemAlertRule.deleteOne({ _id: id });
    return { ok: true };
  } catch (e) {
    logger.error('deleteSystemAlertRule', e);
    return { error: String(e) };
  }
}

async function resolveSystemAlert(id, resolvedBy = null) {
  try {
    await SystemAlert.findByIdAndUpdate(id, {
      resolved: true,
      resolvedAt: new Date(),
      resolvedBy
    });
    return { ok: true };
  } catch (e) {
    logger.error('resolveSystemAlert', e);
    return { error: String(e) };
  }
}

async function listSystemAlertRules() {
  try {
    const rules = await SystemAlertRule.find().sort({ createdAt: -1 }).lean();
    return rules || [];
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