/**
 * Schema: NotificationLog
 * Purpose: Notification delivery tracking and analytics
 */

const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ['email', 'push', 'sms', 'in-app'],
      required: true,
      index: true
    },

    subject: {
      type: String,
      trim: true,
      maxlength: 200
    },

    content: {
      type: String,
      trim: true,
      maxlength: 5000
    },

    recipientEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: null
    },

    recipientPhoneNumber: {
      type: String,
      trim: true,
      default: null
    },

    status: {
      type: String,
      enum: ['sent', 'pending', 'failed', 'bounced'],
      default: 'pending',
      index: true
    },

    sentAt: {
      type: Date,
      default: null
    },

    deliveredAt: {
      type: Date,
      default: null
    },

    failureReason: {
      type: String,
      trim: true,
      default: null
    },

    eventType: {
      type: String,
      trim: true,
      description: 'Event that triggered notification'
    },

    relatedEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false,
    collection: 'notificationlogs'
  }
);

notificationLogSchema.index({ userId: 1 });
notificationLogSchema.index({ userId: 1, createdAt: -1 });

notificationLogSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

notificationLogSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

notificationLogSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: { $gte: startDate, $lte: endDate }
  }).sort({ createdAt: -1 });
};

notificationLogSchema.statics.countByType = function(type) {
  return this.countDocuments({ type });
};

module.exports = mongoose.model('NotificationLog', notificationLogSchema);
