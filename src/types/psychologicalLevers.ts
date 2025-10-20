export interface KarmaBalance {
  total: number;
  earnedToday: number;
  lastEarnedDate: string;
  donated: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string;
}

export interface UserTitles {
  honorific: string;
  deityAffiliation: string;
  spiritualPath: string;
}

export interface PracticeStats {
  meditationMinutes: number;
  mantrasRecited: number;
  ritualsPerformed: number;
  sevaActs: number;
}

export interface KoshaMapping {
  annamaya: number; // Physical body
  pranamaya: number; // Energy body
  manomaya: number; // Mental body
  vijnanamaya: number; // Wisdom body
  anandamaya: number; // Bliss body
}

export interface DoshaBalance {
  vata: number;
  pitta: number;
  kapha: number;
}

export interface EnergyAnalysis {
  primaryElement: 'Fire' | 'Water' | 'Earth' | 'Air' | 'Ether';
  peakDays: string[];
  recommendedPractices: string[];
}

export interface PsychologicalProfile {
  xp: number;
  level: number;
  karmaBalance: KarmaBalance;
  streak: StreakData;
  titles: UserTitles;
  practiceStats: PracticeStats;
  koshaMapping: KoshaMapping;
  doshaBalance: DoshaBalance;
  energyAnalysis: EnergyAnalysis;
  initiatedDeity: string;
  sankalpa: string;
}

export interface TieredProgression {
  title: string;
  minXP: number;
  maxXP: number;
  description: string;
}

export const TIERED_PROGRESSION: TieredProgression[] = [
  {
    title: 'Seeker',
    minXP: 0,
    maxXP: 500,
    description: 'Beginning the spiritual journey with curiosity and openness'
  },
  {
    title: 'Sādhaka',
    minXP: 500,
    maxXP: 2000,
    description: 'Dedicated practitioner establishing daily spiritual routines'
  },
  {
    title: 'Tapasvi',
    minXP: 2000,
    maxXP: 10000,
    description: 'Devoted practitioner engaging in sustained spiritual discipline'
  },
  {
    title: 'Yogi',
    minXP: 10000,
    maxXP: 50000,
    description: 'Experienced practitioner with deep spiritual understanding'
  },
  {
    title: 'Jnani',
    minXP: 50000,
    maxXP: Infinity,
    description: 'Wise practitioner with profound spiritual insight'
  }
];

export interface AdvancedBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt?: string;
  category: 'streak' | 'practice' | 'seva' | 'exploration' | 'mastery';
  criteria: {
    type: 'xp' | 'streak' | 'practiceCount' | 'karma' | 'seva' | 'exploration';
    value: number;
    practiceType?: string;
  };
}

export const ADVANCED_BADGES: AdvancedBadge[] = [
  // Streak Badges
  {
    id: 'tapasvi-30',
    title: 'Tapasvi',
    description: '30 days of tapas logged',
    icon: '🔥',
    category: 'streak',
    criteria: {
      type: 'streak',
      value: 30
    }
  },
  {
    id: 'dhyanajeevi-108',
    title: 'Dhyanajeevi',
    description: '108 meditation sessions',
    icon: '🧘‍♂️',
    category: 'practice',
    criteria: {
      type: 'practiceCount',
      value: 108,
      practiceType: 'meditation'
    }
  },
  {
    id: 'japa-ratna-1008',
    title: 'Japa-ratna',
    description: '1,008 malas completed',
    icon: '📿',
    category: 'practice',
    criteria: {
      type: 'practiceCount',
      value: 1008,
      practiceType: 'japa'
    }
  },
  {
    id: 'seva-ratna',
    title: 'Sevāratna',
    description: 'Helping other sādhakas through Q&A/discussion forum',
    icon: '🤝',
    category: 'seva',
    criteria: {
      type: 'seva',
      value: 10
    }
  },
  {
    id: 'explorer',
    title: 'Cosmic Explorer',
    description: 'Completed practices from 5 different traditions',
    icon: '🧭',
    category: 'exploration',
    criteria: {
      type: 'exploration',
      value: 5
    }
  },
  {
    id: 'kosha-master',
    title: 'Kosha Master',
    description: 'Balanced all five koshas through dedicated practice',
    icon: '🌈',
    category: 'mastery',
    criteria: {
      type: 'xp',
      value: 15000
    }
  }
];