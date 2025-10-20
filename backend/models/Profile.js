class Profile {
  constructor(data) {
    this.id = data.id;
    this.display_name = data.display_name;
    this.avatar_url = data.avatar_url;
    this.bio = data.bio;
    this.experience_level = data.experience_level;
    this.traditions = data.traditions || [];
    this.location = data.location;
    this.available_for_guidance = data.available_for_guidance || false;
    this.date_of_birth = data.date_of_birth;
    this.time_of_birth = data.time_of_birth;
    this.place_of_birth = data.place_of_birth;
    this.favorite_deity = data.favorite_deity;
    this.gotra = data.gotra;
    this.varna = data.varna;
    this.sampradaya = data.sampradaya;
    this.onboarding_completed = data.onboarding_completed || false;
    // Removed welcome_quiz_completed field
    this.settings = data.settings || {}; // Add settings field
    
    // New spiritual feature fields
    this.karma_balance = data.karma_balance || 0;
    this.spiritual_points = data.spiritual_points || 0;
    this.level = data.level || 1;
    this.daily_streak = data.daily_streak || 0;
    this.sankalpa_progress = data.sankalpa_progress || 0.00;
    this.chakra_balance = data.chakra_balance || {
      root: 50,
      sacral: 50,
      solar: 50,
      heart: 50,
      throat: 50,
      thirdEye: 50,
      crown: 50
    };
    this.energy_balance = data.energy_balance || {
      sattva: 33,
      rajas: 33,
      tamas: 34
    };
    
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Convert to JSON format for API responses
  toJSON() {
    return {
      id: this.id,
      display_name: this.display_name,
      avatar_url: this.avatar_url,
      bio: this.bio,
      experience_level: this.experience_level,
      traditions: this.traditions,
      location: this.location,
      available_for_guidance: this.available_for_guidance,
      date_of_birth: this.date_of_birth,
      time_of_birth: this.time_of_birth,
      place_of_birth: this.place_of_birth,
      favorite_deity: this.favorite_deity,
      gotra: this.gotra,
      varna: this.varna,
      sampradaya: this.sampradaya,
      onboarding_completed: this.onboarding_completed,
      // Removed welcome_quiz_completed field
      settings: this.settings, // Include settings in JSON response
      
      // New spiritual feature fields
      karma_balance: this.karma_balance,
      spiritual_points: this.spiritual_points,
      level: this.level,
      daily_streak: this.daily_streak,
      sankalpa_progress: this.sankalpa_progress,
      chakra_balance: this.chakra_balance,
      energy_balance: this.energy_balance,
      
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Profile;