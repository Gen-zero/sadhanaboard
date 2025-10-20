const db = require('../config/db');

// Define role-based permissions with more granular control
const ROLE_PERMISSIONS = {
  'admin': [
    'read:users',
    'write:users',
    'read:content',
    'write:content',
    'read:settings',
    'write:settings',
    'read:logs',
    'read:analytics',
    'read:community',
    'moderate:community',
    'read:dashboard',
    'write:dashboard',
    'read:backup',
    'create:backup',
    'read:approval',
    'approve:content'
  ],
  'super_admin': [
    'read:users',
    'write:users',
    'delete:users',
    'read:content',
    'write:content',
    'delete:content',
    'read:settings',
    'write:settings',
    'delete:settings',
    'read:logs',
    'write:logs',
    'delete:logs',
    'read:analytics',
    'write:analytics',
    'read:community',
    'write:community',
    'moderate:community',
    'delete:community',
    'manage:admins',
    'system:administration',
    'read:dashboard',
    'write:dashboard',
    'delete:dashboard',
    'read:backup',
    'create:backup',
    'restore:backup',
    'delete:backup',
    'read:approval',
    'approve:content',
    'reject:content',
    'manage:permissions'
  ],
  'moderator': [
    'read:users',
    'read:content',
    'write:content',
    'read:community',
    'moderate:community',
    'read:approval',
    'approve:content',
    'reject:content'
  ],
  'content_manager': [
    'read:content',
    'write:content',
    'read:approval',
    'approve:content',
    'reject:content'
  ],
  'analyst': [
    'read:users',
    'read:content',
    'read:logs',
    'read:analytics',
    'read:dashboard'
  ]
};

// Define resource-based permissions
const RESOURCE_PERMISSIONS = {
  'users': ['read', 'write', 'delete'],
  'content': ['read', 'write', 'delete'],
  'settings': ['read', 'write', 'delete'],
  'logs': ['read', 'write', 'delete'],
  'analytics': ['read', 'write'],
  'community': ['read', 'write', 'moderate', 'delete'],
  'admins': ['read', 'write', 'delete'],
  'system': ['read', 'write', 'administrate'],
  'dashboard': ['read', 'write', 'delete'],
  'backup': ['read', 'create', 'restore', 'delete'],
  'approval': ['read', 'approve', 'reject']
};

class PermissionsService {
  // Check if a user has a specific permission
  static async hasPermission(user, permission) {
    try {
      // Get user's role
      const role = user.role || 'admin';
      
      // Check if role exists in ROLE_PERMISSIONS
      if (!ROLE_PERMISSIONS[role]) {
        return false;
      }
      
      // Check if permission exists for this role
      return ROLE_PERMISSIONS[role].includes(permission);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  // Check if a user has access to a resource with a specific action
  static async hasResourceAccess(user, resource, action) {
    try {
      // Get user's role
      const role = user.role || 'admin';
      
      // Check if role exists in ROLE_PERMISSIONS
      if (!ROLE_PERMISSIONS[role]) {
        return false;
      }
      
      // Check if resource and action combination exists for this role
      const permission = `${action}:${resource}`;
      return ROLE_PERMISSIONS[role].includes(permission);
    } catch (error) {
      console.error('Error checking resource access:', error);
      return false;
    }
  }

  // Middleware to check permissions
  static checkPermission(permission) {
    return async (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json({ message: 'Authentication required' });
        }

        const hasPerm = await PermissionsService.hasPermission(req.user, permission);
        if (!hasPerm) {
          // Log the unauthorized access attempt
          console.warn(`Unauthorized access attempt by user ${req.user.id} (${req.user.username}) for permission: ${permission}`);
          return res.status(403).json({ 
            message: 'Insufficient permissions',
            requiredPermission: permission
          });
        }

        next();
      } catch (error) {
        console.error('Permission check error:', error);
        return res.status(500).json({ 
          message: 'Permission check failed',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
      }
    };
  }

  // Middleware to check resource access
  static checkResourceAccess(resource, action) {
    return async (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json({ message: 'Authentication required' });
        }

        const hasAccess = await PermissionsService.hasResourceAccess(req.user, resource, action);
        if (!hasAccess) {
          // Log the unauthorized access attempt
          console.warn(`Unauthorized access attempt by user ${req.user.id} (${req.user.username}) for resource: ${resource}, action: ${action}`);
          return res.status(403).json({ 
            message: 'Insufficient permissions',
            requiredResource: resource,
            requiredAction: action
          });
        }

        next();
      } catch (error) {
        console.error('Resource access check error:', error);
        return res.status(500).json({ 
          message: 'Resource access check failed',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
      }
    };
  }

  // Get all permissions for a user
  static async getUserPermissions(user) {
    try {
      const role = user.role || 'admin';
      return ROLE_PERMISSIONS[role] || [];
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }
  }

  // Get available roles
  static getAvailableRoles() {
    return Object.keys(ROLE_PERMISSIONS);
  }

  // Get permissions for a specific role
  static getRolePermissions(role) {
    return ROLE_PERMISSIONS[role] || [];
  }

  // Add a new role with specific permissions
  static addRole(role, permissions) {
    if (!Array.isArray(permissions)) {
      throw new Error('Permissions must be an array');
    }
    ROLE_PERMISSIONS[role] = permissions;
  }

  // Update permissions for an existing role
  static updateRolePermissions(role, permissions) {
    if (!ROLE_PERMISSIONS[role]) {
      throw new Error(`Role ${role} does not exist`);
    }
    if (!Array.isArray(permissions)) {
      throw new Error('Permissions must be an array');
    }
    ROLE_PERMISSIONS[role] = permissions;
  }

  // Remove a role
  static removeRole(role) {
    if (['admin', 'super_admin'].includes(role)) {
      throw new Error(`Cannot remove protected role: ${role}`);
    }
    delete ROLE_PERMISSIONS[role];
  }
}

module.exports = PermissionsService;