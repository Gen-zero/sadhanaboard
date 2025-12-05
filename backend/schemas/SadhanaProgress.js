/**
 * Schema: SadhanaProgress
 * 
 * Purpose: Tracks daily/periodic progress of a sadhana (spiritual practice)
 * 
 * Key Fields:
 *   - sadhanaId: Reference to parent Sadhana
 *   - userId: User doing the practice
 *   - progressDate: Date of this progress entry
 *   - isCompleted: Whether completed on this date
 *   - duration: Minutes spent today
 *   - notes: Progress notes
 * 
 * Relationships:
 *   - Many-to-one with Sadhana
 *   - Many-to-one with User
 * 
 * Indexes:
 *   - sadhanaId + progressDate: Unique constraint (one entry per date)
 *   - userId + progressDate: For user's daily view
 *   - progressDate: For chronological queries
 */

const mongoose = require('mongoose');

const sadhanaProgressSchema = new mongoose.Schema(
  {
    // References
    sadhanaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sadhana',
      required: [true, 'Sadhana ID is required'],
      index: true,
      description: 'Reference to parent Sadhana'
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
      description: 'Reference to User tracking progress'
    },

    // Date tracking
    progressDate: {
      type: Date,
      required: true,
      index: true,
      description: 'Date of this progress entry (stored as date only, no time)'
    },

    // Completion status
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
      description: 'Whether the practice was completed on this date'
    },

    // Time tracking
    duration: {
      type: Number,
      min: 0,
      default: 0,
      description: 'Minutes spent on practice'
    },

    startTime: {
      type: String,
      default: null,
      description: 'Start time (HH:MM format)'
    },

    endTime: {
      type: String,
      default: null,
      description: 'End time (HH:MM format)'
    },

    // Quality and notes
    quality: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent'],
      default: null,
      description: 'Quality rating of the session'
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
      description: 'Progress notes or reflections'
    },

    // Mood tracking
    mood: {
      type: String,
      enum: ['great', 'good', 'okay', 'bad', 'terrible'],
      default: null,
      description: 'Mood during practice'
    },

    // Energy level
    energy: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
      description: 'Energy level (1-10)'
    },

    // Focus level
    focus: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
      description: 'Focus level (1-10)'
    },

    // Location (optional)
    location: {
      type: String,
      trim: true,
      default: null,
      description: 'Where the practice happened'
    },

    // Challenges faced
    challenges: {
      type: [String],
      default: [],
      description: 'Challenges or obstacles encountered'
    },

    // Achievements
    achievements: {
      type: [String],
      default: [],
      description: 'Personal achievements or highlights'
    },

    // Streaks (cached for performance)
    streakContinued: {
      type: Boolean,
      default: false,
      description: 'Whether this entry continues the streak'
    },

    currentStreak: {
      type: Number,
      default: 0,
      description: 'Streak days at time of entry'
    },

    // Tags
    tags: {
      type: [String],
      default: [],
      description: 'Tags for this progress entry'
    },

    // Media (references)
    mediaUrls: {
      type: [String],
      default: [],
      description: 'URLs of photos/media for this session'
    },

    // Reflection
    reflection: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
      description: 'Detailed reflection on practice'
    },

    // Inspirations
    inspirations: {
      type: [String],
      default: [],
      description: 'Inspirations or lessons from practice'
    },

    // Sync status (for offline-first capability)
    isSynced: {
      type: Boolean,
      default: true,
      description: 'Whether entry is synced to server'
    },

    // Timestamps
    recordedAt: {
      type: Date,
      default: Date.now,
      description: 'When progress was recorded'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When entry was last updated'
    }
  },
  {
    timestamps: false,
    collection: 'sadhnaprogress'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

// Unique constraint: one entry per sadhana per date
sadhanaProgressSchema.index({ sadhanaId: 1, progressDate: 1 }, { unique: true });

// User progress queries
sadhanaProgressSchema.index({ userId: 1, progressDate: -1 });

// Date-based queries
sadhanaProgressSchema.index({ progressDate: -1 });

// Completion status
sadhanaProgressSchema.index({ sadhanaId: 1, isCompleted: 1 });

// Compound indexes for common queries
sadhanaProgressSchema.index({ userId: 1, sadhanaId: 1, progressDate: -1 });

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

sadhanaProgressSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }

  // Ensure progressDate is date only (no time component)
  if (this.progressDate) {
    const d = new Date(this.progressDate);
    this.progressDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Mark as completed
 * @param {Number} duration - Duration in minutes
 * @param {Object} data - Additional data (notes, quality, etc.)
 * @returns {Promise} Updated progress
 */
sadhanaProgressSchema.methods.markCompleted = async function(duration = 0, data = {}) {
  this.isCompleted = true;
  this.duration = duration;
  if (data.notes) this.notes = data.notes;
  if (data.quality) this.quality = data.quality;
  if (data.mood) this.mood = data.mood;
  if (data.energy) this.energy = data.energy;
  if (data.focus) this.focus = data.focus;
  this.recordedAt = new Date();
  await this.save();
  return this;
};

/**
 * Mark as skipped
 * @param {String} reason - Reason for skipping
 * @returns {Promise} Updated progress
 */
sadhanaProgressSchema.methods.markSkipped = async function(reason = null) {
  this.isCompleted = false;
  this.duration = 0;
  if (reason) this.notes = reason;
  this.streakContinued = false;
  await this.save();
  return this;
};

/**
 * Update with session data
 * @param {Object} sessionData
 * @returns {Promise} Updated progress
 */
sadhanaProgressSchema.methods.updateSession = async function(sessionData) {
  if (sessionData.duration) this.duration = sessionData.duration;
  if (sessionData.startTime) this.startTime = sessionData.startTime;
  if (sessionData.endTime) this.endTime = sessionData.endTime;
  if (sessionData.notes) this.notes = sessionData.notes;
  if (sessionData.quality) this.quality = sessionData.quality;
  if (sessionData.mood) this.mood = sessionData.mood;
  if (sessionData.energy !== undefined) this.energy = sessionData.energy;
  if (sessionData.focus !== undefined) this.focus = sessionData.focus;
  if (sessionData.location) this.location = sessionData.location;
  
  if (this.duration > 0) {
    this.isCompleted = true;
  }
  
  this.recordedAt = new Date();
  await this.save();
  return this;
};

/**
 * Add note to progress
 * @param {String} note
 * @returns {Promise} Updated progress
 */
sadhanaProgressSchema.methods.addNote = async function(note) {
  if (this.notes) {
    this.notes += '\n' + note;
  } else {
    this.notes = note;
  }
  await this.save();
  return this;
};

/**
 * Add reflection
 * @param {String} reflection
 * @returns {Promise} Updated progress
 */
sadhanaProgressSchema.methods.addReflection = async function(reflection) {
  this.reflection = reflection;
  await this.save();
  return this;
};

/**
 * Add challenge
 * @param {String} challenge
 * @returns {Promise} Updated progress
 */
sadhanaProgressSchema.methods.addChallenge = async function(challenge) {
  if (!this.challenges.includes(challenge)) {
    this.challenges.push(challenge);
    await this.save();
  }
  return this;
};

/**
 * Add achievement
 * @param {String} achievement
 * @returns {Promise} Updated progress
 */
sadhanaProgressSchema.methods.addAchievement = async function(achievement) {
  if (!this.achievements.includes(achievement)) {
    this.achievements.push(achievement);
    await this.save();
  }
  return this;
};

/**
 * Get summary
 * @returns {Object}
 */
sadhanaProgressSchema.methods.getSummary = function() {
  return {
    date: this.progressDate,
    completed: this.isCompleted,
    duration: this.duration,
    quality: this.quality,
    mood: this.mood,
    energy: this.energy,
    focus: this.focus,
    notes: this.notes
  };
};

/**
 * Convert to JSON
 * @returns {Object}
 */
sadhanaProgressSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find progress for date range
 * @param {String} sadhanaId
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<Array>}
 */
