/**
 * Schema: AuditLog
 * 
 * Purpose: Logs all admin actions for compliance and security
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true,
      index: true
    },

    action: {
      type: String,
      required: true,
      description: 'Action performed'
    },

    entityType: {
      type: String,
      required: true,
      index: true,
      description: 'Type of entity modified'
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      description: 'ID of entity modified'
    },

    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      description: 'Previous state'
    },

    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      description: 'New state'
    },

    changes: {
      type: [String],
      default: [],
      description: 'Changed fields'
    },

    ipAddress: {
      type: String,
      trim: true,
      default: null,
      description: 'Admin IP address'
    },

    userAgent: {
      type: String,
      trim: true,
      default: null,
      description: 'Browser user agent'
    },

    reason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
      description: 'Reason for action'
    },

    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success',
      index: true,
      description: 'Action status'
    },

    errorMessage: {
      type: String,
      trim: true,
      default: null,
      description: 'Error message if failed'
    },

    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false,
    collection: 'auditlogs'
  }
);

// Indexes
auditLogSchema.index({ adminId: 1 });
auditLogSchema.index({ entityType: 1 });
auditLogSchema.index({ status: 1 });
auditLogSchema.index({ adminId: 1, createdAt: -1 });

// Static methods
auditLogSchema.statics.findByAdmin = function(adminId) {
  return this.find({ adminId }).sort({ createdAt: -1 });
};

auditLogSchema.statics.findByEntity = function(entityType, entityId) {
  return this.find({ entityType, entityId }).sort({ createdAt: -1 });
};

auditLogSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: { $gte: startDate, $lte: endDate }
  }).sort({ createdAt: -1 });
};

auditLogSchema.statics.countByAdmin = function(adminId) {
  return this.countDocuments({ adminId });
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
