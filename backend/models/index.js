/**
 * Central export of all Mongoose models
 * This file aggregates all schema models for easy importing across the application
 */

// Import all schemas/models
const Sadhana = require('../schemas/Sadhana');
const SadhanaSession = require('../schemas/SadhanaSession');
const SadhanaProgress = require('../schemas/SadhanaProgress');
const SpiritualMilestone = require('../schemas/SpiritualMilestone');
const User = require('../schemas/User');
const UserFollower = require('../schemas/UserFollower');
const Book = require('../schemas/Book');
const BookAnalytics = require('../schemas/BookAnalytics');
const AdminLog = require('../schemas/AdminLog');
const SecurityEvent = require('../schemas/SecurityEvent');
const SadhanaActivity = require('../schemas/SadhanaActivity');
const CommunityActivity = require('../schemas/CommunityActivity');
const CommunityPost = require('../schemas/CommunityPost');
const CommunityComment = require('../schemas/CommunityComment');

// Import other existing schemas - these should already exist
const ActivityLog = require('../schemas/ActivityLog');
const AuditLog = require('../schemas/AuditLog');
const BiReport = require('../schemas/BiReport');
const BookAnnotation = require('../schemas/BookAnnotation');
const BookBookmark = require('../schemas/BookBookmark');
const BookProgress = require('../schemas/BookProgress');
const BugReport = require('../schemas/BugReport');
const Experiment = require('../schemas/Experiment');
const FeatureFlag = require('../schemas/FeatureFlag');
const Feedback = require('../schemas/Feedback');
const GoogleSheetsIntegration = require('../schemas/GoogleSheetsIntegration');
const Group = require('../schemas/Group');
const GroupMember = require('../schemas/GroupMember');
const Mentorship = require('../schemas/Mentorship');
const MentorshipGoal = require('../schemas/MentorshipGoal');
const NotificationLog = require('../schemas/NotificationLog');
const Profile = require('../schemas/Profile');
const SadhanaComment = require('../schemas/SadhanaComment');
const SadhanaLike = require('../schemas/SadhanaLike');
const SadhanaStoreItem = require('../schemas/SadhanaStoreItem');
const SchemaTemplate = require('../schemas/SchemaTemplate');
const SharedSadhana = require('../schemas/SharedSadhana');
const SharedSadhanaLike = require('../schemas/SharedSadhanaLike');
const SpiritualBook = require('../schemas/SpiritualBook');
const Support = require('../schemas/Support');
const SystemMetrics = require('../schemas/SystemMetrics');
const UserNotification = require('../schemas/UserNotification');
const UserPreferences = require('../schemas/UserPreferences');
const Waitlist = require('../schemas/Waitlist');

// Export all models
module.exports = {
  // Core models
  Sadhana,
  SadhanaSession,
  SadhanaProgress,
  SpiritualMilestone,
  User,
  UserFollower,
  
  // Book-related models
  Book,
  BookAnalytics,
  BookAnnotation,
  BookBookmark,
  BookProgress,
  SpiritualBook,
  
  // Community models
  CommunityActivity,
  CommunityPost,
  CommunityComment,
  SadhanaComment,
  SadhanaLike,
  SharedSadhana,
  SharedSadhanaLike,
  
  // Admin & Logging models
  ActivityLog,
  AdminLog,
  AuditLog,
  SecurityEvent,
  SadhanaActivity,
  NotificationLog,
  
  // Group & Social models
  Group,
  GroupMember,
  Mentorship,
  MentorshipGoal,
  
  // User & Profile models
  Profile,
  UserNotification,
  UserPreferences,
  
  // Data & Analytics models
  BiReport,
  BugReport,
  Feedback,
  Support,
  SystemMetrics,
  
  // Configuration & Integration models
  Experiment,
  FeatureFlag,
  GoogleSheetsIntegration,
  SadhanaStoreItem,
  SchemaTemplate,
  Waitlist
};