sadhanaProgressSchema.statics.findByDateRange = function(sadhanaId, startDate, endDate) {
  return this.find({
    sadhanaId,
    progressDate: { $gte: startDate, $lte: endDate }
  }).sort({ progressDate: -1 });
};

/**
 * Find progress for today
 * @param {String} sadhanaId
 * @returns {Promise<Object>}
 */
sadhanaProgressSchema.statics.findToday = function(sadhanaId) {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  return this.findOne({
    sadhanaId,
    progressDate: startOfDay
  });
};

/**
 * Find completed sessions
 * @param {String} sadhanaId
 * @param {Number} limit
 * @returns {Promise<Array>}
 */
sadhanaProgressSchema.statics.findCompleted = function(sadhanaId, limit = 10) {
  return this.find({ sadhanaId, isCompleted: true })
    .sort({ progressDate: -1 })
    .limit(limit);
};

/**
 * Calculate completion rate
 * @param {String} sadhanaId
 * @param {Number} days
 * @returns {Promise<Number>}
 */
sadhanaProgressSchema.statics.getCompletionRate = async function(sadhanaId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const total = await this.countDocuments({
    sadhanaId,
    progressDate: { $gte: startDate }
  });
  
  const completed = await this.countDocuments({
    sadhanaId,
    progressDate: { $gte: startDate },
    isCompleted: true
  });
  
  return total > 0 ? (completed / total) * 100 : 0;
};

/**
 * Get total minutes for period
 * @param {String} sadhanaId
 * @param {Number} days
 * @returns {Promise<Number>}
 */
sadhanaProgressSchema.statics.getTotalMinutes = async function(sadhanaId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const result = await this.aggregate([
    {
      $match: {
        sadhanaId: mongoose.Types.ObjectId(sadhanaId),
        progressDate: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$duration' }
      }
    }
  ]);
  
  return result[0]?.total || 0;
};

/**
 * Get average quality rating
 * @param {String} sadhanaId
 * @param {Number} days
 * @returns {Promise<Object>}
 */
sadhanaProgressSchema.statics.getAverageQuality = async function(sadhanaId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const result = await this.aggregate([
    {
      $match: {
        sadhanaId: mongoose.Types.ObjectId(sadhanaId),
        progressDate: { $gte: startDate },
        quality: { $ne: null }
      }
    },
    {
      $group: {
        _id: '$quality',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return result;
};

/**
 * Get user's daily progress
 * @param {String} userId
 * @param {Date} date
 * @returns {Promise<Array>}
 */
sadhanaProgressSchema.statics.getUserDailyProgress = function(userId, date) {
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  return this.find({
    userId,
    progressDate: startOfDay
  }).populate('sadhanaId');
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('SadhanaProgress', sadhanaProgressSchema);
