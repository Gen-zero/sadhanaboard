const express = require('express');
const router = express.Router();
const communityService = require('../services/communityService');
const eventService = require('../services/eventService');
const mentorshipService = require('../services/mentorshipService');
const milestoneService = require('../services/milestoneService');
const { adminAuthenticate } = require('../middleware/adminAuth');

// Require admin authentication for all community admin routes
router.use(adminAuthenticate);

// list posts
// Posts
router.get('/posts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const status = req.query.status;
    const items = await communityService.getAllPosts({ status, limit, offset });
    const total = Array.isArray(items) ? items.length : 0;
    const page = Math.floor(offset / limit) + 1;
    const totalPages = limit ? Math.ceil(total / limit) : 1;
    res.json({ items, total, page, limit, totalPages });
  } catch (e) {
    console.error('GET /posts error', e);
    res.status(500).json({ error: 'Failed to list posts' });
  }
});

router.patch('/posts/:id/approve', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await communityService.approvePost(id, req.user && req.user.id);
    try { req.secureLog && req.secureLog('approve_post', 'post', id, { updated }, { severity: 'high', category: 'moderation' }); } catch (e) { req.logAdminAction && req.logAdminAction('approve_post', `post:${id}`); }
    res.json({ item: updated });
  } catch (e) { console.error('approve post', e); res.status(500).json({ error: 'Failed to approve post' }); }
});

router.patch('/posts/:id/reject', async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;
    const updated = await communityService.rejectPost(id, req.user && req.user.id, reason);
    try { req.secureLog && req.secureLog('reject_post', 'post', id, { reason, updated }, { severity: 'high', category: 'moderation' }); } catch (e) { req.logAdminAction && req.logAdminAction('reject_post', `post:${id}`); }
    res.json({ item: updated });
  } catch (e) { console.error('reject post', e); res.status(500).json({ error: 'Failed to reject post' }); }
});

router.delete('/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const ok = await communityService.deletePost(id, req.user && req.user.id);
    try { req.secureLog && req.secureLog('delete_post', 'post', id, { ok }, { severity: 'high', category: 'moderation' }); } catch (e) { req.logAdminAction && req.logAdminAction('delete_post', `post:${id}`); }
    res.json({ ok });
  } catch (e) { console.error('delete post', e); res.status(500).json({ error: 'Failed to delete post' }); }
});

// activity stream
router.get('/activity', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const type = req.query.type;
    const from = req.query.from;
    const to = req.query.to;
    const items = await communityService.getActivityStream({ userId, type, limit, offset, from, to });
    const total = Array.isArray(items) ? items.length : 0;
    const page = Math.floor(offset / limit) + 1;
    const totalPages = limit ? Math.ceil(total / limit) : 1;
    res.json({ items, total, page, limit, totalPages });
  } catch (e) { console.error('GET /activity error', e); res.status(500).json({ error: 'Failed to load activity' }); }
});

router.get('/activity/stats', async (req, res) => {
  const stats = await communityService.getActivityStats();
  res.json({ stats });
});

// events
router.get('/events', async (req, res) => {
  const list = await eventService.getAllEvents({});
  res.json({ items: list });
});

router.post('/events', async (req, res) => {
  const created = await eventService.createEvent(req.body, req.user && req.user.id);
  try { req.secureLog && req.secureLog('create_event', 'event', created && created.id, { created }, { category: 'events' }); } catch (e) { req.logAdminAction && req.logAdminAction('create_event', `event:${created && created.id}`); }
  res.json({ item: created });
});

router.patch('/events/:id', async (req, res) => {
  const id = req.params.id;
  const updated = await eventService.updateEvent(id, req.body, req.user && req.user.id);
  try { req.secureLog && req.secureLog('update_event', 'event', id, { updated }, { category: 'events' }); } catch (e) { req.logAdminAction && req.logAdminAction('update_event', `event:${id}`); }
  res.json({ item: updated });
});

router.delete('/events/:id', async (req, res) => {
  const id = req.params.id;
  const ok = await eventService.deleteEvent(id, req.user && req.user.id);
  try { req.secureLog && req.secureLog('delete_event', 'event', id, { ok }, { category: 'events' }); } catch (e) { req.logAdminAction && req.logAdminAction('delete_event', `event:${id}`); }
  res.json({ ok });
});

