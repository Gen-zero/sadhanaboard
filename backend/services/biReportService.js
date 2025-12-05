const User = require('../schemas/User');
const SadhanaActivity = require('../schemas/SadhanaActivity');
const SadhanaProgress = require('../schemas/SadhanaProgress');
const SpiritualMilestone = require('../schemas/SpiritualMilestone');
const CommunityPost = require('../schemas/CommunityPost');
const CommunityComment = require('../schemas/CommunityComment');
const CommunityActivity = require('../schemas/CommunityActivity');
const MentorshipProgram = require('../schemas/MentorshipProgram');
const ReportTemplate = require('../schemas/ReportTemplate');
const ReportExecution = require('../schemas/ReportExecution');

const biService = {
  async getKPISnapshot(retryCount = 1) {
    try {
      const totalUsers = await User.countDocuments();
      const activeUsers = await SadhanaActivity.distinct('userId', { createdAt: { $gte: new Date(Date.now() - 86400000) } });
      const completedSessions = await SadhanaProgress.countDocuments({ completed: true });
      const avgSessionResult = await SadhanaProgress.aggregate([
        { $match: { completed: true } },
        { $group: { _id: null, avgMinutes: { $avg: '$durationMinutes' } } }
      ]);
      const totalMilestones = await SpiritualMilestone.countDocuments();

      return {
        daily_active_practitioners: activeUsers.length,
        completion_rates: completedSessions,
        average_session_duration_seconds: Math.round((avgSessionResult[0]?.avgMinutes ?? 0) * 60),
        milestone_achievements: { total: totalMilestones },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.warn('BI KPIs database query failed, returning placeholder data:', error.message);
      return {
        daily_active_practitioners: 0,
        completion_rates: 0,
        average_session_duration_seconds: 0,
        milestone_achievements: { total: 0 },
        timestamp: new Date().toISOString(),
        note: 'Database unavailable - placeholder data'
      };
    }
  },

  async getSpiritualProgressAnalytics(filters = {}) {
    try {
      const { from, to } = filters;
      const matchStage = {};
      if (from) matchStage.updatedAt = { $gte: new Date(from) };
      if (to) {
        if (!matchStage.updatedAt) matchStage.updatedAt = {};
        matchStage.updatedAt.$lte = new Date(to);
      }

      const rows = await SpiritualMilestone.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
            achieved: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 100 }
      ]);

      return { items: rows };
    } catch (error) {
      console.warn('Spiritual progress analytics query failed:', error.message);
      return { items: [], note: 'Database unavailable' };
    }
  },

  async getEngagementAnalytics(timeframe = '30d') {
    try {
      const timeMs = this.parseTimeframe(timeframe);
      const cutoffDate = new Date(Date.now() - timeMs);
      const activeUsers = await SadhanaActivity.distinct('userId', { createdAt: { $gte: cutoffDate } });
      return { active: activeUsers.length };
    } catch (error) {
      console.warn('Engagement analytics query failed:', error.message);
      return { active: 0, note: 'Database unavailable' };
    }
  },

  parseTimeframe(timeframe) {
    const match = timeframe.match(/(\d+)([dwmy])/);
    if (!match) return 30 * 86400000; // default 30 days
    const [, num, unit] = match;
    const multipliers = { d: 86400000, w: 604800000, m: 2592000000, y: 31536000000 };
    return parseInt(num) * (multipliers[unit] || 86400000);
  },

  async getCommunityHealthMetrics() {
    try {
      const [posts, comments, activeUsers, mentorships] = await Promise.all([
        CommunityPost.countDocuments(),
        CommunityComment.countDocuments(),
        CommunityActivity.distinct('userId', { createdAt: { $gte: new Date(Date.now() - 30 * 86400000) } }),
        MentorshipProgram.countDocuments({ status: 'active' })
      ]);

      const communityStats = {
        posts,
        comments,
        active_users_30d: activeUsers.length,
        active_mentorships: mentorships
      };
      return { items: communityStats };
    } catch (e) {
      console.error('getCommunityHealthMetrics error', e);
      return { items: {}, note: 'Error computing community metrics - Database unavailable' };
    }
  },

  // Templates CRUD
  async getReportTemplates({ limit = 50, offset = 0, q } = {}) {
    try {
      const query = q ? { name: { $regex: q, $options: 'i' } } : {};
      const [rows, total] = await Promise.all([
        ReportTemplate.find(query).sort({ createdAt: -1 }).limit(limit).skip(offset).lean(),
        ReportTemplate.countDocuments(query)
      ]);
      return { items: rows, total };
    } catch (error) {
      console.warn('Report templates query failed:', error.message);
      return { items: [], total: 0, note: 'Database unavailable' };
    }
  },

  async createReportTemplate(def) {
    try {
      const template = new ReportTemplate({
        name: def.name,
        description: def.description || null,
        template: def.template || {},
        templateType: def.templateType || 'custom',
        ownerId: def.ownerId || null,
        isPublic: def.isPublic || false
      });
      await template.save();
      return template.toJSON();
    } catch (error) {
      console.error('Create report template failed:', error.message);
      throw new Error(`Failed to create report template: ${error.message}`);
    }
  },

  async updateReportTemplate(id, updates) {
    try {
      const updateData = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.template) updateData.template = updates.template;
      if (updates.templateType) updateData.templateType = updates.templateType;
      if (typeof updates.isPublic === 'boolean') updateData.isPublic = updates.isPublic;

      const template = await ReportTemplate.findByIdAndUpdate(id, updateData, { new: true });
      return template?.toJSON();
    } catch (error) {
      console.error('Update report template failed:', error.message);
      throw new Error(`Failed to update report template: ${error.message}`);
    }
  },

  async deleteReportTemplate(id) {
    try {
      await ReportTemplate.findByIdAndDelete(id);
      return { ok: true };
    } catch (error) {
      console.error('Delete report template failed:', error.message);
      throw new Error(`Failed to delete report template: ${error.message}`);
    }
  },

  async executeReportTemplate(templateId, params = {}) {
    try {
      const template = await ReportTemplate.findById(templateId);
      if (!template) throw new Error('Template not found');

      const started = new Date().toISOString();
      const resultData = { preview: true, template: template.template, params };
      const finished = new Date().toISOString();

      const execution = new ReportExecution({
        templateId,
        status: 'completed',
        startedAt: new Date(started),
        finishedAt: new Date(finished),
        resultData,
        resultUrl: null
      });
      await execution.save();
      return execution.toJSON();
    } catch (error) {
      console.error('Execute report template failed:', error.message);
      throw new Error(`Failed to execute report template: ${error.message}`);
    }
  },

  async getReportExecutions({ templateId, scheduledId, limit = 50, offset = 0 } = {}) {
    try {
      const query = {};
      if (templateId) query.templateId = templateId;
      if (scheduledId) query.scheduledId = scheduledId;

      const [items, total] = await Promise.all([
        ReportExecution.find(query).sort({ createdAt: -1 }).limit(limit).skip(offset).lean(),
        ReportExecution.countDocuments(query)
      ]);
      return { items, total };
    } catch (error) {
      console.warn('Report executions query failed:', error.message);
      return { items: [], total: 0, note: 'Database unavailable' };
    }
  }

};

module.exports = biService;