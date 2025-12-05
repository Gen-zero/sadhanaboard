const { ContentApproval, User } = require('../models');

class ContentApprovalService {
  static async createApprovalRequest(contentType, contentId, submitterId, notes = null) {
    try {
      const approval = new ContentApproval({
        contentType,
        contentId,
        submitterId,
        status: 'pending',
        notes,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await approval.save();
      return approval.toJSON();
    } catch (error) {
      console.error('createApprovalRequest', error);
      throw error;
    }
  }
  static async getApprovalRequests(filters = {}, limit = 50, offset = 0) {
    try {
      const query = {};
      if (filters.status) query.status = filters.status;
      if (filters.contentType) query.contentType = filters.contentType;

      const [approvals, total] = await Promise.all([
        ContentApproval.find(query)
          .populate('submitterId', 'displayName')
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(offset)
          .lean(),
        ContentApproval.countDocuments(query)
      ]);

      return {
        requests: approvals,
        total,
        limit,
        offset
      };
    } catch (error) {
      console.error('getApprovalRequests', error);
      throw error;
    }
  }
  static async approveContent(approvalId, approverId, notes = null) {
    try {
      const approval = await ContentApproval.findByIdAndUpdate(approvalId, {
        status: 'approved',
        approverId,
        approvedAt: new Date(),
        notes: notes ? `${approval?.notes || ''} [Approved: ${notes}]` : approval?.notes,
        updatedAt: new Date()
      }, { new: true }).lean();

      if (!approval) {
        throw new Error('Approval request not found');
      }

      return approval;
    } catch (error) {
      console.error('approveContent', error);
      throw error;
    }
  }
  static async rejectContent(approvalId, approverId, notes = null) {
    try {
      const approval = await ContentApproval.findByIdAndUpdate(approvalId, {
        status: 'rejected',
        approverId,
        rejectedAt: new Date(),
        notes: notes ? `${approval?.notes || ''} [Rejected: ${notes}]` : approval?.notes,
        updatedAt: new Date()
      }, { new: true }).lean();

      if (!approval) {
        throw new Error('Approval request not found');
      }

      return approval;
    } catch (error) {
      console.error('rejectContent', error);
      throw error;
    }
  }
  static async getApprovalRequestById(id) {
    try {
      const approval = await ContentApproval.findById(id)
        .populate('submitterId', 'displayName')
        .populate('approverId', 'displayName')
        .lean();
      return approval || null;
    } catch (error) {
      console.error('getApprovalRequestById', error);
      return null;
    }
  }
  static async getPendingApprovalsForUser(userId) {
    try {
      const approvals = await ContentApproval.find({ status: 'pending' })
        .populate('submitterId', 'displayName')
        .sort({ createdAt: 1 })
        .lean();
      return approvals;
    } catch (error) {
      console.error('getPendingApprovalsForUser', error);
      return [];
    }
  }
  static async getUserApprovalHistory(userId, limit = 50, offset = 0) {
    try {
      const query = { $or: [{ submitterId: userId }, { approverId: userId }] };

      const [approvals, total] = await Promise.all([
        ContentApproval.find(query)
          .populate('submitterId', 'displayName')
          .populate('approverId', 'displayName')
          .sort({ updatedAt: -1 })
          .limit(limit)
          .skip(offset)
          .lean(),
        ContentApproval.countDocuments(query)
      ]);

      return {
        requests: approvals,
        total,
        limit,
        offset
      };
    } catch (error) {
      console.error('getUserApprovalHistory', error);
      return { requests: [], total: 0, limit, offset };
    }
  }
  static async getApprovalStats() {
    try {
      const stats = await ContentApproval.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      const result = { pending: 0, approved: 0, rejected: 0 };
      for (const stat of stats) {
        if (stat._id === 'pending') result.pending = stat.count;
        else if (stat._id === 'approved') result.approved = stat.count;
        else if (stat._id === 'rejected') result.rejected = stat.count;
      }
      result.total = result.pending + result.approved + result.rejected;
      return result;
    } catch (error) {
      console.error('getApprovalStats', error);
      return { pending: 0, approved: 0, rejected: 0, total: 0 };
    }
  }
}

module.exports = ContentApprovalService;