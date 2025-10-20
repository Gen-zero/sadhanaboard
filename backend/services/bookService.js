const db = require('../config/db');

class BookService {
  // Cache whether the search_vector column exists to avoid repeated information_schema queries
  static _hasSearchVector = null;

  static async _checkSearchVectorExists() {
    if (this._hasSearchVector !== null) return this._hasSearchVector;
    try {
      const result = await db.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'spiritual_books' AND column_name = 'search_vector' LIMIT 1`
      );
      this._hasSearchVector = result.rows.length > 0;
    } catch (e) {
      // Be conservative and assume false on any error
      this._hasSearchVector = false;
    }
    return this._hasSearchVector;
  }

  // Get all spiritual books with flexible filtering (public-facing)
  // filters: { search, traditions, language, minYear, maxYear, fileType, sortBy, sortOrder, limit, offset }
  static async getBooks(filters = {}) {
    try {
      const {
        search,
        traditions = [],
        language,
        minYear,
        maxYear,
        fileType = 'all',
        sortBy = 'created_at',
        sortOrder = 'desc',
        limit = 20,
        offset = 0
      } = filters || {};

      const params = [];
      const where = [];

      // Exclude deleted by default
      where.push('deleted_at IS NULL');

      // Traditions (array) -> require any match
      if (Array.isArray(traditions) && traditions.length > 0) {
        const conds = traditions.map((_, i) => `$${params.length + i + 1} = ANY(traditions)`).join(' OR ');
        params.push(...traditions);
        where.push(`(${conds})`);
      }

      if (language) {
        params.push(language);
        where.push(`language = $${params.length}`);
      }

      if (minYear !== undefined && minYear !== null) {
        params.push(Number(minYear));
        where.push(`year >= $${params.length}`);
      }

      if (maxYear !== undefined && maxYear !== null) {
        params.push(Number(maxYear));
        where.push(`year <= $${params.length}`);
      }

      if (fileType === 'pdf') {
        // stored files
        where.push(`is_storage_file = true`);
      } else if (fileType === 'text') {
        where.push(`(is_storage_file = false OR is_storage_file IS NULL)`);
      }

  const hasSearchVector = await this._checkSearchVectorExists();

  let searchWhere = '';

  // Validate sortBy and sortOrder against safe lists to prevent SQL injection
  const allowedSortBy = ['created_at','title','author','year','language'];
  const allowedSortOrder = ['asc','desc'];
  const safeSortBy = allowedSortBy.includes(String(sortBy)) ? String(sortBy) : 'created_at';
  const safeSortOrder = allowedSortOrder.includes(String(sortOrder).toLowerCase()) ? String(sortOrder).toLowerCase() : 'desc';
  // start with a default order clause built from validated values
  let orderClause = `ORDER BY ${safeSortBy} ${safeSortOrder.toUpperCase()}`;

      if (search && String(search).trim().length > 0) {
        const q = String(search).trim();
        if (hasSearchVector && q.length >= 3) {
          // Use full-text search ranking
          params.push(q);
          const idx = params.length; // index for plainto_tsquery param
          // we will also push an ILIKE pattern param right after, which will be idx+1
          params.push(`%${q}%`);
          const ilikeIdx = idx + 1;
          searchWhere = `(search_vector @@ plainto_tsquery('english', $${idx}) OR title ILIKE $${ilikeIdx} OR author ILIKE $${ilikeIdx} OR description ILIKE $${ilikeIdx})`;
          // Use validated safeSortBy/safeSortOrder in the compound ORDER BY to avoid injection
          orderClause = `ORDER BY ts_rank(search_vector, plainto_tsquery('english', $${idx})) DESC, ${safeSortBy} ${safeSortOrder.toUpperCase()}`;
        } else {
          params.push(`%${q}%`);
          const idx = params.length;
          searchWhere = `(title ILIKE $${idx} OR author ILIKE $${idx} OR description ILIKE $${idx} OR content ILIKE $${idx})`;
        }
        // We'll append searchWhere into where clauses after param handling
        where.push(searchWhere);
      }

      // Pagination params
      params.push(Number(limit));
      params.push(Number(offset));

      const whereSQL = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

      // Build main query
      // If using ts_rank ordering we already set orderClause appropriately
      const query = `SELECT * FROM spiritual_books ${whereSQL} ${orderClause} LIMIT $${params.length - 1} OFFSET $${params.length}`;

      const result = await db.query(query, params);

      // Build count query - reuse whereSQL but do not include LIMIT/OFFSET params
      // Count query must use the same leading params as the WHERE uses. Since we appended limit/offset last, slice them off.
      const countParams = params.slice(0, Math.max(0, params.length - 2));
      const countQuery = `SELECT COUNT(*) as total FROM spiritual_books ${whereSQL}`;
      const countResult = await db.query(countQuery, countParams);

      return {
        books: result.rows,
        total: Number(countResult.rows[0] ? countResult.rows[0].total : 0),
        limit: Number(limit),
        offset: Number(offset)
      };
    } catch (error) {
      throw new Error(`Failed to fetch books: ${error.message}`);
    }
  }

  // Get unique traditions from all books
  static async getBookTraditions() {
    try {
      const result = await db.query(
        `SELECT DISTINCT unnest(traditions) as tradition 
         FROM spiritual_books 
         WHERE traditions IS NOT NULL AND deleted_at IS NULL
         ORDER BY tradition`
      );
      
      return result.rows.map(row => row.tradition);
    } catch (error) {
      throw new Error(`Failed to fetch traditions: ${error.message}`);
    }
  }

  // Create a new spiritual book
  static async createBook(bookData, userId) {
    try {
      const {
        title,
        author,
        traditions,
        content,
        storage_url,
        is_storage_file,
        description,
        year,
        language,
        page_count,
        cover_url
      } = bookData;

      const result = await db.query(
        `INSERT INTO spiritual_books 
         (user_id, title, author, traditions, content, storage_url, is_storage_file, description, year, language, page_count, cover_url, file_size)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING *`,
        [
          userId,
          title,
          author,
          traditions || [],
          content,
          storage_url,
          is_storage_file || false,
          description,
          year,
          language || 'english',
          page_count,
          cover_url,
          bookData.file_size || null
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create book: ${error.message}`);
    }
  }

  // Get a specific book by ID
  static async getBookById(bookId, includeDeleted = false) {
    try {
      const query = includeDeleted
        ? `SELECT * FROM spiritual_books WHERE id = $1`
        : `SELECT * FROM spiritual_books WHERE id = $1 AND deleted_at IS NULL`;

      const result = await db.query(query, [bookId]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get book: ${error.message}`);
    }
  }

  // Admin: get all books with filters and optional inclusion of deleted
  static async getAllBooksAdmin(searchTerm = '', filters = {}) {
    try {
      const { traditions = [], language, year, showDeleted = false, limit = 100, offset = 0 } = filters;
      let params = [];
      let whereClauses = [];

      if (!showDeleted) {
        whereClauses.push('deleted_at IS NULL');
      }

      if (searchTerm) {
        params.push(`%${searchTerm}%`);
        whereClauses.push(`(title ILIKE $${params.length} OR author ILIKE $${params.length} OR description ILIKE $${params.length})`);
      }

      if (traditions && traditions.length > 0) {
        const tradConds = traditions.map((_, i) => `$${params.length + i + 1} = ANY(traditions)`).join(' OR ');
        params = [...params, ...traditions];
        whereClauses.push(`(${tradConds})`);
      }

      if (language) {
        params.push(language);
        whereClauses.push(`language = $${params.length}`);
      }

      if (year) {
        params.push(year);
        whereClauses.push(`year = $${params.length}`);
      }

      // Pagination
      params.push(limit);
      params.push(offset);

      const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

      const query = `SELECT * FROM spiritual_books ${whereSQL} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

      const result = await db.query(query, params);

      const countQuery = `SELECT COUNT(*) as total FROM spiritual_books ${whereSQL}`;
      const countResult = await db.query(countQuery, params.slice(0, params.length - 2));

      return { books: result.rows, total: Number(countResult.rows[0].total) };
    } catch (error) {
      throw new Error(`Failed to fetch admin books: ${error.message}`);
    }
  }

  // Admin: update a book (partial updates supported)
  static async updateBook(bookId, bookData, userId) {
    try {
      // Fetch existing book to merge values
      const existing = await this.getBookById(bookId, true);
      if (!existing) throw new Error('Book not found');

      const merged = {
        title: bookData.title !== undefined ? bookData.title : existing.title,
        author: bookData.author !== undefined ? bookData.author : existing.author,
        traditions: bookData.traditions !== undefined ? bookData.traditions : existing.traditions,
        content: bookData.content !== undefined ? bookData.content : existing.content,
        storage_url: bookData.storage_url !== undefined ? bookData.storage_url : existing.storage_url,
        is_storage_file: bookData.is_storage_file !== undefined ? bookData.is_storage_file : existing.is_storage_file,
        description: bookData.description !== undefined ? bookData.description : existing.description,
        year: bookData.year !== undefined ? bookData.year : existing.year,
        language: bookData.language !== undefined ? bookData.language : existing.language,
        page_count: bookData.page_count !== undefined ? bookData.page_count : existing.page_count,
        cover_url: bookData.cover_url !== undefined ? bookData.cover_url : existing.cover_url
        ,
        file_size: bookData.file_size !== undefined ? bookData.file_size : existing.file_size
      };

      const result = await db.query(
        `UPDATE spiritual_books SET
          title = $1,
          author = $2,
          traditions = $3,
          content = $4,
          storage_url = $5,
          is_storage_file = $6,
          description = $7,
          year = $8,
          language = $9,
          page_count = $10,
          cover_url = $11,
          file_size = $12,
          updated_at = now()
         WHERE id = $13 RETURNING *`,
        [
          merged.title,
          merged.author,
          merged.traditions || [],
          merged.content,
          merged.storage_url,
          merged.is_storage_file || false,
          merged.description,
          merged.year,
          merged.language || 'english',
          merged.page_count,
          merged.cover_url,
          merged.file_size || null,
          bookId
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update book: ${error.message}`);
    }
  }

  // Find a book by storage filename or storage_url
  static async getBookByFilename(filename) {
    try {
      const storageUrl = `/uploads/${filename}`;
      const result = await db.query(`SELECT id, title, author FROM spiritual_books WHERE storage_url = $1 AND deleted_at IS NULL LIMIT 1`, [storageUrl]);
      if (!result.rows || result.rows.length === 0) return null;
      return result.rows[0];
    } catch (e) {
      console.error('getBookByFilename error', e.message || e);
      return null;
    }
  }

  // Admin: soft delete a book
  static async deleteBook(bookId) {
    try {
      const existing = await this.getBookById(bookId, true);
      if (!existing) throw new Error('Book not found');

      const result = await db.query(
        `UPDATE spiritual_books SET deleted_at = now() WHERE id = $1 RETURNING *`,
        [bookId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to delete book: ${error.message}`);
    }
  }

  // Bulk create books - attempts inserts and returns per-item results; uses transaction wrapper
  static async bulkCreateBooks(booksData = [], userId) {
    const client = await db.connect();
    const results = [];
    try {
      await client.query('BEGIN');
      for (const data of booksData) {
        try {
          const res = await client.query(
            `INSERT INTO spiritual_books (user_id, title, author, traditions, content, storage_url, is_storage_file, description, year, language, page_count, cover_url)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [
              userId,
              data.title,
              data.author,
              data.traditions || [],
              data.content,
              data.storage_url,
              data.is_storage_file || false,
              data.description,
              data.year,
              data.language || 'english',
              data.page_count,
              data.cover_url
            ]
          );
          results.push({ success: true, book: res.rows[0] });
        } catch (e) {
          results.push({ success: false, error: e.message || String(e) });
        }
      }
      await client.query('COMMIT');
      return results;
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      throw e;
    } finally {
      client.release();
    }
  }

  // Bulk update books sequentially
  static async bulkUpdateBooks(updates = [], userId) {
    const results = [];
    for (const u of updates) {
      try {
        const updated = await this.updateBook(u.id, u.bookData, userId);
        results.push({ success: true, book: updated });
      } catch (e) {
        results.push({ success: false, error: e.message || String(e) });
      }
    }
    return results;
  }

  // Bulk soft-delete books using single query
  static async bulkDeleteBooks(bookIds = []) {
    try {
      if (!Array.isArray(bookIds) || bookIds.length === 0) return [];
      const result = await db.query(`UPDATE spiritual_books SET deleted_at = now() WHERE id = ANY($1) RETURNING id, title`, [bookIds]);
      return result.rows;
    } catch (e) {
      throw new Error(`Failed to bulk delete books: ${e.message}`);
    }
  }

  // Basic validation for book data used in bulk operations
  static validateBookData(bookData) {
    const errors = [];
    if (!bookData) return ['Missing book data'];
    if (!bookData.title) errors.push('Missing title');
    if (!bookData.author) errors.push('Missing author');
    if (bookData.year && isNaN(Number(bookData.year))) errors.push('Invalid year');
    return errors.length ? errors : null;
  }

  // Suggest books by title/author for autocomplete/suggestions
  static async getBookSuggestions(query = '', limit = 10) {
    try {
      if (!query || String(query).trim().length < 2) return [];
      const q = `%${String(query).trim()}%`;
      const result = await db.query(
        `SELECT id, title, author FROM spiritual_books WHERE deleted_at IS NULL AND (title ILIKE $1 OR author ILIKE $1) ORDER BY created_at DESC LIMIT $2`,
        [q, Number(limit)]
      );
      return result.rows;
    } catch (e) {
      throw new Error(`Failed to fetch suggestions: ${e.message}`);
    }
  }

  // Return list of languages used in the books table
  static async getLanguages() {
    try {
      const result = await db.query(
        `SELECT DISTINCT language FROM spiritual_books WHERE language IS NOT NULL AND deleted_at IS NULL ORDER BY language`
      );
      return result.rows.map(r => r.language);
    } catch (e) {
      throw new Error(`Failed to fetch languages: ${e.message}`);
    }
  }

  // Return min/max year available in the books table
  static async getYearRange() {
    try {
      const result = await db.query(
        `SELECT MIN(year) as min_year, MAX(year) as max_year FROM spiritual_books WHERE year IS NOT NULL AND deleted_at IS NULL`
      );
      if (!result.rows || !result.rows[0]) return { min: null, max: null };
      return { min: result.rows[0].min_year, max: result.rows[0].max_year };
    } catch (e) {
      throw new Error(`Failed to fetch year range: ${e.message}`);
    }
  }
}

module.exports = BookService;