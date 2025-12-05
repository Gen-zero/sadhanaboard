/**
 * Schema: Sadhana
 * 
 * Purpose: Stores spiritual practice/sadhana records that users create and track
 * 
 * Key Fields:
 *   - userId: Creator of the sadhana
 *   - title: Name of the spiritual practice
 *   - description: Details about the practice
 *   - frequency: How often it should be done
 *   - dueDate: Target completion date
 *   - status: Current status (active, completed, abandoned)
 * 
 * Relationships:
 *   - Many-to-one with User (user creates many sadhanas)
 *   - One-to-many with SadhanaProgress (track daily progress)
 *   - One-to-many with SharedSadhana (shared versions)
 *   - One-to-many with SadhanaLike, SadhanaComment (engagement)
 * 
 * Indexes:
 *   - userId: For user-specific queries
 *   - status: For filtering by status
 *   - createdAt: For chronological sorting
 *   - dueDate: For filtering upcoming/overdue
 */

const mongoose = require('mongoose');

const sadhanaSchema = new mongoose.Schema(
  {
    // Creator/Owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
      description: 'Reference to User who created this sadhana'
    },

    // Assigned by (optional - for mentorship)
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      description: 'User who assigned this sadhana (if assigned by mentor)'
    },

    // Basic information
    title: {
      type: String,
      required: [true, 'Sadhana title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
      description: 'Title of the spiritual practice'
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: null,
      description: 'Detailed description of the practice'
    },

    // Practice details
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'biweekly', 'monthly', 'custom'],
      default: 'daily',
      description: 'How often the practice should be done'
    },

    duration: {
      type: Number,
      min: 1,
      default: 30,
      description: 'Duration in minutes per session'
    },

    type: {
      type: String,
      enum: [
        'meditation',
        'yoga',
        'prayer',
        'chanting',
        'reading',
        'service',
        'study',
        'exercise',
        'breathing',
        'journaling',
        'ritual',
        'other'
      ],
      default: 'other',
      index: true,
      description: 'Type of spiritual practice'
    },

    // Tags and categories
    tags: {
      type: [String],
      default: [],
      description: 'User-defined tags for categorization'
    },

    traditions: {
      type: [String],
      default: [],
      description: 'Spiritual traditions this practice belongs to'
    },

    // Status and dates
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'completed', 'abandoned'],
      default: 'draft',
      index: true,
      description: 'Current status of the sadhana'
    },

    startDate: {
      type: Date,
      default: Date.now,
      description: 'When the practice started'
    },

    dueDate: {
      type: Date,
      default: null,
      index: true,
      description: 'Target completion date'
    },

    completedAt: {
      type: Date,
      default: null,
      description: 'When practice was completed'
    },

    // Sharing and privacy
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
      description: 'Whether this sadhana is publicly visible'
    },

    isShareable: {
      type: Boolean,
      default: true,
      description: 'Whether others can share this sadhana'
    },

    privacyLevel: {
      type: String,
      enum: ['private', 'friends', 'community', 'public'],
      default: 'private',
      description: 'Who can view this sadhana'
    },

    // Engagement metrics (cached for performance)
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of likes (cached)'
    },

    commentCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of comments (cached)'
    },

    shareCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of shares (cached)'
    },

    viewCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of views (cached)'
    },

    // Progress tracking
    totalSessions: {
      type: Number,
      default: 0,
      description: 'Total number of sessions completed'
    },

    totalMinutes: {
      type: Number,
      default: 0,
      description: 'Total minutes spent'
    },

    streakDays: {
      type: Number,
      default: 0,
      description: 'Current consecutive days completed'
    },

    longestStreak: {
      type: Number,
      default: 0,
      description: 'Longest streak achieved'
    },

    // Goals and motivation
    goal: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
      description: 'Goal or intention for this practice'
    },

    motivation: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
      description: 'Personal motivation for the practice'
    },

    // Reminders
    reminderEnabled: {
      type: Boolean,
      default: true,
      description: 'Whether reminders are enabled'
    },

    reminderTime: {
      type: String,
      default: '06:00',
      description: 'Time for daily reminders (HH:MM format)'
    },

    // Progress data (compact reference)
    progressIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'SadhanaProgress',
      default: [],
      description: 'References to progress records'
    },

    // Notes
    notes: {
      type: String,
      trim: true,
      default: null,
      description: 'Personal notes about the practice'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When sadhana was created'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When sadhana was last updated'
    },

    lastActivityAt: {
      type: Date,
      default: null,
      description: 'When last activity occurred'
    }
  },
  {
    timestamps: false,
    collection: 'sadhanas'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

sadhanaSchema.index({ userId: 1 });
sadhanaSchema.index({ status: 1 });
sadhanaSchema.index({ createdAt: -1 });
sadhanaSchema.index({ dueDate: 1 });
sadhanaSchema.index({ type: 1 });
sadhanaSchema.index({ isPublic: 1 });
sadhanaSchema.index({ userId: 1, status: 1 });
sadhanaSchema.index({ userId: 1, createdAt: -1 });
sadhanaSchema.index({ isPublic: 1, createdAt: -1 }); // For public feed
sadhanaSchema.index({ status: 1, dueDate: 1 }); // For upcoming queries
sadhanaSchema.index({ title: 'text', description: 'text' }); // Full-text search

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

sadhanaSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Start the sadhana
 * @returns {Promise} Updated sadhana
 */
sadhanaSchema.methods.start = async function() {
  this.status = 'active';
  this.startDate = new Date();
  this.lastActivityAt = new Date();
  await this.save();
  return this;
};

/**
 * Complete the sadhana
 * @returns {Promise} Updated sadhana
 */
sadhanaSchema.methods.complete = async function() {
  this.status = 'completed';
  this.completedAt = new Date();
  this.lastActivityAt = new Date();
  await this.save();
  return this;
};

/**
 * Pause the sadhana
 * @returns {Promise} Updated sadhana
 */
sadhanaSchema.methods.pause = async function() {
  this.status = 'paused';
  this.lastActivityAt = new Date();
  await this.save();
  return this;
};

/**
 * Abandon the sadhana
 * @returns {Promise} Updated sadhana
 */
sadhanaSchema.methods.abandon = async function() {
  this.status = 'abandoned';
  this.lastActivityAt = new Date();
  await this.save();
  return this;
};

/**
 * Update streak information
 * @param {Number} currentStreak - Current streak days
 * @param {Number} longestStreak - Longest streak
 * @returns {Promise} Updated sadhana
 */
sadhanaSchema.methods.updateStreak = async function(currentStreak, longestStreak) {
  this.streakDays = currentStreak;
  this.longestStreak = Math.max(longestStreak, this.longestStreak);
  this.lastActivityAt = new Date();
  await this.save();
  return this;
};

/**
 * Update progress metrics
 * @param {Object} metrics - Metrics to update
 * @returns {Promise} Updated sadhana
 */
sadhanaSchema.methods.updateMetrics = async function(metrics) {
  if (metrics.totalSessions !== undefined) this.totalSessions = metrics.totalSessions;
  if (metrics.totalMinutes !== undefined) this.totalMinutes = metrics.totalMinutes;
  this.lastActivityAt = new Date();
  await this.save();
  return this;
};

/**
 * Check if sadhana is active
 * @returns {Boolean}
 */
sadhanaSchema.methods.isActive = function() {
  return this.status === 'active';
};

/**
 * Check if sadhana is overdue
 * @returns {Boolean}
 */
sadhanaSchema.methods.isOverdue = function() {
  if (!this.dueDate) return false;
  return this.dueDate < new Date() && this.status !== 'completed';
};

/**
 * Get time remaining until due date
 * @returns {Number|null} Days remaining or null
 */
sadhanaSchema.methods.getDaysRemaining = function() {
  if (!this.dueDate) return null;
  const days = Math.ceil((this.dueDate - new Date()) / (1000 * 60 * 60 * 24));
  return Math.max(days, 0);
};

/**
 * Get engagement summary
 * @returns {Object} Engagement metrics
 */
sadhanaSchema.methods.getEngagement = function() {
  return {
    likes: this.likeCount,
    comments: this.commentCount,
    shares: this.shareCount,
    views: this.viewCount,
    total: this.likeCount + this.commentCount + this.shareCount + this.viewCount
  };
};

/**
 * Get sadhana summary
 * @returns {Object}
 */
sadhanaSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    userId: this.userId,
    title: this.title,
    type: this.type,
    status: this.status,
    frequency: this.frequency,
    progress: this.totalSessions,
    streak: this.streakDays,
    isPublic: this.isPublic,
    createdAt: this.createdAt,
    daysRemaining: this.getDaysRemaining()
  };
};

