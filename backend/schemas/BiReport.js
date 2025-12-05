/**
 * Schema: BiReport
 * Purpose: Business intelligence reports
 */

const mongoose = require('mongoose');

const biReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    reportName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null
    },

    type: {
      type: String,
      enum: ['user_activity', 'sadhana_stats', 'engagement', 'retention', 'custom'],
      default: 'custom',
      index: true
    },

    filters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      description: 'Query filters'
    },

    metrics: {
      type: [String],
      default: [],
      description: 'Metrics to include'
    },

    dateRange: {
      startDate: Date,
      endDate: Date
    },

    lastRunAt: {
      type: Date,
      default: null
    },

    schedule: {
      type: String,
      default: null,
      description: 'Cron expression'
    },

    isScheduled: {
      type: Boolean,
      default: false
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      description: 'Report results'
    },

    resultSize: {
      type: Number,
      default: 0
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
    collection: 'bireports'
  }
);

biReportSchema.index({ userId: 1 });
biReportSchema.index({ type: 1 });

biReportSchema.methods.setSchedule = async function(cronExpression) {
  this.schedule = cronExpression;
  this.isScheduled = true;
  await this.save();
  return this;
};

biReportSchema.methods.unschedule = async function() {
  this.isScheduled = false;
  this.schedule = null;
  await this.save();
  return this;
};

biReportSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

biReportSchema.statics.findScheduled = function() {
  return this.find({ isScheduled: true });
};

module.exports = mongoose.model('BiReport', biReportSchema);
