import { ThemeDefinition } from '../types';
import colors from './colors';

// Use a more build-friendly approach for asset import
// const iconPath = new URL('./assets/Bhagwan_Krishna.png', import.meta.url).href;
const iconPath = '/themes/earth/assets/Bhagwan_Krishna.png';

export const earthTheme: ThemeDefinition = {
  metadata: {
    id: 'earth',
    name: 'Krishna Theme',
    description: 'Earthy brown and green tones',
    deity: 'Krishna',
    category: 'color-scheme',
    isLandingPage: false,
    gradient: 'from-amber-700 to-green-700'
  },
  colors,
  assets: { icon: iconPath },
  available: true,
  createdAt: new Date('2024-09-26T13:00:00.000Z')
};

export default earthTheme;