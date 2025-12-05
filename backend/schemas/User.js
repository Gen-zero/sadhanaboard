/**
 * Schema: User
 * 
 * Purpose: Stores user account information for authentication and identification
 * 
 * Key Fields:
 *   - email: Unique user identifier for login
 *   - password: Hashed password for authentication
 *   - displayName: Public-facing name of the user
 *   - status: Account status (active, inactive, deleted, etc.)
 * 
 * Relationships:
 *   - One-to-one with Profile (user has one profile)
 *   - One-to-many with Sadhana (user has many practices)
 *   - One-to-many with SpiritualBook (user has many books)
 *   - Reference in many other collections
 * 
 * Indexes:
 *   - email: For login queries (unique)
 *   - status: For filtering active/inactive users
 *   - createdAt: For user discovery and filtering
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Authentication fields
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
      description: 'User email address (unique, used for login)'
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
      description: 'Hashed password (bcrypt)'
    },

    // Profile fields
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
      maxlength: [100, 'Display name cannot exceed 100 characters'],
      description: 'Public-facing display name'
    },

    firstName: {
      type: String,
      trim: true,
      maxlength: 50,
      default: null,
      description: 'First name (optional)'
    },

    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
      default: null,
      description: 'Last name (optional)'
    },

    // Account status
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'deleted'],
      default: 'active',
      index: true,
      description: 'Current account status'
    },

    // Account verification
    isEmailVerified: {
      type: Boolean,
      default: false,
      description: 'Whether email has been verified'
    },

    emailVerificationToken: {
      type: String,
      default: null,
      description: 'Token for email verification (temporary)'
    },

    emailVerificationTokenExpiry: {
      type: Date,
      default: null,
      description: 'When verification token expires'
    },

    // Password reset
    passwordResetToken: {
      type: String,
      default: null,
      description: 'Token for password reset (temporary)'
    },

    passwordResetTokenExpiry: {
      type: Date,
      default: null,
      description: 'When password reset token expires'
    },

    // Account preferences
    timezone: {
      type: String,
      default: 'UTC',
      description: 'User timezone for scheduling'
    },

    language: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de', 'hi', 'ja', 'zh'],
      description: 'Preferred language'
    },

    // Notification preferences
    notificationPreferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
        description: 'Receive email notifications'
      },
      weeklyDigest: {
        type: Boolean,
        default: true,
        description: 'Receive weekly digest'
      },
      communityUpdates: {
        type: Boolean,
        default: true,
        description: 'Receive community updates'
      },
      mentorshipUpdates: {
        type: Boolean,
        default: true,
        description: 'Receive mentorship notifications'
      }
    },

    // Account metadata
    lastLoginAt: {
      type: Date,
      default: null,
      description: 'When user last logged in'
    },

    loginCount: {
      type: Number,
      default: 0,
      description: 'Total number of logins'
    },

    // Privacy settings
    isPublicProfile: {
      type: Boolean,
      default: true,
      description: 'Whether profile is visible to other users'
    },

    // Account deletion
    deletedAt: {
      type: Date,
      default: null,
      description: 'When account was deleted (null if not deleted)'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When account was created'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When account was last updated'
    }
  },
  {
    timestamps: false, // Manually manage timestamps
    collection: 'users'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

// Email index (for login, unique)
userSchema.index({ email: 1 }, { unique: true, sparse: true });

// Status index (for filtering active/inactive users)
userSchema.index({ status: 1 });

// Verification token index (for finding users by token)
userSchema.index({ emailVerificationToken: 1 }, { sparse: true });

// Password reset token index
userSchema.index({ passwordResetToken: 1 }, { sparse: true });

// Created date index (for user discovery)
userSchema.index({ createdAt: -1 });

// Compound index for common queries
userSchema.index({ status: 1, createdAt: -1 });

// ============================================================================
// VALIDATIONS
// ============================================================================

// Pre-save validation and processing
userSchema.pre('save', async function(next) {
  try {
    // Only update updatedAt if not a new document
    if (!this.isNew) {
      this.updatedAt = new Date();
    }

    next();
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// MIDDLEWARE HOOKS
// ============================================================================

// Remove password and sensitive fields from response
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  
  // Remove sensitive fields
  delete obj.password;
  delete obj.passwordResetToken;
  delete obj.passwordResetTokenExpiry;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationTokenExpiry;
  delete obj.__v;
  
  return obj;
};

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Check if user account is active
 * @returns {Boolean} True if account is active
 */
userSchema.methods.isActive = function() {
  return this.status === 'active';
};

/**
 * Check if user email is verified
 * @returns {Boolean} True if email verified
 */
userSchema.methods.isVerified = function() {
  return this.isEmailVerified === true;
};

