const mongoose = require('mongoose');

const SadhanaSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sadhanaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sadhana', required: true, index: true },
  startedAt: { type: Date, required: true, index: true },
  endedAt: Date,
  duration: Number,
  status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'sadhana_sessions', timestamps: true });

module.exports = mongoose.model('SadhanaSession', SadhanaSessionSchema);
