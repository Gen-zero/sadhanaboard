/**
 * Schema: Mentorship
 * 
 * Purpose: Tracks mentorship relationships between users
 * 
 * Key Fields:
 *   - mentorId: Reference to mentor User
 *   - menteeId: Reference to mentee User
 *   - status: active, completed, paused, cancelled
 * 
 * Relationships:
 *   - Many-to-one with User (mentor)
 *   - Many-to-one with User (mentee)
 *   - One-to-many with MentorshipGoal
 */

const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema(
  {
    // References
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Mentor ID is required'],
      index: true,
      description: 'Reference to mentor User'
    },

    menteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Mentee ID is required'],
      index: true,
      description: 'Reference to mentee User'
    },

    // Description
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: null,
      description: 'About this mentorship'
    },

    // Status
    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'cancelled'],
      default: 'active',
      index: true,
      description: 'Current status'
    },

    // Timeline
    startDate: {
      type: Date,
      default: Date.now,
      description: 'When mentorship started'
    },

    expectedEndDate: {
      type: Date,
      default: null,
      description: 'Expected completion date'
    },

    actualEndDate: {
      type: Date,
      default: null,
      description: 'When mentorship ended'
    },

    pausedAt: {
      type: Date,
      default: null,
      description: 'When paused (if paused)'
    },

    // Goals tracking
    goalCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Total goals count'
    },

    completedGoalCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Completed goals count'
    },

    // Shared content
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
      default: null,
      description: 'Shared notes/topics'
    },

    learnings: {
      type: String,
      trim: true,
      maxlength: [2000, 'Learnings cannot exceed 2000 characters'],
      default: null,
      description: 'Key learnings and insights'
    },

    // Feedback and ratings
    mentorRating: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
      description: 'Mentee rating of mentor (0-5)'
    },

    mentorFeedback: {
      type: String,
      trim: true,
      maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
      default: null,
      description: 'Mentee feedback on mentor'
    },

    menteeRating: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
      description: 'Mentor rating of mentee (0-5)'
    },

    menteeFeedback: {
      type: String,
      trim: true,
      maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
      default: null,
      description: 'Mentor feedback on mentee'
    },

    // Activity tracking
    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When last activity occurred'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When mentorship started'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When last updated'
    }
  },
  {
    timestamps: false,
    collection: 'mentorships'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

mentorshipSchema.index({ createdAt: -1 });
mentorshipSchema.index({ lastActivityAt: -1 });

// Compound indexes
mentorshipSchema.index({ mentorId: 1, status: 1 });
mentorshipSchema.index({ menteeId: 1, status: 1 });
mentorshipSchema.index({ status: 1, lastActivityAt: -1 });

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

mentorshipSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Mark as completed
 * @returns {Promise} Updated mentorship
 */
mentorshipSchema.methods.complete = async function() {
  this.status = 'completed';
  this.actualEndDate = new Date();
  await this.save();
  return this;
};

/**
 * Pause mentorship
 * @returns {Promise} Updated mentorship
 */
mentorshipSchema.methods.pause = async function() {
  this.status = 'paused';
  this.pausedAt = new Date();
  await this.save();
  return this;
};

/**
 * Resume mentorship
 * @returns {Promise} Updated mentorship
 */
mentorshipSchema.methods.resume = async function() {
  if (this.status === 'paused') {
    this.status = 'active';
    this.pausedAt = null;
    this.lastActivityAt = new Date();
    await this.save();
  }
  return this;
};

/**
 * Cancel mentorship
 * @returns {Promise} Updated mentorship
 */
mentorshipSchema.methods.cancel = async function() {
  this.status = 'cancelled';
  this.actualEndDate = new Date();
  await this.save();
  return this;
};

/**
 * Add/update notes
 * @param {String} newNotes
 * @returns {Promise} Updated mentorship
 */
mentorshipSchema.methods.addNote = async function(newNotes) {
  if (this.notes) {
    this.notes += '\n---\n' + newNotes;
  } else {
    this.notes = newNotes;
  }
  this.lastActivityAt = new Date();
  await this.save();
  return this;
};

/**
 * Update learnings
 * @param {String} newLearnings
 * @returns {Promise} Updated mentorship
 */
mentorshipSchema.methods.updateLearnings = async function(newLearnings) {
  this.learnings = newLearnings;
  this.lastActivityAt = new Date();
  await this.save();
  return this;
};

/**
 * Rate mentor
 * @param {Number} rating
 * @param {String} feedback
 * @returns {Promise} Updated mentorship
 */
mentorshipSchema.methods.rateMentor = async function(rating, feedback = null) {
  if (rating < 0 || rating > 5) {
    throw new Error('Rating must be between 0 and 5');
  }
  this.mentorRating = rating;
  if (feedback) {
    this.mentorFeedback = feedback;
  }
  await this.save();
  return this;
};

/**
 * Rate mentee
 * @param {Number} rating
 * @param {String} feedback
 * @returns {Promise} Updated mentorship
 */
mentorshipSchema.methods.rateMentee = async function(rating, feedback = null) {
  if (rating < 0 || rating > 5) {
    throw new Error('Rating must be between 0 and 5');
  }
  this.menteeRating = rating;
  if (feedback) {
    this.menteeFeedback = feedback;
  }
  await this.save();
  return this;
};

/**
 * Update goal counts
 * @param {Number} total
 * @param {Number} completed
 * @returns {Promise} Updated mentorship
 */
mentorshipSchema.methods.updateGoalCounts = async function(total, completed) {
  this.goalCount = total;
  this.completedGoalCount = completed;
  this.lastActivityAt = new Date();
  await this.save();
  return this;
};

/**
 * Get mentorship summary
 * @returns {Object}
 */
mentorshipSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    mentorId: this.mentorId,
    menteeId: this.menteeId,
    status: this.status,
    goals: this.completedGoalCount + '/' + this.goalCount,
    mentorRating: this.mentorRating,
    menteeRating: this.menteeRating,
    startDate: this.startDate
  };
};

