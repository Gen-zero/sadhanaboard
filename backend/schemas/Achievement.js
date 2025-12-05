const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  description: String,
  icon: String,
  category: String,
  points: {
    type: Number,
    default: 0
  },
  unlockedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  collection: 'achievements',
  timestamps: true
});

module.exports = mongoose.model('Achievement', AchievementSchema);
