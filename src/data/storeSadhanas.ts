import { SadhanaGenre, StoreSadhana } from '@/types/store';

export const sadhanaGenres: SadhanaGenre[] = [
  {
    id: 'meditation',
    name: 'Meditation & Mindfulness',
    description: 'Practices for inner peace and awareness',
    icon: '🧘‍♂️',
    color: 'bg-blue-500',
    unlockLevel: 1
  },
  {
    id: 'mantra',
    name: 'Mantra & Chanting',
    description: 'Sacred sound practices',
    icon: '🕉️',
    color: 'bg-orange-500',
    unlockLevel: 3
  },
  {
    id: 'devotion',
    name: 'Devotional Practices',
    description: 'Heart-centered worship and surrender',
    icon: '💝',
    color: 'bg-pink-500',
    unlockLevel: 5
  },
  {
    id: 'yoga',
    name: 'Yoga & Asana',
    description: 'Physical and energetic practices',
    icon: '🤸‍♀️',
    color: 'bg-green-500',
    unlockLevel: 2
  },
  {
    id: 'study',
    name: 'Scripture Study',
    description: 'Deep dive into sacred texts',
    icon: '📖',
    color: 'bg-purple-500',
    unlockLevel: 4
  },
  {
    id: 'service',
    name: 'Karma Yoga',
    description: 'Selfless service and action',
    icon: '🤝',
    color: 'bg-yellow-500',
    unlockLevel: 6
  },
  {
    id: 'advanced',
    name: 'Advanced Practices',
    description: 'Intensive spiritual disciplines',
    icon: '⚡',
    color: 'bg-red-500',
    unlockLevel: 10
  }
];

