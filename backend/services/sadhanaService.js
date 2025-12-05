const Sadhana = require('../schemas/Sadhana');
const SadhanaProgress = require('../schemas/SadhanaProgress');
const SharedSadhana = require('../schemas/SharedSadhana');
const SadhanaComment = require('../schemas/SadhanaComment');
const SadhanaLike = require('../schemas/SadhanaLike');

class SadhanaService {
  // Get sadhanas for a user
  static async getUserSadhanas(userId) {
    try {
      const sadhanas = await Sadhana.find({
        $or: [{ userId }, { assignedBy: userId }]
      }).select('_id title type status dueDate frequency duration createdAt updatedAt').sort({ createdAt: -1 }).lean();

      return sadhanas;
    } catch (error) {
      throw new Error(`Failed to fetch sadhanas: ${error.message}`);
    }
  }

  // Create a new sadhana
  static async createSadhana(sadhanaData, userId) {
    try {
      const {
        title,
        description,
        type,
        dueDate,
        frequency,
        priority,
        tags,
        duration,
        traditions,
        goal,
        motivation
      } = sadhanaData;

      const sadhana = new Sadhana({
        userId,
        title,
        description,
        type: type || 'other',
        dueDate,
        frequency: frequency || 'daily',
        priority,
        tags: tags || [],
        duration: duration || 30,
        traditions: traditions || [],
        goal,
        motivation,
        status: 'draft'
      });

      await sadhana.save();
      return sadhana.toJSON();
    } catch (error) {
      throw new Error(`Failed to create sadhana: ${error.message}`);
    }
  }

  // Update a sadhana
  static async updateSadhana(sadhanaId, sadhanaData, userId) {
    try {
      const sadhana = await Sadhana.findOne({
        _id: sadhanaId,
        $or: [{ userId }, { assignedBy: userId }]
      });

      if (!sadhana) {
        throw new Error('Sadhana not found or unauthorized');
      }

      const updateData = {};
      if (sadhanaData.title !== undefined) updateData.title = sadhanaData.title;
      if (sadhanaData.description !== undefined) updateData.description = sadhanaData.description;
      if (sadhanaData.type !== undefined) updateData.type = sadhanaData.type;
      if (sadhanaData.dueDate !== undefined) updateData.dueDate = sadhanaData.dueDate;
      if (sadhanaData.frequency !== undefined) updateData.frequency = sadhanaData.frequency;
      if (sadhanaData.priority !== undefined) updateData.priority = sadhanaData.priority;
      if (sadhanaData.tags !== undefined) updateData.tags = sadhanaData.tags;
      if (sadhanaData.duration !== undefined) updateData.duration = sadhanaData.duration;
      if (sadhanaData.status !== undefined) updateData.status = sadhanaData.status;
      if (sadhanaData.traditions !== undefined) updateData.traditions = sadhanaData.traditions;
      if (sadhanaData.goal !== undefined) updateData.goal = sadhanaData.goal;
      if (sadhanaData.motivation !== undefined) updateData.motivation = sadhanaData.motivation;
      if (sadhanaData.completedAt !== undefined) updateData.completedAt = sadhanaData.completedAt;
      if (sadhanaData.notes !== undefined) updateData.notes = sadhanaData.notes;

      const updated = await Sadhana.findByIdAndUpdate(sadhanaId, updateData, {
        new: true,
        runValidators: true
      });

      return updated.toJSON();
    } catch (error) {
      throw new Error(`Failed to update sadhana: ${error.message}`);
    }
  }

  // Delete a sadhana
  static async deleteSadhana(sadhanaId, userId) {
    try {
      const sadhana = await Sadhana.findOneAndDelete({
        _id: sadhanaId,
        $or: [{ userId }, { assignedBy: userId }]
      });

      if (!sadhana) {
        throw new Error('Sadhana not found or unauthorized');
      }

      return { id: sadhana._id };
    } catch (error) {
      throw new Error(`Failed to delete sadhana: ${error.message}`);
    }
  }

