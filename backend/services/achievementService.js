const Achievement = require('../schemas/Achievement');

class AchievementService {
  // Get all achievements for a user
  static async getUserAchievements(userId) {
    try {
      const achievements = await Achievement.find({ userId }).sort({ earnedAt: -1, createdAt: -1 }).lean();
      return achievements;
    } catch (error) {
      throw new Error(`Failed to fetch achievements: ${error.message}`);
    }
  }

  // Get earned achievements for a user
  static async getUserEarnedAchievements(userId) {
    try {
      const achievements = await Achievement.find({ userId, earned: true }).sort({ earnedAt: -1 }).lean();
      return achievements;
    } catch (error) {
      throw new Error(`Failed to fetch earned achievements: ${error.message}`);
    }
  }

  // Create a new achievement
  static async createAchievement(achievementData, userId) {
    try {
      const { name, description, category, points, metadata } = achievementData;

      const achievement = new Achievement({
        userId,
        name,
        description,
        category,
        points: points || 0,
        metadata: metadata || {}
      });
      await achievement.save();

      return achievement.toJSON();
    } catch (error) {
      throw new Error(`Failed to create achievement: ${error.message}`);
    }
  }

  // Update an achievement
  static async updateAchievement(achievementId, achievementData, userId) {
    try {
      const { name, description, category, points, earned, earnedAt, metadata } = achievementData;

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (category !== undefined) updateData.category = category;
      if (points !== undefined) updateData.points = points;
      if (earned !== undefined) updateData.earned = earned;
      if (earnedAt !== undefined) updateData.earnedAt = earnedAt;
      if (metadata !== undefined) updateData.metadata = metadata;

      const achievement = await Achievement.findOneAndUpdate(
        { _id: achievementId, userId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!achievement) throw new Error('Achievement not found or unauthorized');
      return achievement.toJSON();
    } catch (error) {
      throw new Error(`Failed to update achievement: ${error.message}`);
    }
  }

  // Mark an achievement as earned (also handles unlock)
  static async earnAchievement(achievementId, userId) {
    try {
      const achievement = await Achievement.findOneAndUpdate(
        { _id: achievementId, userId, earned: false },
        { earned: true, earnedAt: new Date() },
        { new: true }
      );

      if (!achievement) throw new Error('Achievement not found, already earned, or unauthorized');
      return achievement.toJSON();
    } catch (error) {
      throw new Error(`Failed to earn achievement: ${error.message}`);
    }
  }

  // Unlock achievement by name (helper method for automatic unlocking)
  static async unlockAchievement(userId, achievementName) {
    try {
      const achievement = await Achievement.findOneAndUpdate(
        { userId, name: achievementName, earned: false },
        { earned: true, earnedAt: new Date() },
        { new: true }
      );
      return achievement?.toJSON() || null;
    } catch (error) {
      console.error(`Failed to unlock achievement: ${error.message}`);
      return null;
    }
  }

  // Delete an achievement
  static async deleteAchievement(achievementId, userId) {
    try {
      const achievement = await Achievement.findOneAndDelete(
        { _id: achievementId, userId }
      );

      if (!achievement) throw new Error('Achievement not found or unauthorized');
      return { id: achievement._id };
    } catch (error) {
      throw new Error(`Failed to delete achievement: ${error.message}`);
    }
  }

  // Get achievements by category
  static async getAchievementsByCategory(userId, category) {
    try {
      const achievements = await Achievement.find({ userId, category }).sort({ createdAt: -1 }).lean();
      return achievements;
    } catch (error) {
      throw new Error(`Failed to fetch achievements by category: ${error.message}`);
    }
  }

  // Get achievement statistics for a user
  static async getUserAchievementStats(userId) {
    try {
      const stats = await Achievement.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalAchievements: { $sum: 1 },
            earnedAchievements: { $sum: { $cond: ['$earned', 1, 0] } },
            totalPoints: { $sum: { $cond: ['$earned', '$points', 0] } }
          }
        },
        {
          $project: {
            _id: 0,
            total_achievements: '$totalAchievements',
            earned_achievements: '$earnedAchievements',
            total_points: '$totalPoints'
          }
        }
      ]);

      return stats[0] || { total_achievements: 0, earned_achievements: 0, total_points: 0 };
    } catch (error) {
      throw new Error(`Failed to fetch achievement stats: ${error.message}`);
    }
  }
}

module.exports = AchievementService;