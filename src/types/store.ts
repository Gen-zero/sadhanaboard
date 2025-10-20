export interface StoreSadhana {
  id: string;
  title: string;
  description: string;
  genre: SadhanaGenre;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in days
  price: number; // spiritual points/currency
  unlockLevel: number; // required user level
  isUnlocked: boolean;
  isPremium: boolean;
  practices: string[]; // list of practices included
  benefits: string[]; // spiritual benefits
  deity?: string;
  tradition?: string;
  imageUrl?: string;
  tags: string[];
  rating: number; // 1-5 stars
  completedBy: number; // number of users who completed
}

export interface SadhanaGenre {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockLevel: number;
}

export interface UserProgress {
  level: number;
  experience: number;
  spiritualPoints: number;
  completedSadhanas: string[];
  unlockedGenres: string[];
}

export interface StoreCategory {
  genre: SadhanaGenre;
  sadhanas: StoreSadhana[];
}