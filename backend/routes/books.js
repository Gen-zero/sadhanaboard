const express = require('express');
const BookController = require('../controllers/bookController');
const { authenticate } = require('../middleware/auth');
const { adminAuthenticate } = require('../middleware/adminAuth');
const path = require('path');

const router = express.Router();

// reading endpoints (progress, bookmarks, annotations)
const readingRoutes = require('./bookReading');

// Public routes
router.get('/', BookController.getBooks);
router.get('/traditions', BookController.getBookTraditions);
router.get('/files/:filename', BookController.serveBookFile);
router.get('/suggestions', BookController.getBookSuggestions);
router.get('/languages', BookController.getLanguages);
router.get('/year-range', BookController.getYearRange);

// Admin analytics endpoints
router.get('/admin/analytics', adminAuthenticate, BookController.getLibraryAnalytics);
router.get('/admin/analytics/export', adminAuthenticate, BookController.exportLibraryAnalytics);
router.get('/admin/analytics/:id', adminAuthenticate, BookController.getBookAnalyticsById);

// Admin routes (protected) - MUST be registered before parameterized /:id to avoid shadowing
router.get('/admin/all', adminAuthenticate, BookController.getAllBooksAdmin);
// Admin bulk operations
router.post('/admin/bulk-upload', adminAuthenticate, BookController.bulkUploadBooks);
router.post('/admin/import-url', adminAuthenticate, BookController.importFromURL);
router.post('/admin/bulk-import-urls', adminAuthenticate, BookController.bulkImportFromURLs);
router.put('/admin/batch-update', adminAuthenticate, BookController.batchUpdateBooks);
router.delete('/admin/batch-delete', adminAuthenticate, BookController.batchDeleteBooks);
router.put('/:id', adminAuthenticate, BookController.updateBook);
router.delete('/:id', adminAuthenticate, BookController.deleteBook);

// Public parameterized route (book by id) - placed after admin routes to avoid capture
router.get('/:id', BookController.getBookById);

// Protected public route for authenticated users to create
router.post('/', authenticate, BookController.createBook);

// mount reading routes under a book context
router.use('/:bookId/reading', readingRoutes);

module.exports = router;