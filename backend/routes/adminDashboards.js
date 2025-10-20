const express = require('express');
const { adminAuthenticate, requirePermission } = require('../middleware/adminAuth');
const { catchAsync } = require('../middleware/errorHandler');
const ValidationMiddleware = require('../middleware/validationMiddleware');
const DashboardService = require('../services/dashboardService');

const router = express.Router();

// Get all dashboards for current admin
router.get('/dashboards', 
  adminAuthenticate, 
  requirePermission('read:dashboard'),
  catchAsync(async (req, res) => {
    const dashboards = await DashboardService.getDashboardsForAdmin(req.user.id);
    res.json({ dashboards });
  })
);

// Get dashboard by ID
router.get('/dashboards/:id', 
  adminAuthenticate, 
  requirePermission('read:dashboard'),
  ValidationMiddleware.validateString('id', { required: true, minLength: 1 }),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const dashboard = await DashboardService.getDashboardById(id, req.user.id);
    
    if (!dashboard) {
      return res.status(404).json({ 
        error: 'Dashboard not found',
        message: `Dashboard with ID ${id} not found`
      });
    }
    
    res.json({ dashboard });
  })
);

// Create a new dashboard
router.post('/dashboards', 
  adminAuthenticate, 
  requirePermission('write:dashboard'),
  ValidationMiddleware.validateString('name', { required: true, minLength: 1, maxLength: 100 }),
  catchAsync(async (req, res) => {
    const { name, layout } = req.body;
    
    const dashboard = await DashboardService.createCustomDashboard(req.user.id, name, layout);
    
    // Log the creation
    req.secureLog('DASHBOARD_CREATED', 'dashboard', dashboard.id, { 
      name
    }, { category: 'dashboard' });
    
    res.status(201).json({ 
      message: 'Dashboard created successfully',
      dashboard 
    });
  })
);

// Update dashboard
router.put('/dashboards/:id', 
  adminAuthenticate, 
  requirePermission('write:dashboard'),
  ValidationMiddleware.validateString('id', { required: true, minLength: 1 }),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    const dashboard = await DashboardService.updateDashboard(id, req.user.id, updates);
    
    // Log the update
    req.secureLog('DASHBOARD_UPDATED', 'dashboard', id, { 
      updates: Object.keys(updates)
    }, { category: 'dashboard' });
    
    res.json({ 
      message: 'Dashboard updated successfully',
      dashboard 
    });
  })
);

// Delete dashboard
router.delete('/dashboards/:id', 
  adminAuthenticate, 
  requirePermission('delete:dashboard'),
  ValidationMiddleware.validateString('id', { required: true, minLength: 1 }),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await DashboardService.deleteDashboard(id, req.user.id);
    
    // Log the deletion
    req.secureLog('DASHBOARD_DELETED', 'dashboard', id, null, { 
      category: 'dashboard'
    });
    
    res.json({ 
      message: 'Dashboard deleted successfully'
    });
  })
);

// Get default dashboard
router.get('/dashboards/default', 
  adminAuthenticate, 
  requirePermission('read:dashboard'),
  catchAsync(async (req, res) => {
    const dashboard = await DashboardService.getDefaultDashboard(req.user.id);
    res.json({ dashboard });
  })
);

// Get available widgets
router.get('/dashboards/widgets', 
  adminAuthenticate, 
  requirePermission('read:dashboard'),
  catchAsync(async (req, res) => {
    const widgets = DashboardService.getAvailableWidgets();
    res.json({ widgets });
  })
);

// Set dashboard as default
router.post('/dashboards/:id/default', 
  adminAuthenticate, 
  requirePermission('write:dashboard'),
  ValidationMiddleware.validateString('id', { required: true, minLength: 1 }),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const dashboard = await DashboardService.updateDashboard(id, req.user.id, { is_default: true });
    
    // Log the action
    req.secureLog('DASHBOARD_SET_DEFAULT', 'dashboard', id, null, { 
      category: 'dashboard'
    });
    
    res.json({ 
      message: 'Dashboard set as default successfully',
      dashboard 
    });
  })
);

// Clone dashboard
router.post('/dashboards/:id/clone', 
  adminAuthenticate, 
  requirePermission('write:dashboard'),
  ValidationMiddleware.validateString('id', { required: true, minLength: 1 }),
  ValidationMiddleware.validateString('name', { required: false, minLength: 1, maxLength: 100 }),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    
    // Get the original dashboard
    const original = await DashboardService.getDashboardById(id, req.user.id);
    
    if (!original) {
      return res.status(404).json({ 
        error: 'Dashboard not found',
        message: `Dashboard with ID ${id} not found`
      });
    }
    
    // Create a new dashboard with the same layout
    const newName = name || `${original.name} (Copy)`;
    const cloned = await DashboardService.createCustomDashboard(
      req.user.id, 
      newName, 
      original.layout
    );
    
    // Log the action
    req.secureLog('DASHBOARD_CLONED', 'dashboard', cloned.id, { 
      originalId: id,
      newName
    }, { category: 'dashboard' });
    
    res.status(201).json({ 
      message: 'Dashboard cloned successfully',
      dashboard: cloned
    });
  })
);

// Get dashboard statistics
router.get('/dashboards/stats', 
  adminAuthenticate, 
  requirePermission('read:dashboard'),
  catchAsync(async (req, res) => {
    try {
      const dashboards = await DashboardService.getDashboardsForAdmin(req.user.id);
      
      const stats = {
        total: dashboards.length,
        custom: dashboards.filter(d => !d.is_default).length,
        default: dashboards.filter(d => d.is_default).length
      };
      
      res.json({ stats });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to get dashboard statistics',
        message: 'An error occurred while retrieving dashboard statistics'
      });
    }
  })
);

module.exports = router;