const mongoose = require('mongoose');

const AdminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete', 'approve', 'reject', 'suspend', 'restore'],
    index: true
  },
  targetType: {
    type: String,
    required: true,
    enum: ['user', 'content', 'post', 'sadhana', 'report'],
    index: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    sparse: true,
    index: true
  },
  changes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  reason: {
    type: String,
    sparse: true
  },
  ipAddress: {
    type: String,
    sparse: true
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  collection: 'admin_logs',
  timestamps: true
});

module.exports = mongoose.model('AdminLog', AdminLogSchema);
