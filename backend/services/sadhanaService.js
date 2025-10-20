const db = require('../config/db');

class SadhanaService {
  // Get sadhanas for a user
  static async getUserSadhanas(userId) {
    try {
      const result = await db.query(
        `SELECT * FROM sadhanas 
         WHERE user_id = $1 OR assigned_by = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      return result.rows;
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
        category,
        due_date,
        due_time,
        priority,
        tags,
        sadhana_id,
        
        // New spiritual fields
        deity,
        duration_minutes,
        experience_points,
        spiritual_tags,
        practice_type
      } = sadhanaData;

      const result = await db.query(
        `INSERT INTO sadhanas 
         (user_id, title, description, category, due_date, due_time, priority, tags, sadhana_id,
          deity, duration_minutes, experience_points, spiritual_tags, practice_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING *`,
        [
          userId,
          title,
          description,
          category || 'daily',
          due_date,
          due_time,
          priority || 'medium',
          tags || [],
          sadhana_id,
          
          // New spiritual fields
          deity,
          duration_minutes || 30,
          experience_points || 10,
          spiritual_tags || [],
          practice_type || 'general'
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create sadhana: ${error.message}`);
    }
  }

  // Update a sadhana
  static async updateSadhana(sadhanaId, sadhanaData, userId) {
    try {
      const {
        title,
        description,
        completed,
        category,
        due_date,
        due_time,
        priority,
        tags,
        reflection,
        
        // New spiritual fields
        deity,
        duration_minutes,
        experience_points,
        streak_count,
        last_completed_at,
        spiritual_tags,
        practice_type
      } = sadhanaData;

      const result = await db.query(
        `UPDATE sadhanas 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             completed = COALESCE($3, completed),
             category = COALESCE($4, category),
             due_date = COALESCE($5, due_date),
             due_time = COALESCE($6, due_time),
             priority = COALESCE($7, priority),
             tags = COALESCE($8, tags),
             reflection = COALESCE($9, reflection),
             
             // New spiritual fields
             deity = COALESCE($10, deity),
             duration_minutes = COALESCE($11, duration_minutes),
             experience_points = COALESCE($12, experience_points),
             streak_count = COALESCE($13, streak_count),
             last_completed_at = COALESCE($14, last_completed_at),
             spiritual_tags = COALESCE($15, spiritual_tags),
             practice_type = COALESCE($16, practice_type),
             
             updated_at = NOW()
         WHERE id = $17 AND (user_id = $18 OR assigned_by = $18)
         RETURNING *`,
        [
          title,
          description,
          completed,
          category,
          due_date,
          due_time,
          priority,
          tags,
          reflection,
          
          // New spiritual fields
          deity,
          duration_minutes,
          experience_points,
          streak_count,
          last_completed_at,
          spiritual_tags,
          practice_type,
          
          sadhanaId,
          userId
        ]
      );

      if (result.rows.length === 0) {
        throw new Error('Sadhana not found or unauthorized');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update sadhana: ${error.message}`);
    }
  }

  // Delete a sadhana
  static async deleteSadhana(sadhanaId, userId) {
    try {
      const result = await db.query(
        `DELETE FROM sadhanas 
         WHERE id = $1 AND (user_id = $2 OR assigned_by = $2)
         RETURNING id`,
        [sadhanaId, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Sadhana not found or unauthorized');
      }

      return { id: result.rows[0].id };
    } catch (error) {
      throw new Error(`Failed to delete sadhana: ${error.message}`);
    }
  }

  // Get sadhana progress
  static async getSadhanaProgress(sadhanaId, userId) {
    try {
      const result = await db.query(
        `SELECT * FROM sadhana_progress 
         WHERE sadhana_id = $1 AND user_id = $2
         ORDER BY progress_date DESC`,
        [sadhanaId, userId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch sadhana progress: ${error.message}`);
    }
  }

  // Create or update sadhana progress
  static async upsertSadhanaProgress(progressData, userId) {
    try {
      const {
        sadhana_id,
        progress_date,
        completed,
        notes,
        duration_minutes
      } = progressData;

      const result = await db.query(
        `INSERT INTO sadhana_progress 
         (sadhana_id, user_id, progress_date, completed, notes, duration_minutes)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (sadhana_id, progress_date) 
         DO UPDATE SET 
           completed = COALESCE($4, sadhana_progress.completed),
           notes = COALESCE($5, sadhana_progress.notes),
           duration_minutes = COALESCE($6, sadhana_progress.duration_minutes),
           created_at = NOW()
         RETURNING *`,
        [
          sadhana_id,
          userId,
          progress_date || new Date().toISOString().split('T')[0],
          completed,
          notes,
          duration_minutes
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to upsert sadhana progress: ${error.message}`);
    }
  }

  /* --- Sharing, likes, comments methods --- */

  static async shareSadhana(sadhanaId, userId, privacyLevel = 'public') {
    try {
      if (!['public', 'friends', 'private'].includes(privacyLevel)) {
        throw new Error('Invalid privacy level');
      }

      // verify sadhana exists and belongs to userId
      const row = await db.query(`SELECT id, user_id FROM sadhanas WHERE id = $1`, [sadhanaId]);
      if (row.rows.length === 0) throw new Error('Sadhana not found');
      if (String(row.rows[0].user_id) !== String(userId)) throw new Error('Unauthorized to share this sadhana');

      const res = await db.query(
        `INSERT INTO shared_sadhanas (sadhana_id, user_id, privacy_level)
         VALUES ($1, $2, $3)
         ON CONFLICT (sadhana_id) DO UPDATE SET privacy_level = EXCLUDED.privacy_level, updated_at = NOW()
         RETURNING *`,
        [sadhanaId, userId, privacyLevel]
      );

      return res.rows[0];
    } catch (error) {
      throw new Error(`Failed to share sadhana: ${error.message}`);
    }
  }

  static async unshareSadhana(sadhanaId, userId) {
    try {
      const res = await db.query(
        `DELETE FROM shared_sadhanas WHERE sadhana_id = $1 AND user_id = $2 RETURNING id`,
        [sadhanaId, userId]
      );

      if (res.rows.length === 0) throw new Error('Shared sadhana not found or unauthorized');
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to unshare sadhana: ${error.message}`);
    }
  }

  static async updateSharePrivacy(sadhanaId, userId, newPrivacyLevel) {
    try {
      if (!['public', 'friends', 'private'].includes(newPrivacyLevel)) {
        throw new Error('Invalid privacy level');
      }

      const res = await db.query(
        `UPDATE shared_sadhanas SET privacy_level = $1, updated_at = NOW() WHERE sadhana_id = $2 AND user_id = $3 RETURNING *`,
        [newPrivacyLevel, sadhanaId, userId]
      );

      if (res.rows.length === 0) throw new Error('Shared sadhana not found or unauthorized');
      return res.rows[0];
    } catch (error) {
      throw new Error(`Failed to update share privacy: ${error.message}`);
    }
  }

  static async getCommunityFeed(viewerId, filters = {}, pagination = { limit: 20, offset: 0 }) {
    try {
      const { sortBy = 'recent', searchQuery } = filters;
      const limit = pagination.limit || 20;
      const offset = pagination.offset || 0;

      // only public for now
      const whereClauses = [`ss.privacy_level = 'public'`];
      const params = [];
      let idx = 1;

      if (searchQuery) {
        whereClauses.push(`(s.title ILIKE '%' || $${idx} || '%' OR s.description ILIKE '%' || $${idx} || '%')`);
        params.push(searchQuery);
        idx++;
      }

      const order = sortBy === 'popular' ? 'COALESCE(ss.share_count,0) + COALESCE(like_count,0) DESC' : 'ss.shared_at DESC';

      const query = `
        SELECT ss.*, s.*, p.display_name as owner_name, p.avatar as owner_avatar,
          COALESCE(l.like_count,0) as like_count,
          COALESCE(c.comment_count,0) as comment_count,
          CASE WHEN ul.user_id IS NULL THEN false ELSE true END as user_has_liked
        FROM shared_sadhanas ss
        JOIN sadhanas s ON s.id = ss.sadhana_id
        LEFT JOIN profiles p ON p.user_id = ss.user_id
        LEFT JOIN (
          SELECT sadhana_id, COUNT(*) as like_count FROM sadhana_likes GROUP BY sadhana_id
        ) l ON l.sadhana_id = ss.sadhana_id
        LEFT JOIN (
          SELECT sadhana_id, COUNT(*) as comment_count FROM sadhana_comments GROUP BY sadhana_id
        ) c ON c.sadhana_id = ss.sadhana_id
        LEFT JOIN (
          SELECT sadhana_id, user_id FROM sadhana_likes WHERE user_id = $${idx}
        ) ul ON ul.sadhana_id = ss.sadhana_id
        WHERE ${whereClauses.join(' AND ')}
        ORDER BY ${order}
        LIMIT $${idx+1} OFFSET $${idx+2}
      `;

      params.push(viewerId);
      params.push(limit);
      params.push(offset);

      const rows = await db.query(query, params);
  // count total - build count params separately (only include searchQuery if present)
  const countSql = `SELECT COUNT(*) FROM shared_sadhanas ss JOIN sadhanas s ON s.id = ss.sadhana_id WHERE ${whereClauses.join(' AND ')}`;
  const countParams = [];
  if (searchQuery) countParams.push(searchQuery);
  const countRes = await db.query(countSql, countParams);
      const total = parseInt(countRes.rows[0].count, 10) || 0;

      const items = rows.rows.map(r => ({
        ...r,
        id: r.sadhana_id,
        ownerName: r.owner_name,
        ownerAvatar: r.owner_avatar,
        isShared: true,
        privacyLevel: r.privacy_level,
        sharedAt: r.shared_at,
        shareCount: r.share_count,
        viewCount: r.view_count,
        likeCount: r.like_count,
        commentCount: r.comment_count,
        userHasLiked: r.user_has_liked
      }));

      return { items, total, hasMore: offset + items.length < total };
    } catch (error) {
      throw new Error(`Failed to fetch community feed: ${error.message}`);
    }
  }

  static async getSharedSadhanaDetails(sadhanaId, viewerId) {
    try {
      const query = `
        SELECT ss.*, s.*, p.display_name as owner_name, p.avatar as owner_avatar,
          COALESCE(l.like_count,0) as like_count,
          COALESCE(c.comment_count,0) as comment_count,
          CASE WHEN ul.user_id IS NULL THEN false ELSE true END as user_has_liked
        FROM shared_sadhanas ss
        JOIN sadhanas s ON s.id = ss.sadhana_id
        LEFT JOIN profiles p ON p.user_id = ss.user_id
        LEFT JOIN (
          SELECT sadhana_id, COUNT(*) as like_count FROM sadhana_likes GROUP BY sadhana_id
        ) l ON l.sadhana_id = ss.sadhana_id
        LEFT JOIN (
          SELECT sadhana_id, COUNT(*) as comment_count FROM sadhana_comments GROUP BY sadhana_id
        ) c ON c.sadhana_id = ss.sadhana_id
        LEFT JOIN (
          SELECT sadhana_id, user_id FROM sadhana_likes WHERE user_id = $2
        ) ul ON ul.sadhana_id = ss.sadhana_id
        WHERE ss.sadhana_id = $1
        LIMIT 1
      `;

      const res = await db.query(query, [sadhanaId, viewerId]);
      if (res.rows.length === 0) throw new Error('Shared sadhana not found');

      const row = res.rows[0];

      // enforce privacy: only owner can view non-public shares
      if (row.privacy_level && row.privacy_level !== 'public' && String(row.user_id) !== String(viewerId)) {
        throw new Error('Cannot view this shared sadhana');
      }

      // increment view count
      await db.query(`UPDATE shared_sadhanas SET view_count = view_count + 1 WHERE sadhana_id = $1`, [sadhanaId]);

      return {
        ...row,
        id: row.sadhana_id,
        ownerName: row.owner_name,
        ownerAvatar: row.owner_avatar,
        isShared: true,
        privacyLevel: row.privacy_level,
        sharedAt: row.shared_at,
        shareCount: row.share_count,
        viewCount: row.view_count + 1,
        likeCount: row.like_count,
        commentCount: row.comment_count,
        userHasLiked: row.user_has_liked
      };
    } catch (error) {
      throw new Error(`Failed to fetch shared sadhana details: ${error.message}`);
    }
  }

  static async likeSadhana(sadhanaId, userId) {
    try {
      // check access: ensure shared and public for now
      const shared = await db.query(`SELECT privacy_level FROM shared_sadhanas WHERE sadhana_id = $1`, [sadhanaId]);
      if (shared.rows.length === 0) throw new Error('Shared sadhana not found');
      if (shared.rows[0].privacy_level !== 'public') throw new Error('Cannot like this sadhana');

      await db.query(`INSERT INTO sadhana_likes (sadhana_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [sadhanaId, userId]);
      const countRes = await db.query(`SELECT COUNT(*) FROM sadhana_likes WHERE sadhana_id = $1`, [sadhanaId]);
      return { liked: true, like_count: parseInt(countRes.rows[0].count, 10) };
    } catch (error) {
      throw new Error(`Failed to like sadhana: ${error.message}`);
    }
  }

  static async unlikeSadhana(sadhanaId, userId) {
    try {
      await db.query(`DELETE FROM sadhana_likes WHERE sadhana_id = $1 AND user_id = $2`, [sadhanaId, userId]);
      const countRes = await db.query(`SELECT COUNT(*) FROM sadhana_likes WHERE sadhana_id = $1`, [sadhanaId]);
      return { liked: false, like_count: parseInt(countRes.rows[0].count, 10) };
    } catch (error) {
      throw new Error(`Failed to unlike sadhana: ${error.message}`);
    }
  }

  static async getSadhanaComments(sadhanaId, viewerId, pagination = { limit: 50, offset: 0 }) {
    try {
      // basic access check
      const shared = await db.query(`SELECT privacy_level FROM shared_sadhanas WHERE sadhana_id = $1`, [sadhanaId]);
      if (shared.rows.length === 0) throw new Error('Shared sadhana not found');
      if (shared.rows[0].privacy_level !== 'public') throw new Error('Cannot view comments');

      const limit = pagination.limit || 50;
      const offset = pagination.offset || 0;

      const q = `
        SELECT sc.*, p.display_name as user_name, p.avatar as user_avatar
        FROM sadhana_comments sc
        LEFT JOIN profiles p ON p.user_id = sc.user_id
        WHERE sc.sadhana_id = $1
        ORDER BY sc.created_at ASC
        LIMIT $2 OFFSET $3
      `;

      const res = await db.query(q, [sadhanaId, limit, offset]);
      const count = await db.query(`SELECT COUNT(*) FROM sadhana_comments WHERE sadhana_id = $1`, [sadhanaId]);
      return { comments: res.rows, total: parseInt(count.rows[0].count, 10) };
    } catch (error) {
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }
  }

  static async createSadhanaComment(sadhanaId, userId, content, parentCommentId = null) {
    try {
      if (!content || String(content).trim().length === 0) throw new Error('Content cannot be empty');
      if (content.length > 1000) throw new Error('Content too long');

      const shared = await db.query(`SELECT privacy_level FROM shared_sadhanas WHERE sadhana_id = $1`, [sadhanaId]);
      if (shared.rows.length === 0) throw new Error('Shared sadhana not found');
      if (shared.rows[0].privacy_level !== 'public') throw new Error('Cannot comment on this sadhana');

      const res = await db.query(
        `INSERT INTO sadhana_comments (sadhana_id, user_id, content, parent_comment_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [sadhanaId, userId, content, parentCommentId]
      );

      return res.rows[0];
    } catch (error) {
      throw new Error(`Failed to create comment: ${error.message}`);
    }
  }

  static async updateSadhanaComment(commentId, userId, newContent) {
    try {
      if (!newContent || String(newContent).trim().length === 0) throw new Error('Content cannot be empty');
      if (newContent.length > 1000) throw new Error('Content too long');

      const res = await db.query(
        `UPDATE sadhana_comments SET content = $1, is_edited = true, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *`,
        [newContent, commentId, userId]
      );

      if (res.rows.length === 0) throw new Error('Comment not found or unauthorized');
      return res.rows[0];
    } catch (error) {
      throw new Error(`Failed to update comment: ${error.message}`);
    }
  }

  static async deleteSadhanaComment(commentId, userId) {
    try {
      // allow comment owner or sadhana owner to delete: check ownership via join
      const check = await db.query(
        `SELECT sc.id, sc.user_id, s.user_id as sadhana_owner FROM sadhana_comments sc JOIN sadhanas s ON s.id = sc.sadhana_id WHERE sc.id = $1`,
        [commentId]
      );

      if (check.rows.length === 0) throw new Error('Comment not found');
      const row = check.rows[0];
      if (String(row.user_id) !== String(userId) && String(row.sadhana_owner) !== String(userId)) throw new Error('Unauthorized to delete comment');

      await db.query(`DELETE FROM sadhana_comments WHERE id = $1`, [commentId]);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete comment: ${error.message}`);
    }
  }
}

module.exports = SadhanaService;

