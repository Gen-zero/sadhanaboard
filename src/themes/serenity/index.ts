import { ThemeDefinition } from '../types';
import colors from './colors';

export const serenityTheme: ThemeDefinition = {
  metadata: {
    id: 'serenity',
    name: 'Serenity Theme',
    description: 'Professional light blue theme with enhanced contrast and visual hierarchy for improved readability',
    category: 'color-scheme',
    isLandingPage: false,
    icon: '/themes/serenity/assets/default icon.png',
    gradient: 'from-sky-200 to-blue-300' // Updated gradient to match the new color scheme
  },
  colors,
  available: true,
  createdAt: new Date('2024-09-26T13:00:00.000Z')
};

export default serenityTheme;