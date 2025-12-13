/**
 * Schema: BookProgress
 * 
 * Purpose: Tracks reading progress for each book
 * 
 * Key Fields:
 *   - bookId: Reference to SpiritualBook
 *   - userId: User reading the book
 *   - currentPage: Current page number
 *   - percentageRead: Completion percentage (0-100)
 *   - status: Reading status (reading, completed, paused, abandoned)
 * 
 * Relationships:
 *   - Many-to-one with SpiritualBook
 *   - Many-to-one with User
 * 
 * Indexes:
 *   - userId + bookId: Unique (one entry per user per book)
 *   - userId + status: For finding user's current/completed reads
 */

const mongoose = require('mongoose');

const bookProgressSchema = new mongoose.Schema(
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
      description: 'Reference to User reading this book'
    },

    // Reading progress
    currentPage: {
      type: Number,
      min: 0,
      default: 0,
      description: 'Current page number'
    },

    totalPages: {
      type: Number,
      min: 1,
      required: true,
      description: 'Total pages in book (cached from SpiritualBook)'
    },

    percentageRead: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      description: 'Percentage of book read (0-100)'
    },

    // Status
    status: {
      type: String,
      enum: ['reading', 'completed', 'paused', 'abandoned'],
      default: 'reading',
      index: true,
      description: 'Current reading status'
    },

    // Timeline
    startedAt: {
      type: Date,
      default: Date.now,
      description: 'When reading started'
    },

    completedAt: {
      type: Date,
      default: null,
      description: 'When book was completed'
    },

    pausedAt: {
      type: Date,
      default: null,
      description: 'When reading was paused'
    },

    pauseReason: {
      type: String,
      trim: true,
      maxlength: 300,
      default: null,
      description: 'Reason for pausing'
    },

    abandonedAt: {
      type: Date,
      default: null,
      description: 'When reading was abandoned'
    },

    abandonReason: {
      type: String,
      trim: true,
      maxlength: 300,
      default: null,
      description: 'Reason for abandoning'
    },

    lastReadAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When last read'
    },

    // Session tracking
    totalTimeSpent: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Total minutes spent reading'
    },

    sessionCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of reading sessions'
    },

    lastSessionDuration: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Duration of last reading session (minutes)'
    },

    averageSessionDuration: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Average session duration (minutes)'
    },

    // Chapter tracking (optional)
    currentChapter: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
      description: 'Current chapter or section'
    },

    currentChapterProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
      description: 'Progress within current chapter (%)'
    },

    // Reading goal
    estimatedCompletionDate: {
      type: Date,
      default: null,
      description: 'Estimated completion date'
    },

    readingGoalDays: {
      type: Number,
      min: 1,
      default: null,
      description: 'Target days to complete book'
    },

    // Notes
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
      description: 'User notes about reading progress'
    },

    // Rating (given after completion)
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
      description: 'User rating after completion'
    },

    review: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
      description: 'User review after completion'
    },

    // Reading insights
    favoriteQuotes: {
      type: [String],
      default: [],
      maxlength: 5,
      description: 'Favorite quotes from book'
    },

    keyTakeaways: {
      type: [String],
      default: [],
      maxlength: 10,
      description: 'Key learnings from book'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When progress tracking started'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When progress was last updated'
    }
  },
  {
    timestamps: false,
    collection: 'bookprogress'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

// Unique constraint: one entry per user per book
bookProgressSchema.index({ userId: 1, bookId: 1 }, { unique: true });

// User reading queries
bookProgressSchema.index({ userId: 1, status: 1 });

// Recent activity
bookProgressSchema.index({ userId: 1, lastReadAt: -1 });

// Status queries

// Completed books
bookProgressSchema.index({ status: 1, completedAt: -1 });

// Compound indexes
bookProgressSchema.index({ userId: 1, status: 1, lastReadAt: -1 });

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

bookProgressSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }

  // Auto-calculate percentage
  if (this.totalPages && this.totalPages > 0) {
    this.percentageRead = Math.round((this.currentPage / this.totalPages) * 100);
  }

  next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Update reading progress
 * @param {Number} page - Current page
 * @returns {Promise} Updated progress
 */
