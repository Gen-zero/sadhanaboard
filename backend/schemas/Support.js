/**
 * Schema: Support
 * Purpose: Support tickets and customer inquiries
 */

const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    subject: {
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

    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true
    },

    status: {
      type: String,
      enum: ['open', 'in_progress', 'waiting_user', 'resolved', 'closed'],
      default: 'open',
      index: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    },

    assignedAt: {
      type: Date,
      default: null
    },

    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        senderType: {
          type: String,
          enum: ['user', 'admin'],
          required: true
        },
        content: {
          type: String,
          required: true,
          trim: true,
          maxlength: 5000
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],

    resolvedAt: {
      type: Date,
      default: null
    },

    resolution: {
      type: String,
      trim: true,
      maxlength: 2000,
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
    collection: 'support'
  }
);


supportSchema.methods.assignTo = async function(adminId) {
  this.assignedTo = adminId;
  this.assignedAt = new Date();
  this.status = 'in_progress';
  await this.save();
  return this;
};

supportSchema.methods.addMessage = async function(senderId, senderType, content) {
  this.messages.push({
    sender: senderId,
    senderType,
    content,
    timestamp: new Date()
  });
  this.updatedAt = new Date();
  await this.save();
  return this;
};

supportSchema.methods.resolve = async function(resolution) {
  this.status = 'resolved';
  this.resolution = resolution;
  this.resolvedAt = new Date();
  this.updatedAt = new Date();
  await this.save();
  return this;
};

supportSchema.methods.reopen = async function() {
  this.status = 'open';
  this.resolvedAt = null;
  this.resolution = null;
  this.updatedAt = new Date();
  await this.save();
  return this;
};

supportSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

supportSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

supportSchema.statics.findByTicketNumber = function(ticketNumber) {
  return this.findOne({ ticketNumber });
};

module.exports = mongoose.model('Support', supportSchema);
