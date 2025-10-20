const db = require('../config/db');

class AchievementService {
  // Get all achievements for a user
  static async getUserAchievements(userId) {
    try {
      const result = await db.query(
        `SELECT * FROM achievements 
         WHERE user_id = $1
         ORDER BY earned_at DESC, created_at DESC`,
        [userId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch achievements: ${error.message}`);
    }
  }

  // Get earned achievements for a user
  static async getUserEarnedAchievements(userId) {
    try {
      const result = await db.query(
        `SELECT * FROM achievements 
         WHERE user_id = $1 AND earned = true
         ORDER BY earned_at DESC`,
        [userId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch earned achievements: ${error.message}`);
    }
  }

  // Create a new achievement
  static async createAchievement(achievementData, userId) {
    try {
      const {
        name,
        description,
        category,
        points,
        metadata
      } = achievementData;

      const result = await db.query(
        `INSERT INTO achievements 
         (user_id, name, description, category, points, metadata)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          userId,
          name,
          description,
          category,
          points || 0,
          metadata || {}
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create achievement: ${error.message}`);
    }
  }

  // Update an achievement
  static async updateAchievement(achievementId, achievementData, userId) {
    try {
      const {
        name,
        description,
        category,
        points,
        earned,
        earned_at,
        metadata
      } = achievementData;

      const result = await db.query(
        `UPDATE achievements 
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             category = COALESCE($3, category),
             points = COALESCE($4, points),
             earned = COALESCE($5, earned),
             earned_at = COALESCE($6, earned_at),
             metadata = COALESCE($7, metadata),
             updated_at = NOW()
         WHERE id = $8 AND user_id = $9
         RETURNING *`,
        [
          name,
          description,
          category,
          points,
          earned,
          earned_at,
          metadata,
          achievementId,
          userId
        ]
      );

      if (result.rows.length === 0) {
        throw new Error('Achievement not found or unauthorized');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update achievement: ${error.message}`);
    }
  }

  // Mark an achievement as earned
  static async earnAchievement(achievementId, userId) {
    try {
      const result = await db.query(
        `UPDATE achievements 
         SET earned = true,
             earned_at = NOW(),
             updated_at = NOW()
         WHERE id = $1 AND user_id = $2 AND earned = false
         RETURNING *`,
        [achievementId, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Achievement not found, already earned, or unauthorized');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to earn achievement: ${error.message}`);
    }
  }

  // Delete an achievement
  static async deleteAchievement(achievementId, userId) {
    try {
      const result = await db.query(
        `DELETE FROM achievements 
         WHERE id = $1 AND user_id = $2
         RETURNING id`,
        [achievementId, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Achievement not found or unauthorized');
      }

      return { id: result.rows[0].id };
    } catch (error) {
      throw new Error(`Failed to delete achievement: ${error.message}`);
    }
  }

  // Get achievements by category
  static async getAchievementsByCategory(userId, category) {
    try {
      const result = await db.query(
        `SELECT * FROM achievements 
         WHERE user_id = $1 AND category = $2
         ORDER BY created_at DESC`,
        [userId, category]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch achievements by category: ${error.message}`);
    }
  }

  // Get achievement statistics for a user
  static async getUserAchievementStats(userId) {
    try {
      const result = await db.query(
        `SELECT 
           COUNT(*) as total_achievements,
           COUNT(*) FILTER (WHERE earned = true) as earned_achievements,
           SUM(points) FILTER (WHERE earned = true) as total_points
         FROM achievements 
         WHERE user_id = $1`,
        [userId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch achievement stats: ${error.message}`);
    }
  }
}

module.exports = AchievementService;