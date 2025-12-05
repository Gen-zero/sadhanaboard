/**
 * Schema: BookBookmark
 * 
 * Purpose: Bookmarks within books for quick navigation and reference
 * 
 * Key Fields:
 *   - bookId: Reference to SpiritualBook
 *   - userId: User who created the bookmark
 *   - page: Page number of bookmark
 *   - label: Bookmark label/name
 * 
 * Relationships:
 *   - Many-to-one with SpiritualBook
 *   - Many-to-one with User
 */

const mongoose = require('mongoose');

const bookBookmarkSchema = new mongoose.Schema(
  {
    // References
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SpiritualBook',
      required: [true, 'Book ID is required'],
      index: true,
      description: 'Reference to SpiritualBook'
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
      description: 'User who created bookmark'
    },

    // Bookmark content
    page: {
      type: Number,
      required: [true, 'Page number is required'],
      min: 1,
      index: true,
      description: 'Page number of bookmark'
    },

    label: {
      type: String,
      trim: true,
      maxlength: [200, 'Label cannot exceed 200 characters'],
      default: null,
      description: 'Bookmark label or name'
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: null,
      description: 'Optional notes about bookmark'
    },

    // Visual categorization
    color: {
      type: String,
      enum: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray'],
      default: 'blue',
      description: 'Color for visual categorization'
    },

    // Bookmark type
    type: {
      type: String,
      enum: ['standard', 'important', 'review', 'reference'],
      default: 'standard',
      index: true,
      description: 'Type of bookmark'
    },

    // Default bookmark (return point)
    isDefault: {
      type: Boolean,
      default: false,
      description: 'Whether this is the default/return bookmark'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When bookmark was created'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When bookmark was last updated'
    }
  },
  {
    timestamps: false,
    collection: 'bookbookmarks'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

// User's bookmarks in book
bookBookmarkSchema.index({ userId: 1, bookId: 1 });

// All bookmarks in book
bookBookmarkSchema.index({ bookId: 1 });

// User's all bookmarks
bookBookmarkSchema.index({ userId: 1 });

// Find by page
bookBookmarkSchema.index({ bookId: 1, page: 1 });

// Compound indexes
bookBookmarkSchema.index({ userId: 1, bookId: 1, page: 1 });
bookBookmarkSchema.index({ bookId: 1, type: 1 }); // Filter by type
bookBookmarkSchema.index({ userId: 1, isDefault: 1 }); // Find default

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

bookBookmarkSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }

  // Only one default bookmark per user per book
  if (this.isDefault) {
    // This will be handled in the service layer for atomic updates
  }

  next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Update bookmark label
 * @param {String} newLabel
 * @returns {Promise} Updated bookmark
 */
bookBookmarkSchema.methods.updateLabel = async function(newLabel) {
  this.label = newLabel;
  await this.save();
  return this;
};

/**
 * Update bookmark page
 * @param {Number} newPage
 * @returns {Promise} Updated bookmark
 */
bookBookmarkSchema.methods.updatePage = async function(newPage) {
  if (newPage < 1) {
    throw new Error('Page number must be at least 1');
  }
  this.page = newPage;
  await this.save();
  return this;
};

/**
 * Update notes
 * @param {String} newNotes
 * @returns {Promise} Updated bookmark
 */
bookBookmarkSchema.methods.updateNotes = async function(newNotes) {
  this.notes = newNotes;
  await this.save();
  return this;
};

/**
 * Change bookmark color
 * @param {String} newColor
 * @returns {Promise} Updated bookmark
 */
bookBookmarkSchema.methods.changeColor = async function(newColor) {
  const validColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray'];
  if (!validColors.includes(newColor)) {
    throw new Error('Invalid color');
  }
  this.color = newColor;
  await this.save();
  return this;
};

/**
 * Change bookmark type
 * @param {String} newType
 * @returns {Promise} Updated bookmark
 */
bookBookmarkSchema.methods.changeType = async function(newType) {
  const validTypes = ['standard', 'important', 'review', 'reference'];
  if (!validTypes.includes(newType)) {
    throw new Error('Invalid type');
  }
  this.type = newType;
  await this.save();
  return this;
};

/**
 * Set as default bookmark
 * @returns {Promise} Updated bookmark
 */
bookBookmarkSchema.methods.setAsDefault = async function() {
  this.isDefault = true;
  await this.save();
  return this;
};

/**
 * Unset as default
 * @returns {Promise} Updated bookmark
 */
bookBookmarkSchema.methods.unsetAsDefault = async function() {
  this.isDefault = false;
  await this.save();
  return this;
};

