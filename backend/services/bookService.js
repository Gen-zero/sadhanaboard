const SpiritualBook = require('../schemas/SpiritualBook');

class BookService {

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
        sortBy = 'createdAt',
        sortOrder = 'desc',
        limit = 20,
        offset = 0
      } = filters || {};

      const query = {};
      const allowedSortBy = ['createdAt','title','author','year','language'];
      const allowedSortOrder = ['asc','desc'];
      const safeSortBy = allowedSortBy.includes(String(sortBy)) ? String(sortBy) : 'createdAt';
      const safeSortOrder = allowedSortOrder.includes(String(sortOrder).toLowerCase()) ? String(sortOrder).toLowerCase() : 'desc';

      // Build query filters
      query.deletedAt = null;

      if (Array.isArray(traditions) && traditions.length > 0) {
        query.traditions = { $in: traditions };
      }

      if (language) {
        query.language = language;
      }

      if (minYear !== undefined && minYear !== null) {
        if (!query.year) query.year = {};
        query.year.$gte = Number(minYear);
      }

      if (maxYear !== undefined && maxYear !== null) {
        if (!query.year) query.year = {};
        query.year.$lte = Number(maxYear);
      }

      if (fileType === 'pdf') {
        query.isStorageFile = true;
      } else if (fileType === 'text') {
        query.isStorageFile = { $in: [false, null] };
      }

      // Handle text search
      if (search && String(search).trim().length > 0) {
        const q = String(search).trim();
        query.$or = [
          { title: { $regex: q, $options: 'i' } },
          { author: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } }
        ];
      }

      const sortObj = {};
      sortObj[safeSortBy] = safeSortOrder === 'asc' ? 1 : -1;

      const books = await SpiritualBook.find(query)
        .sort(sortObj)
        .skip(Number(offset))
        .limit(Number(limit))
        .lean();

      const total = await SpiritualBook.countDocuments(query);

      return {
        books,
        total,
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
      const result = await SpiritualBook.aggregate([
        { $match: { traditions: { $exists: true, $ne: [] }, deletedAt: null } },
        { $unwind: '$traditions' },
        { $group: { _id: '$traditions' } },
        { $sort: { _id: 1 } }
      ]);
      
      return result.map(doc => doc._id);
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
        storageUrl,
        isStorageFile,
        description,
        year,
        language,
        pageCount,
        coverUrl,
        fileSize
      } = bookData;

      const book = new SpiritualBook({
        userId,
        title,
        author,
        traditions: traditions || [],
        content,
        storageUrl,
        isStorageFile: isStorageFile || false,
        description,
        year,
        language: language || 'english',
        pageCount,
        coverUrl,
        fileSize: fileSize || null
      });

      await book.save();
      return book.toJSON();
    } catch (error) {
      throw new Error(`Failed to create book: ${error.message}`);
    }
  }

  // Get a specific book by ID
  static async getBookById(bookId, includeDeleted = false) {
    try {
      const query = includeDeleted
        ? { _id: bookId }
        : { _id: bookId, deletedAt: null };

      const book = await SpiritualBook.findOne(query)
        .select('_id title author traditions language year description coverUrl createdAt updatedAt')
        .lean();
      return book;
    } catch (error) {
      throw new Error(`Failed to get book: ${error.message}`);
    }
  }

  // Admin: get all books with filters and optional inclusion of deleted
  static async getAllBooksAdmin(searchTerm = '', filters = {}) {
    try {
      const { traditions = [], language, year, showDeleted = false, limit = 100, offset = 0 } = filters;
      const query = {};

      if (!showDeleted) {
        query.deletedAt = null;
      }

      if (searchTerm) {
        query.$or = [
          { title: { $regex: searchTerm, $options: 'i' } },
          { author: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ];
      }

      if (traditions && traditions.length > 0) {
        query.traditions = { $in: traditions };
      }

      if (language) {
        query.language = language;
      }

      if (year) {
        query.year = year;
      }

      const books = await SpiritualBook.find(query)
        .sort({ createdAt: -1 })
        .skip(Number(offset))
        .limit(Number(limit))
        .lean();

      const total = await SpiritualBook.countDocuments(query);

      return { books, total };
    } catch (error) {
      throw new Error(`Failed to fetch admin books: ${error.message}`);
    }
  }

  // Admin: update a book (partial updates supported)
  static async updateBook(bookId, bookData, userId) {
    try {
      const updateData = {};
      if (bookData.title !== undefined) updateData.title = bookData.title;
      if (bookData.author !== undefined) updateData.author = bookData.author;
      if (bookData.traditions !== undefined) updateData.traditions = bookData.traditions;
      if (bookData.content !== undefined) updateData.content = bookData.content;
      if (bookData.storageUrl !== undefined) updateData.storageUrl = bookData.storageUrl;
      if (bookData.isStorageFile !== undefined) updateData.isStorageFile = bookData.isStorageFile;
      if (bookData.description !== undefined) updateData.description = bookData.description;
      if (bookData.year !== undefined) updateData.year = bookData.year;
      if (bookData.language !== undefined) updateData.language = bookData.language;
      if (bookData.pageCount !== undefined) updateData.pageCount = bookData.pageCount;
      if (bookData.coverUrl !== undefined) updateData.coverUrl = bookData.coverUrl;
      if (bookData.fileSize !== undefined) updateData.fileSize = bookData.fileSize;

      const book = await SpiritualBook.findByIdAndUpdate(bookId, updateData, {
        new: true,
        runValidators: true
      });

      if (!book) throw new Error('Book not found');
      return book.toJSON();
    } catch (error) {
      throw new Error(`Failed to update book: ${error.message}`);
    }
  }

  // Find a book by storage filename or storageUrl
  static async getBookByFilename(filename) {
    try {
      const storageUrl = `/uploads/${filename}`;
      const book = await SpiritualBook.findOne({ storageUrl, deletedAt: null }).lean();
      return book || null;
    } catch (e) {
      console.error('getBookByFilename error', e.message || e);
      return null;
    }
  }

  // Admin: soft delete a book
  static async deleteBook(bookId) {
    try {
      const book = await SpiritualBook.findByIdAndUpdate(
        bookId,
        { deletedAt: new Date() },
        { new: true }
      );

      if (!book) throw new Error('Book not found');
      return book.toJSON();
    } catch (error) {
      throw new Error(`Failed to delete book: ${error.message}`);
    }
  }

  // Bulk create books
  static async bulkCreateBooks(booksData = [], userId) {
    const results = [];
    try {
      for (const data of booksData) {
        try {
          const book = new SpiritualBook({
            userId,
            title: data.title,
            author: data.author,
            traditions: data.traditions || [],
            content: data.content,
            storageUrl: data.storageUrl,
            isStorageFile: data.isStorageFile || false,
            description: data.description,
            year: data.year,
            language: data.language || 'english',
            pageCount: data.pageCount,
            coverUrl: data.coverUrl
          });
          await book.save();
          results.push({ success: true, book: book.toJSON() });
        } catch (e) {
          results.push({ success: false, error: e.message || String(e) });
        }
      }
      return results;
    } catch (e) {
      throw e;
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

  // Bulk soft-delete books
  static async bulkDeleteBooks(bookIds = []) {
    try {
      if (!Array.isArray(bookIds) || bookIds.length === 0) return [];
      const result = await SpiritualBook.updateMany(
        { _id: { $in: bookIds } },
        { deletedAt: new Date() }
      );
      return { modifiedCount: result.modifiedCount };
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
      const q = String(query).trim();
      const books = await SpiritualBook.find({
        deletedAt: null,
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { author: { $regex: q, $options: 'i' } }
        ]
      })
        .select('_id title author')
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .lean();
      return books;
    } catch (e) {
      throw new Error(`Failed to fetch suggestions: ${e.message}`);
    }
  }

  // Return list of languages used in the books table
  static async getLanguages() {
    try {
      const result = await SpiritualBook.aggregate([
        { $match: { language: { $exists: true, $ne: null }, deletedAt: null } },
        { $group: { _id: '$language' } },
        { $sort: { _id: 1 } }
      ]);
      return result.map(r => r._id);
    } catch (e) {
      throw new Error(`Failed to fetch languages: ${e.message}`);
    }
  }

  // Return min/max year available in the books table
  static async getYearRange() {
    try {
      const result = await SpiritualBook.aggregate([
        { $match: { year: { $exists: true, $ne: null }, deletedAt: null } },
        { $group: { _id: null, minYear: { $min: '$year' }, maxYear: { $max: '$year' } } }
      ]);
      if (!result || result.length === 0) return { min: null, max: null };
      return { min: result[0].minYear, max: result[0].maxYear };
    } catch (e) {
      throw new Error(`Failed to fetch year range: ${e.message}`);
    }
  }
}

module.exports = BookService;