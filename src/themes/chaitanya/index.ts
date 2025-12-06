import { ThemeDefinition } from '../types';
import colors from './colors';
import './chaitanya.css';

const chaitanyaTheme: ThemeDefinition = {
  metadata: {
    id: 'chaitanya',
    name: 'Chaitanya Mahaprabhu',
    description: '🎵 💕 Chaitanya theme - Saint-avatar of Krishna representing ecstatic devotion and universal love',
    deity: 'Chaitanya Mahaprabhu (The Divine Lover)',
    category: 'color-scheme',
    icon: '/themes/chaitanya/assets/chaitanya-icon.svg',
    gradient: 'from-yellow-100 via-rose-200 to-green-100'
  },
  colors,
  assets: { icon: '/themes/chaitanya/assets/chaitanya-icon.svg' },
  available: true,
  createdAt: new Date().toISOString()
};

export default chaitanyaTheme;
