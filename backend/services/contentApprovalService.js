const BaseService = require('./BaseService');

class ContentApprovalService extends BaseService {
  // Create a new content approval request
  static async createApprovalRequest(contentType, contentId, submitterId, notes = null) {
    try {
      const query = `
        INSERT INTO content_approvals 
        (content_type, content_id, submitter_id, status, notes, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *`;
      
      const result = await this.executeQuery(query, [contentType, contentId, submitterId, 'pending', notes]);
      
      return result.rows[0];
    } catch (error) {
      this.handleError(error, 'createApprovalRequest', { contentType, contentId, submitterId });
    }
  }
  
  // Get approval requests with filtering
  static async getApprovalRequests(filters = {}, limit = 50, offset = 0) {
    try {
      const params = [];
      const { whereClause, nextIndex } = this.buildWhereClause(filters, params);
      
      params.push(limit, offset);
      
      const query = `
        SELECT 
          ca.*,
          u.display_name as submitter_name
        FROM content_approvals ca
        LEFT JOIN users u ON ca.submitter_id = u.id
        ${whereClause}
        ORDER BY ca.created_at DESC
        LIMIT $${nextIndex} OFFSET $${nextIndex + 1}`;
      
      const countQuery = `
        SELECT COUNT(*) as total
        FROM content_approvals ca
        ${whereClause}`;
      
      const result = await this.executeQuery(query, params);
      const countResult = await this.executeQuery(countQuery, params.slice(0, params.length - 2));
      
      return {
        requests: result.rows,
        total: parseInt(countResult.rows[0].total),
        limit,
        offset
      };
    } catch (error) {
      this.handleError(error, 'getApprovalRequests', { filters, limit, offset });
    }
  }
  
  // Approve content
  static async approveContent(approvalId, approverId, notes = null) {
    try {
      const query = `
        UPDATE content_approvals 
        SET status = $1, approver_id = $2, approved_at = NOW(), notes = COALESCE(notes, '') || $3, updated_at = NOW()
        WHERE id = $4
        RETURNING *`;
      
      const result = await this.executeQuery(query, ['approved', approverId, notes ? ` [Approved: ${notes}]` : '', approvalId]);
      
      if (result.rows.length === 0) {
        throw new Error('Approval request not found');
      }
      
      return result.rows[0];
    } catch (error) {
      this.handleError(error, 'approveContent', { approvalId, approverId });
    }
  }
  
  // Reject content
  static async rejectContent(approvalId, approverId, notes = null) {
    try {
      const query = `
        UPDATE content_approvals 
        SET status = $1, approver_id = $2, rejected_at = NOW(), notes = COALESCE(notes, '') || $3, updated_at = NOW()
        WHERE id = $4
        RETURNING *`;
      
      const result = await this.executeQuery(query, ['rejected', approverId, notes ? ` [Rejected: ${notes}]` : '', approvalId]);
      
      if (result.rows.length === 0) {
        throw new Error('Approval request not found');
      }
      
      return result.rows[0];
    } catch (error) {
      this.handleError(error, 'rejectContent', { approvalId, approverId });
    }
  }
  
  // Get approval request by ID
  static async getApprovalRequestById(id) {
    try {
      const query = `
        SELECT 
          ca.*,
          u1.display_name as submitter_name,
          u2.display_name as approver_name
        FROM content_approvals ca
        LEFT JOIN users u1 ON ca.submitter_id = u1.id
        LEFT JOIN users u2 ON ca.approver_id = u2.id
        WHERE ca.id = $1`;
      
      const result = await this.executeQuery(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      this.handleError(error, 'getApprovalRequestById', { id });
    }
  }
  
  // Get pending approvals for a user
  static async getPendingApprovalsForUser(userId) {
    try {
      const query = `
        SELECT 
          ca.*,
          u.display_name as submitter_name
        FROM content_approvals ca
        LEFT JOIN users u ON ca.submitter_id = u.id
        WHERE ca.status = 'pending'
        ORDER BY ca.created_at ASC`;
      
      const result = await this.executeQuery(query);
      
      return result.rows;
    } catch (error) {
      this.handleError(error, 'getPendingApprovalsForUser', { userId });
    }
  }
  
  // Get user's approval history
  static async getUserApprovalHistory(userId, limit = 50, offset = 0) {
    try {
      const query = `
        SELECT 
          ca.*,
          u.display_name as submitter_name,
          u2.display_name as approver_name
        FROM content_approvals ca
        LEFT JOIN users u ON ca.submitter_id = u.id
        LEFT JOIN users u2 ON ca.approver_id = u2.id
        WHERE ca.submitter_id = $1 OR ca.approver_id = $1
        ORDER BY ca.updated_at DESC
        LIMIT $2 OFFSET $3`;
      
      const countQuery = `
        SELECT COUNT(*) as total
        FROM content_approvals 
        WHERE submitter_id = $1 OR approver_id = $1`;
      
      const result = await this.executeQuery(query, [userId, limit, offset]);
      const countResult = await this.executeQuery(countQuery, [userId]);
      
      return {
        requests: result.rows,
        total: parseInt(countResult.rows[0].total),
        limit,
        offset
      };
    } catch (error) {
      this.handleError(error, 'getUserApprovalHistory', { userId, limit, offset });
    }
  }
  
  // Get approval statistics
  static async getApprovalStats() {
    try {
      const query = `
        SELECT 
          status,
          COUNT(*) as count
        FROM content_approvals
        GROUP BY status`;
      
      const result = await this.executeQuery(query);
      
      // Convert to object format
      const stats = {
        pending: 0,
        approved: 0,
        rejected: 0
      };
      
      result.rows.forEach(row => {
        stats[row.status] = parseInt(row.count);
      });
      
      stats.total = stats.pending + stats.approved + stats.rejected;
      
      return stats;
    } catch (error) {
      this.handleError(error, 'getApprovalStats');
    }
  }
}

module.exports = ContentApprovalService;