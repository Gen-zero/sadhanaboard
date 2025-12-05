/**
 * Schema: BookAnnotation
 * 
 * Purpose: Notes and annotations within books with highlighting and linking support
 * 
 * Key Fields:
 *   - bookId: Reference to SpiritualBook
 *   - userId: User who created annotation
 *   - page: Page number
 *   - content: The annotation text
 *   - type: Type (note, highlight, quote, reference)
 * 
 * Relationships:
 *   - Many-to-one with SpiritualBook
 *   - Many-to-one with User
 *   - Optional link to Sadhana
 * 
 * Indexes:
 *   - userId + bookId: For user's annotations in book
 *   - bookId + page: For finding annotations at page
 *   - text search on content
 */

const mongoose = require('mongoose');

const bookAnnotationSchema = new mongoose.Schema(
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
      description: 'User who created annotation'
    },

    // Location in book
    page: {
      type: Number,
      required: [true, 'Page number is required'],
      min: 1,
      index: true,
      description: 'Page number of annotation'
    },

    // Annotation content
    content: {
      type: String,
      required: [true, 'Annotation content is required'],
      trim: true,
      maxlength: [2000, 'Annotation cannot exceed 2000 characters'],
      minlength: [1, 'Annotation must not be empty'],
      description: 'The annotation text'
    },

    // Type of annotation
    type: {
      type: String,
      enum: ['note', 'highlight', 'quote', 'reference'],
      default: 'note',
      index: true,
      description: 'Type of annotation'
    },

    // Highlighting info
    highlightColor: {
      type: String,
      enum: ['yellow', 'green', 'blue', 'pink', 'orange'],
      default: null,
      description: 'Color if highlighted'
    },

    highlightedText: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
      description: 'Original highlighted text'
    },

    highlightPosition: {
      type: {
        startOffset: Number,
        endOffset: Number
      },
      default: null,
      description: 'Position of highlighted text'
    },

    // Privacy and sharing
    isPrivate: {
      type: Boolean,
      default: true,
      index: true,
      description: 'Whether annotation is private'
    },

    shareableLink: {
      type: String,
      trim: true,
      default: null,
      description: 'Unique shareable link if shared'
    },

    sharedAt: {
      type: Date,
      default: null,
      description: 'When shared publicly'
    },

    // Links to other content
    linkedSadhanaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sadhana',
      default: null,
      index: true,
      description: 'Optional link to related Sadhana'
    },

    linkedBookIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'SpiritualBook',
      default: [],
      description: 'Links to other related books'
    },

    // Engagement metrics (cached)
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of likes'
    },

    commentCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of comments'
    },

    viewCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of views (if public)'
    },

    // Metadata
    tags: {
      type: [String],
      default: [],
      description: 'Tags for organization'
    },

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
      description: 'Whether annotation is soft-deleted'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When annotation was created'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When annotation was last edited'
    },

    deletedAt: {
      type: Date,
      default: null,
      description: 'When deleted (soft delete)'
    }
  },
  {
    timestamps: false,
    collection: 'bookannotations'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

// User's annotations in book
bookAnnotationSchema.index({ userId: 1, bookId: 1 });

// Find by book and page
bookAnnotationSchema.index({ bookId: 1, page: 1 });

// User's all annotations
bookAnnotationSchema.index({ userId: 1, createdAt: -1 });

// Public annotations
bookAnnotationSchema.index({ isPrivate: 1, isDeleted: 1 });

// Linked to sadhana
bookAnnotationSchema.index({ linkedSadhanaId: 1 });

// Compound indexes
bookAnnotationSchema.index({ userId: 1, bookId: 1, page: 1 });
bookAnnotationSchema.index({ bookId: 1, isPrivate: 1, isDeleted: 1 }); // For feed
bookAnnotationSchema.index({ isPrivate: 1, createdAt: -1 }); // For public annotations

// Full-text search
bookAnnotationSchema.index({ content: 'text' });

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

bookAnnotationSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Edit annotation
 * @param {String} newContent
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.edit = async function(newContent) {
  this.content = newContent;
  this.updatedAt = new Date();
  await this.save();
  return this;
};

/**
 * Delete annotation (soft delete)
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.delete = async function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  await this.save();
  return this;
};

/**
 * Restore deleted annotation
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.restore = async function() {
  this.isDeleted = false;
  this.deletedAt = null;
  await this.save();
  return this;
};

/**
 * Toggle privacy
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.togglePrivacy = async function() {
  this.isPrivate = !this.isPrivate;
  if (!this.isPrivate) {
    this.sharedAt = new Date();
  }
  await this.save();
  return this;
};

/**
 * Make public
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.makePublic = async function() {
  this.isPrivate = false;
  this.sharedAt = new Date();
  await this.save();
  return this;
};

/**
 * Make private
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.makePrivate = async function() {
  this.isPrivate = true;
  this.sharedAt = null;
  await this.save();
  return this;
};

/**
 * Link to sadhana
 * @param {String} sadhanaId
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.linkToSadhana = async function(sadhanaId) {
  this.linkedSadhanaId = sadhanaId;
  await this.save();
  return this;
};

/**
 * Unlink from sadhana
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.unlinkFromSadhana = async function() {
  this.linkedSadhanaId = null;
  await this.save();
  return this;
};

/**
 * Link to related book
 * @param {String} bookId
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.linkToBook = async function(bookId) {
  if (!this.linkedBookIds.includes(bookId)) {
    this.linkedBookIds.push(bookId);
    await this.save();
  }
  return this;
};

/**
 * Unlink from book
 * @param {String} bookId
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.unlinkFromBook = async function(bookId) {
  this.linkedBookIds = this.linkedBookIds.filter(id => id.toString() !== bookId.toString());
  await this.save();
  return this;
};

/**
 * Add like
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.addLike = async function() {
  this.likeCount += 1;
  await this.save();
  return this;
};

/**
 * Remove like
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.removeLike = async function() {
  this.likeCount = Math.max(0, this.likeCount - 1);
  await this.save();
  return this;
};

/**
 * Add comment
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.addComment = async function() {
  this.commentCount += 1;
  await this.save();
  return this;
};

/**
 * Remove comment
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.removeComment = async function() {
  this.commentCount = Math.max(0, this.commentCount - 1);
  await this.save();
  return this;
};

/**
 * Record view
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.recordView = async function() {
  this.viewCount += 1;
  await this.save();
  return this;
};

/**
 * Add tag
 * @param {String} tag
 * @returns {Promise} Updated annotation
 */
bookAnnotationSchema.methods.addTag = async function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
    await this.save();
  }
  return this;
};

