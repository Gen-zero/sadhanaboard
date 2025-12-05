const User = require('../schemas/User');
const UserFollower = require('../schemas/UserFollower');
const Group = require('../schemas/Group');
const GroupMember = require('../schemas/GroupMember');
const ActivityLog = require('../schemas/ActivityLog');
const Profile = require('../schemas/Profile');

class SocialService {
  /* FOLLOW METHODS */
  static async followUser(followerId, followedId) {
    try {
      if (String(followerId) === String(followedId)) throw new Error('Cannot follow yourself');

      const user = await User.findById(followedId);
      if (!user) throw new Error('User to follow not found');

      let follower = await UserFollower.findOne({ followerId, followedId });
      if (!follower) {
        follower = new UserFollower({ followerId, followedId, status: 'active' });
      } else {
        follower.status = 'active';
      }
      await follower.save();

      // log activity
      const activity = new ActivityLog({
        userId: followerId,
        activityType: 'user_followed',
        activityData: { followedId }
      });
      await activity.save();

      return { success: true, following: true };
    } catch (error) {
      throw new Error(`Failed to follow user: ${error.message}`);
    }
  }

  static async unfollowUser(followerId, followedId) {
    try {
      const follower = await UserFollower.findOneAndDelete({ followerId, followedId });
      if (!follower) throw new Error('Follow relationship not found');
      return { success: true, following: false };
    } catch (error) {
      throw new Error(`Failed to unfollow user: ${error.message}`);
    }
  }

  static async getFollowers(userId, pagination = { limit: 50, offset: 0 }) {
    try {
      const limit = pagination.limit || 50;
      const offset = pagination.offset || 0;
      const followers = await UserFollower.find({ followedId: userId, status: 'active' })
        .populate('followerId', 'displayName avatar bio')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
      const total = await UserFollower.countDocuments({ followedId: userId, status: 'active' });
      return { followers, total, hasMore: offset + followers.length < total };
    } catch (error) {
      throw new Error(`Failed to fetch followers: ${error.message}`);
    }
  }

  static async getFollowing(userId, pagination = { limit: 50, offset: 0 }) {
    try {
      const limit = pagination.limit || 50;
      const offset = pagination.offset || 0;
      const following = await UserFollower.find({ followerId: userId, status: 'active' })
        .populate('followedId', 'displayName avatar bio')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
      const total = await UserFollower.countDocuments({ followerId: userId, status: 'active' });
      return { following, total, hasMore: offset + following.length < total };
    } catch (error) {
      throw new Error(`Failed to fetch following: ${error.message}`);
    }
  }

  static async getFollowStats(userId) {
    try {
      const followerCount = await UserFollower.countDocuments({ followedId: userId, status: 'active' });
      const followingCount = await UserFollower.countDocuments({ followerId: userId, status: 'active' });
      return { followerCount, followingCount };
    } catch (error) {
      throw new Error(`Failed to fetch follow stats: ${error.message}`);
    }
  }

  static async isFollowing(followerId, followedId) {
    try {
      const follower = await UserFollower.findOne({ followerId, followedId, status: 'active' });
      return !!follower;
    } catch (error) {
      throw new Error(`Failed to check follow status: ${error.message}`);
    }
  }

