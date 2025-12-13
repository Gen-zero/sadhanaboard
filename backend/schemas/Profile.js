/**
 * Schema: Profile
 * 
 * Purpose: Stores extended user profile information and preferences
 * 
 * Key Fields:
 *   - userId: Reference to User document (one-to-one relationship)
 *   - bio: User biography/description
 *   - avatar: Avatar image URL
 *   - traditions: Spiritual traditions the user follows
 *   - socialLinks: Links to social media profiles
 * 
 * Relationships:
 *   - One-to-one with User (each user has one profile)
 * 
 * Indexes:
 *   - userId: For user-specific queries (unique)
 *   - createdAt: For profile discovery
 */

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    // Reference to User (one-to-one relationship)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
      index: true,
      description: 'Reference to User document (one-to-one unique)'
    },

    // Personal information
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: null,
      description: 'User biography/personal description'
    },

    avatar: {
      type: String,
      default: null,
      description: 'URL to user avatar image'
    },

    coverImage: {
      type: String,
      default: null,
      description: 'URL to profile cover image'
    },

    // Profile completeness fields from frontend
    experience_level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'master'],
      default: null,
      description: 'User spiritual experience level'
    },

    favorite_deity: {
      type: String,
      trim: true,
      default: null,
      description: 'User\'s favorite deity'
    },

    gotra: {
      type: String,
      trim: true,
      default: null,
      description: 'User\'s family lineage (Gotra)'
    },

    varna: {
      type: String,
      enum: ['brahmana', 'kshatriya', 'vaishya', 'shudra'],
      default: null,
      description: 'User\'s Varna (social classification)'
    },

    sampradaya: {
      type: String,
      trim: true,
      default: null,
      description: 'User\'s spiritual tradition (Sampradaya)'
    },

    date_of_birth: {
      type: Date,
      default: null,
      description: 'User\'s date of birth'
    },

    time_of_birth: {
      type: String,
      trim: true,
      default: null,
      description: 'Time of birth (HH:MM format)'
    },

    place_of_birth: {
      type: String,
      trim: true,
      default: null,
      description: 'User\'s place of birth'
    },

    availableForGuidance: {
      type: Boolean,
      default: false,
      description: 'Whether the user is available for guidance/mentorship'
    },

    // Spiritual information
    traditions: {
      type: [String],
      default: [],
      enum: [
        'Hindu',
        'Buddhist',
        'Christian',
        'Muslim',
        'Jewish',
        'Sikh',
        'Jain',
        'Secular',
        'Other'
      ],
      description: 'Spiritual traditions the user follows'
    },

    // Spiritual practices
    practices: {
      type: [String],
      default: [],
      description: 'Main spiritual practices (yoga, meditation, prayer, etc.)'
    },

    // Interests/tags
    interests: {
      type: [String],
      default: [],
      description: 'User interests and areas of focus'
    },

    // Onboarding preferences
    deity_preferences: {
      type: [{
        deityId: String,
        priority: Number
      }],
      default: [],
      description: 'User deity preferences with priority rankings'
    },

    energy_level_answers: {
      type: Object,
      default: {},
      description: 'User answers to energy level assessment questions'
    },

    // Location information
    country: {
      type: String,
      trim: true,
      default: null,
      description: 'Country where user is located'
    },

    city: {
      type: String,
      trim: true,
      default: null,
      description: 'City where user is located'
    },

    state: {
      type: String,
      trim: true,
      default: null,
      description: 'State/province where user is located'
    },

    // Social links
    socialLinks: {
      twitter: {
        type: String,
        trim: true,
        default: null,
        description: 'Twitter/X profile URL'
      },
      instagram: {
        type: String,
        trim: true,
        default: null,
        description: 'Instagram profile URL'
      },
      facebook: {
        type: String,
        trim: true,
        default: null,
        description: 'Facebook profile URL'
      },
      website: {
        type: String,
        trim: true,
        default: null,
        description: 'Personal website URL'
      },
      linkedin: {
        type: String,
        trim: true,
        default: null,
        description: 'LinkedIn profile URL'
      }
    },

    // Custom settings/preferences blob
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      description: 'Flexible user-level settings (stored as JSON)'
    },

    // Spiritual metrics and gamification fields
    karmaBalance: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Accumulated karma points'
    },

    spiritualPoints: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Experience-like points for leveling'
    },

    level: {
      type: Number,
      default: 1,
      min: 1,
      description: 'Current spiritual level'
    },

    dailyStreak: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Consecutive practice day streak'
    },

    sankalpaProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      description: 'Progress towards sankalpa goal (0-100)'
    },

    chakraBalance: {
      type: {
        root: { type: Number, default: 50, min: 0, max: 100 },
        sacral: { type: Number, default: 50, min: 0, max: 100 },
        solar: { type: Number, default: 50, min: 0, max: 100 },
        heart: { type: Number, default: 50, min: 0, max: 100 },
        throat: { type: Number, default: 50, min: 0, max: 100 },
        thirdEye: { type: Number, default: 50, min: 0, max: 100 },
        crown: { type: Number, default: 50, min: 0, max: 100 }
      },
      default: () => ({
        root: 50,
        sacral: 50,
        solar: 50,
        heart: 50,
        throat: 50,
        thirdEye: 50,
        crown: 50
      }),
      description: 'Per-chakra balance readings'
    },

    energyBalance: {
      type: {
        sattva: { type: Number, default: 33, min: 0, max: 100 },
        rajas: { type: Number, default: 33, min: 0, max: 100 },
        tamas: { type: Number, default: 34, min: 0, max: 100 }
      },
      default: () => ({
        sattva: 33,
        rajas: 33,
        tamas: 34
      }),
      description: 'Energy type distribution'
    },

    // Profile completion
    profileCompleteness: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      description: 'Profile completion percentage (0-100)'
    },

    // Badges and achievements (references)
    badges: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Badge',
      default: [],
      description: 'User achieved badges'
    },

    // Statistics
    totalSadhanas: {
      type: Number,
      default: 0,
      description: 'Total spiritual practices created'
    },

    totalBooks: {
      type: Number,
      default: 0,
      description: 'Total books added to library'
    },

    totalConnections: {
      type: Number,
      default: 0,
      description: 'Total friends/connections'
    },

    // Privacy settings
    showEmail: {
      type: Boolean,
      default: false,
      description: 'Whether email is visible to others'
    },

    showLocation: {
      type: Boolean,
      default: true,
      description: 'Whether location is visible to others'
    },

    showTraditions: {
      type: Boolean,
      default: true,
      description: 'Whether spiritual traditions visible to others'
    },

    // Account verification badges
    isVerified: {
      type: Boolean,
      default: false,
      description: 'Whether profile is verified by admin'
    },

    // Onboarding status
    onboarding_completed: {
      type: Boolean,
      default: false,
      index: true,
      description: 'Whether user has completed the onboarding process'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When profile was created'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When profile was last updated'
    }
  },
  {
    timestamps: false, // Manually manage timestamps
    collection: 'profiles'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

// User ID index (for finding profile by user, unique constraint)

// Created date index (for profile discovery)
profileSchema.index({ createdAt: -1 });

// Traditions index (for finding users by tradition)

// Interests index (for finding users by interest)

// Location indexes (for geographic discovery)
profileSchema.index({ country: 1, city: 1 });

// Verification index

// Compound index for common discovery queries
profileSchema.index({ traditions: 1, country: 1, createdAt: -1 });

// ============================================================================
// VALIDATIONS
// ============================================================================

// Pre-save hook for validation
profileSchema.pre('save', async function(next) {
  try {
    // Update the updatedAt timestamp
    if (!this.isNew) {
      this.updatedAt = new Date();
    }

    // Calculate profile completeness
    this.calculateProfileCompleteness();

    // Validate user exists
    const User = mongoose.model('User');
    const user = await User.findById(this.userId);
    if (!user) {
      throw new Error('User does not exist');
    }

    next();
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Calculate profile completeness percentage
 * @returns {Number} Completeness percentage (0-100)
 */
profileSchema.methods.calculateProfileCompleteness = function() {
  let completeness = 0;
  let total = 10;

  // Check each optional field
  if (this.bio) completeness++;
  if (this.avatar) completeness++;
  if (this.coverImage) completeness++;
  if (this.traditions.length > 0) completeness++;
  if (this.practices.length > 0) completeness++;
  if (this.interests.length > 0) completeness++;
  if (this.country) completeness++;
  if (this.city) completeness++;
  if (Object.values(this.socialLinks).some(link => link)) completeness++;
  if (this.isVerified) completeness++;

  this.profileCompleteness = Math.round((completeness / total) * 100);
  return this.profileCompleteness;
};

/**
 * Add a badge to user profile
 * @param {String} badgeId - Badge ID
 * @returns {Promise} Updated profile
 */
profileSchema.methods.addBadge = async function(badgeId) {
  if (!this.badges.includes(badgeId)) {
    this.badges.push(badgeId);
    await this.save();
  }
  return this;
};

/**
 * Remove a badge from user profile
 * @param {String} badgeId - Badge ID
 * @returns {Promise} Updated profile
 */
profileSchema.methods.removeBadge = async function(badgeId) {
  this.badges = this.badges.filter(id => id.toString() !== badgeId.toString());
  await this.save();
  return this;
};

/**
 * Update statistics
 * @param {Object} stats - Statistics to update
 * @returns {Promise} Updated profile
 */
profileSchema.methods.updateStats = async function(stats) {
  if (stats.totalSadhanas !== undefined) {
    this.totalSadhanas = stats.totalSadhanas;
  }
  if (stats.totalBooks !== undefined) {
    this.totalBooks = stats.totalBooks;
  }
  if (stats.totalConnections !== undefined) {
    this.totalConnections = stats.totalConnections;
  }
  await this.save();
  return this;
};

/**
 * Get public profile data (only non-private fields)
 * @returns {Object} Public profile data
 */
profileSchema.methods.getPublicProfile = function() {
  const profile = this.toObject();
  
  // Remove private fields
  if (!this.showEmail) delete profile.email;
  if (!this.showLocation) {
    delete profile.country;
    delete profile.city;
    delete profile.state;
  }
  if (!this.showTraditions) delete profile.traditions;

  delete profile.__v;
  
  return profile;
};

/**
 * Get profile summary for quick display
 * @returns {Object} Profile summary
 */
profileSchema.methods.getSummary = function() {
  return {
    userId: this.userId,
    displayName: null, // Will be populated from User
    avatar: this.avatar,
    bio: this.bio,
    traditions: this.traditions,
    country: this.country,
    city: this.city,
    isVerified: this.isVerified,
    totalSadhanas: this.totalSadhanas,
    totalBooks: this.totalBooks
  };
};

/**
 * Check if profile is complete
 * @returns {Boolean} True if profile is at least 50% complete
 */
profileSchema.methods.isComplete = function() {
  return this.profileCompleteness >= 50;
};

/**
 * Add an interest
 * @param {String} interest - Interest to add
 * @returns {Promise} Updated profile
 */
profileSchema.methods.addInterest = async function(interest) {
  if (!this.interests.includes(interest)) {
    this.interests.push(interest);
    await this.save();
  }
  return this;
};

/**
 * Remove an interest
 * @param {String} interest - Interest to remove
 * @returns {Promise} Updated profile
 */
profileSchema.methods.removeInterest = async function(interest) {
  this.interests = this.interests.filter(i => i !== interest);
  await this.save();
  return this;
};

/**
 * Convert to JSON response format
 * Maps MongoDB field names to frontend field names for consistency
 * @returns {Object} JSON safe profile data
 */
profileSchema.methods.toJSON = function() {

  const obj = this.toObject();

  delete obj.__v;



  const fieldMap = {

    avatar: 'avatar_url',

    deity_preferences: 'deity_preferences',

    energy_level_answers: 'energy_level_answers',

    availableForGuidance: 'available_for_guidance',

    karmaBalance: 'karma_balance',

    spiritualPoints: 'spiritual_points',

    dailyStreak: 'daily_streak',

    sankalpaProgress: 'sankalpa_progress',

    chakraBalance: 'chakra_balance',

    energyBalance: 'energy_balance'

  };



  const response = {};

  for (const [key, value] of Object.entries(obj)) {

    const mappedKey = fieldMap[key] || key;

    response[mappedKey] = value;

  }



  return response;

};



// STATIC METHODS
// ============================================================================

/**
 * Find profile by user ID
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Profile document
 */
profileSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId }).populate('userId');
};

/**
 * Find verified profiles
 * @returns {Promise<Array>} Verified profile documents
 */
profileSchema.statics.findVerified = function() {
  return this.find({ isVerified: true });
};

/**
 * Find profiles by tradition
 * @param {String} tradition - Spiritual tradition
 * @returns {Promise<Array>} Profile documents
 */
profileSchema.statics.findByTradition = function(tradition) {
  return this.find({ traditions: tradition });
};

/**
 * Find profiles by interest
 * @param {String} interest - Interest
 * @returns {Promise<Array>} Profile documents
 */
profileSchema.statics.findByInterest = function(interest) {
  return this.find({ interests: interest });
};

/**
 * Find profiles by location
 * @param {String} country - Country
 * @param {String} city - Optional city
 * @returns {Promise<Array>} Profile documents
 */
profileSchema.statics.findByLocation = function(country, city = null) {
  const query = { country };
  if (city) query.city = city;
  return this.find(query);
};

/**
 * Find recently updated profiles
 * @param {Number} days - Number of days
 * @returns {Promise<Array>} Profile documents
 */
profileSchema.statics.findRecentlyUpdated = function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    updatedAt: { $gte: startDate }
  }).sort({ updatedAt: -1 });
};

