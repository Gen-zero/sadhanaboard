/**
 * Schema: Feedback
 * Purpose: User feedback collection for app improvement
 */

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    category: {
      type: String,
      enum: ['bug', 'feature_request', 'improvement', 'other'],
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },

    attachments: {
      type: [String],
      default: [],
      description: 'Array of attachment URLs'
    },

    status: {
      type: String,
      enum: ['new', 'under_review', 'in_progress', 'resolved', 'closed'],
      default: 'new',
      index: true
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },

    adminResponse: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null
    },

    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    },

    respondedAt: {
      type: Date,
      default: null
    },

    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },

    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false,
    collection: 'feedback'
  }
);


feedbackSchema.methods.respond = async function(response, adminId) {
  this.adminResponse = response;
  this.respondedBy = adminId;
  this.respondedAt = new Date();
  this.status = 'under_review';
  await this.save();
  return this;
};

feedbackSchema.methods.close = async function() {
  this.status = 'closed';
  this.updatedAt = new Date();
  await this.save();
  return this;
};

feedbackSchema.methods.updateStatus = async function(status) {
  this.status = status;
  this.updatedAt = new Date();
  await this.save();
  return this;
};

feedbackSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

feedbackSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

feedbackSchema.statics.findByCategory = function(category) {
  return this.find({ category }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Feedback', feedbackSchema);
