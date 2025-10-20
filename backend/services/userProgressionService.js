const db = require('../config/db');
const AchievementService = require('./achievementService');

class UserProgressionService {
  // Initialize user progression data when they complete onboarding
  static async initializeUserProgression(userId) {
    try {
      // Set initial spiritual progression values
      const result = await db.query(
        `UPDATE profiles 
         SET 
           karma_balance = 100,
           spiritual_points = 50,
           level = 1,
           daily_streak = 0,
           sankalpa_progress = 0.00,
           chakra_balance = '{"root": 50, "sacral": 50, "solar": 50, "heart": 50, "throat": 50, "thirdEye": 50, "crown": 50}'::jsonb,
           energy_balance = '{"sattva": 33, "rajas": 33, "tamas": 34}'::jsonb,
           updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Profile not found');
      }

      // Create default achievements for the user
      await this.initializeDefaultAchievements(userId);

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to initialize user progression: ${error.message}`);
    }
  }

  // Initialize default achievements for a new user
  static async initializeDefaultAchievements(userId) {
    try {
      const defaultAchievements = [
        {
          name: 'First Steps',
          description: 'Completed your first sadhana',
          category: 'beginner',
          points: 10,
          metadata: { icon: 'Leaf' }
        },
        {
          name: 'Consistency Master',
          description: '7-day streak achieved',
          category: 'streak',
          points: 50,
          metadata: { icon: 'Flame' }
        },
        {
          name: 'Mindful Warrior',
          description: 'Completed 50 sadhanas',
          category: 'completion',
          points: 100,
          metadata: { icon: 'Medal' }
        },
        {
          name: 'Energy Balancer',
          description: 'Balanced all chakras',
          category: 'chakra',
          points: 75,
          metadata: { icon: 'Zap' }
        },
        {
          name: 'Sankalpa Keeper',
          description: 'Maintained intention for 30 days',
          category: 'intention',
          points: 80,
          metadata: { icon: 'Target' }
        },
        {
          name: 'Community Builder',
          description: 'Shared 10 practices',
          category: 'social',
          points: 60,
          metadata: { icon: 'Users' }
        }
      ];

      // Create each achievement
      for (const achievement of defaultAchievements) {
        await AchievementService.createAchievement(achievement, userId);
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to initialize achievements: ${error.message}`);
    }
  }

  // Calculate level based on experience points
  static calculateLevel(xp) {
    // Level = floor(sqrt(XP / 100)) + 1
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  // Award experience points for completing a sadhana
  static async awardExperiencePoints(userId, points = 10) {
    try {
      // Get current profile data
      const profileResult = await db.query(
        `SELECT spiritual_points, level FROM profiles WHERE id = $1`,
        [userId]
      );

      if (profileResult.rows.length === 0) {
        throw new Error('Profile not found');
      }

      const currentPoints = profileResult.rows[0].spiritual_points || 0;
      const newPoints = currentPoints + points;
      const newLevel = this.calculateLevel(newPoints);

      // Update profile with new points and level
      const result = await db.query(
        `UPDATE profiles 
         SET 
           spiritual_points = $1,
           level = $2,
           updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [newPoints, newLevel, userId]
      );

      // Check if level increased and award bonus if so
      const oldLevel = profileResult.rows[0].level || 1;
      if (newLevel > oldLevel) {
        await this.awardLevelUpBonus(userId, newLevel);
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to award experience points: ${error.message}`);
    }
  }

  // Award spiritual points for completing a sadhana
  static async awardSpiritualPoints(userId, points = 5) {
    try {
      const result = await db.query(
        `UPDATE profiles 
         SET 
           spiritual_points = spiritual_points + $1,
           updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [points, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Profile not found');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to award spiritual points: ${error.message}`);
    }
  }

  // Award karma points for positive actions
  static async awardKarmaPoints(userId, points = 10) {
    try {
      const result = await db.query(
        `UPDATE profiles 
         SET 
           karma_balance = karma_balance + $1,
           updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [points, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Profile not found');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to award karma points: ${error.message}`);
    }
  }

  // Award level up bonus
  static async awardLevelUpBonus(userId, newLevel) {
    try {
      const bonusPoints = newLevel * 20; // 20 points per level as bonus
      
      const result = await db.query(
        `UPDATE profiles 
         SET 
           spiritual_points = spiritual_points + $1,
           karma_balance = karma_balance + $2,
           updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [bonusPoints, bonusPoints, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Profile not found');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to award level up bonus: ${error.message}`);
    }
  }

  // Update daily streak
  static async updateDailyStreak(userId, completed = true) {
    try {
      let result;
      
      if (completed) {
        // Increment streak
        result = await db.query(
          `UPDATE profiles 
           SET 
             daily_streak = daily_streak + 1,
             updated_at = NOW()
           WHERE id = $1
           RETURNING *`,
          [userId]
        );
      } else {
        // Reset streak
        result = await db.query(
          `UPDATE profiles 
           SET 
             daily_streak = 0,
             updated_at = NOW()
           WHERE id = $1
           RETURNING *`,
          [userId]
        );
      }

      if (result.rows.length === 0) {
        throw new Error('Profile not found');
      }

      // Check for streak achievements
      const newStreak = result.rows[0].daily_streak;
      if (completed && [7, 30, 100, 365].includes(newStreak)) {
        await this.awardStreakAchievement(userId, newStreak);
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update daily streak: ${error.message}`);
    }
  }

  // Award streak achievement
  static async awardStreakAchievement(userId, streak) {
    try {
      let achievementName, points;
      
      switch (streak) {
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
        default:
          return;
      }

      // Mark achievement as earned
      await db.query(
        `UPDATE achievements 
         SET 
           earned = true,
           earned_at = NOW(),
           updated_at = NOW()
         WHERE user_id = $1 AND name = $2`,
        [userId, achievementName]
      );

      // Award bonus points
      await this.awardSpiritualPoints(userId, points);
    } catch (error) {
      console.error(`Failed to award streak achievement: ${error.message}`);
    }
  }

  // Update sankalpa progress
  static async updateSankalpaProgress(userId, progressIncrement = 1.00) {
    try {
      const result = await db.query(
        `UPDATE profiles 
         SET 
           sankalpa_progress = LEAST(sankalpa_progress + $1, 100.00),
           updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [progressIncrement, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Profile not found');
      }

      // Check if sankalpa is complete (100%)
      if (result.rows[0].sankalpa_progress >= 100.00) {
        await this.awardSankalpaAchievement(userId);
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update sankalpa progress: ${error.message}`);
    }
  }

  // Award sankalpa achievement
  static async awardSankalpaAchievement(userId) {
    try {
      // Mark achievement as earned
      await db.query(
        `UPDATE achievements 
         SET 
           earned = true,
           earned_at = NOW(),
           updated_at = NOW()
         WHERE user_id = $1 AND name = 'Sankalpa Keeper'`,
        [userId]
      );

      // Award bonus points
      await this.awardSpiritualPoints(userId, 80);
    } catch (error) {
      console.error(`Failed to award sankalpa achievement: ${error.message}`);
    }
  }

  // Update chakra balance
  static async updateChakraBalance(userId, chakraData) {
    try {
      const result = await db.query(
        `UPDATE profiles 
         SET 
           chakra_balance = $1::jsonb,
           updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [JSON.stringify(chakraData), userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Profile not found');
      }

      // Check if all chakras are balanced (above 70%)
      const allBalanced = Object.values(chakraData).every(value => value >= 70);
      if (allBalanced) {
        await this.awardChakraAchievement(userId);
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update chakra balance: ${error.message}`);
    }
  }

  // Award chakra achievement
  static async awardChakraAchievement(userId) {
    try {
      // Mark achievement as earned
      await db.query(
        `UPDATE achievements 
         SET 
           earned = true,
           earned_at = NOW(),
           updated_at = NOW()
         WHERE user_id = $1 AND name = 'Energy Balancer'`,
        [userId]
      );

      // Award bonus points
      await this.awardSpiritualPoints(userId, 75);
    } catch (error) {
      console.error(`Failed to award chakra achievement: ${error.message}`);
    }
  }

  // Update energy balance
  static async updateEnergyBalance(userId, energyData) {
    try {
      const result = await db.query(
        `UPDATE profiles 
         SET 
           energy_balance = $1::jsonb,
           updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [JSON.stringify(energyData), userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Profile not found');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update energy balance: ${error.message}`);
    }
  }

  // Get user progression data
  static async getUserProgressionData(userId) {
    try {
      const result = await db.query(
        `SELECT 
           karma_balance,
           spiritual_points,
           level,
           daily_streak,
           sankalpa_progress,
           chakra_balance,
           energy_balance
         FROM profiles 
         WHERE id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Profile not found');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get user progression data: ${error.message}`);
    }
  }
}

module.exports = UserProgressionService;