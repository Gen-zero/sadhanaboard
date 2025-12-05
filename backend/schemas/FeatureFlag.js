/**
 * Schema: FeatureFlag
 * Purpose: Feature toggles for controlling rollout
 */

const mongoose = require('mongoose');

const featureFlagSchema = new mongoose.Schema(
  {
    flagName: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },

    enabled: {
      type: Boolean,
      default: false,
      index: true
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null
    },

    rolloutPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      description: 'Rollout percentage (0-100)'
    },

    targetUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
      description: 'Specific users to enable for'
    },

    excludeUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
      description: 'Users to exclude'
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    },

    activatedAt: {
      type: Date,
      default: null
    },

    deactivatedAt: {
      type: Date,
      default: null
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
    collection: 'featureflags'
  }
);

featureFlagSchema.methods.isEnabled = function() {
  return this.enabled;
};

featureFlagSchema.methods.isEnabledForUser = function(userId) {
  if (!this.enabled) return false;
  if (this.excludeUsers.some(id => id.toString() === userId.toString())) return false;
  if (this.targetUsers.length > 0) return this.targetUsers.some(id => id.toString() === userId.toString());
  
  // Rollout percentage check (use userId hash)
  if (this.rolloutPercentage < 100) {
    const hash = require('crypto').createHash('md5').update(userId.toString()).digest('hex');
    const hashNum = parseInt(hash.substring(0, 8), 16);
    return (hashNum % 100) < this.rolloutPercentage;
  }
  
  return true;
};

featureFlagSchema.methods.enable = async function() {
  this.enabled = true;
  this.activatedAt = new Date();
  await this.save();
  return this;
};

featureFlagSchema.methods.disable = async function() {
  this.enabled = false;
  this.deactivatedAt = new Date();
  await this.save();
  return this;
};

featureFlagSchema.methods.setRolloutPercentage = async function(percentage) {
  this.rolloutPercentage = percentage;
  await this.save();
  return this;
};

featureFlagSchema.statics.findByName = function(flagName) {
  return this.findOne({ flagName });
};

featureFlagSchema.statics.findEnabled = function() {
  return this.find({ enabled: true });
};

module.exports = mongoose.model('FeatureFlag', featureFlagSchema);
