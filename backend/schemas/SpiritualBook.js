/**
 * Schema: SpiritualBook
 * 
 * Purpose: Stores spiritual books in user libraries with metadata and engagement tracking
 * 
 * Key Fields:
 *   - userId: User who owns/added the book
 *   - title: Book title
 *   - author: Book author
 *   - description: Book description
 *   - totalPages: Total pages in book
 *   - fileUrl: Location of book file (PDF, EPUB, etc.)
 *   - isPublic: Whether visible to others
 * 
 * Relationships:
 *   - Many-to-one with User (user has many books)
 *   - One-to-many with BookProgress (track reading progress)
 *   - One-to-many with BookBookmark (bookmark support)
 *   - One-to-many with BookAnnotation (notes/highlights)
 * 
 * Indexes:
 *   - userId: For user-specific queries
 *   - status: For filtering active/archived
 *   - createdAt: For chronological ordering
 *   - isPublic: For public library queries
 *   - text: title, author, description (full-text search)
 */

const mongoose = require('mongoose');

const spiritualBookSchema = new mongoose.Schema(
  {
    // Owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
      description: 'Reference to User who owns this book'
    },

    // Basic information
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
      description: 'Title of the book'
    },

    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [100, 'Author cannot exceed 100 characters'],
      index: true,
      description: 'Author of the book'
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: null,
      description: 'Book description/summary'
    },

    // Book metadata
    publisher: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
      description: 'Publisher name'
    },

    publishedYear: {
      type: Number,
      min: 1000,
      max: new Date().getFullYear() + 1,
      default: null,
      description: 'Year published'
    },

    isbn: {
      type: String,
      trim: true,
      default: null,
      description: 'ISBN identifier'
    },

    language: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de', 'hi', 'ja', 'zh', 'sa', 'other'],
      description: 'Language of the book'
    },

    // File/storage information
    format: {
      type: String,
      enum: ['pdf', 'epub', 'text', 'url', 'image', 'other'],
      default: 'pdf',
      description: 'File format'
    },

    fileUrl: {
      type: String,
      trim: true,
      default: null,
      description: 'URL or path to the book file'
    },

    fileSize: {
      type: Number,
      default: null,
      description: 'File size in bytes'
    },

    // Book content
    totalPages: {
      type: Number,
      min: 1,
      default: null,
      description: 'Total number of pages'
    },

    coverImageUrl: {
      type: String,
      trim: true,
      default: null,
      description: 'URL to book cover image'
    },

    // Categorization
    traditions: {
      type: [String],
      default: [],
      description: 'Spiritual traditions (Hindu, Buddhist, Christian, etc.)'
    },

    tags: {
      type: [String],
      default: [],
      description: 'User-defined tags for organization'
    },

    readingLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'scholarly'],
      default: 'intermediate',
      description: 'Reading difficulty level'
    },

    // Status
    status: {
      type: String,
      enum: ['active', 'archived', 'deleted'],
      default: 'active',
      index: true,
      description: 'Current status of the book'
    },

    // Visibility and sharing
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
      description: 'Whether book is publicly visible'
    },

    privacyLevel: {
      type: String,
      enum: ['private', 'friends', 'community', 'public'],
      default: 'private',
      description: 'Who can view this book'
    },

    // Featured status (admin control)
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
      description: 'Whether featured in library'
    },

    featuredAt: {
      type: Date,
      default: null,
      description: 'When featured'
    },

    // Engagement metrics (cached for performance)
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of views (cached)'
    },

    likeCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of likes (cached)'
    },

    annotationCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of annotations (cached)'
    },

    bookmarkCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of bookmarks (cached)'
    },

    progressCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of users reading (cached)'
    },

    // Rating (optional)
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
      description: 'Average user rating'
    },

    ratingCount: {
      type: Number,
      default: 0,
      description: 'Number of ratings'
    },

    // Custom notes
    personalNotes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
      description: 'User personal notes about the book'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When book was added to library'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When book entry was last updated'
    },

    deletedAt: {
      type: Date,
      default: null,
      description: 'When deleted (soft delete)'
    }
  },
  {
    timestamps: false,
    collection: 'spiritualbooks'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

spiritualBookSchema.index({ createdAt: -1 });

// Compound indexes for common queries
spiritualBookSchema.index({ userId: 1, createdAt: -1 });
spiritualBookSchema.index({ userId: 1, status: 1 });
spiritualBookSchema.index({ isPublic: 1, createdAt: -1 }); // For public library feed
spiritualBookSchema.index({ isFeatured: 1, createdAt: -1 }); // For featured view

// Full-text search indexes
spiritualBookSchema.index({ title: 'text', author: 'text', description: 'text' });

// Category indexes

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

spiritualBookSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Archive the book
 * @returns {Promise} Updated book
 */
spiritualBookSchema.methods.archive = async function() {
  this.status = 'archived';
  await this.save();
  return this;
};

/**
 * Restore archived book
 * @returns {Promise} Updated book
 */
spiritualBookSchema.methods.restore = async function() {
  this.status = 'active';
  await this.save();
  return this;
};

/**
 * Publish book (make visible)
 * @param {String} privacyLevel - Privacy level
 * @returns {Promise} Updated book
 */
spiritualBookSchema.methods.publish = async function(privacyLevel = 'community') {
  this.isPublic = true;
  this.privacyLevel = privacyLevel;
  await this.save();
  return this;
};

/**
 * Unpublish book (make private)
 * @returns {Promise} Updated book
 */
spiritualBookSchema.methods.unpublish = async function() {
  this.isPublic = false;
  this.privacyLevel = 'private';
  await this.save();
  return this;
};

/**
 * Feature this book
 * @returns {Promise} Updated book
 */
spiritualBookSchema.methods.feature = async function() {
  this.isFeatured = true;
  this.featuredAt = new Date();
  await this.save();
  return this;
};

/**
 * Unfeature this book
 * @returns {Promise} Updated book
 */
spiritualBookSchema.methods.unfeature = async function() {
  this.isFeatured = false;
  this.featuredAt = null;
  await this.save();
  return this;
};

/**
 * Record a view
 * @returns {Promise} Updated book
 */
spiritualBookSchema.methods.recordView = async function() {
  this.viewCount += 1;
  await this.save();
  return this;
};

/**
 * Update engagement metrics
 * @param {Object} metrics - Metrics to update
 * @returns {Promise} Updated book
 */
spiritualBookSchema.methods.updateMetrics = async function(metrics) {
  if (metrics.annotationCount !== undefined) this.annotationCount = metrics.annotationCount;
  if (metrics.bookmarkCount !== undefined) this.bookmarkCount = metrics.bookmarkCount;
  if (metrics.progressCount !== undefined) this.progressCount = metrics.progressCount;
  if (metrics.likeCount !== undefined) this.likeCount = metrics.likeCount;
  await this.save();
  return this;
};

/**
 * Update rating
 * @param {Number} newRating - New rating (0-5)
 * @returns {Promise} Updated book
 */
spiritualBookSchema.methods.updateRating = async function(newRating) {
  if (newRating < 0 || newRating > 5) {
    throw new Error('Rating must be between 0 and 5');
  }
  
  // Recalculate average (would need actual ratings in service)
  const currentTotal = this.averageRating * this.ratingCount;
  this.ratingCount += 1;
  this.averageRating = (currentTotal + newRating) / this.ratingCount;
  
  await this.save();
  return this;
};

/**
 * Get engagement summary
 * @returns {Object}
 */
spiritualBookSchema.methods.getEngagement = function() {
  return {
    views: this.viewCount,
    likes: this.likeCount,
    annotations: this.annotationCount,
    bookmarks: this.bookmarkCount,
    readers: this.progressCount,
    totalEngagement: this.viewCount + this.likeCount + this.annotationCount + this.bookmarkCount
  };
};

/**
 * Get book summary
 * @returns {Object}
 */
spiritualBookSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    title: this.title,
    author: this.author,
    coverImageUrl: this.coverImageUrl,
    totalPages: this.totalPages,
    traditions: this.traditions,
    readingLevel: this.readingLevel,
    isPublic: this.isPublic,
    rating: this.averageRating,
    engagement: this.getEngagement(),
    createdAt: this.createdAt
  };
};

