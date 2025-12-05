/**
 * Schema: SharedSadhana
 * 
 * Purpose: Tracks shared sadhana instances and metadata for community sharing
 * 
 * Key Fields:
 *   - sadhanaId: Reference to original Sadhana
 *   - userId: User who is sharing this sadhana
 *   - privacyLevel: Who can view
 *   - isActive: Whether currently shared
 * 
 * Relationships:
 *   - Many-to-one with Sadhana
 *   - Many-to-one with User
 * 
 * Indexes:
 *   - sadhanaId: For finding shared versions
 *   - userId: For finding user's shared sadhanas
 *   - createdAt: For chronological sorting
 */

const mongoose = require('mongoose');

const sharedSadhanaSchema = new mongoose.Schema(
  {
    // References
    sadhanaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sadhana',
      required: [true, 'Sadhana ID is required'],
      index: true,
      description: 'Reference to original Sadhana'
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
      description: 'User sharing this sadhana'
    },

    // Sharing details
    privacyLevel: {
      type: String,
      enum: ['private', 'friends', 'community', 'public'],
      default: 'community',
      index: true,
      description: 'Who can view this shared sadhana'
    },

    caption: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
      description: 'Sharing caption/message'
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
      description: 'Whether currently shared'
    },

    // Metrics
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of views'
    },

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

    shareCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of times shared further'
    },

    // Engagement tracking
    lastViewedAt: {
      type: Date,
      default: null,
      description: 'When last viewed'
    },

    lastEngagementAt: {
      type: Date,
      default: null,
      description: 'When last liked/commented'
    },

    // Sharing scope
    sharedWith: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
      description: 'Users this was explicitly shared with (friends only)'
    },

    // Settings
    allowComments: {
      type: Boolean,
      default: true,
      description: 'Whether others can comment'
    },

    allowSharing: {
      type: Boolean,
      default: true,
      description: 'Whether others can reshare'
    },

    // Tags for sharing
    tags: {
      type: [String],
      default: [],
      description: 'Tags for discoverability'
    },

    // Featured status
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
      description: 'Whether featured in community'
    },

    featuredAt: {
      type: Date,
      default: null,
      description: 'When featured'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When shared'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When last updated'
    },

    unsharedAt: {
      type: Date,
      default: null,
      description: 'When unshared (if unshared)'
    }
  },
  {
    timestamps: false,
    collection: 'sharedsadhanas'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

sharedSadhanaSchema.index({ sadhanaId: 1 });
sharedSadhanaSchema.index({ userId: 1 });
sharedSadhanaSchema.index({ privacyLevel: 1 });
sharedSadhanaSchema.index({ isActive: 1 });
sharedSadhanaSchema.index({ isFeatured: 1 });
sharedSadhanaSchema.index({ createdAt: -1 });

// Compound indexes for common queries
sharedSadhanaSchema.index({ privacyLevel: 1, isActive: 1, createdAt: -1 }); // For feed
sharedSadhanaSchema.index({ userId: 1, isActive: 1 }); // User's shares
sharedSadhanaSchema.index({ isFeatured: 1, createdAt: -1 }); // Featured feed

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

sharedSadhanaSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Unshare this sadhana
 * @returns {Promise} Updated record
 */
sharedSadhanaSchema.methods.unshare = async function() {
  this.isActive = false;
  this.unsharedAt = new Date();
  await this.save();
  return this;
};

/**
 * Reshare this sadhana
 * @returns {Promise} Updated record
 */
sharedSadhanaSchema.methods.reshare = async function() {
  this.isActive = true;
  this.unsharedAt = null;
  await this.save();
  return this;
};

/**
 * Increment view count
 * @returns {Promise} Updated record
 */
sharedSadhanaSchema.methods.recordView = async function() {
  this.viewCount += 1;
  this.lastViewedAt = new Date();
  await this.save();
  return this;
};

/**
 * Increment like count
 * @returns {Promise} Updated record
 */
sharedSadhanaSchema.methods.recordLike = async function() {
  this.likeCount += 1;
  this.lastEngagementAt = new Date();
  await this.save();
  return this;
};

/**
 * Decrement like count
 * @returns {Promise} Updated record
 */
sharedSadhanaSchema.methods.undoLike = async function() {
  this.likeCount = Math.max(0, this.likeCount - 1);
  await this.save();
  return this;
};

/**
 * Increment comment count
 * @returns {Promise} Updated record
 */
sharedSadhanaSchema.methods.recordComment = async function() {
  this.commentCount += 1;
  this.lastEngagementAt = new Date();
  await this.save();
  return this;
};

/**
 * Decrement comment count
 * @returns {Promise} Updated record
 */
sharedSadhanaSchema.methods.undoComment = async function() {
  this.commentCount = Math.max(0, this.commentCount - 1);
  await this.save();
  return this;
};

/**
 * Increment share count
 * @returns {Promise} Updated record
 */
sharedSadhanaSchema.methods.recordShare = async function() {
  this.shareCount += 1;
  this.lastEngagementAt = new Date();
  await this.save();
  return this;
};

/**
 * Feature this sadhana
 * @returns {Promise} Updated record
 */
sharedSadhanaSchema.methods.feature = async function() {
  this.isFeatured = true;
  this.featuredAt = new Date();
  await this.save();
  return this;
};

/**
 * Unfeature this sadhana
 * @returns {Promise} Updated record
 */
sharedSadhanaSchema.methods.unfeature = async function() {
  this.isFeatured = false;
  this.featuredAt = null;
  await this.save();
  return this;
};

/**
 * Share explicitly with user
 * @param {String} userId
 * @returns {Promise} Updated record
 */
sharedSadhanaSchema.methods.shareWith = async function(userId) {
  if (!this.sharedWith.includes(userId)) {
    this.sharedWith.push(userId);
    await this.save();
  }
  return this;
};

/**
 * Unshare with user
 * @param {String} userId
 * @returns {Promise} Updated record
 */
sharedSadhanaSchema.methods.unshareWith = async function(userId) {
  this.sharedWith = this.sharedWith.filter(id => id.toString() !== userId.toString());
  await this.save();
  return this;
};

/**
 * Get engagement summary
 * @returns {Object}
 */
sharedSadhanaSchema.methods.getEngagement = function() {
  return {
    views: this.viewCount,
    likes: this.likeCount,
    comments: this.commentCount,
    shares: this.shareCount,
    total: this.viewCount + this.likeCount + this.commentCount + this.shareCount
  };
};

/**
 * Check if can be edited by user
 * @param {String} userId
 * @returns {Boolean}
 */
sharedSadhanaSchema.methods.canEdit = function(userId) {
  return this.userId.toString() === userId.toString();
};

/**
 * Get sharing summary
 * @returns {Object}
 */
sharedSadhanaSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    sadhanaId: this.sadhanaId,
    userId: this.userId,
    privacyLevel: this.privacyLevel,
    caption: this.caption,
    engagement: this.getEngagement(),
    isFeatured: this.isFeatured,
    createdAt: this.createdAt
  };
};

