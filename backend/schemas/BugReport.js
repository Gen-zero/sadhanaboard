/**
 * Schema: BugReport
 * Purpose: Bug tracking system
 */

const mongoose = require('mongoose');

const bugReportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },

    appVersion: {
      type: String,
      trim: true,
      default: null
    },

    osVersion: {
      type: String,
      trim: true,
      default: null
    },

    deviceInfo: {
      type: String,
      trim: true,
      default: null
    },

    stepsToReproduce: {
      type: [String],
      default: []
    },

    reproducible: {
      type: Boolean,
      default: true
    },

    severity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
      index: true
    },

    status: {
      type: String,
      enum: ['new', 'assigned', 'in_progress', 'fixed', 'verified', 'closed'],
      default: 'new',
      index: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    },

    tags: {
      type: [String],
      default: []
    },

    fixedInVersion: {
      type: String,
      trim: true,
      default: null
    },

    verifiedAt: {
      type: Date,
      default: null
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null
    },

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
    collection: 'bugreports'
  }
);

bugReportSchema.index({ reporterId: 1 });
bugReportSchema.index({ status: 1 });
bugReportSchema.index({ severity: 1 });

bugReportSchema.methods.assignTo = async function(developerId) {
  this.assignedTo = developerId;
  this.status = 'assigned';
  await this.save();
  return this;
};

bugReportSchema.methods.markFixed = async function(version) {
  this.status = 'fixed';
  this.fixedInVersion = version;
  this.updatedAt = new Date();
  await this.save();
  return this;
};

bugReportSchema.methods.verify = async function() {
  this.status = 'verified';
  this.verifiedAt = new Date();
  this.updatedAt = new Date();
  await this.save();
  return this;
};

bugReportSchema.methods.addTag = async function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
    await this.save();
  }
  return this;
};

bugReportSchema.statics.findByReporter = function(reporterId) {
  return this.find({ reporterId }).sort({ createdAt: -1 });
};

bugReportSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ severity: -1, createdAt: -1 });
};

bugReportSchema.statics.findBySeverity = function(severity) {
  return this.find({ severity }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('BugReport', bugReportSchema);
