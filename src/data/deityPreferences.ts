// Deity preference data for onboarding
export interface DeityOption {
  id: string;
  name: string;
  emoji: string;
  attributes: string[];
}

export const DEITY_OPTIONS: DeityOption[] = [
  { id: 'ganesha', name: 'Lord Ganesha', emoji: '🐘', attributes: ['wisdom', 'remover of obstacles', 'beginnings'] },
  { id: 'shiva', name: 'Lord Shiva', emoji: '🧘', attributes: ['transformation', 'meditation', 'destruction of ego'] },
  { id: 'durga', name: 'Goddess Durga', emoji: '🦁', attributes: ['strength', 'protection', 'courage'] },
  { id: 'krishna', name: 'Lord Krishna', emoji: '🪶', attributes: ['love', 'divine play', 'wisdom'] },
  { id: 'lakshmi', name: 'Goddess Lakshmi', emoji: '🪷', attributes: ['prosperity', 'abundance', 'beauty'] },
  { id: 'saraswati', name: 'Goddess Saraswati', emoji: '🎵', attributes: ['knowledge', 'music', 'arts'] },
  { id: 'vishnu', name: 'Lord Vishnu', emoji: '🌀', attributes: ['preservation', 'protection', 'cosmic order'] },
  { id: 'rama', name: 'Lord Rama', emoji: '🏹', attributes: ['righteousness', 'duty', 'virtue'] },
  { id: 'kali', name: 'Goddess Kali', emoji: '⚔️', attributes: ['destruction of evil', 'time', 'empowerment'] },
  { id: 'parvati', name: 'Goddess Parvati', emoji: '🏔️', attributes: ['love', 'devotion', 'mountains'] },
  { id: 'hanuman', name: 'Lord Hanuman', emoji: '🐒', attributes: ['devotion', 'strength', 'service'] },
  { id: 'brahma', name: 'Lord Brahma', emoji: '🌸', attributes: ['creation', 'knowledge', 'wisdom'] }
];

export interface DeityPreference {
  deityId: string;
  priority: number; // 1-5, where 1 is highest priority
}

// Calculate deity connection percentages based on user preferences
export const calculateDeityConnections = (preferences: DeityPreference[]): Record<string, number> => {
  // Initialize all deities with 0%
  const connections: Record<string, number> = {};
  DEITY_OPTIONS.forEach(deity => {
    connections[deity.id] = 0;
  });
  
  // Assign percentages based on priority (1=25%, 2=20%, 3=15%, 4=10%, 5=5%)
  preferences.forEach(pref => {
    if (pref.priority >= 1 && pref.priority <= 5) {
      const percentage = 30 - (pref.priority * 5); // 25, 20, 15, 10, 5
      connections[pref.deityId] = percentage;
    }
  });
  
  return connections;
};