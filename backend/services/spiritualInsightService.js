const { SpirtualInsight, SadhanaSession, SpirtualMilestone, SadhanaActivity } = require('../models');
const biService = require('./biReportService');

const insightService = {
  async generateUserInsights(userId) {
    try {
      // simple heuristics based on recent activity
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const sessions = await SadhanaSession.countDocuments({ userId, createdAt: { $gt: thirtyDaysAgo } });
      const milestones = await SpirtualMilestone.countDocuments({ userId });
      
      const insightData = {
        insightType: 'practice_recommendation',
        userId,
        data: { sessionsLast30d: sessions, milestones },
        confidenceScore: sessions > 0 ? 0.8 : 0.6,
        generatedAt: new Date()
      };
      
      const insight = new SpirtualInsight(insightData);
      await insight.save();
      
      // emit realtime
      try { if (global.__ADMIN_IO__) global.__ADMIN_IO__.to('bi-insights').emit('bi:insight-generated', insight.toJSON()); } catch (e) {}
      return insight.toJSON();
    } catch (e) {
      console.error('generateUserInsights error:', e);
      return null;
    }
  },

  async generateCommunityInsights() {
    try {
      // example: most popular practices
      const activities = await SadhanaActivity.aggregate([
        { $group: { _id: '$practiceType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      
      const insightData = {
        insightType: 'consistency_improvement',
        data: { popularPractices: activities },
        confidenceScore: 0.7,
        generatedAt: new Date()
      };
      
      const insight = new SpirtualInsight(insightData);
      await insight.save();
      
      try { if (global.__ADMIN_IO__) global.__ADMIN_IO__.to('bi-insights').emit('bi:insight-generated', insight.toJSON()); } catch (e) {}
      return insight.toJSON();
    } catch (e) {
      console.error('generateCommunityInsights error:', e);
      return null;
    }
  },

  async getValidInsights(userId) {
    try {
      const now = new Date();
      const insights = await SpirtualInsight.find({
        $or: [
          { userId },
          { userId: null }
        ],
        $or: [
          { expiresAt: null },
          { expiresAt: { $gt: now } }
        ]
      }).sort({ generatedAt: -1 }).limit(100).lean();
      return insights;
    } catch (e) {
      console.error('getValidInsights error:', e);
      return [];
    }
  }
};

module.exports = insightService;
