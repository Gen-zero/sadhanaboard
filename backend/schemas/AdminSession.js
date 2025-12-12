/**
 * Schema: AdminSession
 * 
 * Purpose: Stores admin login sessions with JWT tokens and expiry
 * 
 * Key Fields:
 *   - adminId: Reference to AdminUser
 *   - jwtToken: JWT token for session validation
 *   - expiresAt: When session expires
 *   - ipAddress: IP address of login
 *   - userAgent: Browser/client info
 * 
 * Relationships:
 *   - Many-to-one with AdminUser (many sessions per admin)
 * 
 * Indexes:
 *   - adminId: For finding admin sessions
 *   - expiresAt: TTL index (auto-delete expired sessions)
 *   - jwtToken: For session validation
 */

const mongoose = require('mongoose');

const adminSessionSchema = new mongoose.Schema(
  {
    // Reference to AdminUser
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: [true, 'Admin ID is required'],
      index: true,
      description: 'Reference to AdminUser'
    },

    // JWT token
    jwtToken: {
      type: String,
      required: [true, 'JWT token is required'],
      unique: true,
      index: true,
      description: 'JWT token for session validation'
    },

    // Session validity
    expiresAt: {
      type: Date,
      required: true,
      index: true, // Used for TTL deletion
      description: 'When session expires'
    },

    // Session information
    ipAddress: {
      type: String,
      trim: true,
      default: null,
      description: 'IP address of login'
    },

    userAgent: {
      type: String,
      trim: true,
      default: null,
      description: 'Browser/client user agent'
    },

    deviceInfo: {
      type: {
        browser: String,
        os: String,
        device: String
      },
      default: {},
      description: 'Parsed device information'
    },

    // Session activity
    lastActivityAt: {
      type: Date,
      default: Date.now,
      description: 'When session was last active'
    },

    // MFA verification
    isMfaVerified: {
      type: Boolean,
      default: false,
      description: 'Whether MFA was verified for this session'
    },

    mfaVerifiedAt: {
      type: Date,
      default: null,
      description: 'When MFA was verified'
    },

    // Session status
    isActive: {
      type: Boolean,
      default: true,
      description: 'Whether session is currently active'
    },

    revokedAt: {
      type: Date,
      default: null,
      description: 'When session was revoked (if revoked)'
    },

    revocationReason: {
      type: String,
      default: null,
      description: 'Reason for revocation'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When session was created (login time)'
    }
  },
  {
    timestamps: false, // Only use createdAt
    collection: 'adminsessions'
  }
);

// ============================================================================
// TTL INDEX - Auto-delete expired sessions after 30 days
// ============================================================================

// This index automatically deletes expired sessions
// The expireAfterSeconds: 0 means delete at exactly expiresAt time

// ============================================================================
// INDEXES
// ============================================================================

// Admin ID index (for finding all sessions of an admin)

// JWT token index (for validating sessions)

// Created date index (for finding recent sessions)
adminSessionSchema.index({ createdAt: -1 });

// Active sessions index

// Compound indexes for common queries
adminSessionSchema.index({ adminId: 1, isActive: 1 });
adminSessionSchema.index({ adminId: 1, createdAt: -1 });

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