  // Get sadhana progress
  static async getSadhanaProgress(sadhanaId, userId) {
    try {
      const progress = await SadhanaProgress.find({
        sadhanaId,
        userId
      }).select('_id sadhanaId progressDate completed durationMinutes notes createdAt').sort({ progressDate: -1 }).lean();

      return progress;
    } catch (error) {
      throw new Error(`Failed to fetch sadhana progress: ${error.message}`);
    }
  }

  // Create or update sadhana progress
  static async upsertSadhanaProgress(progressData, userId) {
    try {
      const {
        sadhanaId,
        progressDate,
        completed,
        notes,
        durationMinutes
      } = progressData;

      const date = progressDate ? new Date(progressDate) : new Date();
      const dateStr = date.toISOString().split('T')[0];

      let progress = await SadhanaProgress.findOne({
        sadhanaId,
        progressDate: { $gte: date, $lt: new Date(date.getTime() + 86400000) }
      });

      if (progress) {
        if (completed !== undefined) progress.completed = completed;
        if (notes !== undefined) progress.notes = notes;
        if (durationMinutes !== undefined) progress.durationMinutes = durationMinutes;
        await progress.save();
      } else {
        progress = new SadhanaProgress({
          sadhanaId,
          userId,
          progressDate: date,
          completed,
          notes,
          durationMinutes: durationMinutes || 0
        });
        await progress.save();
      }

      return progress.toJSON();
    } catch (error) {
      throw new Error(`Failed to upsert sadhana progress: ${error.message}`);
    }
  }

  /* --- Sharing, likes, comments methods --- */

  static async shareSadhana(sadhanaId, userId, privacyLevel = 'public') {
    try {
      if (!['public', 'friends', 'private', 'community'].includes(privacyLevel)) {
        throw new Error('Invalid privacy level');
      }

      // verify sadhana exists and belongs to userId
      const sadhana = await Sadhana.findById(sadhanaId);
      if (!sadhana) throw new Error('Sadhana not found');
      if (String(sadhana.userId) !== String(userId)) throw new Error('Unauthorized to share this sadhana');

      let shared = await SharedSadhana.findOne({ sadhanaId });
      if (shared) {
        shared.privacyLevel = privacyLevel;
        shared.updatedAt = new Date();
        await shared.save();
      } else {
        shared = new SharedSadhana({
          sadhanaId,
          userId,
          privacyLevel
        });
        await shared.save();
      }

      return shared.toJSON();
    } catch (error) {
      throw new Error(`Failed to share sadhana: ${error.message}`);
    }
  }

