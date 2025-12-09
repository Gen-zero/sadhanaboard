import { ThemeDefinition } from '../types';
import colors from './colors';

export const defaultTheme: ThemeDefinition = {
  metadata: {
    id: 'default',
    name: 'Default Theme',
    description: 'Cosmic purple landing page with deep purples and golden accents',
    category: 'landing',
    isLandingPage: true,
    landingPagePath: '/landingpage',
    icon: '/themes/default/assets/default icon.png',
    gradient: 'from-purple-900 to-fuchsia-900'
  },
  colors,
  available: true,
  createdAt: new Date('2024-09-26T13:00:00.000Z')
};

export default defaultTheme;