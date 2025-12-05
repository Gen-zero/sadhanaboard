const mongoose = require('mongoose');

const ThemeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  description: String,
  colors: { type: mongoose.Schema.Types.Mixed, default: {} },
  isActive: { type: Boolean, default: true, index: true },
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'themes', timestamps: true });

module.exports = mongoose.model('Theme', ThemeSchema);
