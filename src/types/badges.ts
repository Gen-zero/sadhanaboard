import { LucideIcon } from 'lucide-react';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt?: string;
  criteria: string;
  tier?: number; // 1=Initiate, 2=Adept, 3=Master, 4=Divine
  category?: string;
}

export interface UserBadges {
  badges: Badge[];
  earnedBadges: string[]; // Array of badge IDs that the user has earned
}

// Define all possible badges in the system
export const ALL_BADGES: Badge[] = [
  // Existing badges
  {
    id: 'first-sadhana',
    title: 'First Steps',
    description: 'Complete your first sadhana',
    icon: '👣',
    criteria: 'completedSadhanas >= 1',
    category: 'discipline'
  },
  {
    id: 'five-sadhanas',
    title: 'Dedicated Practitioner',
    description: 'Complete 5 sadhanas',
    icon: '🧘',
    criteria: 'completedSadhanas >= 5',
    category: 'discipline'
  },
  {
    id: 'ten-sadhanas',
    title: 'Spiritual Journey',
    description: 'Complete 10 sadhanas',
    icon: '🕉️',
    criteria: 'completedSadhanas >= 10',
    category: 'discipline'
  },
  {
    id: 'twenty-sadhanas',
    title: 'Devoted Seeker',
    description: 'Complete 20 sadhanas',
    icon: '🔥',
    criteria: 'completedSadhanas >= 20',
    category: 'discipline'
  },
  {
    id: 'fifty-sadhanas',
    title: 'Spiritual Master',
    description: 'Complete 50 sadhanas',
    icon: '🌟',
    criteria: 'completedSadhanas >= 50',
    category: 'discipline'
  },
  {
    id: 'seven-day-streak',
    title: 'Week of Discipline',
    description: 'Maintain a 7-day practice streak',
    icon: '📅',
    criteria: 'totalPracticeDays >= 7',
    category: 'discipline'
  },
  {
    id: 'thirty-day-streak',
    title: 'Month of Dedication',
    description: 'Maintain a 30-day practice streak',
    icon: '🌙',
    criteria: 'totalPracticeDays >= 30',
    category: 'discipline'
  },
  {
    id: 'hundred-day-streak',
    title: 'Centurion of Spirit',
    description: 'Maintain a 100-day practice streak',
    icon: '💯',
    criteria: 'totalPracticeDays >= 100',
    category: 'discipline'
  },
  {
    id: 'level-5',
    title: 'Awakening',
    description: 'Reach level 5 in spiritual progression',
    icon: '⭐',
    criteria: 'level >= 5',
    category: 'discipline'
  },
  {
    id: 'level-10',
    title: 'Illumination',
    description: 'Reach level 10 in spiritual progression',
    icon: '✨',
    criteria: 'level >= 10',
    category: 'discipline'
  },
  {
    id: 'level-20',
    title: 'Transcendence',
    description: 'Reach level 20 in spiritual progression',
    icon: '🔮',
    criteria: 'level >= 20',
    category: 'discipline'
  },
  {
    id: 'meditation-master',
    title: 'Meditation Master',
    description: 'Complete 5 meditation sadhanas',
    icon: '🧘‍♂️',
    criteria: 'completedMeditationSadhanas >= 5',
    category: 'yoga'
  },
  {
    id: 'yoga-practitioner',
    title: 'Yoga Practitioner',
    description: 'Complete 5 yoga sadhanas',
    icon: '🧘‍♀️',
    criteria: 'completedYogaSadhanas >= 5',
    category: 'yoga'
  },
  {
    id: 'mantra-devotee',
    title: 'Mantra Devotee',
    description: 'Complete 5 mantra sadhanas',
    icon: '📿',
    criteria: 'completedMantraSadhanas >= 5',
    category: 'bhakti'
  },
  {
    id: 'study-scholar',
    title: 'Study Scholar',
    description: 'Complete 5 study sadhanas',
    icon: '📚',
    criteria: 'completedStudySadhanas >= 5',
    category: 'discipline'
  },
  {
    id: 'devotion-follower',
    title: 'Devotion Follower',
    description: 'Complete 5 devotion sadhanas',
    icon: '❤️',
    criteria: 'completedDevotionSadhanas >= 5',
    category: 'bhakti'
  },
  
  // New badges based on user requirements
  
  // 1. Yoga Badges
  {
    id: 'nitya-sadhaka',
    title: 'Nitya Sādhaka',
    description: 'Completed daily sādhanas for 7 consecutive days',
    icon: ' diyā',
    criteria: 'dailyStreak >= 7',
    category: 'yoga'
  },
  {
    id: 'ananya-bhakta',
    title: 'Ananya Bhakta',
    description: '30-day unbroken streak',
    icon: ' silver-aura',
    criteria: 'dailyStreak >= 30',
    tier: 2,
    category: 'yoga'
  },
  {
    id: 'sankalpa-shakti',
    title: 'Sankalpa Shakti',
    description: '100 days without break',
    icon: ' trishul',
    criteria: 'dailyStreak >= 100',
    tier: 3,
    category: 'yoga'
  },
  {
    id: 'aparajita',
    title: 'Aparājita',
    description: '365 days consistent sādhana',
    icon: ' radiant-crown',
    criteria: 'dailyStreak >= 365',
    tier: 4,
    category: 'yoga'
  },
  {
    id: 'ekagratā',
    title: 'Ekāgratā',
    description: 'Logged sādhana before sunrise for 21 days',
    icon: ' rising-sun',
    criteria: 'earlyMorningPractices >= 21',
    category: 'yoga'
  },
  
  // 2. Discipline Badges
  {
    id: 'kalīs-flame',
    title: 'Kālī’s Flame',
    description: 'Completed 3 intense sādhana challenges',
    icon: ' red-black-flame',
    criteria: 'intenseChallengesCompleted >= 3',
    category: 'discipline'
  },
  {
    id: 'tapasvī',
    title: 'Tapasvī',
    description: 'Woke up before 4:30 AM for 10 days',
    icon: ' glowing-rudraksha',
    criteria: 'earlyWakeups >= 10',
    category: 'discipline'
  },
  {
    id: 'mouna-ratna',
    title: 'Mouna Ratna',
    description: 'Observed silence sādhana for full duration',
    icon: ' blue-lotus',
    criteria: 'silencePractices >= 1',
    category: 'discipline'
  },
  {
    id: 'agni-vratī',
    title: 'Agni Vratī',
    description: 'Completed fasting sādhana successfully',
    icon: ' burning-altar',
    criteria: 'fastingPractices >= 1',
    category: 'discipline'
  },
  
  // 3. Bhakti & Mantra Japa Badges
  {
    id: 'viraha-jñānī',
    title: 'Viraha Jñānī',
    description: 'Logged meditative or emotional reflections for 7+ sessions',
    icon: ' teardrop-gem',
    criteria: 'reflectiveSessions >= 7',
    category: 'bhakti'
  },
  {
    id: 'prem-bhakta',
    title: 'Prem Bhakta',
    description: 'Completed 50 chanting sessions',
    icon: ' heart-light',
    criteria: 'chantingSessions >= 50',
    category: 'bhakti'
  },
  {
    id: 'rasa-sāgara',
    title: 'Rasa Sāgara',
    description: 'Consistent japa with feeling for 108 rounds',
    icon: ' flowing-water',
    criteria: 'japaRounds >= 108',
    category: 'bhakti'
  },
  {
    id: 'śaraṇāgata',
    title: 'Śaraṇāgata',
    description: 'Started 5 different sādhana types',
    icon: ' open-palm',
    criteria: 'sadhanaTypes >= 5',
    category: 'bhakti'
  },
  
  // 4. Knowledge & Wisdom Badges (merged with discipline)
  {
    id: 'śāstra-vidyārthī',
    title: 'Śāstra Vidyārthī',
    description: 'Read 5 scriptural chapters',
    icon: ' open-grantha',
    criteria: 'scriptureChapters >= 5',
    category: 'discipline'
  },
  {
    id: 'mantra-master',
    title: 'Mantra Master',
    description: 'Memorized 10+ mantras',
    icon: ' glowing-akṣara',
    criteria: 'mantrasMemorized >= 10',
    category: 'bhakti'
  },
  {
    id: 'jnana-jyoti',
    title: 'Jnana Jyoti',
    description: 'Completed a guided spiritual course',
    icon: ' lamp-circles',
    criteria: 'coursesCompleted >= 1',
    category: 'discipline'
  },
  {
    id: 'sādhana-scholar',
    title: 'Sādhana Scholar',
    description: 'Logged 100+ minutes of learning',
    icon: ' pen-script',
    criteria: 'learningMinutes >= 100',
    category: 'discipline'
  },
  
  // 5. Community & Service Badges (merged with discipline)
  {
    id: 'seva-dhārī',
    title: 'Seva Dhārī',
    description: 'Helped another user start a sādhana',
    icon: ' joined-hands',
    criteria: 'helpedOthers >= 1',
    category: 'discipline'
  },
  {
    id: 'anukampā',
    title: 'Anukampā',
    description: 'Shared 10 motivational posts',
    icon: ' glowing-heart',
    criteria: 'motivationalPosts >= 10',
    category: 'discipline'
  },
  {
    id: 'satsangī',
    title: 'Satsangī',
    description: 'Joined 5+ group meditations',
    icon: ' circle-devotees',
    criteria: 'groupMeditations >= 5',
    category: 'discipline'
  },
  {
    id: 'guru-bhakta',
    title: 'Guru Bhakta',
    description: 'Logged attendance at a live session',
    icon: ' flame-feet',
    criteria: 'liveSessions >= 1',
    category: 'discipline'
  },
  
  // 6. Divine Realization & Milestone Badges (merged with yoga)
  {
    id: 'antarjyoti',
    title: 'Antarjyoti',
    description: 'Completed 1 full sādhana cycle',
    icon: ' inner-light',
    criteria: 'sadhanaCycles >= 1',
    category: 'yoga'
  },
  {
    id: 'mahā-siddha',
    title: 'Mahā Siddha',
    description: '5 full cycles + reflections uploaded',
    icon: ' yantra-bloom',
    criteria: 'sadhanaCycles >= 5 && reflectionsUploaded >= 5',
    category: 'yoga'
  },
  {
    id: 'kalī-anugraha',
    title: 'Kālī Anugraha',
    description: 'Completed all Mahākālī sādhanas',
    icon: ' skull-garland',
    criteria: 'mahakaliSadhanas >= 10',
    category: 'yoga'
  },
  {
    id: 'mokṣa-margī',
    title: 'Mokṣa Margī',
    description: 'Reached level 10+ in all sādhanas',
    icon: ' expanding-mandala',
    criteria: 'allSadhanaLevels >= 10',
    category: 'yoga'
  },
  
  // 7. Hidden / Mystery Badges (merged with appropriate categories)
  {
    id: 'śūnya-dṛṣṭi',
    title: 'Śūnya Dṛṣṭi',
    description: 'Meditated for 108 minutes in a single session',
    icon: ' void-glow',
    criteria: 'longestMeditation >= 108',
    category: 'yoga'
  },
  {
    id: 'kalīs-whisper',
    title: 'Kālī’s Whisper',
    description: 'Visited Mahākālī yantra screen at midnight',
    icon: ' dark-fractal',
    criteria: 'midnightVisits >= 1',
    category: 'bhakti'
  },
  {
    id: 'gupta-bhakta',
    title: 'Gupta Bhakta',
    description: 'Logged sādhana quietly without sharing for 30 days',
    icon: ' hidden-moon',
    criteria: 'quietPractices >= 30',
    category: 'bhakti'
  },
  {
    id: 'ananta-loop',
    title: 'Ananta Loop',
    description: 'Completed the same sādhana thrice in repetition',
    icon: ' ouroboros',
    criteria: 'repeatedSadhanas >= 3',
    category: 'discipline'
  }
];