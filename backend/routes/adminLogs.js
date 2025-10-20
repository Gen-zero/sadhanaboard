const express = require('express');
const router = express.Router();
// use explicit adminAuthenticate middleware exported from adminAuth
const { adminAuthenticate } = require('../middleware/adminAuth');
const logAnalytics = require('../services/logAnalyticsService');
const alertService = require('../services/alertService');
const db = require('../config/db');

// Protect all routes with adminAuthenticate
router.use(adminAuthenticate);

// GET /logs - basic listing with filters
router.get('/', async (req, res) => {
  try {
    const { severity, category, q, limit = 50, offset = 0 } = req.query;
    let sql = 'SELECT * FROM admin_logs WHERE 1=1';
    const params = [];
    if (severity) { params.push(severity); sql += ` AND severity = $${params.length}`; }
    if (category) { params.push(category); sql += ` AND category = $${params.length}`; }
    if (q) { params.push(`%${q}%`); sql += ` AND (details::text ILIKE $${params.length} OR metadata::text ILIKE $${params.length})`; }
    sql += ` ORDER BY created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
    const r = await db.query(sql, params);
    res.json({ items: r.rows, total: r.rowCount, limit: Number(limit), offset: Number(offset) });
  } catch (e) { console.error('GET /logs error', e); res.status(500).json({ error: 'Failed to fetch logs' }); }
});

// POST /logs/search - advanced search body
router.post('/logs/search', async (req, res) => {
  try {
    const { severity, category, q, limit = 50, offset = 0 } = req.body;
    const params = [];
    let sql = 'SELECT * FROM admin_logs WHERE 1=1';
    if (severity) { params.push(severity); sql += ` AND severity = $${params.length}`; }
    if (category) { params.push(category); sql += ` AND category = $${params.length}`; }
    if (q) { params.push(`%${q}%`); sql += ` AND (details::text ILIKE $${params.length} OR metadata::text ILIKE $${params.length})`; }
    sql += ` ORDER BY created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
    const r = await db.query(sql, params);
    res.json({ items: r.rows, total: r.rowCount, limit: Number(limit), offset: Number(offset) });
  } catch (e) { console.error('POST /logs/search error', e); res.status(500).json({ error: 'Failed to search logs' }); }
});

// GET /correlate/:correlationId - fetch logs & events with same correlation id
router.get('/correlate/:correlationId', async (req, res) => {
  try {
    const cid = req.params.correlationId;
    const items = await logAnalytics.getTimelineByCorrelation(cid);
    res.json({ items: items || [], total: (items && items.length) || 0 });
  } catch (e) { console.error('GET /correlate error', e); res.status(500).json({ error: 'Failed to correlate' }); }
});

// GET /trends - provide trend metrics for a time window
router.get('/trends', async (req, res) => {
  try {
    const { from, to, bucket = 'day' } = req.query;
    const t = await logAnalytics.getTrends({ from, to, bucket });
    res.json({ items: t });
  } catch (e) { console.error('GET /trends error', e); res.status(500).json({ error: 'Failed to compute trends' }); }
});

// GET /logs/export - returns CSV text of recent logs (simple export)
router.get('/logs/export', async (req, res) => {
  try {
    const r = await db.query('SELECT id, admin_id, action, details, created_at FROM admin_logs ORDER BY created_at DESC LIMIT 1000');
    res.setHeader('Content-Type', 'text/csv');
    res.send(['id,admin_id,action,created_at', ...r.rows.map(row => `${row.id},${row.admin_id},"${(row.action||'').replace(/"/g,'""')}",${row.created_at.toISOString()}`)].join('\n'));
  } catch (e) { console.error('GET /logs/export error', e); res.status(500).json({ error: 'Failed to export logs' }); }
});

// GET /logs/stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await logAnalytics.getLogStatistics(req.query);
    res.json(stats);
  } catch (e) { console.error('GET /logs/stats error', e); res.status(500).json({ error: 'Failed to get stats' }); }
});

// Security events
router.get('/security-events', async (req, res) => {
  try {
    const events = await logAnalytics.getActiveSecurityEvents();
    res.json({ items: events });
  } catch (e) { console.error('GET /logs/security-events error', e); res.status(500).json({ error: 'Failed to fetch security events' }); }
});

// POST /security-events/:id/resolve
router.post('/security-events/:id/resolve', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const notes = req.body.notes || null;
    const resolved = await logAnalytics.resolveSecurityEvent(id, notes, req.user.id);
    res.json({ event: resolved });
  } catch (e) { console.error('POST /security-events/:id/resolve error', e); res.status(500).json({ error: 'Failed to resolve event' }); }
});

// Alert rule CRUD
router.get('/alert-rules', async (req, res) => { res.json({ items: await alertService.listAlertRules() }); });
router.post('/alert-rules', async (req, res) => { const { rule_name, conditions, notification_channels } = req.body; const r = await alertService.createAlertRule(rule_name, conditions, notification_channels || [], req.user.id); res.json({ rule: r }); });
router.put('/alert-rules/:id', async (req, res) => { try { const id = Number(req.params.id); const payload = req.body; const up = await db.query('UPDATE log_alert_rules SET rule_name=$1, conditions=$2, notification_channels=$3, enabled=$4, severity_threshold=$5, updated_at=NOW() WHERE id=$6 RETURNING *', [payload.rule_name, payload.conditions, payload.notification_channels, payload.enabled, payload.severity_threshold, id]); res.json({ rule: up.rows[0] }); } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to update rule' }); } });
router.delete('/alert-rules/:id', async (req, res) => { try { const id = Number(req.params.id); await db.query('DELETE FROM log_alert_rules WHERE id=$1', [id]); res.json({ ok: true }); } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to delete rule' }); } });
router.post('/alert-rules/:id/test', async (req, res) => { try { const id = Number(req.params.id); // fetch rule and simulate trigger
  const r = await db.query('SELECT * FROM log_alert_rules WHERE id=$1', [id]); const rule = r.rows[0]; if (!rule) return res.status(404).json({ error: 'Rule not found' }); // simulate
  await alertService.triggerAlert(id, { id: null, action: rule.conditions && rule.conditions.matchAction ? rule.conditions.matchAction : 'test' }, rule.severity_threshold || 'warn'); res.json({ ok: true }); } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to test rule' }); } });

// Alert rules management
router.get('/alert-rules', async (req, res) => { res.json({ items: await alertService.listAlertRules() }); });
router.post('/alert-rules', async (req, res) => { const { name, conditions, channels } = req.body; const r = await alertService.createAlertRule(name, conditions, channels, req.user.id); res.json({ rule: r }); });

// SSE fallback for logs stream
router.get('/stream', (req, res) => {
  // SSE endpoint: subscribe to server-side EventEmitter (global.logBus)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders && res.flushHeaders();
  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);
  const onNewLog = (payload) => send({ type: 'logs:new', payload });
  if (!global.logBus) {
    // create a fallback EventEmitter if not present
    const { EventEmitter } = require('events');
    global.logBus = new EventEmitter();
  }
  global.logBus.on('logs:new', onNewLog);
  req.on('close', () => {
    try { global.logBus.off('logs:new', onNewLog); } catch (e) { /* ignore */ }
  });
});

module.exports = router;