/**
 * Get bookmark summary
 * @returns {Object}
 */
bookBookmarkSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    page: this.page,
    label: this.label,
    type: this.type,
    color: this.color,
    isDefault: this.isDefault,
    createdAt: this.createdAt
  };
};

/**
 * Convert to JSON
 * @returns {Object}
 */
bookBookmarkSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find all bookmarks for book
 * @param {String} bookId
 * @returns {Promise<Array>}
 */
bookBookmarkSchema.statics.findByBook = function(bookId) {
  return this.find({ bookId })
    .populate('userId', 'displayName')
    .sort({ page: 1 });
};

/**
 * Find user's bookmarks in book
 * @param {String} userId
 * @param {String} bookId
 * @returns {Promise<Array>}
 */
bookBookmarkSchema.statics.findByUserAndBook = function(userId, bookId) {
  return this.find({ userId, bookId }).sort({ page: 1 });
};

/**
 * Find all user's bookmarks
 * @param {String} userId
 * @returns {Promise<Array>}
 */
bookBookmarkSchema.statics.findByUser = function(userId) {
  return this.find({ userId })
    .populate('bookId', 'title author')
    .sort({ createdAt: -1 });
};

/**
 * Find bookmark at specific page
 * @param {String} bookId
 * @param {Number} page
 * @returns {Promise<Array>}
 */
bookBookmarkSchema.statics.findByPage = function(bookId, page) {
  return this.find({ bookId, page }).populate('userId', 'displayName');
};

/**
 * Find bookmarks in page range
 * @param {String} bookId
 * @param {Number} startPage
 * @param {Number} endPage
 * @returns {Promise<Array>}
 */
bookBookmarkSchema.statics.findByPageRange = function(bookId, startPage, endPage) {
  return this.find({ bookId, page: { $gte: startPage, $lte: endPage } })
    .sort({ page: 1 });
};

/**
 * Find user's default bookmark for book
 * @param {String} userId
 * @param {String} bookId
 * @returns {Promise<Object>}
 */
bookBookmarkSchema.statics.findDefault = function(userId, bookId) {
  return this.findOne({ userId, bookId, isDefault: true });
};

/**
 * Find bookmarks by type
 * @param {String} bookId
 * @param {String} type
 * @returns {Promise<Array>}
 */
bookBookmarkSchema.statics.findByType = function(bookId, type) {
  return this.find({ bookId, type }).sort({ page: 1 });
};

/**
 * Count bookmarks for book
 * @param {String} bookId
 * @returns {Promise<Number>}
 */
bookBookmarkSchema.statics.countByBook = function(bookId) {
  return this.countDocuments({ bookId });
};

/**
 * Count user's bookmarks in book
 * @param {String} userId
 * @param {String} bookId
 * @returns {Promise<Number>}
 */
bookBookmarkSchema.statics.countByUserAndBook = function(userId, bookId) {
  return this.countDocuments({ userId, bookId });
};

/**
 * Get bookmark statistics for book
 * @param {String} bookId
 * @returns {Promise<Object>}
 */
bookBookmarkSchema.statics.getBookmarkStats = async function(bookId) {
  const result = await this.aggregate([
    { $match: { bookId: mongoose.Types.ObjectId(bookId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        byType: {
          $push: {
            type: '$type',
            count: 1
          }
        }
      }
    }
  ]);

  if (result.length === 0) {
    return { total: 0, byType: {} };
  }

  const stats = result[0];
  const byType = {};
  stats.byType.forEach(item => {
    byType[item.type] = (byType[item.type] || 0) + item.count;
  });

  return {
    total: stats.total,
    byType
  };
};

/**
 * Find most bookmarked books
 * @param {Number} limit
 * @returns {Promise<Array>}
 */
bookBookmarkSchema.statics.findMostBookmarked = async function(limit = 10) {
  const result = await this.aggregate([
    {
      $group: {
        _id: '$bookId',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    { $lookup: { from: 'spiritualbooks', localField: '_id', foreignField: '_id', as: 'book' } }
  ]);

  return result;
};

/**
 * Find nearby bookmarks
 * @param {String} bookId
 * @param {Number} page
 * @param {Number} range
 * @returns {Promise<Array>}
 */
bookBookmarkSchema.statics.findNearby = function(bookId, page, range = 10) {
  return this.find({
    bookId,
    page: { $gte: page - range, $lte: page + range }
  }).sort({ page: 1 });
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('BookBookmark', bookBookmarkSchema);
