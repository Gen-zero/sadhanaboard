const express = require('express');
const router = express.Router({ mergeParams: true });
const readingCtrl = require('../controllers/bookReadingController');
const { authenticate } = require('../middleware/auth');

// Progress endpoints
router.post('/progress', authenticate, readingCtrl.upsertProgress);
router.get('/progress', authenticate, readingCtrl.getProgress);

// Bookmarks
router.post('/bookmarks', authenticate, readingCtrl.createBookmark);
router.get('/bookmarks', authenticate, readingCtrl.listBookmarks);
router.put('/bookmarks/:id', authenticate, readingCtrl.updateBookmark);
router.delete('/bookmarks/:id', authenticate, readingCtrl.deleteBookmark);

// Annotations
router.post('/annotations', authenticate, readingCtrl.createAnnotation);
router.get('/annotations', authenticate, readingCtrl.listAnnotations);
router.put('/annotations/:id', authenticate, readingCtrl.updateAnnotation);
router.delete('/annotations/:id', authenticate, readingCtrl.deleteAnnotation);

module.exports = router;
