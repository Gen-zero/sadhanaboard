const express = require('express');
const router = express.Router();
const { adminAuthenticate } = require('../middleware/adminAuth');
const GoogleSheetsController = require('../controllers/googleSheetsController');

// All routes require admin authentication
router.use(adminAuthenticate);

// Create a new Google Sheets integration
router.post('/integrations', GoogleSheetsController.createIntegration);

// Export all books to Google Sheets
router.post('/export-books', GoogleSheetsController.exportBooksToSheets);

// Append books to existing Google Sheets spreadsheet
router.post('/append-books', GoogleSheetsController.appendBooksToSheets);

module.exports = router;