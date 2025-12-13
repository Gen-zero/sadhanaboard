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
      const User = require('../schemas/User');
      
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
        sankalpaProgress,
        chakra_balance,
        chakraBalance,
        energy_balance,
        energyBalance,
        social_links,
        socialLinks,
        deity_preferences,
        energy_level_answers
      } = profileData;
      const updateData = {};
      
      // Update display_name in User document if provided
      if (display_name !== undefined || displayName !== undefined) {
        const nameToUpdate = display_name || displayName;
        if (nameToUpdate) {
          try {
            await User.findByIdAndUpdate(userId, { displayName: nameToUpdate }, { new: true });
            console.log('[ProfileService] Updated User displayName:', nameToUpdate);
          } catch (userError) {
            console.error('[ProfileService] Warning: Failed to update User displayName:', userError.message);
            // Don't fail the entire profile update if user update fails
          }
        }
      }
      
      // Map fields to Profile schema field names
      if (bio !== undefined) updateData.bio = bio;
      if (avatar_url !== undefined || avatarUrl !== undefined) updateData.avatar = avatar_url || avatarUrl;
      if (traditions !== undefined) updateData.traditions = traditions;
      if (practices !== undefined) updateData.practices = practices;
      if (interests !== undefined) updateData.interests = interests;
      
      // Location fields - handle both 'location' and 'city' field names
      if (location !== undefined && city === undefined) {
        // 'location' is provided, use it as city for backward compatibility
        updateData.city = location;
      } else if (city !== undefined) {
        // 'city' is explicitly provided, use it
        updateData.city = city;
      }
      if (country !== undefined) updateData.country = country;
      if (state !== undefined) updateData.state = state;
      
      // Profile completion fields
      if (experience_level !== undefined || experienceLevel !== undefined) {
        updateData.experience_level = experience_level || experienceLevel;
      }
      if (favorite_deity !== undefined || favoriteDeity !== undefined) {
        updateData.favorite_deity = favorite_deity || favoriteDeity;
      }
      if (gotra !== undefined) updateData.gotra = gotra;
      if (varna !== undefined) updateData.varna = varna;
      if (sampradaya !== undefined) updateData.sampradaya = sampradaya;
      if (date_of_birth !== undefined || dateOfBirth !== undefined) {
        updateData.date_of_birth = date_of_birth || dateOfBirth;
      }
      if (place_of_birth !== undefined || placeOfBirth !== undefined) {
        updateData.place_of_birth = place_of_birth || placeOfBirth;
      }
      
      // Social links
      if (social_links !== undefined || socialLinks !== undefined) {
        updateData.socialLinks = social_links || socialLinks;
      }
      
      // Onboarding preferences
      if (deity_preferences !== undefined) updateData.deity_preferences = deity_preferences;
      if (energy_level_answers !== undefined) updateData.energy_level_answers = energy_level_answers;
      
      // Spiritual metrics
      if (karma_balance !== undefined || karmaBalance !== undefined) updateData.karmaBalance = karma_balance || karmaBalance;
      if (spiritual_points !== undefined || spiritualPoints !== undefined) updateData.spiritualPoints = spiritual_points || spiritualPoints;
      if (level !== undefined) updateData.level = level;
      if (daily_streak !== undefined || dailyStreak !== undefined) updateData.dailyStreak = daily_streak || dailyStreak;
      if (sankalpa_progress !== undefined || sankalpaProgress !== undefined) updateData.sankalpaProgress = sankalpa_progress || sankalpaProgress;
      if (chakra_balance !== undefined || chakraBalance !== undefined) updateData.chakraBalance = chakra_balance || chakraBalance;
      if (energy_balance !== undefined || energyBalance !== undefined) updateData.energyBalance = energy_balance || energyBalance;
      
      // Onboarding
      if (onboarding_completed !== undefined || onboardingCompleted !== undefined) updateData.onboarding_completed = onboarding_completed || onboardingCompleted;
      if (settings !== undefined) updateData.settings = settings;

      console.log('[ProfileService] Updating profile for userId:', userId);
      console.log('[ProfileService] Input data keys:', Object.keys(profileData));
      console.log('[ProfileService] Update data being sent to MongoDB:', JSON.stringify(updateData, null, 2));

      const profile = await Profile.findOneAndUpdate(
        { userId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!profile) {
        throw new Error('Profile not found');
      }

      console.log('[ProfileService] Profile updated successfully');
      console.log('[ProfileService] Updated profile:', JSON.stringify(profile.toJSON(), null, 2));
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
        sankalpaProgress,
        chakraBalance,
        energyBalance
      } = metrics;

      const updateData = {};
      if (karmaBalance !== undefined) updateData.karmaBalance = karmaBalance;
      if (spiritualPoints !== undefined) updateData.spiritualPoints = spiritualPoints;
      if (level !== undefined) updateData.level = level;
      if (dailyStreak !== undefined) updateData.dailyStreak = dailyStreak;
      if (sankalpaProgress !== undefined) updateData.sankalpaProgress = sankalpaProgress;
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
