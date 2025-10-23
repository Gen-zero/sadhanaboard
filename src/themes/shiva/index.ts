import { ThemeDefinition } from '../types';
import colors from './colors';

// Use a more build-friendly approach for asset import
// const iconPath = new URL('./assets/Bhagwan_Shiva_icon.png', import.meta.url).href;
const iconPath = '/themes/shiva/assets/Bhagwan_Shiva_icon.png';

export const shivaTheme: ThemeDefinition = {
  metadata: {
    id: 'shiva',
    name: 'Peaceful Shiva',
    description: 'Serene blue theme for meditation',
    deity: 'Shiva',
    category: 'color-scheme',
    isLandingPage: false,
    gradient: 'from-blue-900 to-indigo-900'
  },
  colors,
  assets: { icon: iconPath },
  available: true,
  createdAt: new Date('2024-09-26T13:00:00.000Z')
};

export default shivaTheme;