import { ThemeDefinition } from '../types';
import colors from './colors';

export const neonTheme: ThemeDefinition = {
  metadata: {
    id: 'neon',
    name: 'Neon Cyber',
    description: '⚡ Futuristic cyber-tech theme with neon gradients',
    category: 'color-scheme',
    isLandingPage: false,
    icon: '/themes/neon/assets/default icon.png',
    gradient: 'from-cyan-400 via-purple-500 to-green-400'
  },
  colors,
  available: true,
  createdAt: new Date('2024-12-20T13:00:00.000Z')
};

export default neonTheme;