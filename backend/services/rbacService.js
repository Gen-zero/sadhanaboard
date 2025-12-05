/**
 * RBAC Service
 * Handles role-based access control and permission checking
 */

const {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isRoleHigherThan,
  canAssignRole,
  checkResourcePermission,
  ROLES,
} = require('../config/roles.config');

class RBACService {
  /**
   * Check if user has permission
   */
  static userHasPermission(userRole, permission) {
    if (!userRole) return false;
    return hasPermission(userRole, permission);
  }

  /**
   * Check if user has any of the permissions
   */
  static userHasAnyPermission(userRole, permissions) {
    if (!userRole) return false;
    return hasAnyPermission(userRole, permissions);
  }

  /**
   * Check if user has all permissions
   */
  static userHasAllPermissions(userRole, permissions) {
    if (!userRole) return false;
    return hasAllPermissions(userRole, permissions);
  }

  /**
   * Check if user can access resource
   * Supports both simple permission check and resource-based check
   */
  static canAccessResource(userRole, resourceType, action, resourceOwnerId = null, userId = null) {
    if (!userRole) return false;

    // Admin and super admin can access everything
    if ([ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(userRole)) {
      return true;
    }

    // Disabled users have no access
    if (userRole === ROLES.DISABLED) {
      return false;
    }

    // Check resource-based permissions if resource owner is specified
    if (resourceType && action && resourceOwnerId && userId) {
      return checkResourcePermission(resourceType, userRole, action, resourceOwnerId, userId);
    }

    return false;
  }

  /**
   * Check if user can assign role to another user
   */
  static canAssignRole(userRole, targetRole) {
    if (!userRole) return false;
    return canAssignRole(userRole, targetRole);
  }

  /**
   * Check if user can modify another user
   * Considers role hierarchy
   */
  static canModifyUser(modifierRole, targetRole) {
    if (!modifierRole || !targetRole) return false;

    // Super admin can modify anyone except super admin
    if (modifierRole === ROLES.SUPER_ADMIN) {
      return targetRole !== ROLES.SUPER_ADMIN;
    }

    // Admin can modify users with lower role
    if (modifierRole === ROLES.ADMIN) {
      return isRoleHigherThan(modifierRole, targetRole);
    }

    // Mentor can modify users (not admin)
    if (modifierRole === ROLES.MENTOR) {
      return isRoleHigherThan(modifierRole, targetRole);
    }

    // Regular users cannot modify other users
    return false;
  }

  /**
   * Check if user can view another user's data
   * Considers privacy levels
   */
  static canViewUserData(viewerRole, viewerUserId, targetUserId, dataType = 'basic') {
    if (!viewerRole || !targetUserId) return false;

    // Users can view their own data
    if (viewerUserId === targetUserId) {
      return true;
    }

    // Admin and super admin can view all data
    if ([ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(viewerRole)) {
      return true;
    }

    // Mentor can view basic profile of others
    if (viewerRole === ROLES.MENTOR) {
      return dataType === 'basic' || dataType === 'profile';
    }

    // Regular users can view basic public data
    if (viewerRole === ROLES.USER) {
      return dataType === 'public' || dataType === 'basic';
    }

    // Guests can only view public data
    if (viewerRole === ROLES.GUEST) {
      return dataType === 'public';
    }

    return false;
  }

  /**
   * Get actions available for user on resource
   */
  static getAvailableActions(userRole, resourceType, resourceOwnerId = null, userId = null) {
    const availableActions = [];

    const actions = ['read', 'create', 'update', 'delete', 'moderate', 'publish'];

    for (const action of actions) {
      if (this.canAccessResource(userRole, resourceType, action, resourceOwnerId, userId)) {
        availableActions.push(action);
      }
    }

    return availableActions;
  }

  /**
   * Validate user permissions for request
   * Throws error if unauthorized
   */
  static validatePermission(userRole, requiredPermission) {
    if (!this.userHasPermission(userRole, requiredPermission)) {
      const error = new Error('Insufficient permissions');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }
  }

  /**
   * Validate role access
   * Throws error if role not allowed
   */
  static validateRole(userRole, allowedRoles) {
    if (!allowedRoles.includes(userRole)) {
      const error = new Error('Invalid role for this operation');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }
  }

  /**
   * Sanitize user data based on role
   * Removes sensitive fields user shouldn't see
   */
  static sanitizeUserData(userData, viewerRole, isOwn = false) {
    if (!userData) return null;

    const data = { ...userData };

    // Super admin and admin see everything
    if ([ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(viewerRole)) {
      return data;
    }

    // Owner sees their own data
    if (isOwn) {
      // Remove sensitive admin fields
      delete data.ipHistory;
      delete data.suspiciousActivity;
      return data;
    }

    // Others see limited data
    const publicFields = [
      '_id',
      'display_name',
      'avatar',
      'role',
      'created_at',
      'bio',
    ];

    const safeData = {};
    for (const field of publicFields) {
      if (field in data) {
        safeData[field] = data[field];
      }
    }

    return safeData;
  }

  /**
   * Check if role is disabled
   */
  static isRoleDisabled(role) {
    return role === ROLES.DISABLED;
  }

  /**
   * Check if role is guest
   */
  static isGuestRole(role) {
    return role === ROLES.GUEST;
  }

  /**
   * Check if role is admin or higher
   */
  static isAdmin(role) {
    return [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);
  }

  /**
   * Check if role is super admin
   */
  static isSuperAdmin(role) {
    return role === ROLES.SUPER_ADMIN;
  }

  /**
   * Get role restrictions for query
   * Adds filter to only show data user can access
   */
  static getDataAccessFilter(userRole, userId) {
    // Admin and super admin see all
    if ([ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(userRole)) {
      return {};
    }

    // Regular users see only their own or public data
    if (userRole === ROLES.USER) {
      return {
        $or: [
          { user_id: userId },
          { visibility: 'public' },
          { visibility: 'followers' },
        ],
      };
    }

    // Guests see only public data
    if (userRole === ROLES.GUEST) {
      return {
        visibility: 'public',
      };
    }

    // Disabled see nothing
    return {
      _id: null, // Return empty result
    };
  }

  /**
   * Validate permission change
   * Ensures user can change another user's role
   */
  static validateRoleChange(modifierRole, targetRole, newRole) {
    // Can't change if modifier doesn't have permission
    if (!this.canModifyUser(modifierRole, targetRole)) {
      const error = new Error('Cannot modify this user');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    // Can't assign role higher than self
    if (isRoleHigherThan(newRole, modifierRole)) {
      const error = new Error('Cannot assign role higher than your own');
      error.statusCode = 403;
      error.code = 'INVALID_ROLE_ASSIGNMENT';
      throw error;
    }
  }
}

module.exports = RBACService;
