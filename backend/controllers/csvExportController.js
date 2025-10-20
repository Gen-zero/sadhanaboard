const BookService = require('../services/bookService');

/**
 * CSV Export Controller
 * Handles exporting book data as CSV files
 */
class CSVExportController {
  /**
   * Export all books as CSV
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async exportBooksAsCSV(req, res) {
    try {
      // Get all books from the database
      const booksResult = await BookService.getAllBooksAdmin();
      const books = booksResult.items || booksResult;
      
      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="sadhana-books-export.csv"');
      
      // Create CSV header
      const header = 'Title,Author,Traditions,Description,Year,Language,Page Count,Created At\n';
      
      // Create CSV rows
      const rows = books.map(book => {
        // Escape commas and quotes in fields
        const escapeField = (field) => {
          if (field === null || field === undefined) return '';
          const str = String(field);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };
        
        return [
          escapeField(book.title),
          escapeField(book.author),
          escapeField(Array.isArray(book.traditions) ? book.traditions.join(', ') : book.traditions),
          escapeField(book.description),
          escapeField(book.year),
          escapeField(book.language),
          escapeField(book.page_count),
          escapeField(book.created_at ? new Date(book.created_at).toISOString() : '')
        ].join(',');
      }).join('\n');
      
      // Send CSV content
      res.send(header + rows);
    } catch (error) {
      console.error('CSV export error:', error);
      res.status(500).json({ error: 'Failed to export books as CSV' });
    }
  }
  
  /**
   * Export selected books as CSV
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async exportSelectedBooksAsCSV(req, res) {
    try {
      const { bookIds } = req.body;
      
      if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
        return res.status(400).json({ error: 'bookIds array is required' });
      }
      
      // Get specific books by IDs
      const books = [];
      for (const bookId of bookIds) {
        const book = await BookService.getBookById(bookId);
        if (book) {
          books.push(book);
        }
      }
      
      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="sadhana-selected-books-export.csv"');
      
      // Create CSV header
      const header = 'Title,Author,Traditions,Description,Year,Language,Page Count,Created At\n';
      
      // Create CSV rows
      const rows = books.map(book => {
        // Escape commas and quotes in fields
        const escapeField = (field) => {
          if (field === null || field === undefined) return '';
          const str = String(field);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };
        
        return [
          escapeField(book.title),
          escapeField(book.author),
          escapeField(Array.isArray(book.traditions) ? book.traditions.join(', ') : book.traditions),
          escapeField(book.description),
          escapeField(book.year),
          escapeField(book.language),
          escapeField(book.page_count),
          escapeField(book.created_at ? new Date(book.created_at).toISOString() : '')
        ].join(',');
      }).join('\n');
      
      // Send CSV content
      res.send(header + rows);
    } catch (error) {
      console.error('CSV export error:', error);
      res.status(500).json({ error: 'Failed to export selected books as CSV' });
    }
  }
}

module.exports = CSVExportController;