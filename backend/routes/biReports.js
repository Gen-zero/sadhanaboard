const express = require('express');
const router = express.Router();
const { adminAuthenticate } = require('../middleware/adminAuth');
const biService = require('../services/biReportService');
const scheduler = require('../services/reportSchedulerService');
const insightService = require('../services/spiritualInsightService');

router.use(adminAuthenticate);

router.get('/kpis/snapshot', async (req, res) => {
  try {
    const data = await biService.getKPISnapshot();
    return res.json(data);
  } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); }
});

router.get('/kpis/engagement', async (req, res) => {
  try { const data = await biService.getEngagementAnalytics(req.query.timeframe || '30d'); return res.json(data); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); }
});

router.get('/kpis/community-health', async (req, res) => {
  try { const data = await biService.getCommunityHealthMetrics ? await biService.getCommunityHealthMetrics() : { ok: true }; return res.json(data); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); }
});

// Templates
router.get('/templates', async (req, res) => {
  try {
    const q = req.query.q;
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    const data = await biService.getReportTemplates({ q, limit, offset });
    return res.json(data);
  } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); }
});
router.post('/templates', async (req, res) => {
  try { const created = await biService.createReportTemplate(req.body); return res.json({ item: created }); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); }
});
router.put('/templates/:id', async (req, res) => {
  try { const id = req.params.id; const updated = await biService.updateReportTemplate(id, req.body); return res.json({ item: updated }); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); }
});
router.delete('/templates/:id', async (req, res) => {
  try { const id = req.params.id; await biService.deleteReportTemplate(id); return res.json({ ok: true }); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); }
});
router.post('/templates/:id/execute', async (req, res) => {
  try { const id = req.params.id; const exec = await biService.executeReportTemplate(id, req.body || {}); return res.json({ execution: exec }); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); }
});

// Schedules
router.get('/schedules', async (req, res) => { try { const items = await scheduler.getAllScheduledReports(); return res.json({ items }); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); } });
router.post('/schedules', async (req, res) => {
  try {
    const { templateId, cron_expression, recipients, output_format, timezone, name, description } = req.body;
    const created = await scheduler.createScheduledReport(templateId, cron_expression, recipients, output_format, req.user && req.user.id, { timezone, name, description });
    return res.json({ item: created });
  } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); }
});
router.put('/schedules/:id', async (req, res) => {
  try { const id = req.params.id; const updated = await scheduler.updateScheduledReport(id, req.body); return res.json({ item: updated }); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); }
});
router.delete('/schedules/:id', async (req, res) => {
  try { const id = req.params.id; await scheduler.deleteScheduledReport(id); return res.json({ ok: true }); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); }
});
router.post('/schedules/:id/trigger', async (req, res) => {
  try { const id = req.params.id; const exec = await scheduler.executeScheduledReport(id); return res.json({ execution: exec }); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); }
});

const db = require('../config/db');
// Executions
router.get('/executions', async (req, res) => {
  try { const data = await biService.getReportExecutions ? await biService.getReportExecutions(req.query) : { items: [] }; return res.json(data); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); }
});
router.get('/executions/:id/status', async (req, res) => {
  try { const id = req.params.id; const st = await scheduler.getExecutionStatus ? await scheduler.getExecutionStatus(id) : { status: 'completed' }; return res.json(st); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); }
});
router.get('/executions/:id/download', async (req, res) => {
  try { /* placeholder: return JSON result */ const id = req.params.id; const r = await db.query('SELECT result_data FROM report_executions WHERE id = $1', [id]); const row = r.rows[0]; if (!row) return res.status(404).json({ error: 'Not found' }); res.setHeader('Content-Type', 'application/json'); return res.send(row.result_data || {}); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); }
});

// Analytics
router.get('/analytics/spiritual-journey', async (req, res) => { try { const data = await biService.getSpiritualProgressAnalytics(req.query || {}); return res.json(data); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); } });
router.get('/analytics/user-cohorts', async (req, res) => { try { const data = await biService.getCohortAnalytics ? await biService.getCohortAnalytics(req.query) : { items: [] }; return res.json(data); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); } });
router.get('/analytics/practice-effectiveness', async (req, res) => { try { const data = await biService.getPracticeEffectiveness ? await biService.getPracticeEffectiveness(req.query) : { items: [] }; return res.json(data); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); } });

// Insights
router.get('/insights/user/:userId', async (req, res) => { try { const items = await insightService.getValidInsights(req.params.userId); return res.json({ items }); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); } });
router.get('/insights/community', async (req, res) => { try { const items = await insightService.generateCommunityInsights(); return res.json({ items }); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); } });
router.post('/insights/generate', async (req, res) => { try { const { userId, type } = req.body; if (userId) { const created = await insightService.generateUserInsights(userId); return res.json({ item: created }); } const created = await insightService.generateCommunityInsights(); return res.json({ item: created }); } catch (e) { console.error(e); res.status(500).json({ error: String(e) }); } });

module.exports = router;
