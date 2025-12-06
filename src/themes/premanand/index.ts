import { ThemeDefinition } from '../types';
import colors from './colors';
import './premanand.css';

const premanandTheme: ThemeDefinition = {
  metadata: {
    id: 'premanand',
    name: 'Premanand Ji Maharaj',
    description: '🕯️ 🎶 Premanand Ji theme - Folk saint representing simple bhakti, devotion without pretense, and heartfelt spirituality',
    deity: 'Premanand Ji Maharaj (The Folk Saint)',
    category: 'color-scheme',
    icon: '/themes/premanand/assets/premanand-icon.svg',
    gradient: 'from-amber-100 via-amber-300 to-orange-200'
  },
  colors,
  assets: { icon: '/themes/premanand/assets/premanand-icon.svg' },
  available: true,
  createdAt: new Date().toISOString()
};

export default premanandTheme;
