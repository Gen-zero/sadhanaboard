const mongoose = require('mongoose');

const SadhanaActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sadhanaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sadhana', required: true, index: true },
  activityType: { type: String, enum: ['start', 'complete', 'pause', 'resume'], required: true },
  duration: Number,
  notes: String,
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'sadhana_activity', timestamps: true });

module.exports = mongoose.model('SadhanaActivity', SadhanaActivitySchema);
