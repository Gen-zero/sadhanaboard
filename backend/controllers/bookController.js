/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management and reading progress
 */

const BookService = require('../services/bookService');
const BookAnalyticsService = require('../services/bookAnalyticsService');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    // Create uploads directory if it doesn't exist
    fs.mkdir(uploadPath, { recursive: true }).then(() => {
      cb(null, uploadPath);
    }).catch(err => {
      console.error('Error creating upload directory:', err);
      cb(err);
    });
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Export array upload middleware (max 20 files)
const uploadArray = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter: upload.opts ? upload.opts.fileFilter : undefined }).array('bookFiles', 20);

class BookController {
  // Get all spiritual books
  static async getBooks(req, res) {
    try {
      // Support flexible filters via query params
      const {
        search,
        traditions,
        language,
        minYear,
        maxYear,
        fileType,
        sortBy,
        sortOrder,
        limit,
        offset
      } = req.query;

      const parsedTraditions = traditions ? JSON.parse(traditions) : [];

      const filters = {
        search,
        traditions: parsedTraditions,
        language,
        minYear: minYear ? Number(minYear) : undefined,
        maxYear: maxYear ? Number(maxYear) : undefined,
        fileType,
        sortBy,
        sortOrder,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined
      };

      const result = await BookService.getBooks(filters);
      res.json(result);
    } catch (error) {
      console.error('BookController.getBooks error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch books', details: error.stack || null });
    }
  }

  // Get unique traditions
  static async getBookTraditions(req, res) {
    try {
      const traditions = await BookService.getBookTraditions();
      res.json({ traditions });
    } catch (error) {
      console.error('BookController.getBookTraditions error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch traditions', details: error.stack || null });
    }
  }

  // Public: suggestions for autocomplete
  static async getBookSuggestions(req, res) {
    try {
      const { q, limit } = req.query;
      const suggestions = await BookService.getBookSuggestions(q, limit ? Number(limit) : 10);
      res.json({ suggestions });
    } catch (e) {
      console.error('BookController.getBookSuggestions error:', e);
      res.status(500).json({ error: e.message || 'Failed to fetch suggestions', details: e.stack || null });
    }
  }

  // Public: list available languages
  static async getLanguages(req, res) {
    try {
      const languages = await BookService.getLanguages();
      res.json({ languages });
    } catch (e) {
      console.error('BookController.getLanguages error:', e);
      res.status(500).json({ error: e.message || 'Failed to fetch languages', details: e.stack || null });
    }
  }

  // Public: year range
  static async getYearRange(req, res) {
    try {
      const range = await BookService.getYearRange();
      res.json(range);
    } catch (e) {
      console.error('BookController.getYearRange error:', e);
      res.status(500).json({ error: e.message || 'Failed to fetch year range', details: e.stack || null });
    }
  }

  // Create a new spiritual book with file upload
  static async createBook(req, res) {
    try {
      // Handle file upload if present
      upload.single('bookFile')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ error: `File upload error: ${err.message}` });
        } else if (err) {
          return res.status(400).json({ error: err.message });
        }

        // Process book data
        const bookData = JSON.parse(req.body.bookData);
        
        // If file was uploaded, update book data with file info
        if (req.file) {
          bookData.storage_url = `/uploads/${req.file.filename}`;
          bookData.is_storage_file = true;
          // Set content to null for file-based books
          bookData.content = null;
          // Capture file size
          bookData.file_size = req.file.size;
        }

        const book = await BookService.createBook(bookData, req.user.id);
        // Ensure file_size recorded in case create didn't set it
        if (req.file && book && book.id) {
          try { await BookService.updateBook(book.id, { file_size: req.file.size }, req.user && req.user.id); } catch(e) { /* best-effort */ }
        }
        
        // Emit real-time update event for new book
        if (global.__ADMIN_IO__) {
          try {
            global.__ADMIN_IO__.to('library-stream').emit('library:update', book);
          } catch (emitError) {
            console.error('Failed to emit book create event:', emitError);
          }
        }
        
        res.status(201).json({ book });
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Admin: Get all books with filters
  static async getAllBooksAdmin(req, res) {
    try {
      const { search, traditions, language, year, showDeleted, limit, offset } = req.query;
      const parsedTraditions = traditions ? JSON.parse(traditions) : [];
      const filters = {
        traditions: parsedTraditions,
        language,
        year: year ? Number(year) : undefined,
        showDeleted: showDeleted === 'true',
        limit: limit ? Number(limit) : 100,
        offset: offset ? Number(offset) : 0
      };

      const result = await BookService.getAllBooksAdmin(search || '', filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Admin: Update a book (supports optional file upload)
  static async updateBook(req, res) {
    try {
      // Handle file upload if present
      upload.single('bookFile')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ error: `File upload error: ${err.message}` });
        } else if (err) {
          return res.status(400).json({ error: err.message });
        }

        const { id } = req.params;
        let bookData = {};
        try {
          if (req.body.bookData) {
            bookData = JSON.parse(req.body.bookData);
          } else {
            // Accept form encoded fields as fallback
            bookData = req.body;
          }
        } catch (parseErr) {
          return res.status(400).json({ error: 'Invalid bookData JSON' });
        }

        // If a new file was uploaded, set storage_url
        if (req.file) {
          bookData.storage_url = `/uploads/${req.file.filename}`;
          bookData.is_storage_file = true;
          bookData.content = null;

          // Attempt to delete old file (best-effort)
          try {
            const existing = await BookService.getBookById(id, true);
            if (existing && existing.storage_url && existing.storage_url.startsWith('/uploads/')) {
              const oldFilename = existing.storage_url.replace('/uploads/', '');
              const oldFilePath = path.join(__dirname, '../../uploads', oldFilename);
              await fs.unlink(oldFilePath).catch(() => {});
            }
          } catch (e) {
            // ignore file deletion errors
          }
        }

        const updated = await BookService.updateBook(id, bookData, req.user && req.user.id);
        
        // Emit real-time update event
        if (global.__ADMIN_IO__) {
          try {
            global.__ADMIN_IO__.to('library-stream').emit('library:update', updated);
          } catch (emitError) {
            console.error('Failed to emit book update event:', emitError);
          }
        }
        
        res.json({ book: updated });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Admin: Soft delete a book
  static async deleteBook(req, res) {
    try {
      const { id } = req.params;
      const deleted = await BookService.deleteBook(id);
      
      // Emit real-time update event
      if (global.__ADMIN_IO__) {
        try {
          global.__ADMIN_IO__.to('library-stream').emit('library:update', deleted);
        } catch (emitError) {
          console.error('Failed to emit book delete event:', emitError);
        }
      }
      
      res.json({ message: 'Book deleted successfully', book: deleted });
    } catch (error) {
      if (error.message && error.message.includes('not found')) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Admin: Bulk upload multiple files
  static async bulkUploadBooks(req, res) {
    // Use upload.array middleware
    upload.array('bookFiles', 20)(req, res, async function (err) {
      if (err instanceof multer.MulterError) return res.status(400).json({ error: `File upload error: ${err.message}` });
      if (err) return res.status(400).json({ error: err.message });

      try {
        const files = req.files || [];
        const bookDataArrayRaw = req.body.bookDataArray || '[]';
        let bookDataArray = [];
        try { bookDataArray = JSON.parse(bookDataArrayRaw); } catch (e) { return res.status(400).json({ error: 'Invalid bookDataArray JSON' }); }

        if (!Array.isArray(files) || !Array.isArray(bookDataArray) || files.length !== bookDataArray.length) {
          return res.status(400).json({ error: 'Number of files must match number of metadata objects' });
        }

        const results = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const meta = bookDataArray[i] || {};
          try {
            meta.storage_url = `/uploads/${file.filename}`;
            meta.is_storage_file = true;
            meta.content = null;
              meta.file_size = file.size;
              const book = await BookService.createBook(meta, req.user && req.user.id);
              // best-effort update file_size
              try { if (book && book.id) await BookService.updateBook(book.id, { file_size: file.size }, req.user && req.user.id); } catch (err) {}
            results.push({ success: true, fileName: file.originalname, bookId: book.id });
          } catch (e) {
            results.push({ success: false, fileName: file.originalname, error: e.message || String(e) });
          }
        }

        const successCount = results.filter(r => r.success).length;
        const failCount = results.length - successCount;
        
        // Emit real-time update events for successful uploads
        if (global.__ADMIN_IO__) {
          try {
            results.filter(r => r.success).forEach(result => {
              global.__ADMIN_IO__.to('library-stream').emit('library:update', { id: result.bookId, ...result });
            });
          } catch (emitError) {
            console.error('Failed to emit book bulk upload events:', emitError);
          }
        }
        
        return res.json({ results, summary: { total: results.length, successful: successCount, failed: failCount } });
      } catch (e) {
        return res.status(500).json({ error: e.message || String(e) });
      }
    });
  }

  // Helper: download a file from URL to destination path
  static downloadFileFromURL(urlStr, destPath) {
    const http = require('http');
    const https = require('https');
    const fsSync = require('fs');
    return new Promise((resolve, reject) => {
      try {
        const urlObj = new URL(urlStr);
        const client = urlObj.protocol === 'https:' ? https : http;
        const req = client.get(urlStr, (resp) => {
          if (resp.statusCode !== 200) return reject(new Error(`Download failed with status ${resp.statusCode}`));
          const contentType = resp.headers['content-type'] || '';
          if (!contentType.includes('pdf')) return reject(new Error('URL did not return a PDF'));
          const length = parseInt(resp.headers['content-length'] || '0', 10);
          if (length > 50 * 1024 * 1024) return reject(new Error('File exceeds 50MB limit'));
          const fileStream = fsSync.createWriteStream(destPath);
          resp.pipe(fileStream);
          fileStream.on('finish', () => fileStream.close(() => resolve()));
          fileStream.on('error', (err) => { fsSync.unlink(destPath, () => {}); reject(err); });
        });
        req.setTimeout(30000, () => { req.abort(); reject(new Error('Download timed out')); });
        req.on('error', (err) => reject(err));
      } catch (err) {
        reject(err);
      }
    });
  }

  // Admin: Import a single book from URL
  static async importFromURL(req, res) {
    try {
      const { url, bookData } = req.body || {};
      if (!url) return res.status(400).json({ error: 'Invalid URL' });
      let parsed;
      try { parsed = new URL(url); } catch (e) { return res.status(400).json({ error: 'Invalid URL format' }); }
      if (!/^https?:$/i.test(parsed.protocol)) return res.status(400).json({ error: 'Only http/https supported' });
      if (!url.toLowerCase().endsWith('.pdf')) return res.status(400).json({ error: 'URL must point to a PDF' });

  const filename = `book-${Date.now()}-${Math.round(Math.random()*1e9)}.pdf`;
  const destPath = path.join(__dirname, '../../uploads', filename);
  await BookController.downloadFileFromURL(url, destPath);
  // get file size
  const stats = await fs.stat(destPath);
  bookData.storage_url = `/uploads/${filename}`;
  bookData.is_storage_file = true;
  bookData.content = null;
  bookData.file_size = stats.size;
  const book = await BookService.createBook(bookData, req.user && req.user.id);
  try { if (book && book.id) await BookService.updateBook(book.id, { file_size: stats.size }, req.user && req.user.id); } catch (err) {}
  
  // Emit real-time update event for new book
  if (global.__ADMIN_IO__) {
    try {
      global.__ADMIN_IO__.to('library-stream').emit('library:update', book);
    } catch (emitError) {
      console.error('Failed to emit book import event:', emitError);
    }
  }
      return res.status(201).json({ book });
    } catch (e) {
      return res.status(500).json({ error: e.message || String(e) });
    }
  }

  // Admin: Bulk import from multiple URLs
  static async bulkImportFromURLs(req, res) {
    try {
      const { urls, bookDataArray } = req.body || {};
      if (!Array.isArray(urls) || !Array.isArray(bookDataArray) || urls.length !== bookDataArray.length) return res.status(400).json({ error: 'URLs and metadata must be arrays of same length' });
      const results = [];
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const meta = bookDataArray[i] || {};
        try {
          const parsed = new URL(url);
          if (!/^https?:$/i.test(parsed.protocol) || !url.toLowerCase().endsWith('.pdf')) throw new Error('Invalid URL');
          const filename = `book-${Date.now()}-${Math.round(Math.random()*1e9)}.pdf`;
          const destPath = path.join(__dirname, '../../uploads', filename);
          await BookController.downloadFileFromURL(url, destPath);
          meta.storage_url = `/uploads/${filename}`;
          meta.is_storage_file = true;
          meta.content = null;
          const book = await BookService.createBook(meta, req.user && req.user.id);
          results.push({ success: true, url, bookId: book.id });
        } catch (e) {
          results.push({ success: false, url, error: e.message || String(e) });
        }
      }
      const success = results.filter(r => r.success).length;
      
      // Emit real-time update events for successful imports
      if (global.__ADMIN_IO__) {
        try {
          results.filter(r => r.success).forEach(result => {
            global.__ADMIN_IO__.to('library-stream').emit('library:update', { id: result.bookId, ...result });
          });
        } catch (emitError) {
          console.error('Failed to emit book bulk import events:', emitError);
        }
      }
      
      return res.json({ results, summary: { total: results.length, successful: success, failed: results.length - success } });
    } catch (e) {
      return res.status(500).json({ error: e.message || String(e) });
    }
  }

  // Admin: Batch update books
  static async batchUpdateBooks(req, res) {
    try {
      const { updates } = req.body || {};
      if (!Array.isArray(updates)) return res.status(400).json({ error: 'Updates must be an array' });
      const results = [];
      for (const u of updates) {
        try {
          const updated = await BookService.updateBook(u.id, u.bookData, req.user && req.user.id);
          results.push({ success: true, bookId: u.id, book: updated });
        } catch (e) {
          results.push({ success: false, bookId: u.id, error: e.message || String(e) });
        }
      }
      const success = results.filter(r => r.success).length;
      
      // Emit real-time update events for successful updates
      if (global.__ADMIN_IO__) {
        try {
          results.filter(r => r.success).forEach(result => {
            global.__ADMIN_IO__.to('library-stream').emit('library:update', result.book);
          });
        } catch (emitError) {
          console.error('Failed to emit book batch update events:', emitError);
        }
      }
      
      return res.json({ results, summary: { total: results.length, successful: success, failed: results.length - success } });
    } catch (e) {
      return res.status(500).json({ error: e.message || String(e) });
    }
  }

  // Admin: Batch delete (soft delete)
  static async batchDeleteBooks(req, res) {
    try {
      const { bookIds } = req.body || {};
      if (!Array.isArray(bookIds)) return res.status(400).json({ error: 'bookIds must be an array' });
      const deleted = await BookService.bulkDeleteBooks(bookIds);
      
      // Emit real-time update events for deleted books
      if (global.__ADMIN_IO__) {
        try {
          deleted.forEach(book => {
            global.__ADMIN_IO__.to('library-stream').emit('library:update', book);
          });
        } catch (emitError) {
          console.error('Failed to emit book batch delete events:', emitError);
        }
      }
      
      return res.json({ deletedBooks: deleted, count: deleted.length });
    } catch (e) {
      return res.status(500).json({ error: e.message || String(e) });
    }
  }

  // Get a specific book
  static async getBookById(req, res) {
    try {
      const { id } = req.params;
      const book = await BookService.getBookById(id);
      
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      // Track view (non-blocking)
      try {
        const userId = req.user ? req.user.id : null;
        BookAnalyticsService.trackBookEvent(book.id, 'view', userId, { ip_address: req.ip, user_agent: req.get('user-agent') });
      } catch (e) { /* ignore tracking errors */ }

      res.json({ book });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Serve uploaded files
  static async serveBookFile(req, res) {
    try {
      const { filename } = req.params;
      // Fix the file path construction - go up one more directory level
      const filePath = path.join(__dirname, '../uploads', filename);
      
      // Check if file exists
      try {
        await fs.access(filePath);
        // attempt to map filename to book and track download (best-effort)
        try {
          const book = await BookService.getBookByFilename(filename);
          if (book && book.id) {
            const userId = req.user ? req.user.id : null;
            BookAnalyticsService.trackBookEvent(book.id, 'download', userId, { ip_address: req.ip, user_agent: req.get('user-agent') });
          }
        } catch (e) { /* ignore */ }
        // Set CORS headers for file access
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.sendFile(filePath);
      } catch (err) {
        res.status(404).json({ error: 'File not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Admin: combined analytics endpoint
  static async getLibraryAnalytics(req, res) {
    try {
      const days = req.query.days ? Number(req.query.days) : 30;
      const overview = await BookAnalyticsService.getLibraryOverview();
      const uploadTrends = await BookAnalyticsService.getUploadTrends(days);
      const popularBooks = await BookAnalyticsService.getPopularBooks(10, days);
      const topDownloads = await BookAnalyticsService.getTopDownloads(10, days);
      const engagement = await BookAnalyticsService.getEngagementMetrics(days);
      const storageBreakdown = await BookAnalyticsService.getStorageBreakdown();
      res.json({ overview, uploadTrends, popularBooks, topDownloads, engagement, storageBreakdown });
    } catch (e) {
      res.status(500).json({ error: e.message || String(e) });
    }
  }

  static async exportLibraryAnalytics(req, res) {
    try {
      const { startDate, endDate } = req.query || {};
      const reportData = await BookAnalyticsService.generateAnalyticsReport({ startDate, endDate });
      const header = 'Book Title,Author,Event Type,Date,User ID\n';
      // Ensure each field is quoted and inner quotes are escaped by doubling
      const escape = (v) => {
        if (v === null || typeof v === 'undefined') return '';
        return String(v).replace(/"/g, '""');
      };
      const rows = reportData.map(r => {
        const title = `"${escape(r.book_title||'')}"`;
        const author = `"${escape(r.book_author||'')}"`;
        const eventType = `"${escape(r.event_type||'')}"`;
        const eventDate = `"${escape(r.event_date||'')}"`;
        const userId = `"${escape(r.user_id || 'Anonymous')}"`;
        return [title, author, eventType, eventDate, userId].join(',');
      }).join('\n');
      const csv = header + rows;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="library-analytics-${Date.now()}.csv"`);
      res.send(csv);
    } catch (e) {
      res.status(500).json({ error: e.message || String(e) });
    }
  }

  static async getBookAnalyticsById(req, res) {
    try {
      const { id } = req.params;
      const analytics = await BookAnalyticsService.getBookAnalytics(id);
      res.json({ analytics });
    } catch (e) {
      res.status(500).json({ error: e.message || String(e) });
    }
  }
}

// Export upload middleware for use in routes
BookController.upload = upload;

module.exports = BookController;







