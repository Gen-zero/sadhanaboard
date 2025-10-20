import { ThemeDefinition } from '../types';
import colors from './colors';
import { Leaf } from 'lucide-react';

export const mysteryTheme: ThemeDefinition = {
  metadata: {
    id: 'mystery',
    name: 'Zen Garden',
    description: '🌿 Peaceful zen meditation theme',
    category: 'color-scheme',
    isLandingPage: false,
    icon: Leaf,
    gradient: 'from-green-800 to-teal-700'
  },
  colors,
  available: true,
  createdAt: new Date('2024-09-26T13:00:00.000Z')
};

export default mysteryTheme;
