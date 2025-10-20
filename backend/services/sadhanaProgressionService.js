const db = require('../config/db');
const UserProgressionService = require('./userProgressionService');
const AchievementService = require('./achievementService');

class SadhanaProgressionService {
  // Record sadhana completion and update user progression
  static async recordSadhanaCompletion(userId, sadhanaId, completionData) {
    try {
      const { 
        duration_minutes = 30, 
        experience_points = 10, 
        spiritual_points = 5,
        notes = '',
        completed_at = new Date()
      } = completionData;

      // Start a transaction
      const client = await db.connect();
      
      try {
        await client.query('BEGIN');
        
        // 1. Record the completion in sadhana_progress table
        const progressResult = await client.query(
          `INSERT INTO sadhana_progress 
           (sadhana_id, user_id, progress_date, completed, notes, duration_minutes, completed_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (sadhana_id, progress_date) 
           DO UPDATE SET 
             completed = COALESCE($4, sadhana_progress.completed),
             notes = COALESCE($5, sadhana_progress.notes),
             duration_minutes = COALESCE($6, sadhana_progress.duration_minutes),
             completed_at = COALESCE($7, sadhana_progress.completed_at),
             updated_at = NOW()
           RETURNING *`,
          [
            sadhanaId,
            userId,
            completed_at.toISOString().split('T')[0], // progress_date
            true, // completed
            notes,
            duration_minutes,
            completed_at
          ]
        );

        // 2. Update user's spiritual progression
        // Award experience points
        await UserProgressionService.awardExperiencePoints(userId, experience_points);
        
        // Award spiritual points
        await UserProgressionService.awardSpiritualPoints(userId, spiritual_points);
        
        // Award karma points (1 point per 10 minutes of practice)
        const karmaPoints = Math.floor(duration_minutes / 10);
        await UserProgressionService.awardKarmaPoints(userId, karmaPoints);
        
        // Update daily streak
        await UserProgressionService.updateDailyStreak(userId, true);
        
        // Update sadhana streak count
        await client.query(
          `UPDATE sadhanas 
           SET 
             streak_count = COALESCE(streak_count, 0) + 1,
             last_completed_at = $1,
             updated_at = NOW()
           WHERE id = $2 AND user_id = $3`,
          [completed_at, sadhanaId, userId]
        );

        // 3. Check for achievements
        await this.checkCompletionAchievements(userId);
        await this.checkStreakAchievements(userId);
        
        await client.query('COMMIT');
        
        return {
          success: true,
          progress: progressResult.rows[0],
          pointsAwarded: {
            experience: experience_points,
            spiritual: spiritual_points,
            karma: karmaPoints
          }
        };
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      throw new Error(`Failed to record sadhana completion: ${error.message}`);
    }
  }

  // Check for completion-based achievements
  static async checkCompletionAchievements(userId) {
    try {
      // Get total completed sadhanas
      const countResult = await db.query(
        `SELECT COUNT(*) as total_completed
         FROM sadhana_progress 
         WHERE user_id = $1 AND completed = true`,
        [userId]
      );
      
      const totalCompleted = parseInt(countResult.rows[0].total_completed);
      
      // Check for "Mindful Warrior" achievement (50 completions)
      if (totalCompleted >= 50) {
        await db.query(
          `UPDATE achievements 
           SET 
             earned = true,
             earned_at = NOW(),
             updated_at = NOW()
           WHERE user_id = $1 AND name = 'Mindful Warrior' AND earned = false`,
          [userId]
        );
      }
      
      // Check for "Community Builder" achievement (10 shared practices)
      // This would require checking shared_sadhanas table
      const sharedResult = await db.query(
        `SELECT COUNT(*) as shared_count
         FROM shared_sadhanas 
         WHERE user_id = $1`,
        [userId]
      );
      
      const sharedCount = parseInt(sharedResult.rows[0].shared_count);
      if (sharedCount >= 10) {
        await db.query(
          `UPDATE achievements 
           SET 
             earned = true,
             earned_at = NOW(),
             updated_at = NOW()
           WHERE user_id = $1 AND name = 'Community Builder' AND earned = false`,
          [userId]
        );
      }
    } catch (error) {
      console.error('Error checking completion achievements:', error.message);
    }
  }

  // Check for streak-based achievements
  static async checkStreakAchievements(userId) {
    try {
      // Get current streak
      const profileResult = await db.query(
        `SELECT daily_streak FROM profiles WHERE id = $1`,
        [userId]
      );
      
      if (profileResult.rows.length === 0) return;
      
      const currentStreak = profileResult.rows[0].daily_streak;
      
      // Check for streak achievements
      let achievementName = null;
      let points = 0;
      
      switch (currentStreak) {
        case 7:
          achievementName = 'Consistency Master';
          points = 50;
          break;
        case 30:
          achievementName = 'Month Master';
          points = 100;
          break;
        case 100:
          achievementName = 'Century Champion';
          points = 200;
          break;
        case 365:
          achievementName = 'Year Master';
          points = 500;
          break;
      }
      
      if (achievementName) {
        // Mark achievement as earned
        await db.query(
          `UPDATE achievements 
           SET 
             earned = true,
             earned_at = NOW(),
             updated_at = NOW()
           WHERE user_id = $1 AND name = $2 AND earned = false`,
          [userId, achievementName]
        );
        
        // Award bonus points
        await UserProgressionService.awardSpiritualPoints(userId, points);
      }
    } catch (error) {
      console.error('Error checking streak achievements:', error.message);
    }
  }

  // Update chakra balance based on sadhana practice
  static async updateChakraBalance(userId, chakraUpdates) {
    try {
      // Get current chakra balance
      const profileResult = await db.query(
        `SELECT chakra_balance FROM profiles WHERE id = $1`,
        [userId]
      );
      
      if (profileResult.rows.length === 0) {
        throw new Error('Profile not found');
      }
      
      const currentBalance = profileResult.rows[0].chakra_balance || {
        root: 50,
        sacral: 50,
        solar: 50,
        heart: 50,
        throat: 50,
        thirdEye: 50,
        crown: 50
      };
      
      // Apply updates
      const newBalance = {
        ...currentBalance,
        ...chakraUpdates
      };
      
      // Update in database
      await db.query(
        `UPDATE profiles 
         SET 
           chakra_balance = $1::jsonb,
           updated_at = NOW()
         WHERE id = $2`,
        [JSON.stringify(newBalance), userId]
      );
      
      // Check if all chakras are balanced
      const allBalanced = Object.values(newBalance).every(value => value >= 70);
      if (allBalanced) {
        await db.query(
          `UPDATE achievements 
           SET 
             earned = true,
             earned_at = NOW(),
             updated_at = NOW()
           WHERE user_id = $1 AND name = 'Energy Balancer' AND earned = false`,
          [userId]
        );
      }
      
      return newBalance;
    } catch (error) {
      throw new Error(`Failed to update chakra balance: ${error.message}`);
    }
  }

  // Update energy balance (sattva-rajas-tamas)
  static async updateEnergyBalance(userId, energyUpdates) {
    try {
      // Get current energy balance
      const profileResult = await db.query(
        `SELECT energy_balance FROM profiles WHERE id = $1`,
        [userId]
      );
      
      if (profileResult.rows.length === 0) {
        throw new Error('Profile not found');
      }
      
      const currentBalance = profileResult.rows[0].energy_balance || {
        sattva: 33,
        rajas: 33,
        tamas: 34
      };
      
      // Apply updates
      const newBalance = {
        ...currentBalance,
        ...energyUpdates
      };
      
      // Ensure values sum to 100
      const total = newBalance.sattva + newBalance.rajas + newBalance.tamas;
      if (total !== 100) {
        // Normalize to 100
        const factor = 100 / total;
        newBalance.sattva = Math.round(newBalance.sattva * factor);
        newBalance.rajas = Math.round(newBalance.rajas * factor);
        newBalance.tamas = 100 - newBalance.sattva - newBalance.rajas;
      }
      
      // Update in database
      await db.query(
        `UPDATE profiles 
         SET 
           energy_balance = $1::jsonb,
           updated_at = NOW()
         WHERE id = $2`,
        [JSON.stringify(newBalance), userId]
      );
      
      return newBalance;
    } catch (error) {
      throw new Error(`Failed to update energy balance: ${error.message}`);
    }
  }

  // Update sankalpa progress
  static async updateSankalpaProgress(userId, progressIncrement = 1.00) {
    try {
      // Update sankalpa progress
      const result = await db.query(
        `UPDATE profiles 
         SET 
           sankalpa_progress = LEAST(sankalpa_progress + $1, 100.00),
           updated_at = NOW()
         WHERE id = $2
         RETURNING sankalpa_progress`,
        [progressIncrement, userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Profile not found');
      }
      
      const newProgress = result.rows[0].sankalpa_progress;
      
      // Check if sankalpa is complete
      if (newProgress >= 100.00) {
        await db.query(
          `UPDATE achievements 
           SET 
             earned = true,
             earned_at = NOW(),
             updated_at = NOW()
           WHERE user_id = $1 AND name = 'Sankalpa Keeper' AND earned = false`,
          [userId]
        );
      }
      
      return newProgress;
    } catch (error) {
      throw new Error(`Failed to update sankalpa progress: ${error.message}`);
    }
  }

  // Get user's sadhana statistics
  static async getUserSadhanaStats(userId) {
    try {
      const stats = {};
      
      // Total completed sadhanas
      const totalResult = await db.query(
        `SELECT COUNT(*) as total_completed
         FROM sadhana_progress 
         WHERE user_id = $1 AND completed = true`,
        [userId]
      );
      stats.totalCompleted = parseInt(totalResult.rows[0].total_completed);
      
      // Current streak
      const streakResult = await db.query(
        `SELECT daily_streak FROM profiles WHERE id = $1`,
        [userId]
      );
      stats.currentStreak = streakResult.rows.length > 0 ? streakResult.rows[0].daily_streak : 0;
      
      // Longest streak
      const longestResult = await db.query(
        `SELECT MAX(streak_count) as longest_streak
         FROM sadhanas 
         WHERE user_id = $1`,
        [userId]
      );
      stats.longestStreak = longestResult.rows[0].longest_streak ? 
        parseInt(longestResult.rows[0].longest_streak) : 0;
      
      // Total practice time
      const timeResult = await db.query(
        `SELECT SUM(duration_minutes) as total_minutes
         FROM sadhana_progress 
         WHERE user_id = $1 AND completed = true`,
        [userId]
      );
      stats.totalMinutes = timeResult.rows[0].total_minutes ? 
        parseInt(timeResult.rows[0].total_minutes) : 0;
      
      return stats;
    } catch (error) {
      throw new Error(`Failed to get user sadhana stats: ${error.message}`);
    }
  }
}

module.exports = SadhanaProgressionService;