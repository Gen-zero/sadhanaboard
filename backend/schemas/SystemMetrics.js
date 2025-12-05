/**
 * Schema: SystemMetrics
 * Purpose: System performance metrics tracking
 */

const mongoose = require('mongoose');

const systemMetricsSchema = new mongoose.Schema(
  {
    metricName: {
      type: String,
      required: true,
      index: true
    },

    metricValue: {
      type: Number,
      required: true
    },

    unit: {
      type: String,
      default: null,
      description: 'Unit of measurement'
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      description: 'Additional context'
    },

    tags: {
      type: [String],
      default: []
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false,
    collection: 'systemmetrics'
  }
);

systemMetricsSchema.index({ metricName: 1 });
systemMetricsSchema.index({ metricName: 1, timestamp: -1 });

systemMetricsSchema.statics.findByMetric = function(metricName) {
  return this.find({ metricName }).sort({ timestamp: -1 });
};

systemMetricsSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    timestamp: { $gte: startDate, $lte: endDate }
  }).sort({ timestamp: -1 });
};

systemMetricsSchema.statics.getStats = async function(metricName, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const result = await this.aggregate([
    {
      $match: {
        metricName,
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        avg: { $avg: '$metricValue' },
        min: { $min: '$metricValue' },
        max: { $max: '$metricValue' },
        count: { $sum: 1 }
      }
    }
  ]);

  return result[0] || { avg: 0, min: 0, max: 0, count: 0 };
};

module.exports = mongoose.model('SystemMetrics', systemMetricsSchema);
