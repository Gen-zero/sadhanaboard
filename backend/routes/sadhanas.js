const express = require('express');
const SadhanaController = require('../controllers/sadhanaController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, SadhanaController.getUserSadhanas);
router.post('/', authenticate, SadhanaController.createSadhana);

// Community/feed routes - must be before parameterized routes
router.get('/community/feed', authenticate, SadhanaController.getCommunityFeed);
router.get('/shared/:id', authenticate, SadhanaController.getSharedSadhanaDetails);

// Sharing routes
router.post('/:id/share', authenticate, SadhanaController.shareSadhana);
router.delete('/:id/share', authenticate, SadhanaController.unshareSadhana);
router.put('/:id/share/privacy', authenticate, SadhanaController.updateSharePrivacy);

// Likes
router.post('/:id/likes', authenticate, SadhanaController.likeSadhana);
router.delete('/:id/likes', authenticate, SadhanaController.unlikeSadhana);

// Comments
router.get('/:id/comments', authenticate, SadhanaController.getSadhanaComments);
router.post('/:id/comments', authenticate, SadhanaController.createSadhanaComment);
router.put('/:id/comments/:commentId', authenticate, SadhanaController.updateSadhanaComment);
router.delete('/:id/comments/:commentId', authenticate, SadhanaController.deleteSadhanaComment);

// Existing param routes
router.put('/:id', authenticate, SadhanaController.updateSadhana);
router.delete('/:id', authenticate, SadhanaController.deleteSadhana);
router.get('/:sadhanaId/progress', authenticate, SadhanaController.getSadhanaProgress);
router.post('/:sadhanaId/progress', authenticate, SadhanaController.upsertSadhanaProgress);

module.exports = router;