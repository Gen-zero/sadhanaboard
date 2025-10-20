const express = require('express');
const ProfileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, ProfileController.getProfile);
router.put('/', authenticate, ProfileController.updateProfile);
router.post('/:id/follow', authenticate, ProfileController.follow);
router.post('/:id/unfollow', authenticate, ProfileController.unfollow);
router.get('/:id/followers', authenticate, ProfileController.followers);
router.get('/:id/following', authenticate, ProfileController.following);
router.get('/:id/follow-stats', authenticate, ProfileController.followStats);
router.get('/:id/is-following', authenticate, ProfileController.isFollowing);

// Analytics (operate on authenticated user: use req.user.id)
router.get('/analytics/practice-trends', authenticate, ProfileController.getPracticeTrends);
router.get('/analytics/completion-rates', authenticate, ProfileController.getCompletionRates);
router.get('/analytics/streaks', authenticate, ProfileController.getStreaks);
router.get('/analytics/comparative', authenticate, ProfileController.getComparative);
router.get('/analytics/detailed-report', authenticate, ProfileController.getDetailedReport);
router.get('/analytics/heatmap', authenticate, ProfileController.getHeatmap);
router.get('/analytics/category-insights', authenticate, ProfileController.getCategoryInsights);

// Exports
router.get('/analytics/export/csv', authenticate, ProfileController.exportCSV);
router.get('/analytics/export/pdf', authenticate, ProfileController.exportPDF);

module.exports = router;