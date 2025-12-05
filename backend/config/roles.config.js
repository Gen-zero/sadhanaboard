/**
 * Role and Permission Definitions
 * Complete RBAC configuration for the application
 */

/**
 * Role Definitions
 * Hierarchical order (top = most privileged)
 */
const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MENTOR: 'MENTOR',
  USER: 'USER',
  GUEST: 'GUEST',
  DISABLED: 'DISABLED',
};

/**
 * Permission Definitions
 * Granular permissions for different operations
 */
const PERMISSIONS = {
  // User Management
  user_create: 'user:create',
  user_read: 'user:read',
  user_read_own: 'user:read_own',
  user_update: 'user:update',
  user_update_own: 'user:update_own',
  user_delete: 'user:delete',
  user_list: 'user:list',

  // Profile Management
  profile_read: 'profile:read',
  profile_read_own: 'profile:read_own',
  profile_update: 'profile:update',
  profile_update_own: 'profile:update_own',

  // Sadhana Management
  sadhana_create: 'sadhana:create',
  sadhana_read: 'sadhana:read',
  sadhana_read_own: 'sadhana:read_own',
  sadhana_update: 'sadhana:update',
  sadhana_update_own: 'sadhana:update_own',
  sadhana_delete: 'sadhana:delete',
  sadhana_delete_own: 'sadhana:delete_own',
  sadhana_list: 'sadhana:list',

  // Book Management
  book_create: 'book:create',
  book_read: 'book:read',
  book_update: 'book:update',
  book_delete: 'book:delete',
  book_list: 'book:list',

  // Community Features
  community_post_create: 'community:post_create',
  community_post_read: 'community:post_read',
  community_post_update_own: 'community:post_update_own',
  community_post_delete_own: 'community:post_delete_own',
  community_post_delete_any: 'community:post_delete_any',
  community_comment: 'community:comment',
  community_like: 'community:like',
  community_moderate: 'community:moderate',

  // Analytics
  analytics_view_own: 'analytics:view_own',
  analytics_view_all: 'analytics:view_all',

  // Administration
  admin_manage_users: 'admin:manage_users',
  admin_manage_roles: 'admin:manage_roles',
  admin_manage_content: 'admin:manage_content',
  admin_view_analytics: 'admin:view_analytics',
  admin_view_logs: 'admin:view_logs',
  admin_settings: 'admin:settings',

  // System
  system_access: 'system:access',
};

/**
 * Role to Permissions Mapping
 * Defines which permissions each role has
 */
const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    // Super admin has all permissions
    ...Object.values(PERMISSIONS),
  ],

  [ROLES.ADMIN]: [
    // User management
    PERMISSIONS.user_create,
    PERMISSIONS.user_read,
    PERMISSIONS.user_update,
    PERMISSIONS.user_delete,
    PERMISSIONS.user_list,

    // Profile management
    PERMISSIONS.profile_read,
    PERMISSIONS.profile_update,

    // Sadhana management
    PERMISSIONS.sadhana_read,
    PERMISSIONS.sadhana_update,
    PERMISSIONS.sadhana_delete,
    PERMISSIONS.sadhana_list,

    // Book management
    PERMISSIONS.book_create,
    PERMISSIONS.book_read,
    PERMISSIONS.book_update,
    PERMISSIONS.book_delete,
    PERMISSIONS.book_list,

    // Community moderation
    PERMISSIONS.community_post_read,
    PERMISSIONS.community_post_delete_any,
    PERMISSIONS.community_moderate,

    // Analytics
    PERMISSIONS.analytics_view_all,

    // Admin features
    PERMISSIONS.admin_manage_users,
    PERMISSIONS.admin_manage_content,
    PERMISSIONS.admin_view_analytics,
    PERMISSIONS.admin_view_logs,
    PERMISSIONS.admin_settings,

    // System access
    PERMISSIONS.system_access,
  ],

  [ROLES.MENTOR]: [
    // Profile management
    PERMISSIONS.profile_read,
    PERMISSIONS.profile_read_own,
    PERMISSIONS.profile_update_own,

    // Sadhana management
    PERMISSIONS.sadhana_create,
    PERMISSIONS.sadhana_read,
    PERMISSIONS.sadhana_read_own,
    PERMISSIONS.sadhana_update_own,
    PERMISSIONS.sadhana_delete_own,
    PERMISSIONS.sadhana_list,

    // Book management
    PERMISSIONS.book_create,
    PERMISSIONS.book_read,
    PERMISSIONS.book_update,
    PERMISSIONS.book_list,

    // Community features
    PERMISSIONS.community_post_create,
    PERMISSIONS.community_post_read,
    PERMISSIONS.community_post_update_own,
    PERMISSIONS.community_post_delete_own,
    PERMISSIONS.community_comment,
    PERMISSIONS.community_like,

    // Analytics
    PERMISSIONS.analytics_view_own,

    // System access
    PERMISSIONS.system_access,
  ],

  [ROLES.USER]: [
    // Profile management
    PERMISSIONS.profile_read_own,
    PERMISSIONS.profile_update_own,

    // Sadhana management
    PERMISSIONS.sadhana_create,
    PERMISSIONS.sadhana_read_own,
    PERMISSIONS.sadhana_update_own,
    PERMISSIONS.sadhana_delete_own,

    // Book management
    PERMISSIONS.book_read,
    PERMISSIONS.book_list,

    // Community features
    PERMISSIONS.community_post_create,
    PERMISSIONS.community_post_read,
    PERMISSIONS.community_post_update_own,
    PERMISSIONS.community_post_delete_own,
    PERMISSIONS.community_comment,
    PERMISSIONS.community_like,

    // Analytics
    PERMISSIONS.analytics_view_own,

    // System access
    PERMISSIONS.system_access,
  ],

  [ROLES.GUEST]: [
    // Minimal permissions - read-only
    PERMISSIONS.book_read,
    PERMISSIONS.book_list,
    PERMISSIONS.community_post_read,
  ],

  [ROLES.DISABLED]: [
    // No permissions
  ],
};