/**
 * Find complete profiles
 * @returns {Promise<Array>} Profile documents with 50%+ completion
 */
profileSchema.statics.findComplete = function() {
  return this.find({ profileCompleteness: { $gte: 50 } });
};

/**
 * Find by badge
 * @param {String} badgeId - Badge ID
 * @returns {Promise<Array>} Profiles with badge
 */
profileSchema.statics.findByBadge = function(badgeId) {
  return this.find({ badges: badgeId });
};

/**
 * Count profiles with badge
 * @param {String} badgeId - Badge ID
 * @returns {Promise<Number>} Count
 */
profileSchema.statics.countWithBadge = function(badgeId) {
  return this.countDocuments({ badges: badgeId });
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('Profile', profileSchema);

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * How to use the Profile schema:
 * 
 * const Profile = require('./schemas/Profile');
 * 
 * // Create new profile
 * const profile = await Profile.create({
 *   userId: new ObjectId('...'),
 *   bio: 'Spiritual practitioner',
 *   traditions: ['Hindu', 'Buddhist']
 * });
 * 
 * // Find profile by user
 * const profile = await Profile.findByUserId(userId);
 * 
 * // Calculate completeness
 * profile.calculateProfileCompleteness();
 * 
 * // Get public profile (privacy respecting)
 * const publicProfile = profile.getPublicProfile();
 * 
 * // Find profiles by tradition
 * const hindus = await Profile.findByTradition('Hindu');
 * 
 * // Find verified profiles
 * const verified = await Profile.findVerified();
 * 
 * // Find profiles by location
 * const local = await Profile.findByLocation('India', 'Mumbai');
 */
