/**
 * Schema: Group
 * 
 * Purpose: Stores user communities/groups for spiritual practice
 * 
 * Key Fields:
 *   - creatorId: User who created the group
 *   - name: Group name
 *   - description: Group description
 *   - privacyLevel: open, closed, secret
 *   - joinType: open (anyone), approval (needs approval), invite (invite only)
 * 
 * Relationships:
 *   - Many-to-one with User (creator)
 *   - One-to-many with GroupMember
 * 
 * Indexes:
 *   - creatorId: For user's groups
 *   - isPublic: For public discovery
 *   - createdAt: For chronological ordering
 */

const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    // Creator
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required'],
      index: true,
      description: 'User who created this group'
    },

    // Basic information
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
      index: true,
      description: 'Group name'
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: null,
      description: 'Group description and purpose'
    },

    // Images
    profileImage: {
      type: String,
      trim: true,
      default: null,
      description: 'Group profile image URL'
    },

    coverImage: {
      type: String,
      trim: true,
      default: null,
      description: 'Group cover image URL'
    },

    // Categorization
    category: {
      type: String,
      enum: ['meditation', 'yoga', 'study', 'discussion', 'practice', 'prayer', 'community', 'support', 'other'],
      default: 'community',
      index: true,
      description: 'Group category'
    },

    traditions: {
      type: [String],
      default: [],
      description: 'Spiritual traditions'
    },

    tags: {
      type: [String],
      default: [],
      description: 'Searchable tags'
    },

    // Visibility and privacy
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
      description: 'Whether group is publicly listed'
    },

    privacyLevel: {
      type: String,
      enum: ['open', 'closed', 'secret'],
      default: 'open',
      index: true,
      description: 'Privacy level (open=anyone can view, closed=members only, secret=invite only)'
    },

    joinType: {
      type: String,
      enum: ['open', 'approval', 'invite'],
      default: 'open',
      description: 'How new members can join'
    },

    // Settings
    rules: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
      description: 'Group rules and guidelines'
    },

    moderators: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
      description: 'Moderator user IDs'
    },

    allowComments: {
      type: Boolean,
      default: true,
      description: 'Whether members can comment'
    },

    allowSelfPromotion: {
      type: Boolean,
      default: false,
      description: 'Whether self-promotion is allowed'
    },

    // Metrics (cached)
    memberCount: {
      type: Number,
      default: 1,
      min: 1,
      description: 'Current member count'
    },

    postCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Total posts count'
    },

    viewCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Total view count'
    },

    joinRequestCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Pending join requests'
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
      description: 'When group was created'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When group was last updated'
    }
  },
  {
    timestamps: false,
    collection: 'groups'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

groupSchema.index({ creatorId: 1 });
groupSchema.index({ isPublic: 1 });
groupSchema.index({ privacyLevel: 1 });
groupSchema.index({ category: 1 });
groupSchema.index({ createdAt: -1 });
groupSchema.index({ lastActivityAt: -1 });

// Compound indexes
groupSchema.index({ isPublic: 1, createdAt: -1 });
groupSchema.index({ category: 1, isPublic: 1 });
groupSchema.index({ traditions: 1 });

// Text search
groupSchema.index({ name: 'text', description: 'text' });

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

groupSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Add moderator
 * @param {String} userId
 * @returns {Promise} Updated group
 */
groupSchema.methods.addModerator = async function(userId) {
  if (!this.moderators.includes(userId)) {
    this.moderators.push(userId);
    await this.save();
  }
  return this;
};

/**
 * Remove moderator
 * @param {String} userId
 * @returns {Promise} Updated group
 */
groupSchema.methods.removeModerator = async function(userId) {
  this.moderators = this.moderators.filter(id => id.toString() !== userId.toString());
  await this.save();
  return this;
};

/**
 * Make group public
 * @returns {Promise} Updated group
 */
groupSchema.methods.makePublic = async function() {
  this.isPublic = true;
  await this.save();
  return this;
};

/**
 * Make group private
 * @returns {Promise} Updated group
 */
groupSchema.methods.makePrivate = async function() {
  this.isPublic = false;
  await this.save();
  return this;
};

/**
 * Update settings
 * @param {Object} settings
 * @returns {Promise} Updated group
 */
groupSchema.methods.updateSettings = async function(settings) {
  if (settings.rules !== undefined) this.rules = settings.rules;
  if (settings.joinType !== undefined) this.joinType = settings.joinType;
  if (settings.allowComments !== undefined) this.allowComments = settings.allowComments;
  if (settings.allowSelfPromotion !== undefined) this.allowSelfPromotion = settings.allowSelfPromotion;
  this.lastActivityAt = new Date();
  await this.save();
  return this;
};

/**
 * Get engagement summary
 * @returns {Object}
 */
groupSchema.methods.getEngagement = function() {
  return {
    members: this.memberCount,
    posts: this.postCount,
    views: this.viewCount,
    joinRequests: this.joinRequestCount
  };
};

/**
 * Get group summary
 * @returns {Object}
 */
groupSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    name: this.name,
    creatorId: this.creatorId,
    category: this.category,
    members: this.memberCount,
    privacyLevel: this.privacyLevel,
    isPublic: this.isPublic,
    createdAt: this.createdAt
  };
};

/**
 * Convert to JSON
 * @returns {Object}
 */
groupSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find groups by creator
 * @param {String} creatorId
 * @returns {Promise<Array>}
 */
groupSchema.statics.findByCreator = function(creatorId) {
  return this.find({ creatorId }).sort({ createdAt: -1 });
};

/**
 * Find public groups
 * @returns {Promise<Array>}
 */
groupSchema.statics.findPublic = function() {
  return this.find({ isPublic: true }).sort({ createdAt: -1 });
};

/**
 * Find trending groups
 * @returns {Promise<Array>}
 */
groupSchema.statics.findTrending = function() {
  return this.find({ isPublic: true })
    .sort({ memberCount: -1, viewCount: -1 })
    .limit(20);
};

/**
 * Search groups
 * @param {String} query
 * @returns {Promise<Array>}
 */
groupSchema.statics.search = function(query) {
  return this.find(
    { $text: { $search: query }, isPublic: true },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

/**
 * Find by category
 * @param {String} category
 * @returns {Promise<Array>}
 */
groupSchema.statics.findByCategory = function(category) {
  return this.find({ category, isPublic: true }).sort({ createdAt: -1 });
};

/**
 * Count groups by creator
 * @param {String} creatorId
 * @returns {Promise<Number>}
 */
groupSchema.statics.countByCreator = function(creatorId) {
  return this.countDocuments({ creatorId });
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('Group', groupSchema);
