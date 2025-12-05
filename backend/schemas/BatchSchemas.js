const mongoose = require('mongoose');

const schemas = {
  SecurityEvent: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true, index: true },
    eventType: { type: String, required: true, index: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
    details: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    createdAt: { type: Date, default: Date.now, index: true }
  }, { collection: 'security_events' }),

  SadhanaActivity: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sadhanaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sadhana', required: true, index: true },
    activityType: { type: String, enum: ['start', 'complete', 'pause', 'resume'], required: true },
    duration: Number,
    notes: String,
    createdAt: { type: Date, default: Date.now, index: true }
  }, { collection: 'sadhana_activity' }),

  SadhanaSession: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sadhanaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sadhana', required: true, index: true },
    startedAt: { type: Date, required: true, index: true },
    endedAt: Date,
    duration: Number,
    status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
    createdAt: { type: Date, default: Date.now, index: true }
  }, { collection: 'sadhana_sessions' }),

  SpiritualMilestone: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: String,
    milestone: String,
    achievedAt: { type: Date, default: Date.now, index: true }
  }, { collection: 'spiritual_milestones' }),

  CommunityPost: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: [mongoose.Schema.Types.ObjectId],
    createdAt: { type: Date, default: Date.now, index: true }
  }, { collection: 'community_posts' }),

  CommunityComment: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    postId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: true }
  }, { collection: 'community_comments' })
};

// Export all models
module.exports = {
  SecurityEvent: mongoose.model('SecurityEvent', schemas.SecurityEvent),
  SadhanaActivity: mongoose.model('SadhanaActivity', schemas.SadhanaActivity),
  SadhanaSession: mongoose.model('SadhanaSession', schemas.SadhanaSession),
  SpiritualMilestone: mongoose.model('SpiritualMilestone', schemas.SpiritualMilestone),
  CommunityPost: mongoose.model('CommunityPost', schemas.CommunityPost),
  CommunityComment: mongoose.model('CommunityComment', schemas.CommunityComment)
};
