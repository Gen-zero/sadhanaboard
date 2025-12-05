const mongoose = require('mongoose');

const BookAnalyticsSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SpiritualBook',
    required: true,
    index: true
  },
  eventType: {
    type: String,
    enum: ['view', 'download', 'share', 'highlight', 'note'],
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    sparse: true
  },
  ipAddress: {
    type: String,
    sparse: true
  },
  userAgent: {
    type: String,
    sparse: true
  },
  sessionId: {
    type: String,
    sparse: true,
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
    expires: 365 * 24 * 60 * 60  // Auto-delete after 1 year
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'book_analytics',
  timestamps: true
});

// Compound indexes for common queries
BookAnalyticsSchema.index({ bookId: 1, eventType: 1, createdAt: -1 });
BookAnalyticsSchema.index({ eventType: 1, createdAt: -1 });
BookAnalyticsSchema.index({ userId: 1, eventType: 1, createdAt: -1 });

module.exports = mongoose.model('BookAnalytics', BookAnalyticsSchema);
