const GoogleSheetsService = require('../services/googleSheetsService');
const BookService = require('../services/bookService');
const integrationService = require('../services/integrationService');

/**
 * Google Sheets Controller
 * Handles API endpoints for Google Sheets integration
 */
class GoogleSheetsController {
  /**
   * Create a new Google Sheets integration
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async createIntegration(req, res) {
    try {
      // In a real implementation, you would validate the Google credentials here
      // For now, we'll just store the integration with a placeholder
      const integrationData = {
        name: req.body.name || 'Google Sheets Integration',
        provider: 'google-sheets',
        credentials: req.body.credentials || {},
        enabled: req.body.enabled !== undefined ? req.body.enabled : true,
        spreadsheet_id: req.body.spreadsheetId || null,
        metadata: {
          ...req.body.metadata
        }
      };

      // Create integration in database
      const integration = await integrationService.createIntegration(integrationData);
      
      res.status(201).json({ integration });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Export all books to Google Sheets
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async exportBooksToSheets(req, res) {
    try {
      const { integrationId, spreadsheetId, createNew } = req.body;
      
      // Validate required parameters
      if (!integrationId) {
        return res.status(400).json({ error: 'integrationId is required' });
      }
      
      // Get integration details
      const integration = await integrationService.getIntegration(integrationId);
      if (!integration) {
        return res.status(404).json({ error: 'Integration not found' });
      }
      
      // Get all books from the database
      const books = await BookService.getAllBooksAdmin();
      
      // If createNew flag is set, create a new spreadsheet
      let targetSpreadsheetId = spreadsheetId || integration.spreadsheet_id;
      if (createNew) {
        const title = req.body.title || 'SadhanaBoard Books Export';
        targetSpreadsheetId = await GoogleSheetsService.createSpreadsheet(integrationId, title);
      }
      
      if (!targetSpreadsheetId) {
        return res.status(400).json({ error: 'spreadsheetId is required when createNew is false and no existing spreadsheet ID is set' });
      }
      
      // Export books to Google Sheets
      const result = await GoogleSheetsService.updateSpreadsheet(integrationId, targetSpreadsheetId, books.items || books);
      
      res.json({ 
        message: 'Books successfully exported to Google Sheets',
        spreadsheetId: targetSpreadsheetId,
        result: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Append new books to existing Google Sheets spreadsheet
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async appendBooksToSheets(req, res) {
    try {
      const { integrationId, spreadsheetId, bookIds } = req.body;
      
      // Validate required parameters
      if (!integrationId) {
        return res.status(400).json({ error: 'integrationId is required' });
      }
      
      // Get integration details
      const integration = await integrationService.getIntegration(integrationId);
      if (!integration) {
        return res.status(404).json({ error: 'Integration not found' });
      }
      
      // Use spreadsheet ID from request or integration
      const targetSpreadsheetId = spreadsheetId || integration.spreadsheet_id;
      if (!targetSpreadsheetId) {
        return res.status(400).json({ error: 'spreadsheetId is required when no existing spreadsheet ID is set' });
      }
      
      // Get specific books or all books
      let books = [];
      if (bookIds && Array.isArray(bookIds) && bookIds.length > 0) {
        // Get specific books by IDs
        for (const bookId of bookIds) {
          const book = await BookService.getBookById(bookId);
          if (book) {
            books.push(book);
          }
        }
      } else {
        // Get all books
        const allBooks = await BookService.getAllBooksAdmin();
        books = allBooks.items || allBooks;
      }
      
      // Append books to Google Sheets
      const result = await GoogleSheetsService.appendBookData(integrationId, targetSpreadsheetId, books);
      
      res.json({ 
        message: 'Books successfully appended to Google Sheets',
        result: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = GoogleSheetsController;