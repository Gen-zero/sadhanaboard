/**
 * Schema: ActivityLog
 * Purpose: User activity tracking for analytics and audit
 */

const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    action: {
      type: String,
      required: true,
      trim: true
    },

    actionType: {
      type: String,
      enum: ['create', 'update', 'delete', 'view', 'like', 'comment', 'share', 'follow', 'unfollow', 'login', 'logout'],
      required: true,
      index: true
    },

    entityType: {
      type: String,
      trim: true,
      description: 'Type of entity acted upon'
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      description: 'ID of entity acted upon'
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      description: 'Additional activity context'
    },

    ipAddress: {
      type: String,
      trim: true,
      default: null
    },

    userAgent: {
      type: String,
      trim: true,
      default: null
    },

    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false,
    collection: 'activitylogs'
  }
);

activityLogSchema.index({ userId: 1, createdAt: -1 });

activityLogSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

activityLogSchema.statics.findByActionType = function(actionType) {
  return this.find({ actionType }).sort({ createdAt: -1 });
};

activityLogSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: { $gte: startDate, $lte: endDate }
  }).sort({ createdAt: -1 });
};

activityLogSchema.statics.countByAction = function(userId) {
  return this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$actionType',
        count: { $sum: 1 }
      }
    }
  ]);
};

activityLogSchema.statics.getUserStats = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        userId,
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$actionType',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('ActivityLog', activityLogSchema);
