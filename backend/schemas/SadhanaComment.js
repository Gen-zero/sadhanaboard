/**
 * Schema: SadhanaComment
 * 
 * Purpose: Tracks comments on shared sadhanas with threading support
 * 
 * Key Fields:
 *   - sadhanaId: Reference to Sadhana being commented on
 *   - userId: User who commented
 *   - content: Comment text
 *   - parentCommentId: For threaded replies
 * 
 * Relationships:
 *   - Many-to-one with Sadhana
 *   - Many-to-one with User
 *   - Self-referencing for threading (parentCommentId)
 *   - Many-to-one with SharedSadhana (optional)
 * 
 * Indexes:
 *   - sadhanaId: For finding all comments
 *   - userId: For user's comments
 *   - parentCommentId: For finding replies
 */

const mongoose = require('mongoose');

const sadhanaCommentSchema = new mongoose.Schema(
  {
    // References
    sadhanaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sadhana',
      required: [true, 'Sadhana ID is required'],
      index: true,
      description: 'Reference to commented Sadhana'
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
      description: 'User who commented'
    },

    // Optional reference to shared version
    sharedSadhanaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SharedSadhana',
      default: null,
      description: 'Reference to SharedSadhana if commented on share'
    },

    // Comment content
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
      minlength: [1, 'Comment must not be empty'],
      description: 'The comment text'
    },

    // Threading support
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SadhanaComment',
      default: null,
      index: true,
      description: 'Parent comment (for threaded replies)'
    },

    // Mention support
    mentions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
      description: 'Users mentioned in comment'
    },

    // Comment status
    isDeleted: {
      type: Boolean,
      default: false,
      description: 'Whether comment is soft-deleted'
    },

    isEdited: {
      type: Boolean,
      default: false,
      description: 'Whether comment has been edited'
    },

    // Engagement metrics (cached)
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of likes'
    },

    replyCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of replies'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When comment was created'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When comment was last edited'
    },

    deletedAt: {
      type: Date,
      default: null,
      description: 'When comment was deleted (if deleted)'
    }
  },
  {
    timestamps: false,
    collection: 'sadhanacomments'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

// Find all comments for sadhana
sadhanaCommentSchema.index({ sadhanaId: 1 });

// Find user's comments
sadhanaCommentSchema.index({ userId: 1 });

// Find comment replies
sadhanaCommentSchema.index({ parentCommentId: 1 });

// Recent comments
sadhanaCommentSchema.index({ createdAt: -1 });

// Find comments by shared sadhana
sadhanaCommentSchema.index({ sharedSadhanaId: 1 });

// Compound indexes for common queries
sadhanaCommentSchema.index({ sadhanaId: 1, createdAt: -1 }); // Thread view
sadhanaCommentSchema.index({ parentCommentId: 1, createdAt: -1 }); // Replies
sadhanaCommentSchema.index({ sadhanaId: 1, isDeleted: 1 }); // Show only active

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

sadhanaCommentSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
    this.isEdited = true;
  }
  next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Edit comment
 * @param {String} newContent
 * @returns {Promise} Updated comment
 */
sadhanaCommentSchema.methods.edit = async function(newContent) {
  this.content = newContent;
  this.isEdited = true;
  this.updatedAt = new Date();
  await this.save();
  return this;
};

/**
 * Delete comment (soft delete)
 * @returns {Promise} Updated comment
 */
sadhanaCommentSchema.methods.delete = async function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.content = '[Comment deleted]';
  await this.save();
  return this;
};

/**
 * Restore deleted comment
 * @param {String} originalContent
 * @returns {Promise} Updated comment
 */
sadhanaCommentSchema.methods.restore = async function(originalContent) {
  this.isDeleted = false;
  this.deletedAt = null;
  this.content = originalContent;
  await this.save();
  return this;
};

/**
 * Add like
 * @returns {Promise} Updated comment
 */
sadhanaCommentSchema.methods.addLike = async function() {
  this.likeCount += 1;
  await this.save();
  return this;
};

/**
 * Remove like
 * @returns {Promise} Updated comment
 */
sadhanaCommentSchema.methods.removeLike = async function() {
  this.likeCount = Math.max(0, this.likeCount - 1);
  await this.save();
  return this;
};

/**
 * Add reply
 * @returns {Promise} Updated comment
 */
sadhanaCommentSchema.methods.addReply = async function() {
  this.replyCount += 1;
  await this.save();
  return this;
};

/**
 * Remove reply
 * @returns {Promise} Updated comment
 */
sadhanaCommentSchema.methods.removeReply = async function() {
  this.replyCount = Math.max(0, this.replyCount - 1);
  await this.save();
  return this;
};

/**
 * Add mention
 * @param {String} userId
 * @returns {Promise} Updated comment
 */
