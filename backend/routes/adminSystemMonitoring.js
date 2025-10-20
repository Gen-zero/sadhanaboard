const express = require('express');
const { adminAuthenticate, requirePermission } = require('../middleware/adminAuth');
const { catchAsync } = require('../middleware/errorHandler');
const SystemMetricsService = require('../services/systemMetricsService');

const router = express.Router();

// Get current system metrics
router.get('/system/metrics', 
  adminAuthenticate, 
  requirePermission('read:settings'),
  catchAsync(async (req, res) => {
    const metrics = await SystemMetricsService.collectSystemMetrics();
    res.json({ metrics });
  })
);

// Get system health status
router.get('/system/health', 
  adminAuthenticate, 
  requirePermission('read:settings'),
  catchAsync(async (req, res) => {
    const health = await SystemMetricsService.getSystemHealth();
    res.json({ health });
  })
);

// Get system alerts
router.get('/system/alerts', 
  adminAuthenticate, 
  requirePermission('read:settings'),
  catchAsync(async (req, res) => {
    const alerts = await SystemMetricsService.getSystemAlerts();
    res.json({ alerts });
  })
);

// Get alert history
router.get('/system/alerts/history', 
  adminAuthenticate, 
  requirePermission('read:settings'),
  catchAsync(async (req, res) => {
    const history = SystemMetricsService.getAlertHistory();
    res.json({ history });
  })
);

// Resolve an alert
router.post('/system/alerts/:alertId/resolve', 
  adminAuthenticate, 
  requirePermission('write:settings'),
  catchAsync(async (req, res) => {
    const { alertId } = req.params;
    const resolved = SystemMetricsService.resolveAlert(alertId);
    
    if (resolved) {
      // Log the action
      req.secureLog('ALERT_RESOLVED', 'system_alert', alertId, null, { 
        category: 'system',
        severity: 'info'
      });
      
      res.json({ 
        message: 'Alert resolved successfully',
        alertId 
      });
    } else {
      res.status(404).json({ 
        error: 'Alert not found',
        message: `Alert with ID ${alertId} not found`
      });
    }
  })
);

// Get historical metrics
router.get('/system/metrics/history', 
  adminAuthenticate, 
  requirePermission('read:settings'),
  catchAsync(async (req, res) => {
    const { hours = 24 } = req.query;
    const historical = await SystemMetricsService.getHistoricalMetrics(parseInt(hours));
    res.json({ historical });
  })
);

// Get metrics trends
router.get('/system/metrics/trends', 
  adminAuthenticate, 
  requirePermission('read:settings'),
  catchAsync(async (req, res) => {
    const { hours = 1 } = req.query;
    const trends = await SystemMetricsService.getMetricsTrends(parseInt(hours));
    res.json({ trends });
  })
);

// Get system recommendations
router.get('/system/recommendations', 
  adminAuthenticate, 
  requirePermission('read:settings'),
  catchAsync(async (req, res) => {
    const recommendations = await SystemMetricsService.getSystemRecommendations();
    res.json({ recommendations });
  })
);

module.exports = router;