const mongoose = require('mongoose');

const CmsAssetVariantSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'CmsAsset', required: true, index: true },
  variant: String,
  url: String,
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'cms_asset_variants', timestamps: true });

module.exports = mongoose.model('CmsAssetVariant', CmsAssetVariantSchema);
