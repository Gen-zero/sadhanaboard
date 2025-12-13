/**
 * Schema: Experiment
 * Purpose: A/B testing and feature experiments
 */

const mongoose = require('mongoose');

const experimentSchema = new mongoose.Schema(
  {
    experimentName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null
    },

    type: {
      type: String,
      enum: ['feature_test', 'ui_test', 'algorithm_test'],
      default: 'feature_test'
    },

    controlGroup: {
      type: String,
      required: true,
      description: 'Control group description'
    },

    treatmentGroup: {
      type: String,
      required: true,
      description: 'Treatment group description'
    },

    splitPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
      description: 'Control % vs treatment %'
    },

    metrics: {
      type: [String],
      default: [],
      description: 'Metrics to track'
    },

    startDate: {
      type: Date,
      default: Date.now,
      index: true
    },

    expectedEndDate: {
      type: Date,
      default: null
    },

    actualEndDate: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ['planning', 'running', 'completed', 'cancelled'],
      default: 'planning',
      index: true
    },

    results: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      description: 'Results summary'
    },

    participantCount: {
      type: Number,
      default: 0
    },

    controlCount: {
      type: Number,
      default: 0
    },

    treatmentCount: {
      type: Number,
      default: 0
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
    collection: 'experiments'
  }
);


experimentSchema.methods.start = async function() {
  this.status = 'running';
  this.startDate = new Date();
  await this.save();
  return this;
};

experimentSchema.methods.end = async function(results) {
  this.status = 'completed';
  this.actualEndDate = new Date();
  if (results) this.results = results;
  await this.save();
  return this;
};

experimentSchema.methods.cancel = async function(reason) {
  this.status = 'cancelled';
  if (reason) this.results = { reason };
  await this.save();
  return this;
};

experimentSchema.methods.getUserGroup = function(userId) {
  // Hash userId to determine group
  const crypto = require('crypto');
  const hash = crypto.createHash('md5').update(userId.toString()).digest('hex');
  const hashNum = parseInt(hash.substring(0, 8), 16);
  return (hashNum % 100) < this.splitPercentage ? 'control' : 'treatment';
};

experimentSchema.statics.findRunning = function() {
  return this.find({ status: 'running' }).sort({ startDate: -1 });
};

experimentSchema.statics.findCompleted = function() {
  return this.find({ status: 'completed' }).sort({ actualEndDate: -1 });
};

experimentSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Experiment', experimentSchema);