/**
 * Convert to JSON
 * @returns {Object}
 */
sadhanaSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find active sadhanas for user
 * @param {String} userId
 * @returns {Promise<Array>}
 */
sadhanaSchema.statics.findActiveByUser = function(userId) {
  return this.find({ userId, status: 'active' }).sort({ createdAt: -1 });
};

/**
 * Find completed sadhanas for user
 * @param {String} userId
 * @returns {Promise<Array>}
 */
sadhanaSchema.statics.findCompletedByUser = function(userId) {
  return this.find({ userId, status: 'completed' }).sort({ completedAt: -1 });
};

/**
 * Find overdue sadhanas
 * @returns {Promise<Array>}
 */
sadhanaSchema.statics.findOverdue = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $ne: 'completed' }
  });
};

/**
 * Find public sadhanas
 * @returns {Promise<Array>}
 */
sadhanaSchema.statics.findPublic = function() {
  return this.find({ isPublic: true }).sort({ createdAt: -1 });
};

/**
 * Find trending sadhanas
 * @returns {Promise<Array>}
 */
sadhanaSchema.statics.findTrending = function() {
  return this.find({ isPublic: true })
    .sort({ likeCount: -1, commentCount: -1 })
    .limit(20);
};

/**
 * Search sadhanas
 * @param {String} query
 * @returns {Promise<Array>}
 */
sadhanaSchema.statics.search = function(query) {
  return this.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

/**
 * Count by user
 * @param {String} userId
 * @returns {Promise<Number>}
 */
sadhanaSchema.statics.countByUser = function(userId) {
  return this.countDocuments({ userId, status: { $ne: 'draft' } });
};

/**
 * Count active by type
 * @param {String} type
 * @returns {Promise<Number>}
 */
sadhanaSchema.statics.countByType = function(type) {
  return this.countDocuments({ type, status: 'active' });
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('Sadhana', sadhanaSchema);
