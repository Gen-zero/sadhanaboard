const mongoose = require('mongoose');

const CommunityPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [mongoose.Schema.Types.ObjectId],
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'community_posts', timestamps: true });

module.exports = mongoose.model('CommunityPost', CommunityPostSchema);
