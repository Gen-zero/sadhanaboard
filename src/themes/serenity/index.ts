import { ThemeDefinition } from '../types';
import colors from './colors';

export const serenityTheme: ThemeDefinition = {
  metadata: {
    id: 'serenity',
    name: 'Serenity Theme',
    description: 'Calm and peaceful soft blue tones',
    category: 'color-scheme',
    isLandingPage: false,
    icon: '/themes/serenity/assets/default icon.png',
    gradient: 'from-blue-300 to-teal-300'
  },
  colors,
  available: true,
  createdAt: new Date('2024-09-26T13:00:00.000Z')
};

export default serenityTheme;