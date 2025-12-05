/**
 * Schema: Waitlist
 * 
 * Purpose: Stores user waitlist entries for early access/beta testing
 * 
 * Key Fields:
 *   - email: Waitlist entry email
 *   - name: Person's name
 *   - reason: Why they want access
 *   - status: Approval status (pending, approved, rejected)
 *   - notes: Internal notes about the entry
 * 
 * Relationships:
 *   - None (independent collection)
 * 
 * Indexes:
 *   - email: For checking if already on waitlist (unique)
 *   - status: For filtering by approval status
 *   - createdAt: For ordering by signup date
 */

const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema(
  {
    // Contact information
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email address'
      ],
      index: true,
      description: 'Email address for waitlist entry'
    },

    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
      description: 'Full name of person'
    },

    // Signup information
    reason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
      description: 'Why they want early access'
    },

    interests: {
      type: [String],
      default: [],
      description: 'Areas of interest'
    },

    // Approval process
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'converted'],
      default: 'pending',
      index: true,
      description: 'Waitlist entry status'
    },

    // Conversion to actual user
    isConverted: {
      type: Boolean,
      default: false,
      description: 'Whether waitlist entry converted to user account'
    },

    convertedAt: {
      type: Date,
      default: null,
      description: 'When converted to user (if converted)'
    },

    convertedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      description: 'Reference to created User (if converted)'
    },

    // Admin notes
    adminNotes: {
      type: String,
      trim: true,
      default: null,
      description: 'Internal notes by admin'
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null,
      description: 'Admin who approved the entry'
    },

    approvedAt: {
      type: Date,
      default: null,
      description: 'When entry was approved'
    },

    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null,
      description: 'Admin who rejected the entry'
    },

    rejectedAt: {
      type: Date,
      default: null,
      description: 'When entry was rejected'
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: null,
      description: 'Reason for rejection'
    },

    // Engagement tracking
    emailSentAt: {
      type: Date,
      default: null,
      description: 'When notification email was sent'
    },

    reminderSentAt: {
      type: Date,
      default: null,
      description: 'When reminder email was sent'
    },

    reminderCount: {
      type: Number,
      default: 0,
      description: 'Number of reminder emails sent'
    },

    // Metadata
    source: {
      type: String,
      enum: ['website', 'email', 'referral', 'social', 'other'],
      default: 'website',
      description: 'Where waitlist entry came from'
    },

    referralCode: {
      type: String,
      trim: true,
      default: null,
      description: 'Referral code if referred'
    },

    ipAddress: {
      type: String,
      trim: true,
      default: null,
      description: 'IP address when signed up'
    },

    userAgent: {
      type: String,
      trim: true,
      default: null,
      description: 'User agent when signed up'
    },

    // Priority
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
      description: 'Manual priority ranking (higher = higher priority)'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When waitlist entry was created'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When entry was last updated'
    }
  },
  {
    timestamps: false, // Manually manage timestamps
    collection: 'waitlist'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

// Email index (unique - can only be on waitlist once)
waitlistSchema.index({ email: 1 }, { unique: true });

// Status index (for filtering)
waitlistSchema.index({ status: 1 });

// Created date index (for chronological ordering)
waitlistSchema.index({ createdAt: -1 });

// Conversion tracking
waitlistSchema.index({ isConverted: 1 });

// Admin tracking
waitlistSchema.index({ approvedBy: 1 });

// Compound indexes
waitlistSchema.index({ status: 1, priority: -1 }); // For prioritized queue
waitlistSchema.index({ status: 1, createdAt: 1 }); // For FIFO processing
waitlistSchema.index({ isConverted: 1, convertedAt: -1 });

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

// Pre-save hook
waitlistSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Approve waitlist entry
 * @param {String} adminId - Admin ID who approved
 * @param {String} notes - Optional admin notes
 * @returns {Promise} Updated entry
 */
waitlistSchema.methods.approve = async function(adminId, notes = null) {
  this.status = 'approved';
  this.approvedBy = adminId;
  this.approvedAt = new Date();
  if (notes) {
    this.adminNotes = notes;
  }
  await this.save();
  return this;
};

/**
 * Reject waitlist entry
 * @param {String} adminId - Admin ID who rejected
 * @param {String} reason - Rejection reason
 * @returns {Promise} Updated entry
 */
waitlistSchema.methods.reject = async function(adminId, reason) {
  this.status = 'rejected';
  this.rejectedBy = adminId;
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
  await this.save();
  return this;
};

/**
 * Mark as converted to user
 * @param {String} userId - Created User ID
 * @returns {Promise} Updated entry
 */
waitlistSchema.methods.markConverted = async function(userId) {
  this.isConverted = true;
  this.convertedAt = new Date();
  this.convertedUserId = userId;
  this.status = 'converted';
  await this.save();
  return this;
};

/**
 * Send email notification
 * Marks that email was sent (actual email logic in service)
 * @returns {Promise} Updated entry
 */
waitlistSchema.methods.markEmailSent = async function() {
  this.emailSentAt = new Date();
  await this.save();
  return this;
};

/**
 * Send reminder email
 * @returns {Promise} Updated entry
 */
waitlistSchema.methods.markReminderSent = async function() {
  this.reminderSentAt = new Date();
  this.reminderCount = (this.reminderCount || 0) + 1;
  await this.save();
  return this;
};

/**
 * Check if pending approval
 * @returns {Boolean} True if pending
 */
waitlistSchema.methods.isPending = function() {
  return this.status === 'pending';
};

/**
 * Check if approved
 * @returns {Boolean} True if approved
 */
waitlistSchema.methods.isApproved = function() {
  return this.status === 'approved';
};

/**
 * Get entry summary
 * @returns {Object} Summary for display
 */
waitlistSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    status: this.status,
    priority: this.priority,
    createdAt: this.createdAt,
    isConverted: this.isConverted,
    daysWaiting: Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24))
  };
};

