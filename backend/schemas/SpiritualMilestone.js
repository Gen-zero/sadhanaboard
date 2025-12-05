const mongoose = require('mongoose');

const SpiritualMilestoneSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: String,
  milestone: String,
  achievedAt: { type: Date, default: Date.now, index: true }
}, { collection: 'spiritual_milestones', timestamps: true });

module.exports = mongoose.model('SpiritualMilestone', SpiritualMilestoneSchema);
