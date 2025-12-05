const CommunityEvent = require('../schemas/CommunityEvent');
const EventParticipant = require('../schemas/EventParticipant');
const User = require('../schemas/User');

module.exports = {
  async getAllEvents({ status, limit = 50, offset = 0 } = {}) {
    try {
      const query = {};
      if (status) query.status = status;
      const r = await CommunityEvent.find(query).sort({ startTime: -1 }).limit(Number(limit)).skip(Number(offset)).lean();
      return r;
    } catch (e) { console.error('getAllEvents error', e); return []; }
  },

  async createEvent(data, createdBy) {
    try {
      const event = new CommunityEvent({
        title: data.title,
        description: data.description,
        eventType: data.eventType || 'meditation',
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location || null,
        maxParticipants: data.maxParticipants || 0,
        createdBy: createdBy || null,
        status: data.status || 'draft',
        metadata: data.metadata || {}
      });
      const result = await event.save();
      return result.toJSON();
    } catch (e) { console.error('createEvent error', e); return null; }
  },

  async updateEvent(id, updates, adminId) {
    try {
      const allowed = new Set(['title', 'description', 'eventType', 'startTime', 'endTime', 'location', 'maxParticipants', 'status', 'metadata']);
      const updateData = {};
      for (const k of Object.keys(updates || {})) {
        if (allowed.has(k)) updateData[k] = updates[k];
      }
      if (Object.keys(updateData).length === 0) return null;
      const result = await CommunityEvent.findByIdAndUpdate(id, updateData, { new: true });
      return result?.toJSON();
    } catch (e) { console.error('updateEvent error', e); return null; }
  },

  async cancelEvent(id, adminId, reason) {
    try {
      const metadata = { cancelledBy: adminId, reason };
      const result = await CommunityEvent.findByIdAndUpdate(id, { status: 'cancelled', metadata }, { new: true });
      return result?.toJSON();
    } catch (e) { console.error('cancelEvent error', e); return null; }
  },

  async deleteEvent(id, adminId) {
    try {
      await CommunityEvent.findByIdAndDelete(id);
      return true;
    } catch (e) { console.error(e); return false; }
  },

  async getEventParticipants(eventId) {
    try {
      const r = await EventParticipant.find({ eventId }).populate('userId', 'displayName').lean();
      return r;
    } catch (e) { console.error(e); return []; }
  },

  async addParticipant(eventId, userId) {
    try {
      const participant = new EventParticipant({
        eventId,
        userId,
        status: 'registered'
      });
      const result = await participant.save();
      return result.toJSON();
    } catch (e) { console.error(e); return null; }
  },

  async removeParticipant(eventId, userId) {
    try {
      await EventParticipant.deleteOne({ eventId, userId });
      return true;
    } catch (e) { console.error(e); return false; }
  },

  async getParticipationStats(eventId) {
    try {
      const stats = await EventParticipant.aggregate([
        { $match: { eventId } },
        { $group: { _id: '$status', cnt: { $sum: 1 } } }
      ]);
      return stats;
    } catch (e) { console.error(e); return []; }
  },

  async getUpcomingEvents(limit = 10) {
    try {
      const now = new Date();
      const r = await CommunityEvent.find({
        status: { $in: ['published', 'active'] },
        startTime: { $gt: now }
      }).sort({ startTime: 1 }).limit(limit).lean();
      return r;
    } catch (e) { console.error(e); return []; }
  }
};