  static async unshareSadhana(sadhanaId, userId) {
    try {
      const shared = await SharedSadhana.findOneAndDelete({
        sadhanaId,
        userId
      });

      if (!shared) throw new Error('Shared sadhana not found or unauthorized');
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to unshare sadhana: ${error.message}`);
    }
  }

  static async updateSharePrivacy(sadhanaId, userId, newPrivacyLevel) {
    try {
      if (!['public', 'friends', 'private', 'community'].includes(newPrivacyLevel)) {
        throw new Error('Invalid privacy level');
      }

      const shared = await SharedSadhana.findOneAndUpdate(
        { sadhanaId, userId },
        { privacyLevel: newPrivacyLevel, updatedAt: new Date() },
        { new: true }
      );

      if (!shared) throw new Error('Shared sadhana not found or unauthorized');
      return shared.toJSON();
    } catch (error) {
      throw new Error(`Failed to update share privacy: ${error.message}`);
    }
  }

  static async getCommunityFeed(viewerId, filters = {}, pagination = { limit: 20, offset: 0 }) {
    try {
      const { sortBy = 'recent', searchQuery } = filters;
      const limit = pagination.limit || 20;
      const offset = pagination.offset || 0;

      let matchStage = { privacyLevel: { $in: ['community', 'public'] }, isActive: true };

      if (searchQuery) {
        matchStage.$text = { $search: searchQuery };
      }

      const pipeline = [
        { $match: matchStage },
        {
          $lookup: {
            from: 'sadhanas',
            localField: 'sadhanaId',
            foreignField: '_id',
            as: 'sadhana'
          }
        },
        { $unwind: '$sadhana' },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'owner'
          }
        },
        { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'profiles',
            localField: 'userId',
            foreignField: 'userId',
            as: 'ownerProfile'
          }
        },
        { $unwind: { path: '$ownerProfile', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'sadhanalikes',
            localField: 'sadhanaId',
            foreignField: 'sadhanaId',
            as: 'likes'
          }
        },
        {
          $lookup: {
            from: 'sadhanacomments',
            localField: 'sadhanaId',
            foreignField: 'sadhanaId',
            as: 'comments'
          }
        },
        {
          $lookup: {
            from: 'sadhanalikes',
            let: { sadhanaId: '$sadhanaId' },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ['$sadhanaId', '$$sadhanaId'] }, { $eq: ['$userId', viewerId] }] } } }
            ],
            as: 'userLike'
          }
        },
        {
          $project: {
            _id: 1,
            sadhanaId: 1,
            userId: 1,
            privacyLevel: 1,
            caption: 1,
            viewCount: 1,
            likeCount: { $size: '$likes' },
            commentCount: { $size: '$comments' },
            userHasLiked: { $gt: [{ $size: '$userLike' }, 0] },
            createdAt: 1,
            ownerName: '$ownerProfile.displayName',
            ownerAvatar: '$ownerProfile.avatar',
            isShared: true,
            title: '$sadhana.title',
            description: '$sadhana.description'
          }
        },
        { $sort: sortBy === 'popular' ? { likeCount: -1 } : { createdAt: -1 } },
        { $skip: offset },
        { $limit: limit }
      ];

      const items = await SharedSadhana.aggregate(pipeline);
      
      const countPipeline = [
        { $match: matchStage },
        { $count: 'total' }
      ];
      const countResult = await SharedSadhana.aggregate(countPipeline);
      const total = countResult.length > 0 ? countResult[0].total : 0;

      return { items, total, hasMore: offset + items.length < total };
    } catch (error) {
      throw new Error(`Failed to fetch community feed: ${error.message}`);
    }
  }

  static async getSharedSadhanaDetails(sadhanaId, viewerId) {
    try {
      const pipeline = [
        { $match: { sadhanaId } },
        {
          $lookup: {
            from: 'sadhanas',
            localField: 'sadhanaId',
            foreignField: '_id',
            as: 'sadhana'
          }
        },
        { $unwind: '$sadhana' },
        {
          $lookup: {
            from: 'profiles',
            localField: 'userId',
            foreignField: 'userId',
            as: 'ownerProfile'
          }
        },
        { $unwind: { path: '$ownerProfile', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'sadhanalikes',
            localField: 'sadhanaId',
            foreignField: 'sadhanaId',
            as: 'likes'
          }
        },
        {
          $lookup: {
            from: 'sadhanacomments',
            localField: 'sadhanaId',
            foreignField: 'sadhanaId',
            as: 'comments'
          }
        },
        {
          $lookup: {
            from: 'sadhanalikes',
            let: { sadhanaId: '$sadhanaId' },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ['$sadhanaId', '$$sadhanaId'] }, { $eq: ['$userId', viewerId] }] } } }
            ],
            as: 'userLike'
          }
        },
        {
          $project: {
            _id: 1,
            sadhanaId: 1,
            userId: 1,
            privacyLevel: 1,
            viewCount: 1,
            likeCount: { $size: '$likes' },
            commentCount: { $size: '$comments' },
            userHasLiked: { $gt: [{ $size: '$userLike' }, 0] },
            createdAt: 1,
            ownerName: '$ownerProfile.displayName',
            ownerAvatar: '$ownerProfile.avatar'
          }
        },
        { $limit: 1 }
      ];

      const result = await SharedSadhana.aggregate(pipeline);
      if (result.length === 0) throw new Error('Shared sadhana not found');

      const row = result[0];

      // enforce privacy: only owner can view non-public shares
      if (row.privacyLevel && row.privacyLevel !== 'public' && String(row.userId) !== String(viewerId)) {
        throw new Error('Cannot view this shared sadhana');
      }

      // increment view count
      await SharedSadhana.findByIdAndUpdate(row._id, { $inc: { viewCount: 1 } });

      return {
        ...row,
        id: row.sadhanaId,
        ownerName: row.ownerName,
        ownerAvatar: row.ownerAvatar,
        isShared: true,
        viewCount: row.viewCount + 1
      };
    } catch (error) {
      throw new Error(`Failed to fetch shared sadhana details: ${error.message}`);
    }
  }

  static async likeSadhana(sadhanaId, userId) {
    try {
      // check access: ensure shared and public for now
      const shared = await SharedSadhana.findOne({ sadhanaId });
      if (!shared) throw new Error('Shared sadhana not found');
      if (shared.privacyLevel !== 'public' && shared.privacyLevel !== 'community') throw new Error('Cannot like this sadhana');

      let like = await SadhanaLike.findOne({ sadhanaId, userId });
      if (!like) {
        like = new SadhanaLike({ sadhanaId, userId });
        await like.save();
      }

      const likeCount = await SadhanaLike.countDocuments({ sadhanaId });
      return { liked: true, likeCount };
    } catch (error) {
      throw new Error(`Failed to like sadhana: ${error.message}`);
    }
  }

  static async unlikeSadhana(sadhanaId, userId) {
    try {
      await SadhanaLike.deleteOne({ sadhanaId, userId });
      const likeCount = await SadhanaLike.countDocuments({ sadhanaId });
      return { liked: false, likeCount };
    } catch (error) {
      throw new Error(`Failed to unlike sadhana: ${error.message}`);
    }
  }

  static async getSadhanaComments(sadhanaId, viewerId, pagination = { limit: 50, offset: 0 }) {
    try {
      // basic access check
      const shared = await SharedSadhana.findOne({ sadhanaId });
      if (!shared) throw new Error('Shared sadhana not found');
      if (shared.privacyLevel !== 'public' && shared.privacyLevel !== 'community') throw new Error('Cannot view comments');

      const limit = pagination.limit || 50;
      const offset = pagination.offset || 0;

      const comments = await SadhanaComment.find({ sadhanaId })
        .populate('userId', 'displayName avatar')
        .sort({ createdAt: 1 })
        .skip(offset)
        .limit(limit);

      const total = await SadhanaComment.countDocuments({ sadhanaId });
      return { comments, total };
    } catch (error) {
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }
  }

  static async createSadhanaComment(sadhanaId, userId, content, parentCommentId = null) {
    try {
      if (!content || String(content).trim().length === 0) throw new Error('Content cannot be empty');
      if (content.length > 1000) throw new Error('Content too long');

      const shared = await SharedSadhana.findOne({ sadhanaId });
      if (!shared) throw new Error('Shared sadhana not found');
      if (shared.privacyLevel !== 'public' && shared.privacyLevel !== 'community') throw new Error('Cannot comment on this sadhana');

      const comment = new SadhanaComment({
        sadhanaId,
        userId,
        content,
        parentCommentId
      });

      await comment.save();
      return comment.toJSON();
    } catch (error) {
      throw new Error(`Failed to create comment: ${error.message}`);
    }
  }

  static async updateSadhanaComment(commentId, userId, newContent) {
    try {
      if (!newContent || String(newContent).trim().length === 0) throw new Error('Content cannot be empty');
      if (newContent.length > 1000) throw new Error('Content too long');

      const comment = await SadhanaComment.findOneAndUpdate(
        { _id: commentId, userId },
        { content: newContent, isEdited: true, updatedAt: new Date() },
        { new: true }
      );

      if (!comment) throw new Error('Comment not found or unauthorized');
      return comment.toJSON();
    } catch (error) {
      throw new Error(`Failed to update comment: ${error.message}`);
    }
  }

  static async deleteSadhanaComment(commentId, userId) {
    try {
      // allow comment owner or sadhana owner to delete
      const comment = await SadhanaComment.findById(commentId);
      if (!comment) throw new Error('Comment not found');

      const sadhana = await Sadhana.findById(comment.sadhanaId);
      if (String(comment.userId) !== String(userId) && String(sadhana.userId) !== String(userId)) {
        throw new Error('Unauthorized to delete comment');
      }

      await SadhanaComment.findByIdAndDelete(commentId);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete comment: ${error.message}`);
    }
  }
}

module.exports = SadhanaService;