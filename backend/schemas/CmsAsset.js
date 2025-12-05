const mongoose = require('mongoose');

const CmsAssetSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  type: { type: String, enum: ['image', 'video', 'document', 'audio'], index: true },
  url: { type: String, required: true },
  mimeType: String,
  size: Number,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'cms_assets', timestamps: true });

module.exports = mongoose.model('CmsAsset', CmsAssetSchema);
