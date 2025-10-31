export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  experience_level: string;
  traditions: string[];
  location: string;
  available_for_guidance: boolean;
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
  favorite_deity: string;
  gotra: string;
  varna: string;
  sampradaya: string;
  onboarding_completed: boolean;
  settings: Record<string, unknown>;
  karma_balance: number;
  spiritual_points: number;
  level: number;
  daily_streak: number;
  sankalpa_progress: number;
  chakra_balance: {
    root: number;
    sacral: number;
    solar: number;
    heart: number;
    throat: number;
    thirdEye: number;
    crown: number;
  };
  energy_balance: {
    sattva: number;
    rajas: number;
    tamas: number;
  };
  created_at: string;
  updated_at: string;
}