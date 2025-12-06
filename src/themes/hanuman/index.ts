import { ThemeDefinition } from '../types';
import colors from './colors';
import './hanuman.css';

const hanumanTheme: ThemeDefinition = {
  metadata: {
    id: 'hanuman',
    name: 'Lord Hanuman',
    description: '💪 🧡 Hanuman theme - The mighty devotee symbolizing strength, courage, and unwavering devotion',
    deity: 'Lord Hanuman (The Divine Devotee)',
    category: 'color-scheme',
    icon: '/themes/hanuman/assets/hanuman-icon.svg',
    gradient: 'from-orange-900 via-orange-700 to-red-800'
  },
  colors,
  assets: { icon: '/themes/hanuman/assets/hanuman-icon.svg' },
  available: true,
  createdAt: new Date().toISOString()
};

export default hanumanTheme;
