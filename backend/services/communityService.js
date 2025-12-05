const CommunityActivity = require('../schemas/CommunityActivity');
const CommunityPost = require('../schemas/CommunityPost');
const CommunityComment = require('../schemas/CommunityComment');
const CommunityReport = require('../schemas/CommunityReport');
const User = require('../schemas/User');

module.exports = {
  async getActivityStream({ userId, type, limit = 50, offset = 0 } = {}) {
    try {
      const query = {};
      if (userId) query.userId = userId;
      if (type) query.activityType = type;
      const r = await CommunityActivity.find(query).sort({ createdAt: -1 }).limit(limit).skip(offset).lean();
      return r;
    } catch (e) { console.error('getActivityStream error', e); return []; }
  },

  async createActivityEntry(userId, activityType, data = {}) {
    try {
      const activity = new CommunityActivity({ userId, activityType, activityData: data });
      const row = await activity.save();
      try {
        if (!global.__community_emit_last) global.__community_emit_last = {};
        const last = global.__community_emit_last[activityType] || 0;
        const now = Date.now();
        const THROTTLE_MS = 500;
        if (now - last > THROTTLE_MS) {
          global.__community_emit_last[activityType] = now;
          if (global && global.__ADMIN_IO__) {
            global.__ADMIN_IO__.to('community:stream').emit('community:activity', row);
          }
          if (global && global.logBus && typeof global.logBus.emit === 'function') {
            global.logBus.emit('community:activity', row);
          }
        }
      } catch (e) { /* best-effort */ }
      return row.toJSON();
    } catch (e) { console.error('createActivityEntry error', e); return null; }
  },

  async getActivityStats() {
    try {
      const r = await CommunityActivity.aggregate([
        { $group: { _id: '$activityType', cnt: { $sum: 1 } } }
      ]);
      const map = {};
      r.forEach(rw => map[rw._id] = rw.cnt);
      return map;
    } catch (e) { console.error('getActivityStats error', e); return {}; }
  },

  // Posts
  async getAllPosts({ status, limit = 50, offset = 0 } = {}) {
    try {
      const query = {};
      if (status) query.status = status;
      const r = await CommunityPost.find(query).populate('userId', 'displayName').sort({ createdAt: -1 }).limit(limit).skip(offset).lean();
      return r;
    } catch (e) { console.error('getAllPosts error', e); return []; }
  },

  async getPostById(id) {
    try {
      const r = await CommunityPost.findById(id).populate('userId', 'displayName').lean();
      return r;
    } catch (e) { console.error(e); return null; }
  },

  async approvePost(id, adminId) {
    try {
      const r = await CommunityPost.findByIdAndUpdate(
        id,
        { status: 'published', $set: { 'metadata.approvedBy': adminId } },
        { new: true }
      );
      return r?.toJSON();
    } catch (e) { console.error(e); return null; }
  },

  async rejectPost(id, adminId, reason) {
    try {
      const r = await CommunityPost.findByIdAndUpdate(
        id,
        { status: 'flagged', 'metadata.rejectedBy': adminId, 'metadata.reason': reason },
        { new: true }
      );
      return r?.toJSON();
    } catch (e) { console.error(e); return null; }
  },

  async deletePost(id, adminId) {
    try {
      await CommunityPost.findByIdAndDelete(id);
      try {
        await CommunityActivity.create({ userId: adminId || null, activityType: 'admin_delete_post', activityData: { postId: id } });
      } catch (ee) { /* ignore */ }
      return true;
    } catch (e) { console.error(e); return false; }
  },

  // Comments & reports (minimal)
  async getAllComments({ postId, status, limit = 50, offset = 0 } = {}) {
    try {
      const query = {};
      if (postId) query.postId = postId;
      if (status) query.status = status;
      const r = await CommunityComment.find(query).populate('userId', 'displayName').sort({ createdAt: -1 }).limit(limit).skip(offset).lean();
      return r;
    } catch (e) { console.error(e); return []; }
  },

  async moderateComment(id, action, adminId) {
    try {
      const status = action === 'approve' ? 'visible' : action === 'hide' ? 'hidden' : 'review';
      const r = await CommunityComment.findByIdAndUpdate(id, { status }, { new: true });
      return r?.toJSON();
    } catch (e) { console.error(e); return null; }
  },

  async getReports({ status = 'pending', limit = 50, offset = 0 } = {}) {
    try {
      const r = await CommunityReport.find({ status }).sort({ createdAt: -1 }).limit(limit).skip(offset).lean();
      return r;
    } catch (e) { console.error(e); return []; }
  },

  async getReportsStats() {
    try {
      const r = await CommunityReport.aggregate([
        { $group: { _id: '$status', cnt: { $sum: 1 } } }
      ]);
      return r;
    } catch (e) { console.error(e); return []; }
  },

  async resolveReport(id, adminId, action, notes) {
    try {
      const status = action === 'dismiss' ? 'reviewed' : 'resolved';
      const r = await CommunityReport.findByIdAndUpdate(
        id,
        { status, adminNotes: notes || '', resolvedBy: adminId, resolvedAt: new Date() },
        { new: true }
      );
      return r?.toJSON();
    } catch (e) { console.error(e); return null; }
  },

  async createReport(reporterId, contentType, contentId, reason) {
    try {
      const report = new CommunityReport({ reporterId, reportedContentType: contentType, reportedContentId: contentId, reason, status: 'pending' });
      const r = await report.save();
      return r.toJSON();
    } catch (e) { console.error(e); return null; }
  }
};
