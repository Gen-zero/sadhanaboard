import { ThemeDefinition } from '../types';
import colors from './colors';

export const libraryLightTheme: ThemeDefinition = {
  metadata: {
    id: 'library-light',
    name: 'Library Light',
    description: 'Clean, white and light color scheme for the library to make it more impressive and readable',
    category: 'color-scheme',
    isLandingPage: false,
    icon: '/themes/library-light/assets/icon.png',
    gradient: 'from-white to-blue-50'
  },
  colors,
  available: true,
  createdAt: new Date()
};

export default libraryLightTheme;