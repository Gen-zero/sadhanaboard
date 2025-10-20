// Energy Level (Guna) Assessment Questions
export interface EnergyQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    sattva: number;
    rajas: number;
    tamas: number;
  }[];
  category: 'diet' | 'lifestyle' | 'behavior' | 'practice' | 'sleep' | 'emotion';
  weight?: number; // Optional weight for certain important questions
}

export const ENERGY_LEVEL_QUESTIONS: EnergyQuestion[] = [
  {
    id: 'diet1',
    question: 'How would you describe your typical diet?',
    category: 'diet',
    options: [
      { text: 'Fresh, light, vegetarian, and sattvic foods', sattva: 5, rajas: 1, tamas: 0 },
      { text: 'Spicy, oily, processed, or heavy foods', sattva: 1, rajas: 4, tamas: 3 },
      { text: 'Stale, overcooked, or leftovers', sattva: 0, rajas: 1, tamas: 5 }
    ]
  },
  {
    id: 'lifestyle1',
    question: 'How would you describe your daily routine?',
    category: 'lifestyle',
    options: [
      { text: 'Regular, disciplined, and balanced', sattva: 5, rajas: 2, tamas: 0 },
      { text: 'Busy, fast-paced, and ambitious', sattva: 1, rajas: 5, tamas: 1 },
      { text: 'Irregular, lazy, or procrastinating', sattva: 0, rajas: 1, tamas: 5 }
    ]
  },
  {
    id: 'behavior1',
    question: 'How do you typically respond to challenges?',
    category: 'behavior',
    options: [
      { text: 'With calm, wisdom, and acceptance', sattva: 5, rajas: 1, tamas: 0 },
      { text: 'With energy, determination, and action', sattva: 1, rajas: 5, tamas: 1 },
      { text: 'With avoidance, anger, or frustration', sattva: 0, rajas: 2, tamas: 5 }
    ]
  },
  {
    id: 'practice1',
    question: 'How often do you engage in spiritual practices?',
    category: 'practice',
    options: [
      { text: 'Daily with dedication and mindfulness', sattva: 5, rajas: 2, tamas: 0 },
      { text: 'Occasionally when I remember or feel motivated', sattva: 2, rajas: 3, tamas: 2 },
      { text: 'Rarely or only when forced', sattva: 0, rajas: 1, tamas: 5 }
    ]
  },
  {
    id: 'sleep1',
    question: 'How would you describe your sleep patterns?',
    category: 'sleep',
    options: [
      { text: 'Restful, regular, and refreshing', sattva: 5, rajas: 1, tamas: 0 },
      { text: 'Restless, disturbed, or insufficient', sattva: 1, rajas: 3, tamas: 3 },
      { text: 'Excessive, heavy, or difficult to wake from', sattva: 0, rajas: 1, tamas: 5 }
    ]
  },
  {
    id: 'emotion1',
    question: 'What best describes your emotional state?',
    category: 'emotion',
    options: [
      { text: 'Peaceful, content, and balanced', sattva: 5, rajas: 1, tamas: 0 },
      { text: 'Excited, anxious, or restless', sattva: 1, rajas: 5, tamas: 1 },
      { text: 'Dull, depressed, or lethargic', sattva: 0, rajas: 1, tamas: 5 }
    ]
  },
  {
    id: 'diet2',
    question: 'How do you approach food consumption?',
    category: 'diet',
    options: [
      { text: 'Mindfully, with gratitude and moderation', sattva: 5, rajas: 1, tamas: 0 },
      { text: 'Quickly, while multitasking or on-the-go', sattva: 1, rajas: 4, tamas: 2 },
      { text: 'Excessively or without awareness', sattva: 0, rajas: 2, tamas: 5 }
    ]
  },
  {
    id: 'lifestyle2',
    question: 'How do you spend your free time?',
    category: 'lifestyle',
    options: [
      { text: 'Reading, meditating, or learning spiritually', sattva: 5, rajas: 1, tamas: 0 },
      { text: 'Socializing, working on projects, or active pursuits', sattva: 1, rajas: 5, tamas: 1 },
      { text: 'Watching TV, sleeping, or passive activities', sattva: 0, rajas: 1, tamas: 5 }
    ]
  },
  {
    id: 'behavior2',
    question: 'How do you handle conflicts with others?',
    category: 'behavior',
    options: [
      { text: 'With understanding, compassion, and resolution', sattva: 5, rajas: 1, tamas: 0 },
      { text: 'With assertiveness, competition, or argument', sattva: 1, rajas: 5, tamas: 1 },
      { text: 'With avoidance, resentment, or withdrawal', sattva: 0, rajas: 1, tamas: 5 }
    ]
  },
  {
    id: 'practice2',
    question: 'What motivates your spiritual practice?',
    category: 'practice',
    weight: 2, // More important question
    options: [
      { text: 'Inner peace, self-realization, and growth', sattva: 5, rajas: 1, tamas: 0 },
      { text: 'Achievement, recognition, or personal goals', sattva: 1, rajas: 5, tamas: 1 },
      { text: 'Obligation, guilt, or social pressure', sattva: 0, rajas: 1, tamas: 5 }
    ]
  },
  {
    id: 'sleep2',
    question: 'How do you wake up in the morning?',
    category: 'sleep',
    options: [
      { text: 'Fresh, alert, and ready for the day', sattva: 5, rajas: 2, tamas: 0 },
      { text: 'Rushed, stressed, or struggling to get ready', sattva: 1, rajas: 4, tamas: 2 },
      { text: 'Reluctantly, groggy, or needing more sleep', sattva: 0, rajas: 1, tamas: 5 }
    ]
  },
  {
    id: 'emotion2',
    question: 'How do you make decisions?',
    category: 'emotion',
    options: [
      { text: 'Thoughtfully, with wisdom and clarity', sattva: 5, rajas: 2, tamas: 0 },
      { text: 'Quickly, based on impulse or desire', sattva: 1, rajas: 5, tamas: 1 },
      { text: 'Hesitantly, with confusion or doubt', sattva: 0, rajas: 1, tamas: 5 }
    ]
  }
];

export interface EnergyLevelResult {
  sattva: number;
  rajas: number;
  tamas: number;
  total: number;
  percentages: {
    sattva: number;
    rajas: number;
    tamas: number;
  };
}

export const calculateEnergyLevel = (answers: Record<string, number>): EnergyLevelResult => {
  let sattva = 0;
  let rajas = 0;
  let tamas = 0;
  
  Object.entries(answers).forEach(([questionId, optionIndex]) => {
    const question = ENERGY_LEVEL_QUESTIONS.find(q => q.id === questionId);
    if (question && question.options[optionIndex]) {
      const option = question.options[optionIndex];
      const weight = question.weight || 1;
      
      sattva += option.sattva * weight;
      rajas += option.rajas * weight;
      tamas += option.tamas * weight;
    }
  });
  
  const total = sattva + rajas + tamas;
  
  return {
    sattva,
    rajas,
    tamas,
    total,
    percentages: {
      sattva: total > 0 ? Math.round((sattva / total) * 100) : 0,
      rajas: total > 0 ? Math.round((rajas / total) * 100) : 0,
      tamas: total > 0 ? Math.round((tamas / total) * 100) : 0
    }
  };
};