/**
 * Convert to JSON
 * @returns {Object}
 */
mentorshipSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find mentorships by mentor
 * @param {String} mentorId
 * @returns {Promise<Array>}
 */
mentorshipSchema.statics.findByMentor = function(mentorId) {
  return this.find({ mentorId })
    .populate('menteeId', 'displayName avatar')
    .sort({ createdAt: -1 });
};

/**
 * Find mentorships by mentee
 * @param {String} menteeId
 * @returns {Promise<Array>}
 */
mentorshipSchema.statics.findByMentee = function(menteeId) {
  return this.find({ menteeId })
    .populate('mentorId', 'displayName avatar')
    .sort({ createdAt: -1 });
};

/**
 * Find active mentorships
 * @returns {Promise<Array>}
 */
mentorshipSchema.statics.findActive = function() {
  return this.find({ status: 'active' })
    .populate('mentorId', 'displayName')
    .populate('menteeId', 'displayName')
    .sort({ lastActivityAt: -1 });
};

/**
 * Find completed mentorships
 * @returns {Promise<Array>}
 */
mentorshipSchema.statics.findCompleted = function() {
  return this.find({ status: 'completed' })
    .sort({ actualEndDate: -1 });
};

/**
 * Find active by mentor
 * @param {String} mentorId
 * @returns {Promise<Array>}
 */
mentorshipSchema.statics.findActiveMentees = function(mentorId) {
  return this.find({ mentorId, status: 'active' })
    .populate('menteeId', 'displayName avatar');
};

/**
 * Find active by mentee
 * @param {String} menteeId
 * @returns {Promise<Array>}
 */
mentorshipSchema.statics.findActiveMentors = function(menteeId) {
  return this.find({ menteeId, status: 'active' })
    .populate('mentorId', 'displayName avatar');
};

/**
 * Count mentorships by mentor
 * @param {String} mentorId
 * @returns {Promise<Number>}
 */
mentorshipSchema.statics.countByMentor = function(mentorId) {
  return this.countDocuments({ mentorId, status: 'active' });
};

/**
 * Count mentorships by mentee
 * @param {String} menteeId
 * @returns {Promise<Number>}
 */
mentorshipSchema.statics.countByMentee = function(menteeId) {
  return this.countDocuments({ menteeId, status: 'active' });
};

/**
 * Get mentorship pair (check if exists)
 * @param {String} mentorId
 * @param {String} menteeId
 * @returns {Promise<Object>}
 */
mentorshipSchema.statics.findPair = function(mentorId, menteeId) {
  return this.findOne({ mentorId, menteeId });
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('Mentorship', mentorshipSchema);