export const storeSadhanas: StoreSadhana[] = [
  // Meditation & Mindfulness
  {
    id: 'meditation-basics',
    title: '21-Day Mindful Awakening',
    description: 'Begin your meditation journey with gentle daily practices',
    genre: sadhanaGenres[0],
    difficulty: 'beginner',
    duration: 21,
    price: 0,
    unlockLevel: 1,
    isUnlocked: true,
    isPremium: false,
    practices: ['Breath awareness', 'Body scanning', 'Walking meditation'],
    benefits: ['Reduced stress', 'Better focus', 'Inner peace'],
    deity: 'Buddha',
    tradition: 'Buddhist',
    tags: ['mindfulness', 'beginner', 'stress-relief'],
    rating: 4.8,
    completedBy: 1247
  },
  {
    id: 'vipassana-intensive',
    title: '40-Day Vipassana Journey',
    description: 'Deep insight meditation practice for experienced practitioners',
    genre: sadhanaGenres[0],
    difficulty: 'advanced',
    duration: 40,
    price: 50,
    unlockLevel: 8,
    isUnlocked: false,
    isPremium: true,
    practices: ['Insight meditation', 'Silent retreats', 'Noble silence'],
    benefits: ['Deep wisdom', 'Liberation insights', 'Ego dissolution'],
    deity: 'Buddha',
    tradition: 'Theravada',
    tags: ['vipassana', 'advanced', 'wisdom'],
    rating: 4.9,
    completedBy: 89
  },
  {
    id: 'zen-simplicity',
    title: '30-Day Zen Simplicity',
    description: 'Embrace the art of just sitting in Zen tradition',
    genre: sadhanaGenres[0],
    difficulty: 'intermediate',
    duration: 30,
    price: 25,
    unlockLevel: 5,
    isUnlocked: false,
    isPremium: false,
    practices: ['Zazen', 'Koan study', 'Tea ceremony'],
    benefits: ['Mental clarity', 'Present moment awareness', 'Simplicity'],
    deity: 'Bodhidharma',
    tradition: 'Zen',
    tags: ['zen', 'simplicity', 'clarity'],
    rating: 4.7,
    completedBy: 456
  },

  // Mantra & Chanting
  {
    id: 'om-namah-shivaya',
    title: '108-Day Om Namah Shivaya',
    description: 'Sacred mantra practice for spiritual transformation',
    genre: sadhanaGenres.find(g => g.id === 'mantra')!,
    difficulty: 'beginner',
    duration: 108,
    price: 0,
    unlockLevel: 3,
    isUnlocked: false,
    isPremium: false,
    practices: ['Mantra chanting', 'Mala meditation', 'Shiva worship'],
    benefits: ['Spiritual purification', 'Divine connection', 'Inner strength'],
    deity: 'Shiva',
    tradition: 'Hindu',
    tags: ['mantra', 'shiva', 'purification'],
    rating: 4.9,
    completedBy: 892
  },
  {
    id: 'gayatri-sadhana',
    title: '40-Day Gayatri Sadhana',
    description: 'The most powerful Vedic mantra for enlightenment',
    genre: sadhanaGenres.find(g => g.id === 'mantra')!,
    difficulty: 'intermediate',
    duration: 40,
    price: 30,
    unlockLevel: 6,
    isUnlocked: false,
    isPremium: true,
    practices: ['Gayatri mantra', 'Sandhya vandana', 'Solar meditation'],
    benefits: ['Intellectual clarity', 'Spiritual wisdom', 'Divine grace'],
    deity: 'Savitr',
    tradition: 'Vedic',
    tags: ['gayatri', 'wisdom', 'vedic'],
    rating: 4.8,
    completedBy: 234
  },

  // Devotional Practices
  {
    id: 'krishna-bhakti',
    title: '49-Day Krishna Bhakti',
    description: 'Immerse in divine love through Krishna consciousness',
    genre: sadhanaGenres[2],
    difficulty: 'beginner',
    duration: 49,
    price: 15,
    unlockLevel: 5,
    isUnlocked: false,
    isPremium: false,
    practices: ['Kirtan', 'Deity worship', 'Bhagavad Gita study'],
    benefits: ['Divine love', 'Emotional healing', 'Spiritual joy'],
    deity: 'Krishna',
    tradition: 'Vaishnava',
    tags: ['bhakti', 'krishna', 'love'],
    rating: 4.9,
    completedBy: 1034
  },
  {
    id: 'divine-mother',
    title: '21-Day Divine Mother Worship',
    description: 'Connect with the nurturing aspect of the Divine',
    genre: sadhanaGenres[2],
    difficulty: 'beginner',
    duration: 21,
    price: 10,
    unlockLevel: 4,
    isUnlocked: false,
    isPremium: false,
    practices: ['Devi worship', 'Sacred feminine rituals', 'Mother mantras'],
    benefits: ['Emotional healing', 'Intuitive wisdom', 'Protective grace'],
    deity: 'Devi',
    tradition: 'Shakta',
    tags: ['divine-mother', 'feminine', 'healing'],
    rating: 4.8,
    completedBy: 567
  },

  // Yoga & Asana
  {
    id: 'surya-namaskara',
    title: '21-Day Sun Salutation',
    description: 'Energize your body and spirit with solar practices',
    genre: sadhanaGenres[3],
    difficulty: 'beginner',
    duration: 21,
    price: 0,
    unlockLevel: 2,
    isUnlocked: false,
    isPremium: false,
    practices: ['Sun salutations', 'Pranayama', 'Solar meditation'],
    benefits: ['Physical vitality', 'Energy balance', 'Spiritual radiance'],
    deity: 'Surya',
    tradition: 'Hatha Yoga',
    tags: ['yoga', 'energy', 'vitality'],
    rating: 4.7,
    completedBy: 2143
  },
  {
    id: 'kundalini-awakening',
    title: '40-Day Kundalini Awakening',
    description: 'Awaken your spiritual energy through advanced yoga',
    genre: sadhanaGenres[3],
    difficulty: 'advanced',
    duration: 40,
    price: 75,
    unlockLevel: 12,
    isUnlocked: false,
    isPremium: true,
    practices: ['Kundalini yoga', 'Chakra meditation', 'Energy work'],
    benefits: ['Spiritual awakening', 'Psychic abilities', 'Divine consciousness'],
    deity: 'Shiva-Shakti',
    tradition: 'Kundalini Yoga',
    tags: ['kundalini', 'advanced', 'awakening'],
    rating: 4.9,
    completedBy: 78
  },

  // Scripture Study
  {
    id: 'bhagavad-gita',
    title: '18-Week Bhagavad Gita Study',
    description: 'Deep study of the divine song chapter by chapter',
    genre: sadhanaGenres[4],
    difficulty: 'intermediate',
    duration: 126,
    price: 40,
    unlockLevel: 4,
    isUnlocked: false,
    isPremium: true,
    practices: ['Daily verse study', 'Contemplation', 'Life application'],
    benefits: ['Spiritual wisdom', 'Life guidance', 'Divine understanding'],
    deity: 'Krishna',
    tradition: 'Vedantic',
    tags: ['gita', 'study', 'wisdom'],
    rating: 4.8,
    completedBy: 345
  },

  // Karma Yoga
  {
    id: 'seva-practice',
    title: '30-Day Selfless Service',
    description: 'Transform through dedicated service to others',
    genre: sadhanaGenres[5],
    difficulty: 'beginner',
    duration: 30,
    price: 0,
    unlockLevel: 6,
    isUnlocked: false,
    isPremium: false,
    practices: ['Daily service', 'Compassion practice', 'Ego dissolution'],
    benefits: ['Spiritual purification', 'Heart opening', 'Unity consciousness'],
    deity: 'Hanuman',
    tradition: 'Karma Yoga',
    tags: ['service', 'compassion', 'karma-yoga'],
    rating: 4.7,
    completedBy: 789
  },

  // Advanced Practices
  {
    id: 'mahamudra-intensive',
    title: '49-Day Mahamudra Intensive',
    description: 'Advanced Tibetan Buddhist meditation practice',
    genre: sadhanaGenres[6],
    difficulty: 'advanced',
    duration: 49,
    price: 100,
    unlockLevel: 15,
    isUnlocked: false,
    isPremium: true,
    practices: ['Mahamudra meditation', 'Tantric visualization', 'Energy channels'],
    benefits: ['Realization of nature of mind', 'Enlightenment', 'Buddha nature'],
    deity: 'Vajradhara',
    tradition: 'Tibetan Buddhist',
    tags: ['mahamudra', 'tibetan', 'enlightenment'],
    rating: 5.0,
    completedBy: 23
  }
];

export const getStoreSadhanasByGenre = (genreId: string): StoreSadhana[] => {
  return storeSadhanas.filter(sadhana => sadhana.genre.id === genreId);
};