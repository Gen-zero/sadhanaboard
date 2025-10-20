const express = require('express');
const router = express.Router();
const { adminAuthenticate } = require('../middleware/adminAuth');
const systemMetrics = require('../services/systemMetricsService');
const dbOpt = require('../services/dbOptimizationService');
const alerts = require('../services/systemAlertService');
const deployment = require('../services/deploymentService');
const db = require('../config/db');

router.use(adminAuthenticate);

router.get('/metrics/current', async (req, res) => {
  try {
    const m = await systemMetrics.collectSystemMetrics();
    // Add id and timestamp for consistency with DB records
    const response = {
      id: 'current',
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      ...m
    };
    res.json(response);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

router.get('/metrics/history', async (req, res) => {
  try {
    const tf = req.query.timeframe || '24h';
    const rows = await systemMetrics.getMetricsHistory(tf);
    res.json({ items: rows });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

router.get('/metrics/api-analytics', async (req, res) => {
  try { 
    const timeframe = req.query.timeframe || '24h';
    const analytics = await systemMetrics.getApiMetrics(timeframe);
    res.json(analytics);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

router.get('/metrics/database', async (req, res) => {
  try { 
    const rows = await dbOpt.getConnectionPoolStatus(); 
    res.json({ items: rows }); 
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

// DB analysis / optimization
router.get('/database/analysis', async (req, res) => {
  try { 
    const q = await dbOpt.analyzeQueryPerformance(); 
    res.json({ items: q }); 
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

router.post('/database/optimize', async (req, res) => {
  try { 
    const table = req.body.table; 
    const r = await dbOpt.runVacuumAnalyze(table); 
    res.json(r); 
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

router.get('/database/slow-queries', async (req, res) => {
  try { 
    const limit = Number(req.query.limit) || 100;
    const q = await dbOpt.analyzeQueryPerformance(limit); 
    res.json({ items: q }); 
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

router.get('/database/connections', async (req, res) => {
  try { 
    const s = await dbOpt.getConnectionPoolStatus(); 
    res.json({ items: s }); 
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

// Alerts
router.get('/alerts/system', async (req, res) => { 
  try { 
    const items = await alerts.listSystemAlerts(); 
    res.json({ items }); 
  } catch (e) { res.status(500).json({ error: String(e) }); } 
});

router.get('/alerts/system/rules', async (req, res) => {
  try {
    const rules = await alerts.listSystemAlertRules();
    res.json({ items: rules });
  } catch (e) { 
    res.status(500).json({ error: String(e) }); 
  }
});

router.post('/alerts/system/rules', async (req, res) => { 
  try { 
    const r = await alerts.createSystemAlertRule(req.body.name, req.body.conditions, req.body.thresholds); 
    res.json(r); 
  } catch (e) { res.status(500).json({ error: String(e) }); } 
});

router.put('/alerts/system/rules/:id', async (req, res) => { 
  try {
    const r = await alerts.updateSystemAlertRule(req.params.id, req.body);
    res.json(r);
  } catch (e) { 
    res.status(500).json({ error: String(e) }); 
  }
});

router.delete('/alerts/system/rules/:id', async (req, res) => { 
  try {
    const r = await alerts.deleteSystemAlertRule(req.params.id);
    res.json(r);
  } catch (e) { 
    res.status(500).json({ error: String(e) }); 
  }
});

router.post('/alerts/system/:id/resolve', async (req, res) => { 
  try { 
    // Get admin user from request (set by adminAuthenticate middleware)
    const resolvedBy = req.user ? req.user.username : null;
    const r = await alerts.resolveSystemAlert(req.params.id, resolvedBy); 
    res.json(r); 
  } catch (e) { res.status(500).json({ error: String(e) }); } 
});

// Deployment
router.get('/deployment/info', async (req, res) => { 
  try { 
    const v = deployment.getCurrentVersion(); 
    res.json(v); 
  } catch (e) { res.status(500).json({ error: String(e) }); } 
});

router.get('/deployment/history', async (req, res) => { 
  try { 
    const h = await deployment.getDeploymentHistory(); 
    res.json({ items: h }); 
  } catch (e) { res.status(500).json({ error: String(e) }); } 
});

router.get('/deployment/health', async (req, res) => { 
  try { 
    const health = await deployment.getHealthCheckStatus(); 
    res.json(health); 
  } catch (e) { res.status(500).json({ error: String(e) }); } 
});

router.post('/deployment/restart', async (req, res) => {
  try {
    // This is a placeholder - in a real implementation, you would need to handle
    // application restart carefully, possibly through a process manager
    res.json({ message: 'Restart initiated' });
  } catch (e) { 
    res.status(500).json({ error: String(e) }); 
  }
});

// SSE endpoint for metrics streaming
router.get('/metrics/stream', (req, res) => {
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Credentials': 'true',
    'X-Accel-Buffering': 'no' // Disable buffering for nginx
  });

  // Send a heartbeat every 30 seconds
  const heartbeat = setInterval(() => {
    res.write(':keep-alive\n\n');
  }, 30000);

  // Send initial data
  systemMetrics.collectSystemMetrics().then(metrics => {
    res.write(`data: ${JSON.stringify(metrics)}\n\n`);
  }).catch(err => {
    console.error('Error collecting initial metrics:', err);
  });

  // Send updates every 5 seconds
  const interval = setInterval(async () => {
    try {
      const metrics = await systemMetrics.collectSystemMetrics();
      res.write(`data: ${JSON.stringify(metrics)}\n\n`);
    } catch (err) {
      console.error('Error collecting metrics:', err);
    }
  }, 5000);

  // Handle CORS preflight requests
  // Some browsers may send an OPTIONS preflight; respond accordingly
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  req.on('close', () => {
    clearInterval(interval);
    clearInterval(heartbeat);
    res.end();
  });
});

// Preflight for SSE endpoint
router.options('/metrics/stream', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(204).end();
});

module.exports = router;