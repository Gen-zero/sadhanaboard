/**
 * RBAC Middleware
 * Role and permission checking middleware for Express
 */

const RBACService = require('../services/rbacService');
const { ROLES } = require('../config/roles.config');

/**
 * Middleware to require specific role(s)
 * @param {string|string[]} allowedRoles - Single role or array of roles
 */
function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient role permissions',
        requiredRoles: roles,
        userRole: req.user.role,
      });
    }

    next();
  };
}

/**
 * Middleware to require specific permission(s)
 * @param {string|string[]} requiredPermissions - Single permission or array
 */
function requirePermission(requiredPermissions) {
  const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const userRole = req.user.role;

    // Check if user has all required permissions
    if (!RBACService.userHasAllPermissions(userRole, permissions)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
        requiredPermissions: permissions,
      });
    }

    next();
  };
}

/**
 * Middleware to require any of the permissions
 * @param {string[]} permissions - Array of permissions (OR logic)
 */
function requireAnyPermission(permissions) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const userRole = req.user.role;

    // Check if user has any of the permissions
    if (!RBACService.userHasAnyPermission(userRole, permissions)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
        requiredPermissions: permissions,
      });
    }

    next();
  };
}

/**
 * Middleware to require admin or higher role
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }

  if (!RBACService.isAdmin(req.user.role)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required',
    });
  }

  next();
}

/**
 * Middleware to require super admin role
 */
function requireSuperAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }

  if (!RBACService.isSuperAdmin(req.user.role)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Super admin access required',
    });
  }

  next();
}

/**
 * Middleware to check resource ownership
 * Verifies user owns the resource or is admin
 * @param {string} userIdPath - Path in req object to get user ID
 * @param {string} resourceOwnerPath - Path in req object to get resource owner ID
 */
function requireResourceOwnership(userIdPath = 'user.id', resourceOwnerPath = 'body.user_id') {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const userId = req.user.id;
    const resourceOwnerId = getNestedProperty(req, resourceOwnerPath);

    // Admin can access any resource
    if (RBACService.isAdmin(req.user.role)) {
      return next();
    }

    // User must own the resource
    if (userId !== resourceOwnerId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not own this resource',
      });
    }

    next();
  };
}

/**
 * Middleware to check disabled users
 * Prevents disabled users from accessing any protected resource
 */
function preventDisabledUsers(req, res, next) {
  if (!req.user) {
    return next();
  }

  if (RBACService.isRoleDisabled(req.user.role)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Your account has been disabled',
    });
  }

  next();
}

/**
 * Middleware to attach user permissions to request
 * Useful for conditional rendering in response
 */
function attachPermissions(req, res, next) {
  if (!req.user) {
    return next();
  }

  const role = req.user.role;

  // Attach helper methods
  req.can = {
    create: (resource) => RBACService.userHasPermission(role, `${resource}:create`),
    read: (resource) => RBACService.userHasPermission(role, `${resource}:read`),
    update: (resource) => RBACService.userHasPermission(role, `${resource}:update`),
    delete: (resource) => RBACService.userHasPermission(role, `${resource}:delete`),
    access: (resource) => RBACService.userHasPermission(role, `${resource}:read`),
  };

  req.isAdmin = () => RBACService.isAdmin(role);
  req.isSuperAdmin = () => RBACService.isSuperAdmin(role);
  req.hasPermission = (permission) => RBACService.userHasPermission(role, permission);

  next();
}

/**
 * Middleware for role hierarchy validation
 * Ensures user can only manage users of lower role
 */
function validateRoleHierarchy(req, res, next) {
  if (!req.user) {
    return next();
  }

  const targetRole = req.body.role || req.params.role;

  if (targetRole) {
    try {
      RBACService.validateRoleChange(req.user.role, undefined, targetRole);
    } catch (error) {
      return res.status(error.statusCode || 403).json({
        error: error.message,
      });
    }
  }

  next();
}

/**
 * Middleware to log access for audit
 * Logs all access to sensitive resources
 */
function auditLog(resourceType) {
  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    // Log after response is sent
    res.on('finish', () => {
      const status = res.statusCode;

      // Only log certain status codes
      if ([200, 201, 403, 401].includes(status)) {
        console.log(`[AUDIT] ${req.user.id} - ${req.method} ${req.path} - ${resourceType} - Status: ${status}`);

        // Could send to audit service
        if (global.auditService) {
          global.auditService.log({
            userId: req.user.id,
            action: `${req.method} ${resourceType}`,
            resource: resourceType,
            path: req.path,
            status,
            timestamp: new Date(),
          });
        }
      }
    });

    next();
  };
}

/**
 * Helper function to get nested property
 */
function getNestedProperty(obj, path) {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

/**
 * Combine multiple middleware
 */
function requireRoleAndPermission(role, permission) {
  return [requireRole(role), requirePermission(permission)];
}

module.exports = {
  requireRole,
  requirePermission,
  requireAnyPermission,
  requireAdmin,
  requireSuperAdmin,
  requireResourceOwnership,
  preventDisabledUsers,
  attachPermissions,
  validateRoleHierarchy,
  auditLog,
  requireRoleAndPermission,
};
