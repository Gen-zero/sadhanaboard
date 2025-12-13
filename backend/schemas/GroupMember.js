/**
 * Schema: GroupMember
 * 
 * Purpose: Tracks group membership with roles and permissions
 * 
 * Key Fields:
 *   - groupId: Reference to Group
 *   - userId: Reference to User
 *   - role: creator, moderator, member
 *   - status: active, inactive, banned, left
 * 
 * Relationships:
 *   - Many-to-one with Group
 *   - Many-to-one with User
 */

const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema(
  {
    // References
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: [true, 'Group ID is required'],
      index: true,
      description: 'Reference to Group'
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
      description: 'Reference to User'
    },

    // Role-based access
    role: {
      type: String,
      enum: ['creator', 'moderator', 'member'],
      default: 'member',
      index: true,
      description: 'Member role in group'
    },

    // Status
    status: {
      type: String,
      enum: ['active', 'inactive', 'banned', 'left'],
      default: 'active',
      index: true,
      description: 'Membership status'
    },

    // Permissions (role-based)
    permissions: {
      type: [String],
      default: [],
      enum: ['post', 'comment', 'delete_own', 'delete_others', 'pin_post', 'manage_members', 'edit_group'],
      description: 'Specific permissions'
    },

    // Group-specific info
    nickname: {
      type: String,
      trim: true,
      maxlength: 50,
      default: null,
      description: 'User nickname in group'
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
      description: 'User bio specific to group'
    },

    // Activity tracking
    postCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of posts by member'
    },

    commentCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of comments by member'
    },

    reactionCount: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Number of reactions by member'
    },

    // Timeline
    joinedAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When member joined'
    },

    leftAt: {
      type: Date,
      default: null,
      description: 'When member left (if applicable)'
    },

    bannedAt: {
      type: Date,
      default: null,
      description: 'When member was banned'
    },

    banReason: {
      type: String,
      trim: true,
      default: null,
      description: 'Reason for ban'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },

    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false,
    collection: 'groupmembers'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

// Unique: one membership per user per group
groupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

// Find group members

// Find user's groups

// Status queries
groupMemberSchema.index({ groupId: 1, status: 1 });

// Moderator queries
groupMemberSchema.index({ groupId: 1, role: 1 });

// Joined date
groupMemberSchema.index({ joinedAt: -1 });

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

groupMemberSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Promote to moderator
 * @returns {Promise} Updated member
 */
groupMemberSchema.methods.promoteToModerator = async function() {
  this.role = 'moderator';
  this.permissions = ['post', 'comment', 'delete_own', 'delete_others', 'pin_post', 'manage_members'];
  await this.save();
  return this;
};

/**
 * Demote to member
 * @returns {Promise} Updated member
 */
groupMemberSchema.methods.demoteToMember = async function() {
  this.role = 'member';
  this.permissions = ['post', 'comment', 'delete_own'];
  await this.save();
  return this;
};

/**
 * Ban member
 * @param {String} reason
 * @returns {Promise} Updated member
 */
groupMemberSchema.methods.ban = async function(reason = null) {
  this.status = 'banned';
  this.bannedAt = new Date();
  if (reason) {
    this.banReason = reason;
  }
  await this.save();
  return this;
};

/**
 * Unban member
 * @returns {Promise} Updated member
 */
groupMemberSchema.methods.unban = async function() {
  this.status = 'active';
  this.bannedAt = null;
  this.banReason = null;
  await this.save();
  return this;
};

/**
 * Leave group
 * @returns {Promise} Updated member
 */
groupMemberSchema.methods.leave = async function() {
  this.status = 'left';
  this.leftAt = new Date();
  await this.save();
  return this;
};

/**
 * Update permissions
 * @param {Array} permissions
 * @returns {Promise} Updated member
 */
groupMemberSchema.methods.updatePermissions = async function(permissions) {
  this.permissions = permissions;
  await this.save();
  return this;
};

/**
 * Check if has permission
 * @param {String} permission
 * @returns {Boolean}
 */
groupMemberSchema.methods.hasPermission = function(permission) {
  if (this.role === 'creator') return true;
  if (this.role === 'moderator') return ['post', 'comment', 'delete_own', 'delete_others', 'pin_post', 'manage_members'].includes(permission);
  return this.permissions.includes(permission);
};

/**
 * Get member summary
 * @returns {Object}
 */
groupMemberSchema.methods.getSummary = function() {
  return {
    userId: this.userId,
    nickname: this.nickname,
    role: this.role,
    posts: this.postCount,
    joinedAt: this.joinedAt
  };
};

/**
 * Convert to JSON
 * @returns {Object}
 */
groupMemberSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find member in group
 * @param {String} groupId
 * @param {String} userId
 * @returns {Promise<Object>}
 */
groupMemberSchema.statics.findByGroupAndUser = function(groupId, userId) {
  return this.findOne({ groupId, userId }).populate('userId');
};

/**
 * Find all group members
 * @param {String} groupId
 * @returns {Promise<Array>}
 */
groupMemberSchema.statics.findByGroup = function(groupId) {
  return this.find({ groupId, status: 'active' })
    .populate('userId', 'displayName avatar')
    .sort({ joinedAt: -1 });
};

/**
 * Find user's groups
 * @param {String} userId
 * @returns {Promise<Array>}
 */
groupMemberSchema.statics.findByUser = function(userId) {
  return this.find({ userId, status: 'active' })
    .populate('groupId', 'name profileImage')
    .sort({ joinedAt: -1 });
};

/**
 * Find moderators in group
 * @param {String} groupId
 * @returns {Promise<Array>}
 */
groupMemberSchema.statics.findModerators = function(groupId) {
  return this.find({ groupId, role: { $in: ['creator', 'moderator'] } })
    .populate('userId', 'displayName email');
};

/**
 * Count group members
 * @param {String} groupId
 * @returns {Promise<Number>}
 */
groupMemberSchema.statics.countMembers = function(groupId) {
  return this.countDocuments({ groupId, status: 'active' });
};

/**
 * Find active members
 * @param {String} groupId
 * @returns {Promise<Array>}
 */
groupMemberSchema.statics.findActiveMembers = function(groupId) {
  return this.find({ groupId, status: 'active' }).populate('userId', 'displayName avatar');
};

/**
 * Find most active members
 * @param {String} groupId
 * @param {Number} limit
 * @returns {Promise<Array>}
 */
groupMemberSchema.statics.findMostActive = function(groupId, limit = 10) {
  return this.find({ groupId, status: 'active' })
    .sort({ postCount: -1, commentCount: -1 })
    .limit(limit)
    .populate('userId', 'displayName avatar');
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('GroupMember', groupMemberSchema);
