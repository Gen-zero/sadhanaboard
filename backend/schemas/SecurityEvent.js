const mongoose = require('mongoose');

const SecurityEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true, index: true },
  eventType: { type: String, required: true, index: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'security_events', timestamps: true });

module.exports = mongoose.model('SecurityEvent', SecurityEventSchema);
