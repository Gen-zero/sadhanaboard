/**
 * Schema: AdminUser
 * 
 * Purpose: Stores admin/staff user accounts with role-based access control
 * 
 * Key Fields:
 *   - email: Admin email (unique)
 *   - password: Hashed admin password
 *   - role: Admin role with specific permissions
 *   - permissions: Specific permissions granted
 *   - isActive: Whether admin account is active
 * 
 * Relationships:
 *   - One-to-many with AdminSession (admin has multiple sessions)
 *   - One-to-many with AuditLog (admin generates audit logs)
 * 
 * Indexes:
 *   - email: For login (unique)
 *   - role: For filtering admins by role
 *   - isActive: For finding active admins
 */

const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema(
  {
    // Authentication fields
    email: {
      type: String,
      required: [true, 'Admin email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email address'
      ],
      index: true,
      description: 'Admin email address (unique, used for login)'
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password in queries by default
      description: 'Hashed password (bcrypt)'
    },

    // Admin information
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
      maxlength: 100,
      description: 'Admin display name'
    },

    firstName: {
      type: String,
      trim: true,
      maxlength: 50,
      default: null,
      description: 'First name'
    },

    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
      default: null,
      description: 'Last name'
    },

    // Role-based access control
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'moderator', 'support'],
      required: [true, 'Admin role is required'],
      index: true,
      default: 'moderator',
      description: 'Admin role (superadmin, admin, moderator, support)'
    },

    // Specific permissions (for fine-grained control)
    permissions: {
      type: [String],
      default: [],
      enum: [
        'manage_users',
        'manage_admins',
        'view_audit_logs',
        'manage_content',
        'manage_reports',
        'manage_features',
        'manage_integrations',
        'manage_settings',
        'manage_badges',
        'manage_experiments',
        'moderate_content',
        'ban_users',
        'approve_content',
        'view_analytics'
      ],
      description: 'Specific permissions granted to this admin'
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
      description: 'Whether admin account is active'
    },

    // Account verification
    isMfaEnabled: {
      type: Boolean,
      default: false,
      description: 'Whether two-factor authentication is enabled'
    },

    mfaSecret: {
      type: String,
      default: null,
      select: false,
      description: 'MFA secret (if MFA enabled)'
    },

    // IP whitelist (security)
    ipWhitelist: {
      type: [String],
      default: [],
      description: 'IP addresses allowed for login'
    },

    // Last access information
    lastLoginAt: {
      type: Date,
      default: null,
      description: 'When admin last logged in'
    },

    lastLoginIp: {
      type: String,
      default: null,
      description: 'IP address of last login'
    },

    loginAttempts: {
      type: Number,
      default: 0,
      description: 'Number of failed login attempts'
    },

    loginAttemptResetAt: {
      type: Date,
      default: null,
      description: 'When login attempts counter resets'
    },

    // Account suspension
    isSuspended: {
      type: Boolean,
      default: false,
      description: 'Whether admin account is suspended'
    },

    suspensionReason: {
      type: String,
      default: null,
      description: 'Reason for suspension (if suspended)'
    },

    suspensionAt: {
      type: Date,
      default: null,
      description: 'When account was suspended'
    },

    // Department/team
    department: {
      type: String,
      trim: true,
      default: null,
      description: 'Department or team assignment'
    },

    phone: {
      type: String,
      trim: true,
      default: null,
      description: 'Admin phone number'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When admin account was created'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When admin account was last updated'
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null,
      description: 'Admin who created this account'
    }
  },
  {
    timestamps: false, // Manually manage timestamps
    collection: 'adminusers'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

// Email index (for login, unique)
adminUserSchema.index({ email: 1 }, { unique: true });

// Role index (for filtering by role)
adminUserSchema.index({ role: 1 });

// Active status index (for finding active admins)
adminUserSchema.index({ isActive: 1 });

// Suspension status index
adminUserSchema.index({ isSuspended: 1 });

// Created date index
adminUserSchema.index({ createdAt: -1 });

// Compound indexes for common queries
adminUserSchema.index({ isActive: 1, role: 1 });
adminUserSchema.index({ isActive: 1, createdAt: -1 });

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

// Pre-save hook
adminUserSchema.pre('save', async function(next) {
  try {
    if (!this.isNew) {
      this.updatedAt = new Date();
    }
    next();
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Check if admin has specific permission
 * @param {String} permission - Permission to check
 * @returns {Boolean} True if admin has permission
 */
adminUserSchema.methods.hasPermission = function(permission) {
  // Superadmin has all permissions
  if (this.role === 'superadmin') {
    return true;
  }

  return this.permissions.includes(permission);
};

/**
 * Check if admin has any of the permissions
 * @param {Array} permissions - Array of permissions
 * @returns {Boolean} True if admin has any of the permissions
 */
adminUserSchema.methods.hasAnyPermission = function(permissions) {
  if (this.role === 'superadmin') {
    return true;
  }

  return permissions.some(p => this.permissions.includes(p));
};

/**
 * Add permission to admin
 * @param {String} permission - Permission to add
 * @returns {Promise} Updated admin
 */
adminUserSchema.methods.addPermission = async function(permission) {
  if (!this.permissions.includes(permission)) {
    this.permissions.push(permission);
    await this.save();
  }
  return this;
};

/**
 * Remove permission from admin
 * @param {String} permission - Permission to remove
 * @returns {Promise} Updated admin
 */
adminUserSchema.methods.removePermission = async function(permission) {
  this.permissions = this.permissions.filter(p => p !== permission);
  await this.save();
  return this;
};

/**
 * Check if admin can login
 * @returns {Boolean} True if admin can login
 */
adminUserSchema.methods.canLogin = function() {
  return this.isActive && !this.isSuspended;
};

/**
 * Check if admin is locked due to failed login attempts
 * @returns {Boolean} True if locked
 */
adminUserSchema.methods.isLoginLocked = function() {
  const maxAttempts = 5;
  const lockoutMinutes = 15;

  if (this.loginAttempts < maxAttempts) {
    return false;
  }

  if (!this.loginAttemptResetAt) {
    return true;
  }

  const minutesElapsed = (Date.now() - this.loginAttemptResetAt) / (1000 * 60);
  return minutesElapsed < lockoutMinutes;
};

/**
 * Increment failed login attempts
 * @returns {Promise} Updated admin
 */
adminUserSchema.methods.incrementLoginAttempts = async function() {
  this.loginAttempts += 1;
  this.loginAttemptResetAt = new Date();

  // Lock after 5 attempts
  if (this.loginAttempts >= 5) {
    this.isActive = false;
  }

  await this.save();
  return this;
};

/**
 * Clear login attempts and unlock
 * @returns {Promise} Updated admin
 */
adminUserSchema.methods.clearLoginAttempts = async function() {
  this.loginAttempts = 0;
  this.loginAttemptResetAt = null;
  this.isActive = true;
  await this.save();
  return this;
};

/**
 * Update last login info
 * @param {String} ip - IP address
 * @returns {Promise} Updated admin
 */
adminUserSchema.methods.updateLastLogin = async function(ip) {
  this.lastLoginAt = new Date();
  this.lastLoginIp = ip;
  this.loginAttempts = 0;
  this.loginAttemptResetAt = null;
  await this.save();
  return this;
};

/**
 * Suspend admin account
 * @param {String} reason - Suspension reason
 * @returns {Promise} Updated admin
 */
adminUserSchema.methods.suspend = async function(reason = null) {
  this.isSuspended = true;
  this.suspensionReason = reason;
  this.suspensionAt = new Date();
  await this.save();
  return this;
};

/**
 * Unsuspend admin account
 * @returns {Promise} Updated admin
 */
adminUserSchema.methods.unsuspend = async function() {
  this.isSuspended = false;
  this.suspensionReason = null;
  this.suspensionAt = null;
  await this.save();
  return this;
};

/**
 * Add IP to whitelist
 * @param {String} ip - IP address
 * @returns {Promise} Updated admin
 */
adminUserSchema.methods.addIpToWhitelist = async function(ip) {
  if (!this.ipWhitelist.includes(ip)) {
    this.ipWhitelist.push(ip);
    await this.save();
  }
  return this;
};

/**
 * Check if IP is whitelisted
 * @param {String} ip - IP address
 * @returns {Boolean} True if whitelisted or whitelist is empty
 */
adminUserSchema.methods.isIpWhitelisted = function(ip) {
  if (this.ipWhitelist.length === 0) {
    return true; // No whitelist = allow all
  }
  return this.ipWhitelist.includes(ip);
};

/**
 * Get admin summary (safe for API response)
 * @returns {Object} Admin summary
 */
adminUserSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    email: this.email,
    displayName: this.displayName,
    role: this.role,
    isActive: this.isActive,
    isSuspended: this.isSuspended,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt
  };
};

/**
 * Convert to JSON (remove sensitive fields)
 * @returns {Object} Safe JSON
 */
adminUserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.mfaSecret;
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find active admins
 * @returns {Promise<Array>} Active admin documents
 */
adminUserSchema.statics.findActive = function() {
  return this.find({ isActive: true, isSuspended: false });
};

/**
 * Find by email
 * @param {String} email - Admin email
 * @returns {Promise<Object>} Admin document
 */
adminUserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

/**
 * Find by role
 * @param {String} role - Admin role
 * @returns {Promise<Array>} Admin documents
 */
adminUserSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true });
};