/**
 * Check if can be edited by user
 * @param {String} userId
 * @returns {Boolean}
 */
spiritualBookSchema.methods.canEdit = function(userId) {
  return this.userId.toString() === userId.toString();
};

/**
 * Convert to JSON (for API response)
 * @returns {Object}
 */
spiritualBookSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find all books by user
 * @param {String} userId
 * @returns {Promise<Array>}
 */
spiritualBookSchema.statics.findByUser = function(userId) {
  return this.find({ userId, status: 'active' }).sort({ createdAt: -1 });
};

/**
 * Find active books by user
 * @param {String} userId
 * @returns {Promise<Array>}
 */
spiritualBookSchema.statics.findActiveByUser = function(userId) {
  return this.find({ userId, status: 'active' }).sort({ updatedAt: -1 });
};

/**
 * Find archived books by user
 * @param {String} userId
 * @returns {Promise<Array>}
 */
spiritualBookSchema.statics.findArchivedByUser = function(userId) {
  return this.find({ userId, status: 'archived' }).sort({ createdAt: -1 });
};

/**
 * Find public books
 * @returns {Promise<Array>}
 */
spiritualBookSchema.statics.findPublic = function() {
  return this.find({ isPublic: true, status: 'active' })
    .sort({ createdAt: -1 })
    .limit(50);
};

