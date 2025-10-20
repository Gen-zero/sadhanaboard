const db = require('../config/db');

class SocialService {
  /* FOLLOW METHODS */
  static async followUser(followerId, followedId) {
    try {
      if (String(followerId) === String(followedId)) throw new Error('Cannot follow yourself');

      const userRes = await db.query(`SELECT id FROM profiles WHERE id = $1`, [followedId]);
      if (userRes.rows.length === 0) throw new Error('User to follow not found');

      await db.query(
        `INSERT INTO user_followers (follower_id, followed_id, status) VALUES ($1, $2, 'active') ON CONFLICT (follower_id, followed_id) DO UPDATE SET status = 'active'`,
        [followerId, followedId]
      );

      // log activity
      await db.query(`INSERT INTO community_activity (user_id, activity_type, activity_data) VALUES ($1, 'user_followed', $2)`, [followerId, JSON.stringify({ followed_id: followedId })]);

      return { success: true, following: true };
    } catch (error) {
      throw new Error(`Failed to follow user: ${error.message}`);
    }
  }

  static async unfollowUser(followerId, followedId) {
    try {
      const res = await db.query(`DELETE FROM user_followers WHERE follower_id = $1 AND followed_id = $2 RETURNING id`, [followerId, followedId]);
      if (res.rows.length === 0) throw new Error('Follow relationship not found');
      return { success: true, following: false };
    } catch (error) {
      throw new Error(`Failed to unfollow user: ${error.message}`);
    }
  }

  static async getFollowers(userId, pagination = { limit: 50, offset: 0 }) {
    try {
      const limit = pagination.limit || 50;
      const offset = pagination.offset || 0;
      const rows = await db.query(
        `SELECT uf.*, p.display_name, p.avatar_url, p.bio FROM user_followers uf JOIN profiles p ON p.id = uf.follower_id WHERE uf.followed_id = $1 AND uf.status = 'active' ORDER BY uf.created_at DESC LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
      const countRes = await db.query(`SELECT COUNT(*) FROM user_followers WHERE followed_id = $1 AND status = 'active'`, [userId]);
      const total = parseInt(countRes.rows[0].count, 10) || 0;
      return { followers: rows.rows, total, hasMore: offset + rows.rows.length < total };
    } catch (error) {
      throw new Error(`Failed to fetch followers: ${error.message}`);
    }
  }

  static async getFollowing(userId, pagination = { limit: 50, offset: 0 }) {
    try {
      const limit = pagination.limit || 50;
      const offset = pagination.offset || 0;
      const rows = await db.query(
        `SELECT uf.*, p.display_name, p.avatar_url, p.bio FROM user_followers uf JOIN profiles p ON p.id = uf.followed_id WHERE uf.follower_id = $1 AND uf.status = 'active' ORDER BY uf.created_at DESC LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
      const countRes = await db.query(`SELECT COUNT(*) FROM user_followers WHERE follower_id = $1 AND status = 'active'`, [userId]);
      const total = parseInt(countRes.rows[0].count, 10) || 0;
      return { following: rows.rows, total, hasMore: offset + rows.rows.length < total };
    } catch (error) {
      throw new Error(`Failed to fetch following: ${error.message}`);
    }
  }

  static async getFollowStats(userId) {
    try {
      const followerRes = await db.query(`SELECT get_follower_count($1) as cnt`, [userId]);
      const followingRes = await db.query(`SELECT get_following_count($1) as cnt`, [userId]);
      return { followerCount: parseInt(followerRes.rows[0].cnt, 10) || 0, followingCount: parseInt(followingRes.rows[0].cnt, 10) || 0 };
    } catch (error) {
      throw new Error(`Failed to fetch follow stats: ${error.message}`);
    }
  }

  static async isFollowing(followerId, followedId) {
    try {
      const res = await db.query(`SELECT is_following($1,$2) as is_following`, [followerId, followedId]);
      return !!res.rows[0].is_following;
    } catch (error) {
      throw new Error(`Failed to check follow status: ${error.message}`);
    }
  }

  static async removeFollower(userId, followerId) {
    try {
      const res = await db.query(`DELETE FROM user_followers WHERE follower_id = $1 AND followed_id = $2 RETURNING id`, [followerId, userId]);
      if (res.rows.length === 0) throw new Error('Follower relationship not found');
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to remove follower: ${error.message}`);
    }
  }

  /* GROUP METHODS */
  static async createGroup(groupData, creatorId) {
    try {
      const { name, description, avatar_url, group_type = 'public', tags = [], max_members = null, settings = {} } = groupData;
      if (!name || name.trim().length === 0) throw new Error('Group name required');
      if (name.length > 100) throw new Error('Group name too long');

      const res = await db.query(
        `INSERT INTO groups (name, description, avatar_url, group_type, created_by, tags, max_members, settings) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [name, description, avatar_url, group_type, creatorId, tags, max_members, settings]
      );
      return res.rows[0];
    } catch (error) {
      throw new Error(`Failed to create group: ${error.message}`);
    }
  }

