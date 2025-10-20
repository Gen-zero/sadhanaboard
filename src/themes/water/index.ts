import { ThemeDefinition } from '../types';
import colors from './colors';

const iconPath = new URL('./assets/Bhagwan_Vishnu.png', import.meta.url).href;

export const waterTheme: ThemeDefinition = {
  metadata: {
    id: 'water',
    name: 'Vishnu Theme',
    description: 'Calming blue and teal water tones',
    deity: 'Vishnu',
    category: 'color-scheme',
    isLandingPage: false,
    gradient: 'from-blue-600 to-teal-500'
  },
  colors,
  assets: { icon: iconPath },
  available: true,
  createdAt: new Date('2024-09-26T13:00:00.000Z')
};

export default waterTheme;
