const Profile = require('../schemas/Profile');

class ProfileService {
  // Get profile by user ID
  static async getProfileByUserId(userId) {
    try {
      const profile = await Profile.findOne({ userId });
      return profile;
    } catch (error) {
      throw new Error(`Failed to get profile: ${error.message}`);
    }
  }

  // Update profile
  static async updateProfile(userId, profileData) {
    try {
      const {
        displayName,
        avatarUrl,
        bio,
        experienceLevel,
        traditions,
        location,
        availableForGuidance,
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
        favoriteDeity,
        gotra,
        varna,
        sampradaya,
        onboardingCompleted,
        settings,
        karmaBalance,
        spiritualPoints,
        level,
        dailyStreak,
        sankalpProgress,
        chakraBalance,
        energyBalance
      } = profileData;

      const updateData = {};
      if (displayName !== undefined) updateData.displayName = displayName;
      if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
      if (bio !== undefined) updateData.bio = bio;
      if (experienceLevel !== undefined) updateData.experienceLevel = experienceLevel;
      if (traditions !== undefined) updateData.traditions = traditions;
      if (location !== undefined) updateData.location = location;
      if (availableForGuidance !== undefined) updateData.availableForGuidance = availableForGuidance;
      if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
      if (timeOfBirth !== undefined) updateData.timeOfBirth = timeOfBirth;
      if (placeOfBirth !== undefined) updateData.placeOfBirth = placeOfBirth;
      if (favoriteDeity !== undefined) updateData.favoriteDeity = favoriteDeity;
      if (gotra !== undefined) updateData.gotra = gotra;
      if (varna !== undefined) updateData.varna = varna;
      if (sampradaya !== undefined) updateData.sampradaya = sampradaya;
      if (onboardingCompleted !== undefined) updateData.onboardingCompleted = onboardingCompleted;
      if (settings !== undefined) updateData.settings = settings;
      if (karmaBalance !== undefined) updateData.karmaBalance = karmaBalance;
      if (spiritualPoints !== undefined) updateData.spiritualPoints = spiritualPoints;
      if (level !== undefined) updateData.level = level;
      if (dailyStreak !== undefined) updateData.dailyStreak = dailyStreak;
      if (sankalpProgress !== undefined) updateData.sankalpProgress = sankalpProgress;
      if (chakraBalance !== undefined) updateData.chakraBalance = chakraBalance;
      if (energyBalance !== undefined) updateData.energyBalance = energyBalance;

      const profile = await Profile.findOneAndUpdate(
        { userId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!profile) {
        throw new Error('Profile not found');
      }

      return profile;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  // Create profile (for new users)
  static async createProfile(userId, displayName) {
    try {
      const profile = new Profile({
        userId,
        displayName
      });
      await profile.save();

      return profile;
    } catch (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }
  }
  
  // Update spiritual metrics for a user
  static async updateSpiritualMetrics(userId, metrics) {
    try {
      const {
        karmaBalance,
        spiritualPoints,
        level,
        dailyStreak,
        sankalpProgress,
        chakraBalance,
        energyBalance
      } = metrics;

      const updateData = {};
      if (karmaBalance !== undefined) updateData.karmaBalance = karmaBalance;
      if (spiritualPoints !== undefined) updateData.spiritualPoints = spiritualPoints;
      if (level !== undefined) updateData.level = level;
      if (dailyStreak !== undefined) updateData.dailyStreak = dailyStreak;
      if (sankalpProgress !== undefined) updateData.sankalpProgress = sankalpProgress;
      if (chakraBalance !== undefined) updateData.chakraBalance = chakraBalance;
      if (energyBalance !== undefined) updateData.energyBalance = energyBalance;

      const profile = await Profile.findOneAndUpdate(
        { userId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!profile) {
        throw new Error('Profile not found');
      }

      return profile;
    } catch (error) {
      throw new Error(`Failed to update spiritual metrics: ${error.message}`);
    }
  }
}

module.exports = ProfileService;