const mongoose = require('mongoose');

const AdminReminderTemplateSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  scheduleCron: {
    type: String,
    required: false
  },
  channelIds: {
    type: [Number],
    default: []
  },
  enabled: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Add indexes
AdminReminderTemplateSchema.index({ key: 1 });
AdminReminderTemplateSchema.index({ enabled: 1, scheduleCron: 1 });

module.exports = mongoose.model('AdminReminderTemplate', AdminReminderTemplateSchema);