const SadhanaProgress = require('../schemas/SadhanaProgress');
const Sadhana = require('../schemas/Sadhana');
const Profile = require('../schemas/Profile');
const UserProgressionService = require('./userProgressionService');
const AchievementService = require('./achievementService');

class SadhanaProgressionService {
  // Record sadhana completion and update user progression
  static async recordSadhanaCompletion(userId, sadhanaId, completionData) {
    try {
      const {
        durationMinutes = 30,
        experiencePoints = 10,
        spiritualPoints = 5,
        notes = '',
        completedAt = new Date()
      } = completionData;

      const dateStr = new Date(completedAt).toISOString().split('T')[0];

      // 1. Record the completion in sadhana_progress
      let progress = await SadhanaProgress.findOne({
        sadhanaId,
        progressDate: { $gte: new Date(dateStr), $lt: new Date(new Date(dateStr).getTime() + 86400000) }
      });

      if (progress) {
        progress.completed = true;
        progress.notes = notes;
        progress.durationMinutes = durationMinutes;
        progress.completedAt = completedAt;
        await progress.save();
      } else {
        progress = new SadhanaProgress({
          sadhanaId,
          userId,
          progressDate: new Date(dateStr),
          completed: true,
          notes,
          durationMinutes,
          completedAt
        });
        await progress.save();
      }

      // 2. Update user's spiritual progression
      await UserProgressionService.awardExperiencePoints(userId, experiencePoints);
      await UserProgressionService.awardSpiritualPoints(userId, spiritualPoints);

      const karmaPoints = Math.floor(durationMinutes / 10);
      await UserProgressionService.awardKarmaPoints(userId, karmaPoints);
      await UserProgressionService.updateDailyStreak(userId, true);

      // Update sadhana streak
      const sadhana = await Sadhana.findByIdAndUpdate(
        sadhanaId,
        {
          streakDays: (await Sadhana.findById(sadhanaId))?.streakDays || 0 + 1,
          lastCompletedAt: completedAt
        },
        { new: true }
      );

      // 3. Check for achievements
      await this.checkCompletionAchievements(userId);
      await this.checkStreakAchievements(userId);

      return {
        success: true,
        progress: progress.toJSON(),
        pointsAwarded: {
          experience: experiencePoints,
          spiritual: spiritualPoints,
          karma: karmaPoints
        }
      };
    } catch (error) {
      throw new Error(`Failed to record sadhana completion: ${error.message}`);
    }
  }

  // Check for completion-based achievements
  static async checkCompletionAchievements(userId) {
    try {
      const totalCompleted = await SadhanaProgress.countDocuments({ userId, completed: true });

      // Check for "Mindful Warrior" achievement (50 completions)
      if (totalCompleted >= 50) {
        await AchievementService.unlockAchievement(userId, 'Mindful Warrior');
      }

      // Check for "Community Builder" achievement (10 shared practices)
      const sharedCount = await Sadhana.countDocuments({ userId, isPublic: true });
      if (sharedCount >= 10) {
        await AchievementService.unlockAchievement(userId, 'Community Builder');
      }
    } catch (error) {
      console.error('Error checking completion achievements:', error.message);
    }
  }

  // Check for streak-based achievements
  static async checkStreakAchievements(userId) {
    try {
      const profile = await Profile.findOne({ userId });
      if (!profile) return;

      const currentStreak = profile.dailyStreak || 0;

      const streakAchievements = {
        7: { name: 'Consistency Master', points: 50 },
        30: { name: 'Month Master', points: 100 },
        100: { name: 'Century Champion', points: 200 },
        365: { name: 'Year Master', points: 500 }
      };

      if (streakAchievements[currentStreak]) {
        const achievement = streakAchievements[currentStreak];
        await AchievementService.unlockAchievement(userId, achievement.name);
        await UserProgressionService.awardSpiritualPoints(userId, achievement.points);
      }
    } catch (error) {
      console.error('Error checking streak achievements:', error.message);
    }
  }

  // Update chakra balance based on sadhana practice
  static async updateChakraBalance(userId, chakraUpdates) {
    try {
      const profile = await Profile.findOne({ userId });
      if (!profile) throw new Error('Profile not found');

      const currentBalance = profile.chakraBalance || {
        root: 50,
        sacral: 50,
        solar: 50,
        heart: 50,
        throat: 50,
        thirdEye: 50,
        crown: 50
      };

      const newBalance = { ...currentBalance, ...chakraUpdates };

      await Profile.findOneAndUpdate(
        { userId },
        { chakraBalance: newBalance },
        { new: true }
      );

      // Check if all chakras are balanced
      const allBalanced = Object.values(newBalance).every(value => value >= 70);
      if (allBalanced) {
        await AchievementService.unlockAchievement(userId, 'Energy Balancer');
      }

      return newBalance;
    } catch (error) {
      throw new Error(`Failed to update chakra balance: ${error.message}`);
    }
  }

  // Update energy balance (sattva-rajas-tamas)
  static async updateEnergyBalance(userId, energyUpdates) {
    try {
      const profile = await Profile.findOne({ userId });
      if (!profile) throw new Error('Profile not found');

      const currentBalance = profile.energyBalance || {
        sattva: 33,
        rajas: 33,
        tamas: 34
      };

      let newBalance = { ...currentBalance, ...energyUpdates };

      // Ensure values sum to 100
      const total = newBalance.sattva + newBalance.rajas + newBalance.tamas;
      if (total !== 100) {
        const factor = 100 / total;
        newBalance.sattva = Math.round(newBalance.sattva * factor);
        newBalance.rajas = Math.round(newBalance.rajas * factor);
        newBalance.tamas = 100 - newBalance.sattva - newBalance.rajas;
      }

      await Profile.findOneAndUpdate(
        { userId },
        { energyBalance: newBalance },
        { new: true }
      );

      return newBalance;
    } catch (error) {
      throw new Error(`Failed to update energy balance: ${error.message}`);
    }
  }

  // Update sankalpa progress
  static async updateSankalpaProgress(userId, progressIncrement = 1.0) {
    try {
      const profile = await Profile.findOne({ userId });
      if (!profile) throw new Error('Profile not found');

      const newProgress = Math.min((profile.sankalpaProgress || 0) + progressIncrement, 100.0);

      await Profile.findOneAndUpdate(
        { userId },
        { sankalpaProgress: newProgress },
        { new: true }
      );

      // Check if sankalpa is complete
      if (newProgress >= 100.0) {
        await AchievementService.unlockAchievement(userId, 'Sankalpa Keeper');
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
      stats.totalCompleted = await SadhanaProgress.countDocuments({ userId, completed: true });

      // Current streak
      const profile = await Profile.findOne({ userId });
      stats.currentStreak = profile?.dailyStreak || 0;

      // Longest streak (max streak_count from user's sadhanas)
      const longestStreakDoc = await Sadhana.findOne({ userId }).sort({ streakDays: -1 }).select('streakDays');
      stats.longestStreak = longestStreakDoc?.streakDays || 0;

      // Total practice time
      const timeResult = await SadhanaProgress.aggregate([
        { $match: { userId, completed: true } },
        { $group: { _id: null, totalMinutes: { $sum: '$durationMinutes' } } }
      ]);
      stats.totalMinutes = timeResult.length > 0 ? timeResult[0].totalMinutes : 0;

      return stats;
    } catch (error) {
      throw new Error(`Failed to get user sadhana stats: ${error.message}`);
    }
  }
}

module.exports = SadhanaProgressionService;
