const mongoose = require('mongoose');

const schemas = {};

// CmsTemplate
schemas.CmsTemplate = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  content: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'cms_templates', timestamps: true });

// CmsTheme
schemas.CmsTheme = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  colors: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'cms_themes', timestamps: true });

// CmsVersionHistory
schemas.CmsVersionHistory = new mongoose.Schema({
  documentId: mongoose.Schema.Types.ObjectId,
  version: Number,
  content: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'cms_version_histories', timestamps: true });

// CommunityEvent
schemas.CommunityEvent = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: String,
  date: { type: Date, index: true },
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'community_events', timestamps: true });

// CommunityReport
schemas.CommunityReport = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  targetId: mongoose.Schema.Types.ObjectId,
  targetType: String,
  reason: String,
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'community_reports', timestamps: true });

// EventParticipant
schemas.EventParticipant = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  joinedAt: { type: Date, default: Date.now, index: true }
}, { collection: 'event_participants', timestamps: true });

// MentorshipProgram
schemas.MentorshipProgram = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  startDate: { type: Date, index: true },
  status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'mentorship_programs', timestamps: true });

// ReportExecution
schemas.ReportExecution = new mongoose.Schema({
  reportId: mongoose.Schema.Types.ObjectId,
  executedAt: { type: Date, default: Date.now, index: true },
  status: { type: String, enum: ['pending', 'running', 'completed', 'failed'], default: 'pending' },
  result: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'report_executions', timestamps: true });

// ReportTemplate
schemas.ReportTemplate = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  type: { type: String, index: true },
  definition: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'report_templates', timestamps: true });

// AdminIntegration
schemas.AdminIntegration = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  type: { type: String, required: true },
  config: mongoose.Schema.Types.Mixed,
  enabled: { type: Boolean, default: true, index: true },
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'admin_integrations', timestamps: true });

module.exports = {
  CmsTemplate: mongoose.model('CmsTemplate', schemas.CmsTemplate),
  CmsTheme: mongoose.model('CmsTheme', schemas.CmsTheme),
  CmsVersionHistory: mongoose.model('CmsVersionHistory', schemas.CmsVersionHistory),
  CommunityEvent: mongoose.model('CommunityEvent', schemas.CommunityEvent),
  CommunityReport: mongoose.model('CommunityReport', schemas.CommunityReport),
  EventParticipant: mongoose.model('EventParticipant', schemas.EventParticipant),
  MentorshipProgram: mongoose.model('MentorshipProgram', schemas.MentorshipProgram),
  ReportExecution: mongoose.model('ReportExecution', schemas.ReportExecution),
  ReportTemplate: mongoose.model('ReportTemplate', schemas.ReportTemplate),
  AdminIntegration: mongoose.model('AdminIntegration', schemas.AdminIntegration)
};
