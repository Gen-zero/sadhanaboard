/**
 * Schema: UserNotification
 * Purpose: User notification inbox for in-app notifications
 */

const mongoose = require('mongoose');

const userNotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ['like', 'comment', 'mention', 'system', 'promotion', 'follow', 'message'],
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },

    relatedEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      description: 'ID of related object (like, comment, etc.)'
    },

    relatedEntityType: {
      type: String,
      trim: true,
      default: null,
      description: 'Type of related entity'
    },

    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      description: 'User who triggered notification'
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true
    },

    readAt: {
      type: Date,
      default: null
    },

    isArchived: {
      type: Boolean,
      default: false
    },

    actionUrl: {
      type: String,
      trim: true,
      default: null,
      description: 'URL to navigate to'
    },

    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false,
    collection: 'usernotifications'
  }
);

userNotificationSchema.index({ userId: 1 });
userNotificationSchema.index({ isRead: 1 });
userNotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

userNotificationSchema.methods.markAsRead = async function() {
  this.isRead = true;
  this.readAt = new Date();
  await this.save();
  return this;
};

userNotificationSchema.methods.markAsUnread = async function() {
  this.isRead = false;
  this.readAt = null;
  await this.save();
  return this;
};

userNotificationSchema.methods.archive = async function() {
  this.isArchived = true;
  await this.save();
  return this;
};

userNotificationSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

userNotificationSchema.statics.findUnread = function(userId) {
  return this.find({ userId, isRead: false }).sort({ createdAt: -1 });
};

userNotificationSchema.statics.countUnread = function(userId) {
  return this.countDocuments({ userId, isRead: false });
};

userNotificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

module.exports = mongoose.model('UserNotification', userNotificationSchema);
