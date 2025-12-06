import { ThemeDefinition } from '../types';
import colors from './colors';
import './narasimha.css';

const narasimhaTheme: ThemeDefinition = {
  metadata: {
    id: 'narasimha',
    name: 'Lord Narasimha',
    description: '⚡ 🔥 Narasimha theme - The fierce avatar of Vishnu representing divine protection and transformative power',
    deity: 'Lord Narasimha (The Divine Protector)',
    category: 'color-scheme',
    icon: '/themes/narasimha/assets/narasimha-icon.svg',
    gradient: 'from-orange-900 via-red-700 to-black-800'
  },
  colors,
  assets: { icon: '/themes/narasimha/assets/narasimha-icon.svg' },
  available: true,
  createdAt: new Date().toISOString()
};

export default narasimhaTheme;