bookProgressSchema.methods.updateProgress = async function(page) {
  if (page < 0 || page > this.totalPages) {
    throw new Error('Invalid page number');
  }

  this.currentPage = page;
  this.lastReadAt = new Date();

  // Recalculate percentage
  if (this.totalPages > 0) {
    this.percentageRead = Math.round((page / this.totalPages) * 100);
  }

  await this.save();
  return this;
};

/**
 * Record a reading session
 * @param {Number} durationMinutes - Session duration in minutes
 * @param {Number} page - Page reached after session
 * @returns {Promise} Updated progress
 */
bookProgressSchema.methods.recordSession = async function(durationMinutes, page) {
  if (page) {
    await this.updateProgress(page);
  }

  this.totalTimeSpent += durationMinutes;
  this.sessionCount += 1;
  this.lastSessionDuration = durationMinutes;
  this.averageSessionDuration = Math.round(this.totalTimeSpent / this.sessionCount);
  this.lastReadAt = new Date();

  await this.save();
  return this;
};

/**
 * Mark as completed
 * @param {Number} rating - Rating (0-5)
 * @param {String} review - Review text
 * @returns {Promise} Updated progress
 */
bookProgressSchema.methods.markCompleted = async function(rating = null, review = null) {
  this.status = 'completed';
  this.completedAt = new Date();
  this.currentPage = this.totalPages;
  this.percentageRead = 100;
  
  if (rating !== null) {
    this.rating = rating;
  }
  if (review) {
    this.review = review;
  }

  await this.save();
  return this;
};

/**
 * Pause reading
 * @param {String} reason - Reason for pausing
 * @returns {Promise} Updated progress
 */
bookProgressSchema.methods.pauseReading = async function(reason = null) {
  this.status = 'paused';
  this.pausedAt = new Date();
  if (reason) {
    this.pauseReason = reason;
  }
  await this.save();
  return this;
};

/**
 * Resume reading
 * @returns {Promise} Updated progress
 */
bookProgressSchema.methods.resumeReading = async function() {
  if (this.status === 'paused') {
    this.status = 'reading';
    this.pausedAt = null;
    this.pauseReason = null;
    this.lastReadAt = new Date();
    await this.save();
  }
  return this;
};

/**
 * Abandon reading
 * @param {String} reason - Reason for abandoning
 * @returns {Promise} Updated progress
 */
bookProgressSchema.methods.abandonReading = async function(reason = null) {
  this.status = 'abandoned';
  this.abandonedAt = new Date();
  if (reason) {
    this.abandonReason = reason;
  }
  await this.save();
  return this;
};

/**
 * Add favorite quote
 * @param {String} quote
 * @returns {Promise} Updated progress
 */
bookProgressSchema.methods.addFavoriteQuote = async function(quote) {
  if (this.favoriteQuotes.length < 5 && !this.favoriteQuotes.includes(quote)) {
    this.favoriteQuotes.push(quote);
    await this.save();
  }
  return this;
};

/**
 * Add key takeaway
 * @param {String} takeaway
 * @returns {Promise} Updated progress
 */
bookProgressSchema.methods.addKeyTakeaway = async function(takeaway) {
  if (this.keyTakeaways.length < 10 && !this.keyTakeaways.includes(takeaway)) {
    this.keyTakeaways.push(takeaway);
    await this.save();
  }
  return this;
};

/**
 * Get reading summary
 * @returns {Object}
 */
bookProgressSchema.methods.getSummary = function() {
  return {
    bookId: this.bookId,
    userId: this.userId,
    currentPage: this.currentPage,
    totalPages: this.totalPages,
    percentageRead: this.percentageRead,
    status: this.status,
    lastReadAt: this.lastReadAt,
    timeSpent: this.totalTimeSpent,
    sessions: this.sessionCount
  };
};

/**
 * Get reading stats
 * @returns {Object}
 */
