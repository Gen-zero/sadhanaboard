import { ThemeDefinition } from '../types';
import colors from './colors';

// Use a more build-friendly approach for asset import
// const iconPath = new URL('./assets/Ganesha.png', import.meta.url).href;
const iconPath = '/themes/ganesha/assets/Ganesha.png';

export const ganeshaTheme: ThemeDefinition = {
  metadata: {
    id: 'ganesha',
    name: 'Ganesha Theme',
    description: 'Divine purple and gold tones',
    deity: 'Ganesha',
    category: 'color-scheme',
    isLandingPage: false,
    gradient: 'from-purple-600 to-amber-500'
  },
  colors,
  assets: { icon: iconPath },
  available: true,
  createdAt: new Date('2024-09-26T13:00:00.000Z')
};

export default ganeshaTheme;