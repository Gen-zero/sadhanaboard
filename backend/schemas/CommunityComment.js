const mongoose = require('mongoose');

const CommunityCommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  postId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'community_comments', timestamps: true });

module.exports = mongoose.model('CommunityComment', CommunityCommentSchema);
