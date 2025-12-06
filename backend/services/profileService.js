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
      // Handle both snake_case (from frontend) and camelCase (for backward compatibility)
      const {
        display_name,
        displayName,
        avatar_url,
        avatarUrl,
        bio,
        experience_level,
        experienceLevel,
        traditions,
        location,
        country,
        city,
        state,
        practices,
        interests,
        available_for_guidance,
        availableForGuidance,
        date_of_birth,
        dateOfBirth,
        time_of_birth,
        timeOfBirth,
        place_of_birth,
        placeOfBirth,
        favorite_deity,
        favoriteDeity,
        gotra,
        varna,
        sampradaya,
        onboarding_completed,
        onboardingCompleted,
        settings,
        karma_balance,
        karmaBalance,
        spiritual_points,
        spiritualPoints,
        level,
        daily_streak,
        dailyStreak,
        sankalpa_progress,
        sankalpProgress,
        chakra_balance,
        chakraBalance,
        energy_balance,
        energyBalance,
        social_links,
        socialLinks
      } = profileData;

      const updateData = {};
      
      // Map fields to Profile schema field names
      if (bio !== undefined) updateData.bio = bio;
      if (avatar_url !== undefined || avatarUrl !== undefined) updateData.avatar = avatar_url || avatarUrl;
      if (traditions !== undefined) updateData.traditions = traditions;
      if (practices !== undefined) updateData.practices = practices;
      if (interests !== undefined) updateData.interests = interests;
      
      // Location fields
      if (location !== undefined) updateData.city = location; // Map 'location' to 'city' for backward compatibility
      if (country !== undefined) updateData.country = country;
      if (city !== undefined) updateData.city = city;
      if (state !== undefined) updateData.state = state;
      
      // Social links
      if (social_links !== undefined || socialLinks !== undefined) {
        updateData.socialLinks = social_links || socialLinks;
      }
      
      // Spiritual information (not in Profile schema, but keep for backward compatibility)
      // These fields are not used in the actual Profile schema
      // if (favorite_deity !== undefined || favoriteDeity !== undefined) { }
      // if (gotra !== undefined) { }
      // if (varna !== undefined) { }
      // if (sampradaya !== undefined) { }
      // if (date_of_birth !== undefined || dateOfBirth !== undefined) { }
      // if (place_of_birth !== undefined || placeOfBirth !== undefined) { }
      // if (experience_level !== undefined || experienceLevel !== undefined) { }
      
      // Spiritual metrics
      if (karma_balance !== undefined || karmaBalance !== undefined) updateData.karmaBalance = karma_balance || karmaBalance;
      if (spiritual_points !== undefined || spiritualPoints !== undefined) updateData.spiritualPoints = spiritual_points || spiritualPoints;
      if (level !== undefined) updateData.level = level;
      if (daily_streak !== undefined || dailyStreak !== undefined) updateData.dailyStreak = daily_streak || dailyStreak;
      if (sankalpa_progress !== undefined || sankalpProgress !== undefined) updateData.sankalpProgress = sankalpa_progress || sankalpProgress;
      if (chakra_balance !== undefined || chakraBalance !== undefined) updateData.chakraBalance = chakra_balance || chakraBalance;
      if (energy_balance !== undefined || energyBalance !== undefined) updateData.energyBalance = energy_balance || energyBalance;
      
      // Onboarding
      if (onboarding_completed !== undefined || onboardingCompleted !== undefined) updateData.onboarding_completed = onboarding_completed || onboardingCompleted;
      if (settings !== undefined) updateData.settings = settings;

      console.log('[ProfileService] Updating profile for userId:', userId);
      console.log('[ProfileService] Update data:', JSON.stringify(updateData, null, 2));

      const profile = await Profile.findOneAndUpdate(
        { userId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!profile) {
        throw new Error('Profile not found');
      }

      console.log('[ProfileService] Profile updated successfully');
      return profile;
    } catch (error) {
      console.error('[ProfileService] Error updating profile:', error.message);
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