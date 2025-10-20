import { Profile } from '@/types/profile';

interface ValidationErrors {
  display_name?: string;
  email?: string;
  bio?: string;
  experience_level?: string;
  location?: string;
  favorite_deity?: string;
  gotra?: string;
  varna?: string;
  sampradaya?: string;
  date_of_birth?: string;
  place_of_birth?: string;
}

export const useProfileValidation = () => {
  const validateProfile = (profile: Partial<Profile>): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Validate display name
    if (profile.display_name) {
      if (profile.display_name.length < 2) {
        errors.display_name = 'Name must be at least 2 characters long';
      } else if (profile.display_name.length > 50) {
        errors.display_name = 'Name must be less than 50 characters';
      }
    }

    // Validate bio
    if (profile.bio && profile.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters';
    }

    // Validate location
    if (profile.location && profile.location.length > 100) {
      errors.location = 'Location must be less than 100 characters';
    }

    // Validate favorite deity
    if (profile.favorite_deity && profile.favorite_deity.length > 50) {
      errors.favorite_deity = 'Favorite deity name must be less than 50 characters';
    }

    // Validate gotra
    if (profile.gotra && profile.gotra.length > 50) {
      errors.gotra = 'Gotra must be less than 50 characters';
    }

    // Validate varna
    if (profile.varna && profile.varna.length > 30) {
      errors.varna = 'Varna must be less than 30 characters';
    }

    // Validate sampradaya
    if (profile.sampradaya && profile.sampradaya.length > 50) {
      errors.sampradaya = 'Sampradaya must be less than 50 characters';
    }

    // Validate place of birth
    if (profile.place_of_birth && profile.place_of_birth.length > 100) {
      errors.place_of_birth = 'Place of birth must be less than 100 characters';
    }

    return errors;
  };

  return { validateProfile };
};