/**
 * Convert to JSON
 * @returns {Object}
 */
sharedSadhanaSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find shared by user
 * @param {String} userId
 * @returns {Promise<Array>}
 */
sharedSadhanaSchema.statics.findByUser = function(userId) {
  return this.find({ userId, isActive: true }).sort({ createdAt: -1 });
};

/**
 * Find for community feed
 * @returns {Promise<Array>}
 */
sharedSadhanaSchema.statics.findCommunityFeed = function() {
  return this.find({
    privacyLevel: { $in: ['community', 'public'] },
    isActive: true
  })
    .populate('userId')
    .sort({ createdAt: -1 })
    .limit(50);
};

/**
 * Find featured sadhanas
 * @returns {Promise<Array>}
 */
sharedSadhanaSchema.statics.findFeatured = function() {
  return this.find({
    isFeatured: true,
    isActive: true,
    privacyLevel: { $in: ['community', 'public'] }
  })
    .sort({ featuredAt: -1 })
    .limit(10);
};

/**
 * Find trending sadhanas
 * @param {Number} days
 * @returns {Promise<Array>}
 */
sharedSadhanaSchema.statics.findTrending = function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    isActive: true,
    privacyLevel: { $in: ['community', 'public'] },
    lastEngagementAt: { $gte: startDate }
  })
    .sort({ likeCount: -1, commentCount: -1, viewCount: -1 })
    .limit(20);
};

/**
 * Find by privacy level
 * @param {String} privacyLevel
 * @returns {Promise<Array>}
 */
sharedSadhanaSchema.statics.findByPrivacy = function(privacyLevel) {
  return this.find({ privacyLevel, isActive: true }).sort({ createdAt: -1 });
};

/**
 * Count shares by user
 * @param {String} userId
 * @returns {Promise<Number>}
 */
sharedSadhanaSchema.statics.countByUser = function(userId) {
  return this.countDocuments({ userId, isActive: true });
};

/**
 * Find shared with specific user
 * @param {String} userId
 * @returns {Promise<Array>}
 */
sharedSadhanaSchema.statics.findSharedWithUser = function(userId) {
  return this.find({
    sharedWith: userId,
    isActive: true
  }).sort({ createdAt: -1 });
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('SharedSadhana', sharedSadhanaSchema);