/**
 * Role Hierarchy
 * Higher index = higher privilege
 */
const ROLE_HIERARCHY = [
  ROLES.DISABLED,    // 0
  ROLES.GUEST,       // 1
  ROLES.USER,        // 2
  ROLES.MENTOR,      // 3
  ROLES.ADMIN,       // 4
  ROLES.SUPER_ADMIN, // 5
];

/**
 * Role Descriptions
 */
const ROLE_DESCRIPTIONS = {
  [ROLES.SUPER_ADMIN]: {
    name: 'Super Administrator',
    description: 'Full system access, can manage all features and users',
    level: 5,
    canAssign: [],
  },
  [ROLES.ADMIN]: {
    name: 'Administrator',
    description: 'System administration, user management, content moderation',
    level: 4,
    canAssign: [ROLES.MENTOR, ROLES.USER, ROLES.GUEST, ROLES.DISABLED],
  },
  [ROLES.MENTOR]: {
    name: 'Mentor',
    description: 'Guide community, create and manage content',
    level: 3,
    canAssign: [ROLES.USER, ROLES.GUEST],
  },
  [ROLES.USER]: {
    name: 'User',
    description: 'Standard user with full community access',
    level: 2,
    canAssign: [],
  },
  [ROLES.GUEST]: {
    name: 'Guest',
    description: 'Limited read-only access',
    level: 1,
    canAssign: [],
  },
  [ROLES.DISABLED]: {
    name: 'Disabled',
    description: 'Account disabled, no access',
    level: 0,
    canAssign: [],
  },
};

/**
 * Resource-based Permissions
 * For specific resource access control
 */
const RESOURCE_PERMISSIONS = {
  sadhana: {
    owner_can: [
      'read',
      'update',
      'delete',
      'share',
      'comment',
    ],
    mentor_can: [
      'read',
      'comment',
      'guide',
    ],
    public_can: [
      'read',
    ],
  },
  user_profile: {
    owner_can: [
      'read',
      'update',
      'delete_account',
    ],
    mentor_can: [
      'read',
      'comment',
    ],
    admin_can: [
      'read',
      'update',
      'suspend',
      'delete',
    ],
    public_can: [
      'read_limited',
    ],
  },
  community_post: {
    owner_can: [
      'read',
      'update',
      'delete',
      'edit',
    ],
    mentor_can: [
      'read',
      'reply',
      'pin',
    ],
    admin_can: [
      'read',
      'delete',
      'hide',
      'moderate',
    ],
    public_can: [
      'read',
    ],
  },
};

/**
 * Helper Functions
 */

/**
 * Get all permissions for a role
 */
function getPermissionsForRole(role) {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if role has permission
 */
function hasPermission(role, permission) {
  const permissions = getPermissionsForRole(role);
  return permissions.includes(permission);
}

/**
 * Check if role has any of the permissions
 */
function hasAnyPermission(role, permissions) {
  const rolePermissions = getPermissionsForRole(role);
  return permissions.some(perm => rolePermissions.includes(perm));
}

/**
 * Check if role has all permissions
 */
function hasAllPermissions(role, permissions) {
  const rolePermissions = getPermissionsForRole(role);
  return permissions.every(perm => rolePermissions.includes(perm));
}

/**
 * Get role hierarchy level
 */
function getRoleLevel(role) {
  return ROLE_HIERARCHY.indexOf(role);
}

/**
 * Check if one role is higher than another
 */
function isRoleHigherThan(role1, role2) {
  return getRoleLevel(role1) > getRoleLevel(role2);
}

/**
 * Check if user can assign role to another user
 */
function canAssignRole(userRole, targetRole) {
  const description = ROLE_DESCRIPTIONS[userRole];
  if (!description) return false;
  return description.canAssign.includes(targetRole);
}

/**
 * Get available roles for a user to assign
 */
function getAssignableRoles(userRole) {
  const description = ROLE_DESCRIPTIONS[userRole];
  return description ? description.canAssign : [];
}

/**
 * Check resource permission for user
 */
function checkResourcePermission(resourceType, userRole, action, resourceOwnerId, userId) {
  const resource = RESOURCE_PERMISSIONS[resourceType];
  if (!resource) return false;

  // Owner permissions
  if (userId === resourceOwnerId) {
    if (resource.owner_can.includes(action)) return true;
  }

  // Role-based permissions
  const roleKey = `${userRole.toLowerCase()}_can`;
  if (resource[roleKey]) {
    if (resource[roleKey].includes(action)) return true;
  }

  // Public permissions
  if (resource.public_can && resource.public_can.includes(action)) {
    return true;
  }

  return false;
}

/**
 * Get role display name
 */
function getRoleDisplayName(role) {
  return ROLE_DESCRIPTIONS[role]?.name || role;
}

/**
 * Get all roles
 */
function getAllRoles() {
  return Object.values(ROLES);
}

/**
 * Validate role
 */
function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}

module.exports = {
  // Enums
  ROLES,
  PERMISSIONS,

  // Mappings
  ROLE_PERMISSIONS,
  ROLE_HIERARCHY,
  ROLE_DESCRIPTIONS,
  RESOURCE_PERMISSIONS,

  // Helper functions
  getPermissionsForRole,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRoleLevel,
  isRoleHigherThan,
  canAssignRole,
  getAssignableRoles,
  checkResourcePermission,
  getRoleDisplayName,
  getAllRoles,
  isValidRole,
};
