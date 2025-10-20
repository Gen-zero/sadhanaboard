const express = require('express');
const router = express.Router();
const { adminAuthenticate } = require('../middleware/adminAuth');
const CSVExportController = require('../controllers/csvExportController');

// All routes require admin authentication
router.use(adminAuthenticate);

// Export all books as CSV
router.get('/books', CSVExportController.exportBooksAsCSV);

// Export selected books as CSV
router.post('/books', CSVExportController.exportSelectedBooksAsCSV);

module.exports = router;