import { ThemeDefinition } from '../types';
import colors from './colors';

const iconPath = new URL('./assets/Bhairava.png', import.meta.url).href;

export const bhairavaTheme: ThemeDefinition = {
  metadata: {
    id: 'bhairava',
    name: 'Bhairava Theme',
    description: 'Fierce dark red and crimson tones',
    deity: 'Bhairava',
    category: 'color-scheme',
    isLandingPage: false,
    gradient: 'from-red-900 to-red-700'
  },
  colors,
  assets: { icon: iconPath },
  available: true,
  createdAt: new Date('2024-09-26T13:00:00.000Z')
};

export default bhairavaTheme;