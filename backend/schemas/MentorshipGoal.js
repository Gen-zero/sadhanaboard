/**
 * Schema: MentorshipGoal
 * 
 * Purpose: Goals within a mentorship relationship
 * 
 * Key Fields:
 *   - mentorshipId: Reference to Mentorship
 *   - goalTitle: Title of the goal
 *   - achieved: Whether goal is completed
 * 
 * Relationships:
 *   - Many-to-one with Mentorship
 */

const mongoose = require('mongoose');

const mentorshipGoalSchema = new mongoose.Schema(
  {
    // Reference
    mentorshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentorship',
      required: [true, 'Mentorship ID is required'],
      index: true,
      description: 'Reference to parent Mentorship'
    },

    // Goal content
    goalTitle: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      description: 'Title of the goal'
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: null,
      description: 'Detailed goal description'
    },

    // Goal details
    category: {
      type: String,
      enum: ['skill', 'knowledge', 'behavior', 'project', 'habit', 'other'],
      default: 'other',
      description: 'Category of goal'
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      description: 'Goal priority'
    },

    // Progress tracking
    progressPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      description: 'Goal progress (0-100%)'
    },

    // Timeline
    targetDate: {
      type: Date,
      default: null,
      description: 'Target completion date'
    },

    completedAt: {
      type: Date,
      default: null,
      description: 'When goal was completed'
    },

    achieved: {
      type: Boolean,
      default: false,
      index: true,
      description: 'Whether goal is achieved'
    },

    // Tracking notes
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
      default: null,
      description: 'Progress notes and updates'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When goal was created'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When goal was last updated'
    }
  },
  {
    timestamps: false,
    collection: 'mentorshipgoals'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

mentorshipGoalSchema.index({ createdAt: -1 });

// Compound indexes
mentorshipGoalSchema.index({ mentorshipId: 1, achieved: 1 });
mentorshipGoalSchema.index({ mentorshipId: 1, targetDate: 1 });

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

mentorshipGoalSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }

  // Auto-mark as achieved if progress is 100%
  if (this.progressPercentage === 100 && !this.achieved) {
    this.achieved = true;
    this.completedAt = new Date();
  }

  next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Mark as completed
 * @returns {Promise} Updated goal
 */
mentorshipGoalSchema.methods.markCompleted = async function() {
  this.achieved = true;
  this.completedAt = new Date();
  this.progressPercentage = 100;
  await this.save();
  return this;
};

/**
 * Update progress
 * @param {Number} percentage
 * @returns {Promise} Updated goal
 */
mentorshipGoalSchema.methods.updateProgress = async function(percentage) {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Progress percentage must be between 0 and 100');
  }

  this.progressPercentage = percentage;

  if (percentage === 100 && !this.achieved) {
    this.achieved = true;
    this.completedAt = new Date();
  }

  await this.save();
  return this;
};

/**
 * Add note
 * @param {String} note
 * @returns {Promise} Updated goal
 */
mentorshipGoalSchema.methods.addNote = async function(note) {
  if (this.notes) {
    this.notes += '\n---\n' + note;
  } else {
    this.notes = note;
  }
  await this.save();
  return this;
};

/**
 * Update target date
 * @param {Date} newDate
 * @returns {Promise} Updated goal
 */
mentorshipGoalSchema.methods.updateTargetDate = async function(newDate) {
  this.targetDate = newDate;
  await this.save();
  return this;
};

/**
 * Check if overdue
 * @returns {Boolean}
 */
mentorshipGoalSchema.methods.isOverdue = function() {
  if (!this.targetDate || this.achieved) {
    return false;
  }
  return new Date() > this.targetDate;
};

/**
 * Get days until target
 * @returns {Number} Days remaining (negative if overdue)
 */
mentorshipGoalSchema.methods.getDaysRemaining = function() {
  if (!this.targetDate || this.achieved) {
    return null;
  }
  const today = new Date();
  const days = Math.ceil((this.targetDate - today) / (1000 * 60 * 60 * 24));
  return days;
};

/**
 * Get goal summary
 * @returns {Object}
 */
mentorshipGoalSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    title: this.goalTitle,
    category: this.category,
    priority: this.priority,
    progress: this.progressPercentage,
    achieved: this.achieved,
    targetDate: this.targetDate,
    daysRemaining: this.getDaysRemaining()
  };
};

/**
 * Convert to JSON
 * @returns {Object}
 */
mentorshipGoalSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find goals for mentorship
 * @param {String} mentorshipId
 * @returns {Promise<Array>}
 */
mentorshipGoalSchema.statics.findByMentorship = function(mentorshipId) {
  return this.find({ mentorshipId }).sort({ createdAt: -1 });
};

/**
 * Find incomplete goals
 * @param {String} mentorshipId
 * @returns {Promise<Array>}
 */
mentorshipGoalSchema.statics.findIncomplete = function(mentorshipId) {
  return this.find({ mentorshipId, achieved: false }).sort({ targetDate: 1 });
};

/**
 * Find completed goals
 * @param {String} mentorshipId
 * @returns {Promise<Array>}
 */
mentorshipGoalSchema.statics.findCompleted = function(mentorshipId) {
  return this.find({ mentorshipId, achieved: true }).sort({ completedAt: -1 });
};

/**
 * Find overdue goals
 * @param {String} mentorshipId
 * @returns {Promise<Array>}
 */
mentorshipGoalSchema.statics.findOverdue = function(mentorshipId) {
  return this.find({
    mentorshipId,
    achieved: false,
    targetDate: { $lt: new Date() }
  }).sort({ targetDate: 1 });
};

/**
 * Count goals by mentorship
 * @param {String} mentorshipId
 * @returns {Promise<Number>}
 */
mentorshipGoalSchema.statics.countByMentorship = function(mentorshipId) {
  return this.countDocuments({ mentorshipId });
};

/**
 * Get goal progress stats
 * @param {String} mentorshipId
 * @returns {Promise<Object>}
 */
mentorshipGoalSchema.statics.getProgressStats = async function(mentorshipId) {
  const result = await this.aggregate([
    { $match: { mentorshipId: mongoose.Types.ObjectId(mentorshipId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$achieved', true] }, 1, 0] }
        },
        avgProgress: { $avg: '$progressPercentage' }
      }
    }
  ]);

  if (result.length === 0) {
    return {
      total: 0,
      completed: 0,
      completionRate: 0,
      avgProgress: 0
    };
  }

  const stats = result[0];
  return {
    total: stats.total,
    completed: stats.completed,
    completionRate: Math.round((stats.completed / stats.total) * 100),
    avgProgress: Math.round(stats.avgProgress)
  };
};

/**
 * Find high priority incomplete goals
 * @param {String} mentorshipId
 * @returns {Promise<Array>}
 */
mentorshipGoalSchema.statics.findHighPriority = function(mentorshipId) {
  return this.find({
    mentorshipId,
    achieved: false,
    priority: 'high'
  }).sort({ targetDate: 1 });
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('MentorshipGoal', mentorshipGoalSchema);
