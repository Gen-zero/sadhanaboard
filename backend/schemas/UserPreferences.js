/**
 * Schema: UserPreferences
 * Purpose: Store user app preferences and settings
 */

const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },

    notifications: {
      enabled: {
        type: Boolean,
        default: true
      },
      emailNotifications: {
        type: String,
        enum: ['daily', 'weekly', 'never'],
        default: 'daily'
      },
      pushNotifications: {
        type: Boolean,
        default: true
      },
      smsNotifications: {
        type: Boolean,
        default: false
      },
      mentionNotifications: {
        type: Boolean,
        default: true
      },
      likeNotifications: {
        type: Boolean,
        default: true
      },
      commentNotifications: {
        type: Boolean,
        default: true
      }
    },

    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public'
      },
      activityVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'friends'
      },
      showEmail: {
        type: Boolean,
        default: false
      },
      dataCollection: {
        type: Boolean,
        default: true
      }
    },

    appSettings: {
      language: {
        type: String,
        default: 'en',
        enum: ['en', 'es', 'fr', 'de', 'hi']
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'auto'
      },
      timezone: {
        type: String,
        default: 'UTC'
      },
      dailySummary: {
        type: Boolean,
        default: true
      }
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false,
    collection: 'userpreferences'
  }
);


userPreferencesSchema.methods.updateNotificationPreferences = async function(prefs) {
  Object.assign(this.notifications, prefs);
  this.updatedAt = new Date();
  await this.save();
  return this;
};

userPreferencesSchema.methods.updatePrivacySettings = async function(settings) {
  Object.assign(this.privacy, settings);
  this.updatedAt = new Date();
  await this.save();
  return this;
};

userPreferencesSchema.statics.findByUser = function(userId) {
  return this.findOne({ userId });
};

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
