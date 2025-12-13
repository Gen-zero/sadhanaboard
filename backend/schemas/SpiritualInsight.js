const mongoose = require('mongoose');

/**
 * Schema: SpiritualInsight
 *
 * Stores generated insights for users and the broader community.
 */
const spiritualInsightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
    description: 'Targeted user for the insight (null for community insights)'
  },
  insightType: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'practice_recommendation',
      'consistency_improvement',
      'community_trend',
      'milestone_highlight',
      'custom'
    ],
    default: 'custom',
    description: 'Type/category of the generated insight'
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    description: 'Arbitrary payload describing the insight'
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5,
    description: 'Normalized confidence score (0-1)'
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'dismissed'],
    default: 'active',
    description: 'Insight lifecycle status'
  },
  generatedAt: {
    type: Date,
    default: Date.now,
    index: true,
    description: 'When the insight was generated'
  },
  expiresAt: {
    type: Date,
    default: null,
    description: 'Optional expiry timestamp'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'spiritual_insights',
  timestamps: false
});

spiritualInsightSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

spiritualInsightSchema.index({ status: 1, generatedAt: -1 });

module.exports = mongoose.model('SpiritualInsight', spiritualInsightSchema);