bookProgressSchema.methods.getStats = function() {
  return {
    currentPage: this.currentPage,
    totalPages: this.totalPages,
    percentageRead: this.percentageRead,
    totalTimeSpent: this.totalTimeSpent,
    averageSessionDuration: this.averageSessionDuration,
    sessionCount: this.sessionCount,
    lastReadAt: this.lastReadAt,
    startedAt: this.startedAt,
    completedAt: this.completedAt,
    rating: this.rating
  };
};

/**
 * Convert to JSON
 * @returns {Object}
 */
bookProgressSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find progress for user and book
 * @param {String} userId
 * @param {String} bookId
 * @returns {Promise<Object>}
 */
bookProgressSchema.statics.findByUserAndBook = function(userId, bookId) {
  return this.findOne({ userId, bookId }).populate('bookId');
};

/**
 * Find user's currently reading books
 * @param {String} userId
 * @returns {Promise<Array>}
 */
bookProgressSchema.statics.findCurrentlyReading = function(userId) {
  return this.find({ userId, status: 'reading' })
    .populate('bookId', 'title author coverImageUrl')
    .sort({ lastReadAt: -1 });
};

/**
 * Find user's completed books
 * @param {String} userId
 * @returns {Promise<Array>}
 */
bookProgressSchema.statics.findCompleted = function(userId) {
  return this.find({ userId, status: 'completed' })
    .populate('bookId', 'title author')
    .sort({ completedAt: -1 });
};

/**
 * Find user's paused books
 * @param {String} userId
 * @returns {Promise<Array>}
 */
bookProgressSchema.statics.findPaused = function(userId) {
  return this.find({ userId, status: 'paused' })
    .populate('bookId', 'title author')
    .sort({ pausedAt: -1 });
};

/**
 * Get user's reading stats
 * @param {String} userId
 * @returns {Promise<Object>}
 */
bookProgressSchema.statics.getUserReadingStats = async function(userId) {
  const result = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalBooksRead: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        totalBooksReading: {
          $sum: { $cond: [{ $eq: ['$status', 'reading'] }, 1, 0] }
        },
        totalMinutesRead: { $sum: '$totalTimeSpent' },
        averageRating: {
          $avg: {
            $cond: [{ $eq: ['$status', 'completed'] }, '$rating', null]
          }
        }
      }
    }
  ]);

  return result[0] || {
    totalBooksRead: 0,
    totalBooksReading: 0,
    totalMinutesRead: 0,
    averageRating: 0
  };
};

/**
 * Get completion rate for book
 * @param {String} bookId
 * @returns {Promise<Object>}
 */
bookProgressSchema.statics.getBookCompletionRate = async function(bookId) {
  const total = await this.countDocuments({ bookId });
  const completed = await this.countDocuments({ bookId, status: 'completed' });

  return {
    total,
    completed,
    rate: total > 0 ? (completed / total) * 100 : 0
  };
};

/**
 * Find active readers for book
 * @param {String} bookId
 * @returns {Promise<Array>}
 */
bookProgressSchema.statics.findActiveReaders = function(bookId) {
  return this.find({ bookId, status: { $in: ['reading', 'paused'] } })
    .populate('userId', 'displayName avatar')
    .sort({ lastReadAt: -1 });
};

/**
 * Find highest rated books by user
 * @param {String} userId
 * @returns {Promise<Array>}
 */
bookProgressSchema.statics.findHighestRatedByUser = function(userId) {
  return this.find({ userId, status: 'completed', rating: { $gt: 3 } })
    .populate('bookId', 'title author')
    .sort({ rating: -1 });
};

/**
 * Get average reading time for book
 * @param {String} bookId
 * @returns {Promise<Number>}
 */
bookProgressSchema.statics.getAverageReadingTime = async function(bookId) {
  const result = await this.aggregate([
    { $match: { bookId: mongoose.Types.ObjectId(bookId) } },
    {
      $group: {
        _id: null,
        avgTime: { $avg: '$totalTimeSpent' }
      }
    }
  ]);

  return result[0]?.avgTime || 0;
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('BookProgress', bookProgressSchema);
