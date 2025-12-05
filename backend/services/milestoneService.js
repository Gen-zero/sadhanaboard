const MentorshipGoal = require('../schemas/MentorshipGoal');

module.exports = {
  async createMilestone(userId, milestoneType, data = {}, achievedAt = null) {
    try {
      const milestone = new MentorshipGoal({
        goalTitle: `${milestoneType}-milestone`,
        description: JSON.stringify(data),
        category: milestoneType,
        achievedAt: achievedAt || null
      });
      await milestone.save();
      return milestone.toJSON();
    } catch (e) {
      console.error('createMilestone', e);
      return null;
    }
  },

  async listMilestones({ userId, limit = 50, offset = 0 } = {}) {
    try {
      let query = {};
      if (userId) query.userId = userId;
      
      const milestones = await MentorshipGoal.find(query)
        .sort({ achievedAt: -1 })
        .limit(Number(limit))
        .skip(Number(offset))
        .select('id userId goalTitle description achievedAt');
      
      return milestones.map(m => m.toJSON());
    } catch (e) {
      console.error('listMilestones', e);
      return [];
    }
  },

  async getMilestone(id) {
    try {
      const milestone = await MentorshipGoal.findById(id)
        .select('id userId goalTitle description achievedAt');
      return milestone ? milestone.toJSON() : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async deleteMilestone(id) {
    try {
      await MentorshipGoal.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};