// mentorship pairs
router.get('/mentorship/pairs', async (req, res) => {
  const { limit = 50, offset = 0 } = req.query;
  const list = await mentorshipService.listPairs({ limit, offset });
  res.json({ items: list });
});

router.post('/mentorship/pairs', async (req, res) => {
  const { mentorId, menteeId, programType } = req.body;
  const pair = await mentorshipService.createMentorshipPair(mentorId, menteeId, programType, req.user && req.user.id);
  try { req.secureLog && req.secureLog('create_mentorship_pair', 'mentorship', pair && pair.id, { pair }, { category: 'mentorship' }); } catch (e) { req.logAdminAction && req.logAdminAction('create_mentorship_pair', `pair:${pair && pair.id}`); }
  res.json({ item: pair });
});

router.patch('/mentorship/pairs/:id/status', async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const updated = await mentorshipService.updatePairStatus(id, status, req.user && req.user.id);
  res.json({ item: updated });
});

router.post('/mentorship/pairs/:id/end', async (req, res) => {
  const id = req.params.id;
  const ended = await mentorshipService.endMentorship(id, req.user && req.user.id);
  res.json({ item: ended });
});

// milestones
router.get('/milestones', async (req, res) => {
  const { userId } = req.query;
  const list = await milestoneService.listMilestones({ userId });
  res.json({ items: list });
});

router.post('/milestones', async (req, res) => {
  const { userId, milestoneType, data } = req.body;
  const item = await milestoneService.createMilestone(userId, milestoneType, data);
  try { req.secureLog && req.secureLog('create_milestone', 'milestone', item && item.id, { item }, { category: 'milestones' }); } catch (e) { req.logAdminAction && req.logAdminAction('create_milestone', `milestone:${item && item.id}`); }
  res.json({ item });
});

// Comments
router.get('/comments', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const postId = req.query.postId ? Number(req.query.postId) : undefined;
    const status = req.query.status;
    const items = await communityService.getAllComments({ postId, status, limit, offset });
    const total = Array.isArray(items) ? items.length : 0;
    const page = Math.floor(offset / limit) + 1;
    const totalPages = limit ? Math.ceil(total / limit) : 1;
    res.json({ items, total, page, limit, totalPages });
  } catch (e) { console.error('GET /comments error', e); res.status(500).json({ error: 'Failed to load comments' }); }
});

router.patch('/comments/:id/moderate', async (req, res) => {
  const { action } = req.body; // approve/hide/review
  const id = req.params.id;
  const updated = await communityService.moderateComment(id, action, req.user && req.user.id);
  try { req.secureLog && req.secureLog('moderate_comment', 'comment', id, { action, updated }, { category: 'moderation' }); } catch (e) { req.logAdminAction && req.logAdminAction('moderate_comment', `comment:${id}`); }
  res.json({ item: updated });
});

// Reports
router.get('/reports', async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const items = await communityService.getReports({ status, limit, offset });
    const total = Array.isArray(items) ? items.length : 0;
    const page = Math.floor(offset / limit) + 1;
    const totalPages = limit ? Math.ceil(total / limit) : 1;
    res.json({ items, total, page, limit, totalPages });
  } catch (e) { console.error('GET /reports error', e); res.status(500).json({ error: 'Failed to load reports' }); }
});

router.get('/reports/stats', async (req, res) => {
  // basic stats grouped by status
  const items = await communityService.getReportsStats();
  res.json({ stats: items });
});

router.patch('/reports/:id/resolve', async (req, res) => {
  const id = req.params.id;
  const { action, notes } = req.body;
  const updated = await communityService.resolveReport(id, req.user && req.user.id, action, notes);
  try { req.secureLog && req.secureLog('resolve_report', 'report', id, { action, notes, updated }, { category: 'moderation' }); } catch (e) { req.logAdminAction && req.logAdminAction('resolve_report', `report:${id}`); }
  res.json({ item: updated });
});

module.exports = router;
