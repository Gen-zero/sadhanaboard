const mongoose = require('mongoose');

const CmsAuditTrailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true, index: true },
  targetId: mongoose.Schema.Types.ObjectId,
  targetType: String,
  changes: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'cms_audit_trails', timestamps: true });

module.exports = mongoose.model('CmsAuditTrail', CmsAuditTrailSchema);
