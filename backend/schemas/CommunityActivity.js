const mongoose = require('mongoose');

const CommunityActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  type: { type: String, enum: ['post', 'comment', 'like', 'follow'], index: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, sparse: true, index: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'community_activity', timestamps: true });

module.exports = mongoose.model('CommunityActivity', CommunityActivitySchema);
