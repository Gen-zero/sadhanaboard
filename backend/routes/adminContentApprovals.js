const express = require('express');
const { adminAuthenticate, requirePermission } = require('../middleware/adminAuth');
const { catchAsync } = require('../middleware/errorHandler');
const ValidationMiddleware = require('../middleware/validationMiddleware');
const ContentApprovalService = require('../services/contentApprovalService');

const router = express.Router();

// Get all approval requests
router.get('/content-approvals', 
  adminAuthenticate, 
  requirePermission('read:approval'),
  catchAsync(async (req, res) => {
    const { status, contentType, submitterId, startDate, endDate, limit = 50, offset = 0 } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (contentType) filters.contentType = contentType;
    if (submitterId) filters.submitterId = submitterId;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    
    const result = await ContentApprovalService.getApprovalRequests(filters, parseInt(limit), parseInt(offset));
    res.json(result);
  })
);

// Get approval request by ID
router.get('/content-approvals/:id', 
  adminAuthenticate, 
  requirePermission('read:approval'),
  ValidationMiddleware.validateString('id', { required: true, minLength: 1 }),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const request = await ContentApprovalService.getApprovalRequestById(id);
    
    if (!request) {
      return res.status(404).json({ 
        error: 'Approval request not found',
        message: `Approval request with ID ${id} not found`
      });
    }
    
    res.json({ request });
  })
);

// Approve content
router.post('/content-approvals/:id/approve', 
  adminAuthenticate, 
  requirePermission('approve:content'),
  ValidationMiddleware.validateString('id', { required: true, minLength: 1 }),
  ValidationMiddleware.validateString('notes', { required: false, maxLength: 1000 }),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { notes } = req.body;
    
    // Log the approval attempt
    req.secureLog('CONTENT_APPROVAL_ATTEMPT', 'content_approval', id, { 
      action: 'approve'
    }, { category: 'content' });
    
    const request = await ContentApprovalService.approveContent(id, req.user.id, notes);
    
    // Log the successful approval
    req.secureLog('CONTENT_APPROVED', 'content_approval', id, { 
      notes
    }, { category: 'content' });
    
    res.json({ 
      message: 'Content approved successfully',
      request 
    });
  })
);

// Reject content
router.post('/content-approvals/:id/reject', 
  adminAuthenticate, 
  requirePermission('reject:content'),
  ValidationMiddleware.validateString('id', { required: true, minLength: 1 }),
  ValidationMiddleware.validateString('notes', { required: false, maxLength: 1000 }),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { notes } = req.body;
    
    // Log the rejection attempt
    req.secureLog('CONTENT_REJECTION_ATTEMPT', 'content_approval', id, { 
      action: 'reject'
    }, { 
      category: 'content',
      severity: 'warning'
    });
    
    const request = await ContentApprovalService.rejectContent(id, req.user.id, notes);
    
    // Log the successful rejection
    req.secureLog('CONTENT_REJECTED', 'content_approval', id, { 
      notes
    }, { category: 'content' });
    
    res.json({ 
      message: 'Content rejected successfully',
      request 
    });
  })
);

// Get pending approvals for current user
router.get('/content-approvals/pending', 
  adminAuthenticate, 
  requirePermission('read:approval'),
  catchAsync(async (req, res) => {
    const requests = await ContentApprovalService.getPendingApprovalsForUser(req.user.id);
    res.json({ requests });
  })
);

// Get user's approval history
router.get('/content-approvals/history', 
  adminAuthenticate, 
  requirePermission('read:approval'),
  catchAsync(async (req, res) => {
    const { limit = 50, offset = 0 } = req.query;
    const result = await ContentApprovalService.getUserApprovalHistory(req.user.id, parseInt(limit), parseInt(offset));
    res.json(result);
  })
);

// Create a new content approval request
router.post('/content-approvals', 
  adminAuthenticate, 
  requirePermission('read:approval'),
  ValidationMiddleware.validateString('contentType', { required: true, minLength: 1, maxLength: 50 }),
  ValidationMiddleware.validateString('contentId', { required: true, minLength: 1 }),
  ValidationMiddleware.validateString('notes', { required: false, maxLength: 1000 }),
  catchAsync(async (req, res) => {
    const { contentType, contentId, notes } = req.body;
    
    const request = await ContentApprovalService.createApprovalRequest(
      contentType, 
      contentId, 
      req.user.id, 
      notes
    );
    
    // Log the creation
    req.secureLog('CONTENT_APPROVAL_CREATED', 'content_approval', request.id, { 
      contentType,
      contentId
    }, { category: 'content' });
    
    res.status(201).json({ 
      message: 'Approval request created successfully',
      request 
    });
  })
);

// Get approval statistics
router.get('/content-approvals/stats', 
  adminAuthenticate, 
  requirePermission('read:approval'),
  catchAsync(async (req, res) => {
    try {
      // Get statistics from the service
      const stats = await ContentApprovalService.getApprovalStats();
      res.json({ stats });
    } catch (error) {
      // If the method doesn't exist yet, return basic stats
      const pending = await ContentApprovalService.getApprovalRequests({ status: 'pending' });
      const approved = await ContentApprovalService.getApprovalRequests({ status: 'approved' });
      const rejected = await ContentApprovalService.getApprovalRequests({ status: 'rejected' });
      
      res.json({
        stats: {
          pending: pending.total || 0,
          approved: approved.total || 0,
          rejected: rejected.total || 0,
          total: (pending.total || 0) + (approved.total || 0) + (rejected.total || 0)
        }
      });
    }
  })
);

module.exports = router;