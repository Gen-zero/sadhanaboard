const Profile = require('../schemas/Profile');
const AchievementService = require('./achievementService');

class UserProgressionService {
  // Initialize user progression data when they complete onboarding
  static async initializeUserProgression(userId) {
    try {
      const profile = await Profile.findOneAndUpdate(
        { userId },
        {
          karmaBalance: 100,
          spiritualPoints: 50,
          level: 1,
          dailyStreak: 0,
          sankalphaProgress: 0.0,
          chakraBalance: {
            root: 50,
            sacral: 50,
            solar: 50,
            heart: 50,
            throat: 50,
            thirdEye: 50,
            crown: 50
          },
          energyBalance: {
            sattva: 33,
            rajas: 33,
            tamas: 34
          }
        },
        { new: true, runValidators: true }
      );

      if (!profile) throw new Error('Profile not found');

      // Create default achievements for the user
      await this.initializeDefaultAchievements(userId);

      return profile.toJSON();
    } catch (error) {
      throw new Error(`Failed to initialize user progression: ${error.message}`);
    }
  }

  // Initialize default achievements for a new user
  static async initializeDefaultAchievements(userId) {
    try {
      const defaultAchievements = [
        { name: 'First Steps', description: 'Completed your first sadhana', category: 'beginner', points: 10, metadata: { icon: 'Leaf' } },
        { name: 'Consistency Master', description: '7-day streak achieved', category: 'streak', points: 50, metadata: { icon: 'Flame' } },
        { name: 'Mindful Warrior', description: 'Completed 50 sadhanas', category: 'completion', points: 100, metadata: { icon: 'Medal' } },
        { name: 'Energy Balancer', description: 'Balanced all chakras', category: 'chakra', points: 75, metadata: { icon: 'Zap' } },
        { name: 'Sankalpa Keeper', description: 'Maintained intention for 30 days', category: 'intention', points: 80, metadata: { icon: 'Target' } },
        { name: 'Community Builder', description: 'Shared 10 practices', category: 'social', points: 60, metadata: { icon: 'Users' } }
      ];

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
      const profile = await Profile.findOne({ userId });
      if (!profile) throw new Error('Profile not found');

      const newPoints = (profile.spiritualPoints || 0) + points;
      const newLevel = this.calculateLevel(newPoints);
      const oldLevel = profile.level || 1;

      const updated = await Profile.findOneAndUpdate(
        { userId },
        { spiritualPoints: newPoints, level: newLevel },
        { new: true, runValidators: true }
      );

      // Award bonus if level increased
      if (newLevel > oldLevel) {
        await this.awardLevelUpBonus(userId, newLevel);
      }

      return updated.toJSON();
    } catch (error) {
      throw new Error(`Failed to award experience points: ${error.message}`);
    }
  }

  // Award spiritual points for completing a sadhana
  static async awardSpiritualPoints(userId, points = 5) {
    try {
      const profile = await Profile.findOneAndUpdate(
        { userId },
        { $inc: { spiritualPoints: points } },
        { new: true }
      );

      if (!profile) throw new Error('Profile not found');
      return profile.toJSON();
    } catch (error) {
      throw new Error(`Failed to award spiritual points: ${error.message}`);
    }
  }

  // Award karma points for positive actions
  static async awardKarmaPoints(userId, points = 10) {
    try {
      const profile = await Profile.findOneAndUpdate(
        { userId },
        { $inc: { karmaBalance: points } },
        { new: true }
      );

      if (!profile) throw new Error('Profile not found');
      return profile.toJSON();
    } catch (error) {
      throw new Error(`Failed to award karma points: ${error.message}`);
    }
  }

  // Award level up bonus
  static async awardLevelUpBonus(userId, newLevel) {
    try {
      const bonusPoints = newLevel * 20;
      const profile = await Profile.findOneAndUpdate(
        { userId },
        { $inc: { spiritualPoints: bonusPoints, karmaBalance: bonusPoints } },
        { new: true }
      );

      if (!profile) throw new Error('Profile not found');
      return profile.toJSON();
    } catch (error) {
      throw new Error(`Failed to award level up bonus: ${error.message}`);
    }
  }

  // Update daily streak
  static async updateDailyStreak(userId, completed = true) {
    try {
      const incValue = completed ? 1 : { $set: 0 };
      const updateOp = completed ? { $inc: { dailyStreak: incValue } } : { $set: { dailyStreak: 0 } };

      const profile = await Profile.findOneAndUpdate(
        { userId },
        updateOp,
        { new: true }
      );

      if (!profile) throw new Error('Profile not found');

      // Check for streak achievements
      const newStreak = profile.dailyStreak;
      if (completed && [7, 30, 100, 365].includes(newStreak)) {
        await this.awardStreakAchievement(userId, newStreak);
      }

      return profile.toJSON();
    } catch (error) {
      throw new Error(`Failed to update daily streak: ${error.message}`);
    }
  }

  // Award streak achievement
  static async awardStreakAchievement(userId, streak) {
    try {
      const streakMap = {
        7: { name: 'Consistency Master', points: 50 },
        30: { name: 'Month Master', points: 100 },
        100: { name: 'Century Champion', points: 200 },
        365: { name: 'Year Master', points: 500 }
      };

      const achievement = streakMap[streak];
      if (!achievement) return;

      await AchievementService.unlockAchievement(userId, achievement.name);
      await this.awardSpiritualPoints(userId, achievement.points);
    } catch (error) {
      console.error(`Failed to award streak achievement: ${error.message}`);
    }
  }

  // Update sankalpa progress
  static async updateSankalpaProgress(userId, progressIncrement = 1.0) {
    try {
      const profile = await Profile.findOne({ userId });
      if (!profile) throw new Error('Profile not found');

      const newProgress = Math.min((profile.sankalphaProgress || 0) + progressIncrement, 100.0);

      const updated = await Profile.findOneAndUpdate(
        { userId },
        { sankalphaProgress: newProgress },
        { new: true }
      );

      if (newProgress >= 100.0) {
        await AchievementService.unlockAchievement(userId, 'Sankalpa Keeper');
      }

      return updated.toJSON();
    } catch (error) {
      throw new Error(`Failed to update sankalpa progress: ${error.message}`);
    }
  }

  // Update chakra balance
  static async updateChakraBalance(userId, chakraData) {
    try {
      const updated = await Profile.findOneAndUpdate(
        { userId },
        { chakraBalance: chakraData },
        { new: true }
      );

      if (!updated) throw new Error('Profile not found');

      const allBalanced = Object.values(chakraData).every(value => value >= 70);
      if (allBalanced) {
        await AchievementService.unlockAchievement(userId, 'Energy Balancer');
      }

      return updated.toJSON();
    } catch (error) {
      throw new Error(`Failed to update chakra balance: ${error.message}`);
    }
  }

  // Update energy balance
  static async updateEnergyBalance(userId, energyData) {
    try {
      const updated = await Profile.findOneAndUpdate(
        { userId },
        { energyBalance: energyData },
        { new: true }
      );

      if (!updated) throw new Error('Profile not found');
      return updated.toJSON();
    } catch (error) {
      throw new Error(`Failed to update energy balance: ${error.message}`);
    }
  }

  // Get user progression data
  static async getUserProgressionData(userId) {
    try {
      const profile = await Profile.findOne({ userId }).select(
        'karmaBalance spiritualPoints level dailyStreak sankalphaProgress chakraBalance energyBalance'
      ).lean();

      if (!profile) throw new Error('Profile not found');
      return profile;
    } catch (error) {
      throw new Error(`Failed to get user progression data: ${error.message}`);
    }
  }
}

module.exports = UserProgressionService;