/**
 * Find superadmins
 * @returns {Promise<Array>} Superadmin documents
 */
adminUserSchema.statics.findSuperadmins = function() {
  return this.find({ role: 'superadmin', isActive: true });
};

/**
 * Count admins by role
 * @param {String} role - Admin role
 * @returns {Promise<Number>} Count
 */
adminUserSchema.statics.countByRole = function(role) {
  return this.countDocuments({ role, isActive: true });
};

/**
 * Find recently created admins
 * @param {Number} days - Number of days
 * @returns {Promise<Array>} Admin documents
 */
adminUserSchema.statics.findRecentlyCreated = function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({ createdAt: { $gte: startDate } }).sort({ createdAt: -1 });
};

/**
 * Count total active admins
 * @returns {Promise<Number>} Count
 */
adminUserSchema.statics.countActive = function() {
  return this.countDocuments({ isActive: true, isSuspended: false });
};

/**
 * Find admins with permission
 * @param {String} permission - Permission
 * @returns {Promise<Array>} Admin documents
 */
adminUserSchema.statics.findWithPermission = function(permission) {
  return this.find({
    $or: [
      { role: 'superadmin' },
      { permissions: permission }
    ],
    isActive: true
  });
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('AdminUser', adminUserSchema);

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * How to use the AdminUser schema:
 * 
 * const AdminUser = require('./schemas/AdminUser');
 * 
 * // Create admin
 * const admin = await AdminUser.create({
 *   email: 'admin@example.com',
 *   displayName: 'Admin Name',
 *   password: 'hashedPassword',
 *   role: 'admin',
 *   permissions: ['manage_users', 'view_audit_logs']
 * });
 * 
 * // Check permission
 * if (admin.hasPermission('manage_users')) { ... }
 * 
 * // Update login
 * await admin.updateLastLogin('192.168.1.1');
 * 
 * // Suspend account
 * await admin.suspend('Policy violation');
 * 
 * // Find active admins
 * const active = await AdminUser.findActive();
 */