/**
 * Get user's full name
 * @returns {String} Full name (displayName or firstName+lastName)
 */
userSchema.methods.getFullName = function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.displayName;
};

/**
 * Update last login timestamp
 * @returns {Promise} Updated user document
 */
userSchema.methods.updateLastLogin = async function() {
  this.lastLoginAt = new Date();
  this.loginCount = (this.loginCount || 0) + 1;
  return this.save();
};

/**
 * Clear password reset token
 * @returns {Promise} Updated user document
 */
userSchema.methods.clearPasswordResetToken = async function() {
  this.passwordResetToken = null;
  this.passwordResetTokenExpiry = null;
  return this.save();
};

/**
 * Clear email verification token
 * @returns {Promise} Updated user document
 */
userSchema.methods.clearEmailVerificationToken = async function() {
  this.emailVerificationToken = null;
  this.emailVerificationTokenExpiry = null;
  this.isEmailVerified = true;
  return this.save();
};

/**
 * Check if password reset token is valid (not expired)
 * @returns {Boolean} True if token valid
 */
userSchema.methods.isPasswordResetTokenValid = function() {
  return (
    this.passwordResetToken &&
    this.passwordResetTokenExpiry &&
    this.passwordResetTokenExpiry > new Date()
  );
};

/**
 * Check if email verification token is valid (not expired)
 * @returns {Boolean} True if token valid
 */
userSchema.methods.isEmailVerificationTokenValid = function() {
  return (
    this.emailVerificationToken &&
    this.emailVerificationTokenExpiry &&
    this.emailVerificationTokenExpiry > new Date()
  );
};

/**
 * Soft delete user (mark as deleted, don't remove from DB)
 * @returns {Promise} Updated user document
 */
userSchema.methods.softDelete = async function() {
  this.status = 'deleted';
  this.deletedAt = new Date();
  return this.save();
};

/**
 * Get user statistics
 * @returns {Object} User statistics
 */
userSchema.methods.getStats = function() {
  return {
    userId: this._id,
    accountAge: Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)), // days
    loginCount: this.loginCount,
    lastLogin: this.lastLoginAt,
    isVerified: this.isEmailVerified,
    isPublic: this.isPublicProfile
  };
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find active users
 * @returns {Promise<Array>} Array of active user documents
 */
userSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

/**
 * Find verified users
 * @returns {Promise<Array>} Array of verified user documents
 */
userSchema.statics.findVerified = function() {
  return this.find({ isEmailVerified: true });
};

/**
 * Find by email
 * @param {String} email - User email
 * @returns {Promise<Object>} User document
 */
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

/**
 * Find by password reset token
 * @param {String} token - Password reset token
 * @returns {Promise<Object>} User document
 */
userSchema.statics.findByPasswordResetToken = function(token) {
  return this.findOne({
    passwordResetToken: token,
    passwordResetTokenExpiry: { $gt: new Date() }
  });
};

/**
 * Find by email verification token
 * @param {String} token - Email verification token
 * @returns {Promise<Object>} User document
 */
userSchema.statics.findByEmailVerificationToken = function(token) {
  return this.findOne({
    emailVerificationToken: token,
    emailVerificationTokenExpiry: { $gt: new Date() }
  });
};

/**
 * Count active users
 * @returns {Promise<Number>} Count of active users
 */
userSchema.statics.countActive = function() {
  return this.countDocuments({ status: 'active' });
};

/**
 * Find users created in last N days
 * @param {Number} days - Number of days
 * @returns {Promise<Array>} New user documents
 */
userSchema.statics.findNewUsers = function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    createdAt: { $gte: startDate },
    status: 'active'
  }).sort({ createdAt: -1 });
};

/**
 * Find users by public profile status
 * @param {Boolean} isPublic - Whether profile is public
 * @returns {Promise<Array>} User documents
 */
userSchema.statics.findByProfileVisibility = function(isPublic = true) {
  return this.find({ isPublicProfile: isPublic });
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('User', userSchema);

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * How to use the User schema:
 * 
 * const User = require('./schemas/User');
 * 
 * // Create new user
 * const user = await User.create({
 *   email: 'user@example.com',
 *   displayName: 'John Doe',
 *   password: 'hashedPasswordHere'
 * });
 * 
 * // Find user by email
 * const user = await User.findByEmail('user@example.com');
 * 
 * // Update last login
 * user.updateLastLogin();
 * 
 * // Check if user is active
 * if (user.isActive()) { ... }
 * 
 * // Get user stats
 * const stats = user.getStats();
 * 
 * // Find new users (last 7 days)
 * const newUsers = await User.findNewUsers(7);
 * 
 * // Count active users
 * const count = await User.countActive();
 * 
 * // Convert to JSON (removes sensitive fields)
 * const json = user.toJSON();
 */