/**
 * Convert to JSON
 * @returns {Object} Safe JSON
 */
waitlistSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find pending entries
 * @returns {Promise<Array>} Pending entries
 */
waitlistSchema.statics.findPending = function() {
  return this.find({ status: 'pending' }).sort({ priority: -1, createdAt: 1 });
};

/**
 * Find approved entries
 * @returns {Promise<Array>} Approved entries
 */
waitlistSchema.statics.findApproved = function() {
  return this.find({ status: 'approved' }).sort({ createdAt: -1 });
};

/**
 * Find by email
 * @param {String} email - Email address
 * @returns {Promise<Object>} Entry or null
 */
waitlistSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

/**
 * Check if email already on waitlist
 * @param {String} email - Email address
 * @returns {Promise<Boolean>} True if on waitlist
 */
waitlistSchema.statics.isOnWaitlist = async function(email) {
  const entry = await this.findOne({ email: email.toLowerCase() });
  return !!entry;
};

/**
 * Count by status
 * @returns {Promise<Object>} Count per status
 */
waitlistSchema.statics.countByStatus = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

/**
 * Find waiting longest (FIFO queue)
 * @param {Number} limit - Number of entries
 * @returns {Promise<Array>} Oldest entries
 */
waitlistSchema.statics.findOldestPending = function(limit = 10) {
  return this.find({ status: 'pending' })
    .sort({ priority: -1, createdAt: 1 })
    .limit(limit);
};

/**
 * Find converted entries
 * @param {Number} days - Last N days
 * @returns {Promise<Array>} Converted entries
 */
waitlistSchema.statics.findConverted = function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    isConverted: true,
    convertedAt: { $gte: startDate }
  }).sort({ convertedAt: -1 });
};

/**
 * Count waiting users
 * @returns {Promise<Number>} Count
 */
waitlistSchema.statics.countPending = function() {
  return this.countDocuments({ status: 'pending' });
};

/**
 * Count converted
 * @returns {Promise<Number>} Count
 */
waitlistSchema.statics.countConverted = function() {
  return this.countDocuments({ isConverted: true });
};

/**
 * Get conversion stats
 * @returns {Promise<Object>} Conversion statistics
 */
waitlistSchema.statics.getConversionStats = async function() {
  const results = await this.aggregate([
    {
      $facet: {
        total: [{ $count: 'count' }],
        pending: [
          { $match: { status: 'pending' } },
          { $count: 'count' }
        ],
        approved: [
          { $match: { status: 'approved' } },
          { $count: 'count' }
        ],
        converted: [
          { $match: { isConverted: true } },
          { $count: 'count' }
        ]
      }
    }
  ]);

  return {
    total: results[0].total[0]?.count || 0,
    pending: results[0].pending[0]?.count || 0,
    approved: results[0].approved[0]?.count || 0,
    converted: results[0].converted[0]?.count || 0,
    conversionRate: results[0].converted[0]?.count / (results[0].total[0]?.count || 1)
  };
};

/**
 * Find entries needing reminder
 * @returns {Promise<Array>} Entries without recent reminders
 */
waitlistSchema.statics.findNeedingReminder = function() {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return this.find({
    status: 'approved',
    $or: [
      { reminderSentAt: null },
      { reminderSentAt: { $lt: weekAgo } }
    ]
  }).limit(50);
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('Waitlist', waitlistSchema);

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * How to use the Waitlist schema:
 * 
 * const Waitlist = require('./schemas/Waitlist');
 * 
 * // Add to waitlist
 * const entry = await Waitlist.create({
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   reason: 'Interested in spiritual practices'
 * });
 * 
 * // Check if already on waitlist
 * const onList = await Waitlist.isOnWaitlist('user@example.com');
 * 
 * // Approve entry
 * await entry.approve(adminId, 'Looks good');
 * 
 * // Mark converted
 * await entry.markConverted(userId);
 * 
 * // Get pending entries (FIFO)
 * const pending = await Waitlist.findOldestPending(10);
 * 
 * // Get stats
 * const stats = await Waitlist.getConversionStats();
 */
