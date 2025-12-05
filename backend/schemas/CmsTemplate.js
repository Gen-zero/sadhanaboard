const mongoose = require('mongoose');

const CmsTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  content: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'cms_templates', timestamps: true });

module.exports = mongoose.model('CmsTemplate', CmsTemplateSchema);
