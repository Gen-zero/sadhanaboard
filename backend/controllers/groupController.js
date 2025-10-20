const SocialService = require('../services/socialService');

const GroupController = {
  async createGroup(req, res) {
    try {
      const creatorId = req.user.id;
      const group = await SocialService.createGroup(req.body, creatorId);
      return res.status(201).json({ success: true, group });
    } catch (err) {
      console.error('createGroup error', err);
      return res.status(400).json({ error: err.message });
    }
  },

  async updateGroup(req, res) {
    try {
      const groupId = req.params.id;
      const userId = req.user.id;
      const updated = await SocialService.updateGroup(groupId, userId, req.body);
      return res.json({ success: true, group: updated });
    } catch (err) {
      console.error('updateGroup error', err);
      return res.status(400).json({ error: err.message });
    }
  },

  async deleteGroup(req, res) {
    try {
      const groupId = req.params.id;
      const userId = req.user.id;
      const result = await SocialService.deleteGroup(groupId, userId);
      return res.json(result);
    } catch (err) {
      console.error('deleteGroup error', err);
      return res.status(400).json({ error: err.message });
    }
  },

  async getGroup(req, res) {
    try {
      const groupId = req.params.id;
      const viewerId = req.user ? req.user.id : null;
      const group = await SocialService.getGroup(groupId, viewerId);
      return res.json({ group });
    } catch (err) {
      console.error('getGroup error', err);
      return res.status(404).json({ error: err.message });
    }
  },

  async listGroups(req, res) {
    try {
      const filters = req.query || {};
      const pagination = { limit: parseInt(req.query.limit,10) || 20, offset: parseInt(req.query.offset,10) || 0 };
      const viewerId = req.user ? req.user.id : null;
      const data = await SocialService.listGroups(filters, pagination, viewerId);
      return res.json(data);
    } catch (err) {
      console.error('listGroups error', err);
      return res.status(400).json({ error: err.message });
    }
  },

  async joinGroup(req, res) {
    try {
      const groupId = req.params.id;
      const userId = req.user.id;
      const data = await SocialService.joinGroup(groupId, userId);
      return res.json(data);
    } catch (err) {
      console.error('joinGroup error', err);
      return res.status(400).json({ error: err.message });
    }
  },

  async leaveGroup(req, res) {
    try {
      const groupId = req.params.id;
      const userId = req.user.id;
      const data = await SocialService.leaveGroup(groupId, userId);
      return res.json(data);
    } catch (err) {
      console.error('leaveGroup error', err);
      return res.status(400).json({ error: err.message });
    }
  },

  async getMembers(req, res) {
    try {
      const groupId = req.params.id;
      const viewerId = req.user ? req.user.id : null;
      const pagination = { limit: parseInt(req.query.limit,10) || 50, offset: parseInt(req.query.offset,10) || 0 };
      const data = await SocialService.getGroupMembers(groupId, viewerId, pagination);
      return res.json(data);
    } catch (err) {
      console.error('getMembers error', err);
      return res.status(400).json({ error: err.message });
    }
  },

  async getActivity(req, res) {
    try {
      const groupId = req.params.id;
      const viewerId = req.user.id;
      const pagination = { limit: parseInt(req.query.limit,10) || 50, offset: parseInt(req.query.offset,10) || 0 };
      const data = await SocialService.getGroupActivity(groupId, viewerId, pagination);
      return res.json(data);
    } catch (err) {
      console.error('getActivity error', err);
      return res.status(400).json({ error: err.message });
    }
  },

  async updateMemberRole(req, res) {
    try {
      const groupId = req.params.id;
      const targetUserId = req.body.user_id;
      const newRole = req.body.role;
      const requesterId = req.user.id;
      const updated = await SocialService.updateMemberRole(groupId, targetUserId, newRole, requesterId);
      return res.json({ member: updated });
    } catch (err) {
      console.error('updateMemberRole error', err);
      return res.status(400).json({ error: err.message });
    }
  },

  async removeMember(req, res) {
    try {
      const groupId = req.params.id;
      const targetUserId = req.body.user_id;
      const requesterId = req.user.id;
      const result = await SocialService.removeMember(groupId, targetUserId, requesterId);
      return res.json(result);
    } catch (err) {
      console.error('removeMember error', err);
      return res.status(400).json({ error: err.message });
    }
  }
};

module.exports = GroupController;
