/**
 * Schema: SharedSadhanaLike
 * 
 * Purpose: Tracks likes on shared sadhanas for engagement
 * 
 * Key Fields:
 *   - sharedSadhanaId: Reference to SharedSadhana
 *   - userId: User who liked
 *   - likeType: Type of like/reaction
 * 
 * Relationships:
 *   - Many-to-one with SharedSadhana
 *   - Many-to-one with User
 * 
 * Indexes:
 *   - sharedSadhanaId + userId: Unique constraint
 *   - sharedSadhanaId: For finding all likes
 *   - userId: For finding user's likes
 */

const mongoose = require('mongoose');

const sharedSadhanaLikeSchema = new mongoose.Schema(
  {
    // References
    sharedSadhanaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SharedSadhana',
      required: [true, 'SharedSadhana ID is required'],
      index: true,
      description: 'Reference to SharedSadhana'
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
      description: 'User who liked'
    },

    // Like type/reaction
    likeType: {
      type: String,
      enum: ['like', 'love', 'inspiring', 'helpful'],
      default: 'like',
      description: 'Type of like/reaction'
    },

    // Timestamp
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When like was created'
    }
  },
  {
    timestamps: false,
    collection: 'sharedsadhanalikes'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

// Unique constraint: can only like once
sharedSadhanaLikeSchema.index({ sharedSadhanaId: 1, userId: 1 }, { unique: true });

// Finding all likes for shared sadhana
sharedSadhanaLikeSchema.index({ sharedSadhanaId: 1 });

// Finding user's likes
sharedSadhanaLikeSchema.index({ userId: 1 });

// Recent likes
sharedSadhanaLikeSchema.index({ createdAt: -1 });

// Compound indexes
sharedSadhanaLikeSchema.index({ sharedSadhanaId: 1, createdAt: -1 });

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Change like type
 * @param {String} newType
 * @returns {Promise} Updated like
 */
sharedSadhanaLikeSchema.methods.changeLikeType = async function(newType) {
  const validTypes = ['like', 'love', 'inspiring', 'helpful'];
  if (!validTypes.includes(newType)) {
    throw new Error('Invalid like type');
  }
  this.likeType = newType;
  await this.save();
  return this;
};

/**
 * Get like summary
 * @returns {Object}
 */
sharedSadhanaLikeSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    sharedSadhanaId: this.sharedSadhanaId,
    userId: this.userId,
    likeType: this.likeType,
    createdAt: this.createdAt
  };
};

/**
 * Convert to JSON
 * @returns {Object}
 */
sharedSadhanaLikeSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find all likes for shared sadhana
 * @param {String} sharedSadhanaId
 * @returns {Promise<Array>}
 */
sharedSadhanaLikeSchema.statics.findBySharedSadhana = function(sharedSadhanaId) {
  return this.find({ sharedSadhanaId })
    .populate('userId', 'displayName avatar')
    .sort({ createdAt: -1 });
};

/**
 * Check if user liked shared sadhana
 * @param {String} sharedSadhanaId
 * @param {String} userId
 * @returns {Promise<Object>}
 */
sharedSadhanaLikeSchema.statics.findByUsers = function(sharedSadhanaId, userId) {
  return this.findOne({ sharedSadhanaId, userId });
};

/**
 * Count likes for shared sadhana
 * @param {String} sharedSadhanaId
 * @returns {Promise<Number>}
 */
sharedSadhanaLikeSchema.statics.countBySharedSadhana = function(sharedSadhanaId) {
  return this.countDocuments({ sharedSadhanaId });
};

/**
 * Count likes by type
 * @param {String} sharedSadhanaId
 * @returns {Promise<Object>}
 */
sharedSadhanaLikeSchema.statics.countByType = async function(sharedSadhanaId) {
  const result = await this.aggregate([
    { $match: { sharedSadhanaId: mongoose.Types.ObjectId(sharedSadhanaId) } },
    { $group: { _id: '$likeType', count: { $sum: 1 } } }
  ]);

  return result.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});
};

/**
 * Find user's likes
 * @param {String} userId
 * @returns {Promise<Array>}
 */
sharedSadhanaLikeSchema.statics.findByUser = function(userId) {
  return this.find({ userId })
    .populate('sharedSadhanaId')
    .sort({ createdAt: -1 });
};

/**
 * Find recent likes
 * @param {Number} limit
 * @returns {Promise<Array>}
 */
sharedSadhanaLikeSchema.statics.findRecent = function(limit = 20) {
  return this.find()
    .populate('sharedSadhanaId', 'title')
    .populate('userId', 'displayName avatar')
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Get likers for shared sadhana
 * @param {String} sharedSadhanaId
 * @returns {Promise<Array>}
 */
sharedSadhanaLikeSchema.statics.getLikers = function(sharedSadhanaId) {
  return this.find({ sharedSadhanaId })
    .populate('userId', 'displayName avatar')
    .select('userId likeType createdAt')
    .sort({ createdAt: -1 });
};

/**
 * Check if user liked any in list
 * @param {String} userId
 * @param {Array} sharedSadhanaIds
 * @returns {Promise<Object>}
 */
sharedSadhanaLikeSchema.statics.getUserLikesForList = async function(userId, sharedSadhanaIds) {
  const likes = await this.find({
    userId,
    sharedSadhanaId: { $in: sharedSadhanaIds }
  });

  return likes.reduce((acc, like) => {
    acc[like.sharedSadhanaId.toString()] = like._id;
    return acc;
  }, {});
};

/**
 * Get engagement breakdown for shared sadhana
 * @param {String} sharedSadhanaId
 * @returns {Promise<Object>}
 */
sharedSadhanaLikeSchema.statics.getEngagementBreakdown = async function(sharedSadhanaId) {
  const byType = await this.countByType(sharedSadhanaId);
  const total = await this.countBySharedSadhana(sharedSadhanaId);

  return {
    total,
    byType,
    breakdown: {
      like: byType.like || 0,
      love: byType.love || 0,
      inspiring: byType.inspiring || 0,
      helpful: byType.helpful || 0
    }
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('SharedSadhanaLike', sharedSadhanaLikeSchema);