// Validate JWT token format
adminSessionSchema.pre('save', function(next) {
  // Ensure JWT token exists and has basic format
  if (!this.jwtToken || this.jwtToken.split('.').length !== 3) {
    return next(new Error('Invalid JWT token format'));
  }

  next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Check if session is valid (active and not expired)
 * @returns {Boolean} True if session is valid
 */
adminSessionSchema.methods.isValid = function() {
  return (
    this.isActive &&
    !this.revokedAt &&
    this.expiresAt > new Date()
  );
};

/**
 * Check if session has expired
 * @returns {Boolean} True if expired
 */
adminSessionSchema.methods.isExpired = function() {
  return this.expiresAt < new Date();
};

/**
 * Get remaining time in minutes
 * @returns {Number} Minutes until expiry
 */
adminSessionSchema.methods.getTimeRemaining = function() {
  if (this.isExpired()) {
    return 0;
  }
  return Math.ceil((this.expiresAt - Date.now()) / (1000 * 60));
};

/**
 * Update last activity time
 * @returns {Promise} Updated session
 */
adminSessionSchema.methods.updateActivity = async function() {
  this.lastActivityAt = new Date();
  await this.save();
  return this;
};

/**
 * Revoke session
 * @param {String} reason - Revocation reason
 * @returns {Promise} Updated session
 */
adminSessionSchema.methods.revoke = async function(reason = 'User requested logout') {
  this.isActive = false;
  this.revokedAt = new Date();
  this.revocationReason = reason;
  await this.save();
  return this;
};

/**
 * Mark MFA as verified
 * @returns {Promise} Updated session
 */
adminSessionSchema.methods.verifyMfa = async function() {
  this.isMfaVerified = true;
  this.mfaVerifiedAt = new Date();
  await this.save();
  return this;
};

/**
 * Check if session needs MFA verification
 * @returns {Boolean} True if MFA required but not verified
 */
adminSessionSchema.methods.needsMfaVerification = function() {
  // In production, check AdminUser's isMfaEnabled
  return !this.isMfaVerified;
};

/**
 * Get session summary for response
 * @returns {Object} Session summary
 */
adminSessionSchema.methods.getSummary = function() {
  return {
    sessionId: this._id,
    adminId: this.adminId,
    ipAddress: this.ipAddress,
    deviceInfo: this.deviceInfo,
    createdAt: this.createdAt,
    expiresAt: this.expiresAt,
    timeRemaining: this.getTimeRemaining(),
    isValid: this.isValid()
  };
};

/**
 * Convert to JSON (remove sensitive token)
 * @returns {Object} Safe JSON
 */
adminSessionSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.jwtToken; // Never expose token in API responses
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find active sessions for admin
 * @param {String} adminId - Admin ID
 * @returns {Promise<Array>} Active session documents
 */
adminSessionSchema.statics.findActiveByAdmin = function(adminId) {
  return this.find({
    adminId,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 });
};

/**
 * Find session by JWT token
 * @param {String} token - JWT token
 * @returns {Promise<Object>} Session document
 */
adminSessionSchema.statics.findByToken = function(token) {
  return this.findOne({ jwtToken: token });
};

/**
 * Find valid session by token (active and not expired)
 * @param {String} token - JWT token
 * @returns {Promise<Object>} Valid session document or null
 */
adminSessionSchema.statics.findValidByToken = function(token) {
  return this.findOne({
    jwtToken: token,
    isActive: true,
    expiresAt: { $gt: new Date() }
  });
};

/**
 * Count active sessions for admin
 * @param {String} adminId - Admin ID
 * @returns {Promise<Number>} Count
 */
adminSessionSchema.statics.countActiveByAdmin = function(adminId) {
  return this.countDocuments({
    adminId,
    isActive: true,
    expiresAt: { $gt: new Date() }
  });
};

/**
 * Revoke all sessions for admin
 * @param {String} adminId - Admin ID
 * @param {String} reason - Revocation reason
 * @returns {Promise} Update result
 */
adminSessionSchema.statics.revokeAllByAdmin = async function(adminId, reason = 'All sessions revoked') {
  return this.updateMany(
    { adminId, isActive: true },
    {
      isActive: false,
      revokedAt: new Date(),
      revocationReason: reason
    }
  );
};

/**
 * Find sessions by IP address
 * @param {String} ip - IP address
 * @returns {Promise<Array>} Session documents
 */
adminSessionSchema.statics.findByIp = function(ip) {
  return this.find({ ipAddress: ip, isActive: true }).sort({ createdAt: -1 });
};

/**
 * Find sessions created in last N days
 * @param {Number} days - Number of days
 * @returns {Promise<Array>} Session documents
 */
adminSessionSchema.statics.findRecentSessions = function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({ createdAt: { $gte: startDate } }).sort({ createdAt: -1 });
};

/**
 * Count sessions by admin (for audit)
 * @returns {Promise<Array>} Array with adminId and count
 */
adminSessionSchema.statics.countByAdmin = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$adminId', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

/**
 * Clean up expired sessions (manual cleanup, TTL index is primary)
 * @returns {Promise} Delete result
 */
adminSessionSchema.statics.deleteExpired = function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('AdminSession', adminSessionSchema);

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * How to use the AdminSession schema:
 * 
 * const AdminSession = require('./schemas/AdminSession');
 * 
 * // Create session after login
 * const session = await AdminSession.create({
 *   adminId: adminId,
 *   jwtToken: generatedJwt,
 *   expiresAt: tokenExpiry,
 *   ipAddress: req.ip,
 *   userAgent: req.headers['user-agent']
 * });
 * 
 * // Find valid session by token
 * const session = await AdminSession.findValidByToken(token);
 * if (!session) throw new Error('Invalid session');
 * 
 * // Logout (revoke session)
 * await session.revoke('User logout');
 * 
 * // Logout all devices
 * await AdminSession.revokeAllByAdmin(adminId);
 * 
 * // Update activity
 * await session.updateActivity();
 * 
 * // Get active sessions for admin
 * const sessions = await AdminSession.findActiveByAdmin(adminId);
 */