  static async updateGroup(groupId, userId, updates) {
    try {
      const canManage = await db.query(`SELECT can_user_manage_group($1,$2) as ok`, [groupId, userId]);
      if (!canManage.rows[0].ok) throw new Error('Unauthorized to update group');

      const fields = [];
      const params = [];
      let idx = 1;
      const allowed = ['name','description','avatar_url','group_type','tags','max_members','settings'];
      for (const key of allowed) {
        if (updates[key] !== undefined) {
          fields.push(`${key} = $${idx}`);
          params.push(updates[key]);
          idx++;
        }
      }
      if (fields.length === 0) throw new Error('No valid fields to update');
      params.push(groupId);
      const q = `UPDATE groups SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`;
      const res = await db.query(q, params);
      if (res.rows.length === 0) throw new Error('Group not found');
      return res.rows[0];
    } catch (error) {
      throw new Error(`Failed to update group: ${error.message}`);
    }
  }

  static async deleteGroup(groupId, userId) {
    try {
      const roleRes = await db.query(`SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2 LIMIT 1`, [groupId, userId]);
      if (roleRes.rows.length === 0 || roleRes.rows[0].role !== 'owner') throw new Error('Only group owner can delete group');
      await db.query(`DELETE FROM groups WHERE id = $1`, [groupId]);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete group: ${error.message}`);
    }
  }

  static async getGroup(groupId, viewerId) {
    try {
      const res = await db.query(
        `SELECT g.*, p.display_name as creator_name, p.avatar as creator_avatar, gm.role as viewer_role, gm.status as viewer_status FROM groups g LEFT JOIN profiles p ON p.id = g.created_by LEFT JOIN group_members gm ON gm.group_id = g.id AND gm.user_id = $2 WHERE g.id = $1 LIMIT 1`,
        [groupId, viewerId]
      );
      if (res.rows.length === 0) throw new Error('Group not found');
      const row = res.rows[0];
      if (row.group_type === 'secret' && row.viewer_status !== 'active' && String(row.created_by) !== String(viewerId)) {
        throw new Error('Group not found');
      }
      return row;
    } catch (error) {
      throw new Error(`Failed to fetch group: ${error.message}`);
    }
  }

  static async listGroups(filters = {}, pagination = { limit: 20, offset: 0 }, viewerId = null) {
    try {
      const { searchQuery, group_type, tags, sortBy = 'recent' } = filters;
      const limit = pagination.limit || 20;
      const offset = pagination.offset || 0;

      const where = ['1=1'];
      const params = [];
      let idx = 1;
      if (group_type) { where.push(`group_type = $${idx}`); params.push(group_type); idx++; }
      if (searchQuery) { where.push(`to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'')) @@ plainto_tsquery($${idx})`); params.push(searchQuery); idx++; }
      if (tags && tags.length) { where.push(`tags && $${idx}`); params.push(tags); idx++; }

      // secret groups should only be visible to members
      if (!viewerId) {
        where.push(`group_type <> 'secret'`);
      } else {
        where.push(`(group_type <> 'secret' OR id IN (SELECT group_id FROM group_members WHERE user_id = $${idx} AND status = 'active'))`);
        params.push(viewerId);
        idx++;
      }

      const order = sortBy === 'popular' ? 'member_count DESC' : (sortBy === 'name' ? 'name ASC' : 'created_at DESC');

      params.push(limit); params.push(offset);
      const q = `SELECT * FROM groups WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT $${idx} OFFSET $${idx+1}`;
      const rows = await db.query(q, params);

      // count
      const countParams = [];
      let countSql = `SELECT COUNT(*) FROM groups WHERE ${where.join(' AND ')}`;
      // for simplicity reuse params when safe; but avoid passing limit/offset
      const countRes = await db.query(countSql, params.slice(0, params.length - 2));
      const total = parseInt(countRes.rows[0].count,10) || 0;
      return { groups: rows.rows, total, hasMore: offset + rows.rows.length < total };
    } catch (error) {
      throw new Error(`Failed to list groups: ${error.message}`);
    }
  }

  static async getUserGroups(userId, pagination = { limit: 20, offset: 0 }) {
    try {
      const limit = pagination.limit || 20; const offset = pagination.offset || 0;
      const rows = await db.query(`SELECT g.*, gm.role, gm.joined_at FROM groups g JOIN group_members gm ON gm.group_id = g.id WHERE gm.user_id = $1 AND gm.status = 'active' ORDER BY gm.joined_at DESC LIMIT $2 OFFSET $3`, [userId, limit, offset]);
      const countRes = await db.query(`SELECT COUNT(*) FROM group_members WHERE user_id = $1 AND status = 'active'`, [userId]);
      const total = parseInt(countRes.rows[0].count,10) || 0;
      return { groups: rows.rows, total };
    } catch (error) {
      throw new Error(`Failed to fetch user groups: ${error.message}`);
    }
  }

  static async joinGroup(groupId, userId) {
    try {
      const g = await db.query(`SELECT group_type, member_count, max_members FROM groups WHERE id = $1`, [groupId]);
      if (g.rows.length === 0) throw new Error('Group not found');
      const group = g.rows[0];
      if (group.max_members && group.member_count >= group.max_members) throw new Error('Group is full');
      const existing = await db.query(`SELECT status FROM group_members WHERE group_id = $1 AND user_id = $2 LIMIT 1`, [groupId, userId]);
      if (existing.rows.length > 0) {
        if (existing.rows[0].status === 'active') return { success: true, status: 'active' };
        return { success: true, status: existing.rows[0].status };
      }
      if (group.group_type === 'public') {
        await db.query(`INSERT INTO group_members (group_id, user_id, role, status) VALUES ($1,$2,'member','active')`, [groupId, userId]);
        return { success: true, status: 'active' };
      }
      if (group.group_type === 'private') {
        await db.query(`INSERT INTO group_members (group_id, user_id, role, status) VALUES ($1,$2,'member','pending')`, [groupId, userId]);
        return { success: true, status: 'pending' };
      }
      throw new Error('Cannot join secret group without invitation');
    } catch (error) {
      throw new Error(`Failed to join group: ${error.message}`);
    }
  }

  static async leaveGroup(groupId, userId) {
    try {
      const ownerCountRes = await db.query(`SELECT COUNT(*) FROM group_members WHERE group_id = $1 AND role = 'owner' AND status = 'active'`, [groupId]);
      const isOwnerRes = await db.query(`SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2 LIMIT 1`, [groupId, userId]);
      if (isOwnerRes.rows.length > 0 && isOwnerRes.rows[0].role === 'owner' && parseInt(ownerCountRes.rows[0].count,10) === 1) {
        throw new Error('Cannot leave group as the only owner. Transfer ownership or delete group.');
      }
      await db.query(`DELETE FROM group_members WHERE group_id = $1 AND user_id = $2`, [groupId, userId]);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to leave group: ${error.message}`);
    }
  }

  static async updateMemberRole(groupId, targetUserId, newRole, requesterId) {
    try {
      const canManage = await db.query(`SELECT can_user_manage_group($1,$2) as ok`, [groupId, requesterId]);
      if (!canManage.rows[0].ok) throw new Error('Unauthorized');
      if (!['owner','moderator','member'].includes(newRole)) throw new Error('Invalid role');
      const res = await db.query(`UPDATE group_members SET role = $1 WHERE group_id = $2 AND user_id = $3 RETURNING *`, [newRole, groupId, targetUserId]);
      if (res.rows.length === 0) throw new Error('Member not found');
      return res.rows[0];
    } catch (error) {
      throw new Error(`Failed to update member role: ${error.message}`);
    }
  }

  static async removeMember(groupId, targetUserId, requesterId) {
    try {
      const canManage = await db.query(`SELECT can_user_manage_group($1,$2) as ok`, [groupId, requesterId]);
      if (!canManage.rows[0].ok) throw new Error('Unauthorized');
      const ownerCountRes = await db.query(`SELECT COUNT(*) FROM group_members WHERE group_id = $1 AND role = 'owner' AND status = 'active'`, [groupId]);
      const targetRoleRes = await db.query(`SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2 LIMIT 1`, [groupId, targetUserId]);
      if (targetRoleRes.rows.length > 0 && targetRoleRes.rows[0].role === 'owner' && parseInt(ownerCountRes.rows[0].count,10) === 1) {
        throw new Error('Cannot remove the only owner');
      }
      await db.query(`DELETE FROM group_members WHERE group_id = $1 AND user_id = $2`, [groupId, targetUserId]);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to remove member: ${error.message}`);
    }
  }

  static async getGroupMembers(groupId, viewerId, pagination = { limit: 50, offset: 0 }) {
    try {
      // check visibility
      const g = await db.query(`SELECT group_type FROM groups WHERE id = $1`, [groupId]);
      if (g.rows.length === 0) throw new Error('Group not found');
      const group = g.rows[0];
      if (group.group_type === 'secret') {
        const m = await db.query(`SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2 AND status = 'active'`, [groupId, viewerId]);
        if (m.rows.length === 0) throw new Error('Unauthorized to view members');
      }
      const limit = pagination.limit || 50; const offset = pagination.offset || 0;
      const rows = await db.query(`SELECT gm.*, p.display_name, p.avatar as avatar_url, p.bio FROM group_members gm JOIN profiles p ON p.id = gm.user_id WHERE gm.group_id = $1 AND gm.status = 'active' ORDER BY CASE WHEN gm.role = 'owner' THEN 1 WHEN gm.role = 'moderator' THEN 2 ELSE 3 END, gm.joined_at ASC LIMIT $2 OFFSET $3`, [groupId, limit, offset]);
      const countRes = await db.query(`SELECT COUNT(*) FROM group_members WHERE group_id = $1 AND status = 'active'`, [groupId]);
      const total = parseInt(countRes.rows[0].count,10) || 0;
      return { members: rows.rows, total };
    } catch (error) {
      throw new Error(`Failed to fetch group members: ${error.message}`);
    }
  }

  static async getGroupActivity(groupId, viewerId, pagination = { limit: 50, offset: 0 }) {
    try {
      // must be member to view
      const m = await db.query(`SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2 AND status = 'active'`, [groupId, viewerId]);
      if (m.rows.length === 0) throw new Error('Unauthorized to view group activity');
      const limit = pagination.limit || 50; const offset = pagination.offset || 0;
      const rows = await db.query(`SELECT ga.*, p.display_name, p.avatar as avatar_url FROM group_activity ga LEFT JOIN profiles p ON p.id = ga.user_id WHERE ga.group_id = $1 ORDER BY ga.created_at DESC LIMIT $2 OFFSET $3`, [groupId, limit, offset]);
      const countRes = await db.query(`SELECT COUNT(*) FROM group_activity WHERE group_id = $1`, [groupId]);
      const total = parseInt(countRes.rows[0].count,10) || 0;
      return { activities: rows.rows, total };
    } catch (error) {
      throw new Error(`Failed to fetch group activity: ${error.message}`);
    }
  }

  /* ACTIVITY FEED */
  static async getFollowedUsersActivity(userId, pagination = { limit: 20, offset: 0 }) {
    try {
      const limit = pagination.limit || 20; const offset = pagination.offset || 0;
      const follows = await db.query(`SELECT followed_id FROM user_followers WHERE follower_id = $1 AND status = 'active'`, [userId]);
      const ids = follows.rows.map(r => r.followed_id);
      if (ids.length === 0) return { activities: [], total: 0, hasMore: false };
      const rows = await db.query(`SELECT ca.*, p.display_name, p.avatar as avatar_url FROM community_activity ca JOIN profiles p ON p.id = ca.user_id WHERE ca.user_id = ANY($1) AND ca.activity_type IN ('sadhana_completed','sadhana_shared','milestone_achieved','badge_earned','group_joined') ORDER BY ca.created_at DESC LIMIT $2 OFFSET $3`, [ids, limit, offset]);
      const countRes = await db.query(`SELECT COUNT(*) FROM community_activity WHERE user_id = ANY($1) AND activity_type IN ('sadhana_completed','sadhana_shared','milestone_achieved','badge_earned','group_joined')`, [ids]);
      const total = parseInt(countRes.rows[0].count,10) || 0;
      return { activities: rows.rows, total, hasMore: offset + rows.rows.length < total };
    } catch (error) {
      throw new Error(`Failed to fetch activity feed: ${error.message}`);
    }
  }

  static async logActivity(userId, activityType, activityData = {}) {
    try {
      const res = await db.query(`INSERT INTO community_activity (user_id, activity_type, activity_data) VALUES ($1,$2,$3) RETURNING *`, [userId, activityType, activityData]);
      return res.rows[0];
    } catch (error) {
      throw new Error(`Failed to log activity: ${error.message}`);
    }
  }
}

module.exports = SocialService;
