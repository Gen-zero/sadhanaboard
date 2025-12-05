const { MentorshipProgram, User } = require('../models');

module.exports = {
  async listPairs({ limit = 50, offset = 0 } = {}) {
    try {
      const items = await MentorshipProgram.find()
        .populate('mentorId', 'displayName')
        .populate('menteeId', 'displayName')
        .sort({ startedAt: -1 })
        .limit(limit)
        .skip(offset)
        .lean();
      const total = await MentorshipProgram.countDocuments();
      return { items, total, limit, offset };
    } catch (e) {
      console.error('listPairs', e);
      return { items: [], total: 0, limit, offset };
    }
  },

  async createMentorshipPair(mentorId, menteeId, programType = 'general', adminId) {
    try {
      const pair = new MentorshipProgram({
        mentorId,
        menteeId,
        programType,
        status: 'active',
        startedAt: new Date(),
        metadata: { createdBy: adminId }
      });
      await pair.save();
      return pair.toJSON();
    } catch (e) {
      console.error('createMentorshipPair', e);
      return null;
    }
  },

  async updatePairStatus(id, status, adminId) {
    try {
      const updates = {
        status,
        metadata: { updatedBy: adminId, status }
      };
      const pair = await MentorshipProgram.findByIdAndUpdate(id, updates, { new: true }).lean();
      return pair;
    } catch (e) {
      console.error('updatePairStatus', e);
      return null;
    }
  },

  async endMentorship(id, adminId) {
    try {
      const updates = {
        status: 'ended',
        endedAt: new Date(),
        metadata: { endedBy: adminId }
      };
      const pair = await MentorshipProgram.findByIdAndUpdate(id, updates, { new: true }).lean();
      return pair;
    } catch (e) {
      console.error('endMentorship', e);
      return null;
    }
  },

  async getPair(id) {
    try {
      return await MentorshipProgram.findById(id).lean();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async deletePair(id) {
    try {
      await MentorshipProgram.deleteOne({ _id: id });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};
