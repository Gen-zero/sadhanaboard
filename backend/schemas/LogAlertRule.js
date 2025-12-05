const mongoose = require('mongoose');

const LogAlertRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  description: String,
  logLevel: {
    type: String,
    enum: ['error', 'warn', 'info', 'debug'],
    default: 'error'
  },
  pattern: String,
  actions: [String],
  enabled: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  collection: 'log_alert_rules',
  timestamps: true
});

module.exports = mongoose.model('LogAlertRule', LogAlertRuleSchema);
