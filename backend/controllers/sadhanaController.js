/**
 * @swagger
 * tags:
 *   name: Sadhanas
 *   description: Sadhana practices and tracking
 */

const SadhanaService = require('../services/sadhanaService');

class SadhanaController {
  // Get user sadhanas
  static async getUserSadhanas(req, res) {
    try {
      const sadhanas = await SadhanaService.getUserSadhanas(req.user.id);
      res.json({ sadhanas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // Create a new sadhana
  static async createSadhana(req, res) {
    try {
      const sadhana = await SadhanaService.createSadhana(req.body, req.user.id);
      res.status(201).json({ sadhana });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Update a sadhana
  static async updateSadhana(req, res) {
    try {
      const { id } = req.params;
      const sadhana = await SadhanaService.updateSadhana(id, req.body, req.user.id);
      res.json({ sadhana });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a sadhana
  static async deleteSadhana(req, res) {
    try {
      const { id } = req.params;
      await SadhanaService.deleteSadhana(id, req.user.id);
      res.json({ message: 'Sadhana deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Get sadhana progress
  static async getSadhanaProgress(req, res) {
    try {
      const { sadhanaId } = req.params;
      const progress = await SadhanaService.getSadhanaProgress(sadhanaId, req.user.id);
      res.json({ progress });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // Create or update sadhana progress
  static async upsertSadhanaProgress(req, res) {
    try {
      const { sadhanaId } = req.params;
      const progressData = { ...req.body, sadhana_id: sadhanaId };
      const progress = await SadhanaService.upsertSadhanaProgress(progressData, req.user.id);
      res.json({ progress });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // --- Sharing endpoints ---
  static async shareSadhana(req, res) {
    try {
      const { id } = req.params;
      const { privacyLevel = 'public' } = req.body || {};
      const shared = await SadhanaService.shareSadhana(id, req.user.id, privacyLevel);
      res.json({ shared: true, sharedSadhana: shared });
    } catch (error) {
      console.error(error);
      if (error.message && error.message.includes('Unauthorized')) return res.status(403).json({ error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  static async unshareSadhana(req, res) {
    try {
      const { id } = req.params;
      await SadhanaService.unshareSadhana(id, req.user.id);
      res.json({ shared: false, message: 'Sadhana unshared successfully' });
    } catch (error) {
      console.error(error);
      if (error.message && error.message.includes('Unauthorized')) return res.status(403).json({ error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  static async updateSharePrivacy(req, res) {
    try {
      const { id } = req.params;
      const { privacyLevel } = req.body || {};
      if (!privacyLevel) return res.status(400).json({ error: 'privacyLevel required' });
      const updated = await SadhanaService.updateSharePrivacy(id, req.user.id, privacyLevel);
      res.json({ sharedSadhana: updated });
    } catch (error) {
      console.error(error);
      if (error.message && error.message.includes('Unauthorized')) return res.status(403).json({ error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  static async getCommunityFeed(req, res) {
    try {
      const { sortBy, searchQuery, limit = 20, offset = 0 } = req.query;
      const filters = { sortBy, searchQuery };
      const pagination = { limit: parseInt(limit, 10), offset: parseInt(offset, 10) };
      const result = await SadhanaService.getCommunityFeed(req.user.id, filters, pagination);
      res.json({ feed: result.items, total: result.total, hasMore: result.hasMore });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getSharedSadhanaDetails(req, res) {
    try {
      const { id } = req.params;
      const result = await SadhanaService.getSharedSadhanaDetails(id, req.user.id);
      res.json({ sadhana: result });
    } catch (error) {
      console.error(error);
      if (error.message && error.message.includes('not found')) return res.status(404).json({ error: error.message });
      if (error.message && error.message.includes('Cannot')) return res.status(403).json({ error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  // Likes
  static async likeSadhana(req, res) {
    try {
      const { id } = req.params;
      const result = await SadhanaService.likeSadhana(id, req.user.id);
      res.json({ liked: result.liked, likeCount: result.like_count });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  static async unlikeSadhana(req, res) {
    try {
      const { id } = req.params;
      const result = await SadhanaService.unlikeSadhana(id, req.user.id);
      res.json({ liked: result.liked, likeCount: result.like_count });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  // Comments
  static async getSadhanaComments(req, res) {
    try {
      const { id } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      const result = await SadhanaService.getSadhanaComments(id, req.user.id, { limit: parseInt(limit, 10), offset: parseInt(offset, 10) });
      res.json({ comments: result.comments, total: result.total });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  static async createSadhanaComment(req, res) {
    try {
      const { id } = req.params;
      const { content, parentCommentId = null } = req.body || {};
      if (!content || String(content).trim().length === 0) return res.status(400).json({ error: 'Content required' });
      const comment = await SadhanaService.createSadhanaComment(id, req.user.id, content, parentCommentId);
      res.status(201).json({ comment });
    } catch (error) {
      console.error(error);
      if (error.message && error.message.includes('Cannot')) return res.status(403).json({ error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  static async updateSadhanaComment(req, res) {
    try {
      const { commentId } = req.params;
      const { content } = req.body || {};
      if (!content || String(content).trim().length === 0) return res.status(400).json({ error: 'Content required' });
      const updated = await SadhanaService.updateSadhanaComment(commentId, req.user.id, content);
      res.json({ comment: updated });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteSadhanaComment(req, res) {
    try {
      const { commentId } = req.params;
      await SadhanaService.deleteSadhanaComment(commentId, req.user.id);
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = SadhanaController;
