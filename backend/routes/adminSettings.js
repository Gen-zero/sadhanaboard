const express = require('express');
const router = express.Router();
const { adminAuthenticate } = require('../middleware/adminAuth');
const featureFlagService = require('../services/featureFlagService');
const experimentService = require('../services/experimentService');
const notificationService = require('../services/notificationService');
const integrationService = require('../services/integrationService');
const securityPolicyService = require('../services/securityPolicyService');
const reminderService = require('../services/reminderService');

// All routes require admin auth
router.use(adminAuthenticate);

// Feature flags
router.get('/feature-flags', async (req, res) => {
  const { q, limit, offset } = req.query;
  const data = await featureFlagService.listFlags({ q, limit: Number(limit) || 50, offset: Number(offset) || 0 });
  res.json(data);
});
router.post('/feature-flags', async (req, res) => {
  const payload = req.body;
  const created = await featureFlagService.createFlag(payload);
  res.json({ feature_flag: created });
});
router.get('/feature-flags/:id', async (req, res) => {
  const item = await featureFlagService.getFlag(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ feature_flag: item });
});
router.patch('/feature-flags/:id', async (req, res) => {
  const updated = await featureFlagService.updateFlag(req.params.id, req.body);
  res.json({ feature_flag: updated });
});
router.delete('/feature-flags/:id', async (req, res) => {
  await featureFlagService.deleteFlag(req.params.id);
  res.json({ message: 'deleted' });
});

// Experiments
router.get('/experiments', async (req, res) => {
  const { q, limit, offset } = req.query;
  const data = await experimentService.listExperiments({ q, limit: Number(limit) || 50, offset: Number(offset) || 0 });
  res.json(data);
});
router.post('/experiments', async (req, res) => {
  const created = await experimentService.createExperiment(req.body);
  res.json({ experiment: created });
});
router.get('/experiments/:id', async (req, res) => {
  const item = await experimentService.getExperiment(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ experiment: item });
});
router.patch('/experiments/:id', async (req, res) => {
  const updated = await experimentService.updateExperiment(req.params.id, req.body);
  res.json({ experiment: updated });
});
router.delete('/experiments/:id', async (req, res) => {
  await experimentService.deleteExperiment(req.params.id);
  res.json({ message: 'deleted' });
});

// Notification channels
router.get('/notification-channels', async (req, res) => {
  const { limit, offset } = req.query;
  const data = await notificationService.listChannels({ limit: Number(limit) || 50, offset: Number(offset) || 0 });
  res.json(data);
});
router.post('/notification-channels', async (req, res) => {
  const created = await notificationService.createChannel(req.body);
  res.json({ channel: created });
});
router.patch('/notification-channels/:id', async (req, res) => {
  const updated = await notificationService.updateChannel(req.params.id, req.body);
  res.json({ channel: updated });
});
router.delete('/notification-channels/:id', async (req, res) => {
  await notificationService.deleteChannel(req.params.id);
  res.json({ message: 'deleted' });
});

// Integrations
router.get('/integrations', async (req, res) => {
  const data = await integrationService.listIntegrations({ limit: Number(req.query.limit) || 50, offset: Number(req.query.offset) || 0 });
  res.json(data);
});
router.post('/integrations', async (req, res) => {
  const created = await integrationService.createIntegration(req.body);
  res.json({ integration: created });
});
router.get('/integrations/:id', async (req, res) => {
  const item = await integrationService.getIntegration(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ integration: item });
});
router.patch('/integrations/:id', async (req, res) => {
  const updated = await integrationService.updateIntegration(req.params.id, req.body);
  res.json({ integration: updated });
});
router.delete('/integrations/:id', async (req, res) => {
  await integrationService.deleteIntegration(req.params.id);
  res.json({ message: 'deleted' });
});

// Security policies
router.get('/security-policies', async (req, res) => {
  const data = await securityPolicyService.listPolicies({ limit: Number(req.query.limit) || 50, offset: Number(req.query.offset) || 0 });
  res.json(data);
});
router.post('/security-policies', async (req, res) => {
  const created = await securityPolicyService.createPolicy(req.body);
  res.json({ policy: created });
});
router.patch('/security-policies/:id', async (req, res) => {
  const updated = await securityPolicyService.updatePolicy(req.params.id, req.body);
  res.json({ policy: updated });
});
router.delete('/security-policies/:id', async (req, res) => {
  await securityPolicyService.deletePolicy(req.params.id);
  res.json({ message: 'deleted' });
});

// Reminder templates
router.get('/reminders', async (req, res) => {
  const data = await reminderService.listTemplates({ limit: Number(req.query.limit) || 50, offset: Number(req.query.offset) || 0 });
  res.json(data);
});
router.post('/reminders', async (req, res) => {
  const created = await reminderService.createTemplate(req.body);
  res.json({ reminder: created });
});
router.get('/reminders/:id', async (req, res) => {
  const item = await reminderService.getTemplate(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ reminder: item });
});
router.patch('/reminders/:id', async (req, res) => {
  const updated = await reminderService.updateTemplate(req.params.id, req.body);
  res.json({ reminder: updated });
});
router.delete('/reminders/:id', async (req, res) => {
  await reminderService.deleteTemplate(req.params.id);
  res.json({ message: 'deleted' });
});

module.exports = router;
