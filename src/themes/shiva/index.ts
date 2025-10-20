import { ThemeDefinition } from '../types';
import colors from './colors';

const iconPath = new URL('./assets/Bhagwan_Shiva_icon.png', import.meta.url).href;

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
