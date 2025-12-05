/**
 * Schema: SadhanaLike
 * 
 * Purpose: Tracks likes on shared sadhanas for engagement
 * 
 * Key Fields:
 *   - sadhanaId: Reference to Sadhana being liked
 *   - userId: User who liked
 *   - sharedSadhanaId: Reference to SharedSadhana (if liked via share)
 * 
 * Relationships:
 *   - Many-to-one with Sadhana
 *   - Many-to-one with User
 *   - Many-to-one with SharedSadhana (optional)
 * 
 * Indexes:
 *   - sadhanaId + userId: Unique constraint (can only like once)
 *   - sadhanaId: For finding all likes
 *   - userId: For finding user's likes
 */

const mongoose = require('mongoose');

const sadhanaLikeSchema = new mongoose.Schema(
  {
    // References
    sadhanaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sadhana',
      required: [true, 'Sadhana ID is required'],
      index: true,
      description: 'Reference to liked Sadhana'
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
      description: 'User who liked'
    },

    // Optional reference to shared version
    sharedSadhanaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SharedSadhana',
      default: null,
      description: 'Reference to SharedSadhana if liked via share'
    },

    // Type of like
    likeType: {
      type: String,
      enum: ['like', 'love', 'inspiring', 'helpful'],
      default: 'like',
      description: 'Type/reaction of like'
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
    collection: 'sadhanalikers'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

// Unique constraint: can only like once per sadhana
sadhanaLikeSchema.index({ sadhanaId: 1, userId: 1 }, { unique: true });

// Finding all likes for sadhana
sadhanaLikeSchema.index({ sadhanaId: 1 });

// Finding user's likes
sadhanaLikeSchema.index({ userId: 1 });

// Recent likes
sadhanaLikeSchema.index({ createdAt: -1 });

// For shared sadhana engagement
sadhanaLikeSchema.index({ sharedSadhanaId: 1 });

// Compound indexes
sadhanaLikeSchema.index({ sadhanaId: 1, createdAt: -1 });

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

// Ensure can't like own sadhana (pre-save check needed in service)

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Change like type
 * @param {String} newType
 * @returns {Promise} Updated like
 */
sadhanaLikeSchema.methods.changeLikeType = async function(newType) {
  this.likeType = newType;
  await this.save();
  return this;
};

/**
 * Get summary
 * @returns {Object}
 */
sadhanaLikeSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    sadhanaId: this.sadhanaId,
    userId: this.userId,
    likeType: this.likeType,
    createdAt: this.createdAt
  };
};

/**
 * Convert to JSON
 * @returns {Object}
 */
sadhanaLikeSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find all likes for sadhana
 * @param {String} sadhanaId
 * @returns {Promise<Array>}
 */
sadhanaLikeSchema.statics.findBySadhana = function(sadhanaId) {
  return this.find({ sadhanaId })
    .populate('userId', 'displayName avatar')
    .sort({ createdAt: -1 });
};

/**
 * Check if user liked sadhana
 * @param {String} sadhanaId
 * @param {String} userId
 * @returns {Promise<Object>}
 */
sadhanaLikeSchema.statics.findByUsers = function(sadhanaId, userId) {
  return this.findOne({ sadhanaId, userId });
};

/**
 * Count likes for sadhana
 * @param {String} sadhanaId
 * @returns {Promise<Number>}
 */
sadhanaLikeSchema.statics.countBySadhana = function(sadhanaId) {
  return this.countDocuments({ sadhanaId });
};

/**
 * Count likes by type
 * @param {String} sadhanaId
 * @returns {Promise<Object>}
 */
sadhanaLikeSchema.statics.countByType = async function(sadhanaId) {
  const result = await this.aggregate([
    { $match: { sadhanaId: mongoose.Types.ObjectId(sadhanaId) } },
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
sadhanaLikeSchema.statics.findByUser = function(userId) {
  return this.find({ userId })
    .populate('sadhanaId', 'title')
    .sort({ createdAt: -1 });
};

/**
 * Find recent likes
 * @param {Number} limit
 * @returns {Promise<Array>}
 */
sadhanaLikeSchema.statics.findRecent = function(limit = 20) {
  return this.find()
    .populate('sadhanaId', 'title')
    .populate('userId', 'displayName avatar')
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Get likers for sadhana
 * @param {String} sadhanaId
 * @returns {Promise<Array>}
 */
sadhanaLikeSchema.statics.getLikers = function(sadhanaId) {
  return this.find({ sadhanaId })
    .populate('userId', 'displayName avatar')
    .select('userId likeType createdAt')
    .sort({ createdAt: -1 });
};

/**
 * Check if user liked any in list
 * @param {String} userId
 * @param {Array} sadhanaIds
 * @returns {Promise<Object>}
 */
sadhanaLikeSchema.statics.getUserLikesForList = async function(userId, sadhanaIds) {
  const likes = await this.find({
    userId,
    sadhanaId: { $in: sadhanaIds }
  });

  return likes.reduce((acc, like) => {
    acc[like.sadhanaId.toString()] = like._id;
    return acc;
  }, {});
};

/**
 * Find likes on shared sadhana
 * @param {String} sharedSadhanaId
 * @returns {Promise<Array>}
 */
sadhanaLikeSchema.statics.findBySharedSadhana = function(sharedSadhanaId) {
  return this.find({ sharedSadhanaId })
    .populate('userId', 'displayName avatar')
    .sort({ createdAt: -1 });
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('SadhanaLike', sadhanaLikeSchema);