sadhanaCommentSchema.methods.addMention = async function(userId) {
  if (!this.mentions.includes(userId)) {
    this.mentions.push(userId);
    await this.save();
  }
  return this;
};

/**
 * Check if comment can be edited by user
 * @param {String} userId
 * @returns {Boolean}
 */
sadhanaCommentSchema.methods.canEdit = function(userId) {
  return this.userId.toString() === userId.toString();
};

/**
 * Check if comment can be deleted by user
 * @param {String} userId
 * @returns {Boolean}
 */
sadhanaCommentSchema.methods.canDelete = function(userId) {
  return this.userId.toString() === userId.toString();
};

/**
 * Is this a reply to another comment?
 * @returns {Boolean}
 */
sadhanaCommentSchema.methods.isReply = function() {
  return !!this.parentCommentId;
};

/**
 * Get comment summary
 * @returns {Object}
 */
sadhanaCommentSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    content: this.content,
    userId: this.userId,
    isEdited: this.isEdited,
    likes: this.likeCount,
    replies: this.replyCount,
    createdAt: this.createdAt
  };
};

/**
 * Convert to JSON
 * @returns {Object}
 */
sadhanaCommentSchema.methods.toJSON = function() {
  if (this.isDeleted) {
    return {
      _id: this._id,
      content: '[Comment deleted]',
      isDeleted: true,
      createdAt: this.createdAt
    };
  }

  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find all comments for sadhana
 * @param {String} sadhanaId
 * @returns {Promise<Array>}
 */
sadhanaCommentSchema.statics.findBySadhana = function(sadhanaId) {
  return this.find({ sadhanaId, isDeleted: false, parentCommentId: null })
    .populate('userId', 'displayName avatar')
    .sort({ createdAt: -1 });
};

/**
 * Find replies to comment
 * @param {String} commentId
 * @returns {Promise<Array>}
 */
sadhanaCommentSchema.statics.findReplies = function(commentId) {
  return this.find({ parentCommentId: commentId, isDeleted: false })
    .populate('userId', 'displayName avatar')
    .sort({ createdAt: 1 });
};

/**
 * Find user's comments
 * @param {String} userId
 * @returns {Promise<Array>}
 */
sadhanaCommentSchema.statics.findByUser = function(userId) {
  return this.find({ userId, isDeleted: false })
    .populate('sadhanaId', 'title')
    .sort({ createdAt: -1 });
};

/**
 * Count comments for sadhana
 * @param {String} sadhanaId
 * @returns {Promise<Number>}
 */
sadhanaCommentSchema.statics.countBySadhana = function(sadhanaId) {
  return this.countDocuments({ sadhanaId, isDeleted: false, parentCommentId: null });
};

/**
 * Count replies for comment
 * @param {String} commentId
 * @returns {Promise<Number>}
 */
sadhanaCommentSchema.statics.countReplies = function(commentId) {
  return this.countDocuments({ parentCommentId: commentId, isDeleted: false });
};

/**
 * Find recent comments
 * @param {Number} limit
 * @returns {Promise<Array>}
 */
sadhanaCommentSchema.statics.findRecent = function(limit = 20) {
  return this.find({ isDeleted: false, parentCommentId: null })
    .populate('userId', 'displayName avatar')
    .populate('sadhanaId', 'title')
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Find comments with mentions of user
 * @param {String} userId
 * @returns {Promise<Array>}
 */
sadhanaCommentSchema.statics.findMentioning = function(userId) {
  return this.find({ mentions: userId, isDeleted: false })
    .populate('userId', 'displayName avatar')
    .sort({ createdAt: -1 });
};

/**
 * Find comments on shared sadhana
 * @param {String} sharedSadhanaId
 * @returns {Promise<Array>}
 */
sadhanaCommentSchema.statics.findBySharedSadhana = function(sharedSadhanaId) {
  return this.find({ sharedSadhanaId, isDeleted: false, parentCommentId: null })
    .populate('userId', 'displayName avatar')
    .sort({ createdAt: -1 });
};

/**
 * Get conversation thread
 * @param {String} commentId
 * @returns {Promise<Array>}
 */
sadhanaCommentSchema.statics.getThread = async function(commentId) {
  const comment = await this.findById(commentId).populate('userId');
  const replies = await this.findReplies(commentId).populate('userId');
  
  return {
    comment,
    replies
  };
};

/**
 * Mark old deleted comments for cleanup
 * @param {Number} daysOld
 * @returns {Promise} Delete result
 */
sadhanaCommentSchema.statics.deleteOldDeleted = async function(daysOld = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return this.deleteMany({
    isDeleted: true,
    deletedAt: { $lt: cutoffDate }
  });
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('SadhanaComment', sadhanaCommentSchema);

