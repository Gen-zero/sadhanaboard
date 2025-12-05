const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  author: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['spiritual', 'fiction', 'non-fiction', 'academic', 'reference', 'other'],
    default: 'other',
    index: true
  },
  isbn: {
    type: String,
    sparse: true,
    index: true
  },
  coverImage: {
    type: String,
    sparse: true
  },
  publisher: {
    type: String,
    trim: true,
    sparse: true
  },
  publicationDate: {
    type: Date,
    sparse: true
  },
  pages: {
    type: Number,
    min: 0,
    sparse: true
  },
  language: {
    type: String,
    default: 'en',
    index: true
  },
  fileSize: {
    type: Number,
    default: 0
  },
  fileFormat: {
    type: String,
    enum: ['pdf', 'epub', 'mobi', 'txt', 'other'],
    default: 'pdf'
  },
  filePath: {
    type: String,
    sparse: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
    index: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true,
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: {
    type: Date,
    sparse: true,
    index: true
  }
}, {
  collection: 'books',
  timestamps: true
});

// Indexes for common queries
BookSchema.index({ title: 'text', author: 'text', description: 'text' });
BookSchema.index({ category: 1, isPublished: 1, deletedAt: 1 });
BookSchema.index({ uploadedBy: 1, createdAt: -1 });
BookSchema.index({ rating: -1, isPublished: 1 });

module.exports = mongoose.model('Book', BookSchema);
