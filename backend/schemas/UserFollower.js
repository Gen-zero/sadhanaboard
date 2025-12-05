const mongoose = require('mongoose');

const UserFollowerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  followedAt: { type: Date, default: Date.now, index: true }
}, { collection: 'user_followers', timestamps: true });

module.exports = mongoose.model('UserFollower', UserFollowerSchema);