/**
 * Check if can be edited by user
 * @param {String} userId
 * @returns {Boolean}
 */
bookAnnotationSchema.methods.canEdit = function(userId) {
  return this.userId.toString() === userId.toString();
};

/**
 * Get annotation summary
 * @returns {Object}
 */
bookAnnotationSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    page: this.page,
    content: this.content,
    type: this.type,
    isPrivate: this.isPrivate,
    likes: this.likeCount,
    createdAt: this.createdAt
  };
};

/**
 * Convert to JSON (handle soft delete)
 * @returns {Object}
 */
bookAnnotationSchema.methods.toJSON = function() {
  if (this.isDeleted) {
    return {
      _id: this._id,
      isDeleted: true,
      createdAt: this.createdAt
    };
  }

  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find annotations in book
 * @param {String} bookId
 * @returns {Promise<Array>}
 */
bookAnnotationSchema.statics.findByBook = function(bookId) {
  return this.find({ bookId, isDeleted: false })
    .populate('userId', 'displayName avatar')
    .sort({ page: 1 });
};

/**
 * Find user's annotations in book
 * @param {String} userId
 * @param {String} bookId
 * @returns {Promise<Array>}
 */
bookAnnotationSchema.statics.findByUserAndBook = function(userId, bookId) {
  return this.find({ userId, bookId, isDeleted: false }).sort({ page: 1 });
};

/**
 * Find all user's annotations
 * @param {String} userId
 * @returns {Promise<Array>}
 */
bookAnnotationSchema.statics.findByUser = function(userId) {
  return this.find({ userId, isDeleted: false })
    .populate('bookId', 'title author')
    .sort({ createdAt: -1 });
};

/**
 * Find annotations at page
 * @param {String} bookId
 * @param {Number} page
 * @returns {Promise<Array>}
 */
bookAnnotationSchema.statics.findByPage = function(bookId, page) {
  return this.find({ bookId, page, isDeleted: false })
    .populate('userId', 'displayName avatar');
};

/**
 * Find public annotations
 * @returns {Promise<Array>}
 */
bookAnnotationSchema.statics.findPublic = function() {
  return this.find({ isPrivate: false, isDeleted: false })
    .populate('userId', 'displayName avatar')
    .sort({ createdAt: -1 })
    .limit(50);
};

/**
 * Find annotations linked to sadhana
 * @param {String} sadhanaId
 * @returns {Promise<Array>}
 */
bookAnnotationSchema.statics.findLinkedToSadhana = function(sadhanaId) {
  return this.find({ linkedSadhanaId: sadhanaId, isDeleted: false })
    .populate('bookId', 'title author')
    .populate('userId', 'displayName');
};

/**
 * Search annotations
 * @param {String} query
 * @returns {Promise<Array>}
 */
bookAnnotationSchema.statics.search = function(query) {
  return this.find(
    { $text: { $search: query }, isDeleted: false },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

/**
 * Find user's highlighted text
 * @param {String} userId
 * @param {String} bookId
 * @returns {Promise<Array>}
 */
bookAnnotationSchema.statics.findHighlights = function(userId, bookId) {
  return this.find({ userId, bookId, type: 'highlight', isDeleted: false })
    .sort({ page: 1 });
};

/**
 * Find user's quotes
 * @param {String} userId
 * @returns {Promise<Array>}
 */
bookAnnotationSchema.statics.findQuotes = function(userId) {
  return this.find({ userId, type: 'quote', isDeleted: false })
    .populate('bookId', 'title author')
    .sort({ createdAt: -1 });
};

/**
 * Count annotations for book
 * @param {String} bookId
 * @returns {Promise<Number>}
 */
bookAnnotationSchema.statics.countByBook = function(bookId) {
  return this.countDocuments({ bookId, isDeleted: false });
};

/**
 * Find recently modified annotations
 * @param {Number} days
 * @returns {Promise<Array>}
 */
bookAnnotationSchema.statics.findRecentlyModified = function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.find({
    updatedAt: { $gte: startDate },
    isDeleted: false
  }).sort({ updatedAt: -1 });
};

/**
 * Get annotation statistics for book
 * @param {String} bookId
 * @returns {Promise<Object>}
 */
bookAnnotationSchema.statics.getBookStats = async function(bookId) {
  const result = await this.aggregate([
    { $match: { bookId: mongoose.Types.ObjectId(bookId), isDeleted: false } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        totalLikes: { $sum: '$likeCount' },
        byType: { $push: '$type' }
      }
    }
  ]);

  if (result.length === 0) {
    return { total: 0, totalLikes: 0, byType: {} };
  }

  const stats = result[0];
  const byType = {};
  stats.byType.forEach(type => {
    byType[type] = (byType[type] || 0) + 1;
  });

  return {
    total: stats.total,
    totalLikes: stats.totalLikes,
    byType
  };
};

/**
 * Find most annotated books
 * @param {Number} limit
 * @returns {Promise<Array>}
 */
bookAnnotationSchema.statics.findMostAnnotated = async function(limit = 10) {
  const result = await this.aggregate([
    { $match: { isDeleted: false } },
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

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('BookAnnotation', bookAnnotationSchema);