/**
 * Find featured books
 * @returns {Promise<Array>}
 */
spiritualBookSchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, isPublic: true, status: 'active' })
    .sort({ featuredAt: -1 })
    .limit(10);
};

/**
 * Find trending books
 * @returns {Promise<Array>}
 */
spiritualBookSchema.statics.findTrending = function() {
  return this.find({ isPublic: true, status: 'active' })
    .sort({ viewCount: -1, likeCount: -1 })
    .limit(20);
};

/**
 * Search books
 * @param {String} query
 * @returns {Promise<Array>}
 */
spiritualBookSchema.statics.search = function(query) {
  return this.find(
    { $text: { $search: query }, status: 'active' },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

/**
 * Find by tradition
 * @param {String} tradition
 * @returns {Promise<Array>}
 */
spiritualBookSchema.statics.findByTradition = function(tradition) {
  return this.find({ traditions: tradition, isPublic: true, status: 'active' })
    .sort({ createdAt: -1 });
};

/**
 * Find by reading level
 * @param {String} level
 * @returns {Promise<Array>}
 */
spiritualBookSchema.statics.findByReadingLevel = function(level) {
  return this.find({ readingLevel: level, isPublic: true, status: 'active' })
    .sort({ averageRating: -1 });
};

/**
 * Count books by user
 * @param {String} userId
 * @returns {Promise<Number>}
 */
spiritualBookSchema.statics.countByUser = function(userId) {
  return this.countDocuments({ userId, status: 'active' });
};

/**
 * Find highly rated books
 * @returns {Promise<Array>}
 */
spiritualBookSchema.statics.findHighestRated = function() {
  return this.find({ isPublic: true, status: 'active', averageRating: { $gt: 4 } })
    .sort({ averageRating: -1 })
    .limit(20);
};

/**
 * Get popular books
 * @returns {Promise<Array>}
 */
spiritualBookSchema.statics.findPopular = function() {
  return this.find({ isPublic: true, status: 'active' })
    .sort({ progressCount: -1, likeCount: -1 })
    .limit(15);
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('SpiritualBook', spiritualBookSchema);

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * How to use the SpiritualBook schema:
 * 
 * const SpiritualBook = require('./schemas/SpiritualBook');
 * 
 * // Add book to library
 * const book = await SpiritualBook.create({
 *   userId: userId,
 *   title: 'The Bhagavad Gita',
 *   author: 'Vyasa',
 *   totalPages: 400,
 *   traditions: ['Hindu']
 * });
 * 
 * // Find user's books
 * const books = await SpiritualBook.findByUser(userId);
 * 
 * // Publish book
 * await book.publish('community');
 * 
 * // Record view
 * await book.recordView();
 * 
 * // Get engagement
 * const stats = book.getEngagement();
 * 
 * // Search books
 * const results = await SpiritualBook.search('meditation');
 */