  static async removeFollower(userId, followerId) {
    try {
      const follower = await UserFollower.findOneAndDelete({ followerId, followedId: userId });
      if (!follower) throw new Error('Follower relationship not found');
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to remove follower: ${error.message}`);
    }
  }

  /* GROUP METHODS */
  static async createGroup(groupData, creatorId) {
    try {
      const { name, description, avatarUrl, groupType = 'public', tags = [], maxMembers = null, settings = {} } = groupData;
      if (!name || name.trim().length === 0) throw new Error('Group name required');
      if (name.length > 100) throw new Error('Group name too long');

      const group = new Group({
        name,
        description,
        avatarUrl,
        groupType,
        createdBy: creatorId,
        tags,
        maxMembers,
        settings
      });
      await group.save();

      // Add creator as owner
      const member = new GroupMember({
        groupId: group._id,
        userId: creatorId,
        role: 'owner',
        status: 'active'
      });
      await member.save();

      return group.toJSON();
    } catch (error) {
      throw new Error(`Failed to create group: ${error.message}`);
    }
  }

  static async updateGroup(groupId, userId, updates) {
    try {
      const member = await GroupMember.findOne({ groupId, userId, role: 'owner' });
      if (!member) throw new Error('Unauthorized to update group');

      const allowed = ['name', 'description', 'avatarUrl', 'groupType', 'tags', 'maxMembers', 'settings'];
      const updateData = {};
      for (const key of allowed) {
        if (updates[key] !== undefined) {
          updateData[key] = updates[key];
        }
      }

      if (Object.keys(updateData).length === 0) throw new Error('No valid fields to update');

      const group = await Group.findByIdAndUpdate(groupId, updateData, { new: true, runValidators: true });
      if (!group) throw new Error('Group not found');
      return group.toJSON();
    } catch (error) {
      throw new Error(`Failed to update group: ${error.message}`);
    }
  }

  static async deleteGroup(groupId, userId) {
    try {
      const member = await GroupMember.findOne({ groupId, userId, role: 'owner' });
      if (!member) throw new Error('Only group owner can delete group');
      await Group.findByIdAndDelete(groupId);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete group: ${error.message}`);
    }
  }

  static async getGroup(groupId, viewerId) {
    try {
      const group = await Group.findById(groupId)
        .populate('createdBy', 'displayName avatar')
        .lean();

      if (!group) throw new Error('Group not found');

      const viewerMember = await GroupMember.findOne({ groupId, userId: viewerId });
      const viewerRole = viewerMember ? viewerMember.role : null;
      const viewerStatus = viewerMember ? viewerMember.status : null;

      // Secret groups only visible to members
      if (group.groupType === 'secret' && viewerStatus !== 'active' && String(group.createdBy._id) !== String(viewerId)) {
        throw new Error('Group not found');
      }

      return { ...group, viewerRole, viewerStatus };
    } catch (error) {
      throw new Error(`Failed to fetch group: ${error.message}`);
    }
  }

  static async listGroups(filters = {}, pagination = { limit: 20, offset: 0 }, viewerId = null) {
    try {
      const { searchQuery, groupType, tags, sortBy = 'recent' } = filters;
      const limit = pagination.limit || 20;
      const offset = pagination.offset || 0;

      const query = {};

      if (groupType) {
        query.groupType = groupType;
      }

      if (searchQuery) {
        query.$or = [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } }
        ];
      }

      if (tags && tags.length) {
        query.tags = { $in: tags };
      }

      // Secret groups only visible to members
      if (!viewerId) {
        query.groupType = { $ne: 'secret' };
      } else {
        const memberGroups = await GroupMember.find({ userId: viewerId, status: 'active' }).select('groupId');
        const memberGroupIds = memberGroups.map(m => m.groupId);
        query.$or = [
          { groupType: { $ne: 'secret' } },
          { _id: { $in: memberGroupIds } }
        ];
      }

      const sortObj = {};
      if (sortBy === 'popular') {
        sortObj.memberCount = -1;
      } else if (sortBy === 'name') {
        sortObj.name = 1;
      } else {
        sortObj.createdAt = -1;
      }

      const groups = await Group.find(query)
        .sort(sortObj)
        .skip(offset)
        .limit(limit)
        .lean();

      const total = await Group.countDocuments(query);
      return { groups, total, hasMore: offset + groups.length < total };
    } catch (error) {
      throw new Error(`Failed to list groups: ${error.message}`);
    }
  }

  static async getUserGroups(userId, pagination = { limit: 20, offset: 0 }) {
    try {
      const limit = pagination.limit || 20;
      const offset = pagination.offset || 0;
      const members = await GroupMember.find({ userId, status: 'active' })
        .populate('groupId')
        .sort({ joinedAt: -1 })
        .skip(offset)
        .limit(limit);
      const total = await GroupMember.countDocuments({ userId, status: 'active' });
      const groups = members.map(m => ({ ...m.groupId.toJSON(), role: m.role }));
      return { groups, total };
    } catch (error) {
      throw new Error(`Failed to fetch user groups: ${error.message}`);
    }
  }

  static async joinGroup(groupId, userId) {
    try {
      const group = await Group.findById(groupId);
      if (!group) throw new Error('Group not found');
      if (group.maxMembers && group.memberCount >= group.maxMembers) throw new Error('Group is full');

      let member = await GroupMember.findOne({ groupId, userId });
      if (member) {
        if (member.status === 'active') return { success: true, status: 'active' };
        return { success: true, status: member.status };
      }

      const status = group.groupType === 'public' ? 'active' : (group.groupType === 'private' ? 'pending' : null);
      if (!status) throw new Error('Cannot join secret group without invitation');

      member = new GroupMember({ groupId, userId, role: 'member', status });
      await member.save();
      return { success: true, status };
    } catch (error) {
      throw new Error(`Failed to join group: ${error.message}`);
    }
  }

  static async leaveGroup(groupId, userId) {
    try {
      const ownerCount = await GroupMember.countDocuments({ groupId, role: 'owner', status: 'active' });
      const member = await GroupMember.findOne({ groupId, userId });
      if (member && member.role === 'owner' && ownerCount === 1) {
        throw new Error('Cannot leave group as the only owner. Transfer ownership or delete group.');
      }
      await GroupMember.findOneAndDelete({ groupId, userId });
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to leave group: ${error.message}`);
    }
  }

  static async updateMemberRole(groupId, targetUserId, newRole, requesterId) {
    try {
      const member = await GroupMember.findOne({ groupId, userId: requesterId, role: 'owner' });
      if (!member) throw new Error('Unauthorized');
      if (!['owner', 'moderator', 'member'].includes(newRole)) throw new Error('Invalid role');
      
      const updated = await GroupMember.findOneAndUpdate(
        { groupId, userId: targetUserId },
        { role: newRole },
        { new: true }
      );
      if (!updated) throw new Error('Member not found');
      return updated.toJSON();
    } catch (error) {
      throw new Error(`Failed to update member role: ${error.message}`);
    }
  }

  static async removeMember(groupId, targetUserId, requesterId) {
    try {
      const member = await GroupMember.findOne({ groupId, userId: requesterId, role: 'owner' });
      if (!member) throw new Error('Unauthorized');
      
      const ownerCount = await GroupMember.countDocuments({ groupId, role: 'owner', status: 'active' });
      const targetMember = await GroupMember.findOne({ groupId, userId: targetUserId });
      if (targetMember && targetMember.role === 'owner' && ownerCount === 1) {
        throw new Error('Cannot remove the only owner');
      }
      
      await GroupMember.findOneAndDelete({ groupId, userId: targetUserId });
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to remove member: ${error.message}`);
    }
  }

  static async getGroupMembers(groupId, viewerId, pagination = { limit: 50, offset: 0 }) {
    try {
      const group = await Group.findById(groupId).select('groupType');
      if (!group) throw new Error('Group not found');
      
      if (group.groupType === 'secret') {
        const member = await GroupMember.findOne({ groupId, userId: viewerId, status: 'active' });
        if (!member) throw new Error('Unauthorized to view members');
      }
      
      const limit = pagination.limit || 50;
      const offset = pagination.offset || 0;
      const members = await GroupMember.find({ groupId, status: 'active' })
        .populate('userId', 'displayName avatar bio')
        .sort({ role: 1, joinedAt: 1 }) // owners first, then by join date
        .skip(offset)
        .limit(limit);
      
      const total = await GroupMember.countDocuments({ groupId, status: 'active' });
      return { members, total };
    } catch (error) {
      throw new Error(`Failed to fetch group members: ${error.message}`);
    }
  }

  static async getGroupActivity(groupId, viewerId, pagination = { limit: 50, offset: 0 }) {
    try {
      const member = await GroupMember.findOne({ groupId, userId: viewerId, status: 'active' });
      if (!member) throw new Error('Unauthorized to view group activity');
      
      const limit = pagination.limit || 50;
      const offset = pagination.offset || 0;
      const activities = await ActivityLog.find({ relatedGroup: groupId })
        .populate('userId', 'displayName avatar')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
      
      const total = await ActivityLog.countDocuments({ relatedGroup: groupId });
      return { activities, total };
    } catch (error) {
      throw new Error(`Failed to fetch group activity: ${error.message}`);
    }
  }

  /* ACTIVITY FEED */
  static async getFollowedUsersActivity(userId, pagination = { limit: 20, offset: 0 }) {
    try {
      const limit = pagination.limit || 20;
      const offset = pagination.offset || 0;
      
      const followers = await UserFollower.find({ followerId: userId, status: 'active' }).select('followedId');
      const followedIds = followers.map(f => f.followedId);
      
      if (followedIds.length === 0) return { activities: [], total: 0, hasMore: false };
      
      const allowedTypes = ['sadhana_completed', 'sadhana_shared', 'milestone_achieved', 'badge_earned', 'group_joined'];
      const activities = await ActivityLog.find({
        userId: { $in: followedIds },
        activityType: { $in: allowedTypes }
      })
        .populate('userId', 'displayName avatar')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
      
      const total = await ActivityLog.countDocuments({
        userId: { $in: followedIds },
        activityType: { $in: allowedTypes }
      });
      
      return { activities, total, hasMore: offset + activities.length < total };
    } catch (error) {
      throw new Error(`Failed to fetch activity feed: ${error.message}`);
    }
  }

  static async logActivity(userId, activityType, activityData = {}) {
    try {
      const activity = new ActivityLog({
        userId,
        activityType,
        activityData
      });
      await activity.save();
      return activity.toJSON();
    } catch (error) {
      throw new Error(`Failed to log activity: ${error.message}`);
    }
  }
}

module.exports = SocialService;
