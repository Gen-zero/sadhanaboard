const express = require('express');
const path = require('path');
const { adminAuthenticate, logAdminAction } = require('../middleware/adminAuth');
const { readJson, writeJson } = require('../utils/jsonStore');
const db = require('../config/db');

const router = express.Router();
const SETTINGS = path.join(__dirname, '..', 'data', 'settings.json');

// Get settings with validation
router.get('/settings', adminAuthenticate, (req, res) => {
  const defaultSettings = {
    features: {
      biometric: false,
      music: true,
      notifications: true,
      darkMode: true,
      autoSave: true
    },
    timers: {
      meditation: 20,
      mantra: 108,
      reflection: 10
    },
    security: {
      sessionTimeout: 3600,
      maxLoginAttempts: 5,
      passwordMinLength: 8
    },
    application: {
      maintenanceMode: false,
      newUserRegistration: true,
      emailVerification: false
    }
  };
  
  const settings = readJson(SETTINGS, defaultSettings);
  res.json({ settings });
});

// Update settings with logging
router.put('/settings', adminAuthenticate, async (req, res) => {
  try {
    const currentSettings = readJson(SETTINGS, {});
    const newSettings = req.body;
    
    // Validate settings structure
    if (typeof newSettings !== 'object') {
      return res.status(400).json({ error: 'Invalid settings format' });
    }
    
    // Merge with existing settings
    const mergedSettings = {
      ...currentSettings,
      ...newSettings,
      lastUpdated: new Date().toISOString(),
      updatedBy: req.user.id
    };
    
    writeJson(SETTINGS, mergedSettings);
    
    // Log settings update
    if (typeof req.secureLog === 'function') {
      await req.secureLog('UPDATE_SETTINGS', 'settings', 1, { changes: newSettings, admin: req.user.username });
    } else {
      await req.logAdminAction(req.user.id, 'UPDATE_SETTINGS', 'settings', 1, { changes: newSettings, admin: req.user.username });
    }
    
    res.json({ message: 'Settings saved successfully', settings: mergedSettings });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Enhanced CSV reports with more data
router.get('/reports/users.csv', adminAuthenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let whereClause = '';
    let params = [];
    
    if (startDate && endDate) {
      whereClause = 'WHERE created_at BETWEEN $1 AND $2';
      params = [startDate, endDate];
    }
    
    const q = await db.query(`
      SELECT 
        id, 
        email, 
        display_name, 
        is_admin, 
        active,
        created_at,
        last_login,
        login_attempts
      FROM users 
      ${whereClause}
      ORDER BY id DESC
    `, params);
    
    const esc = (v) => {
      if (v == null) return '';
      const s = String(v);
      return '"' + s.replace(/"/g, '""') + '"';
    };

    const header = 'id,email,display_name,is_admin,active,created_at,last_login,login_attempts\n';
    const rows = q.rows.map(r => 
      `${r.id},${esc(r.email)},${esc(r.display_name)},${r.is_admin},${r.active},${esc(r.created_at?.toISOString?.() || '')},${esc(r.last_login?.toISOString?.() || '')},${r.login_attempts || 0}`
    ).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="users-${new Date().toISOString().split('T')[0]}.csv"`);
      try {
        // best effort: log export action but don't fail the request if logging throws
        if (typeof req.secureLog === 'function') {
          try { await req.secureLog('EXPORT_USERS_CSV', 'reports', q.rowCount); } catch (e) { console.error('Admin log failed:', e); }
        } else if (typeof req.logAdminAction === 'function') {
          try { await req.logAdminAction(req.user.id, 'EXPORT_USERS_CSV', 'reports', q.rowCount); } catch (e) { console.error('Admin log failed:', e); }
        }
      } catch (e) {
        console.error('Logging wrapper error:', e);
      }

    res.send(header + rows);
  } catch (e) {
    console.error('CSV export error:', e);
    res.status(500).send('id,email,display_name,is_admin,active,created_at,last_login,login_attempts');
  }
});

// Sadhanas report
router.get('/reports/sadhanas.csv', adminAuthenticate, async (req, res) => {
  try {
    const q = await db.query(`
      SELECT 
        s.id,
        s.title,
        s.status,
        s.duration,
        s.start_date,
        s.end_date,
        s.created_at,
        u.email as user_email,
        u.display_name as user_name
      FROM sadhanas s
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `);
    
    const esc = (v) => {
      if (v == null) return '';
      const s = String(v);
      return '"' + s.replace(/"/g, '""') + '"';
    };

    const header = 'id,title,status,duration,start_date,end_date,created_at,user_email,user_name\n';
    const rows = q.rows.map(r => 
      `${r.id},${esc(r.title)},${r.status},${r.duration},${esc(r.start_date || '')},${esc(r.end_date || '')},${esc(r.created_at?.toISOString?.() || '')},${esc(r.user_email || '')},${esc(r.user_name || '')}`
    ).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="sadhanas-${new Date().toISOString().split('T')[0]}.csv"`);
    try {
      if (typeof req.secureLog === 'function') {
        try { await req.secureLog('EXPORT_SADHANAS_CSV', 'reports', q.rowCount); } catch (e) { console.error('Admin log failed:', e); }
      } else if (typeof req.logAdminAction === 'function') {
        try { await req.logAdminAction(req.user.id, 'EXPORT_SADHANAS_CSV', 'reports', q.rowCount); } catch (e) { console.error('Admin log failed:', e); }
      }
    } catch (e) {
      console.error('Logging wrapper error:', e);
    }

    res.send(header + rows);
  } catch (e) {
    console.error('Sadhanas CSV export error:', e);
    res.status(500).send('id,title,status,duration,start_date,end_date,created_at,user_email,user_name');
  }
});

// System stats report
router.get('/reports/stats', adminAuthenticate, async (req, res) => {
  try {
    const stats = {
      timestamp: new Date().toISOString(),
      users: {
        total: await db.query('SELECT COUNT(*)::int AS c FROM users').then(r => r.rows[0].c).catch(() => 0),
        active: await db.query('SELECT COUNT(*)::int AS c FROM users WHERE active = true').then(r => r.rows[0].c).catch(() => 0),
        admins: await db.query('SELECT COUNT(*)::int AS c FROM users WHERE is_admin = true').then(r => r.rows[0].c).catch(() => 0)
      },
      sadhanas: {
        total: await db.query('SELECT COUNT(*)::int AS c FROM sadhanas').then(r => r.rows[0].c).catch(() => 0),
        active: await db.query('SELECT COUNT(*)::int AS c FROM sadhanas WHERE status = \'active\'').then(r => r.rows[0].c).catch(() => 0),
        completed: await db.query('SELECT COUNT(*)::int AS c FROM sadhanas WHERE status = \'completed\'').then(r => r.rows[0].c).catch(() => 0)
      },
      books: {
        total: await db.query('SELECT COUNT(*)::int AS c FROM books').then(r => r.rows[0].c).catch(() => 0)
      }
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Stats report error:', error);
    res.status(500).json({ error: 'Failed to generate stats report' });
  }
});

module.exports = router;


