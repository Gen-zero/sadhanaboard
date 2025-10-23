import { ThemeDefinition } from '../types';
import colors from './colors';
import FireBackground from './FireBackground';

// Use a more build-friendly approach for asset import
// const iconPath = new URL('./assets/Maa_Durga_icon.png', import.meta.url).href;
const iconPath = '/themes/fire/assets/Maa_Durga_icon.png';

export const fireTheme: ThemeDefinition = {
  metadata: {
    id: 'fire',
    name: 'Maa Durga',
    description: 'Divine feminine energy with elegant rotating Durga yantra',
    deity: 'Durga',
    category: 'color-scheme',
    isLandingPage: false,
    gradient: 'from-red-700 to-orange-500'
  },
  colors,
  assets: { 
    icon: iconPath,
    css: '/themes/fire/fire-theme.css'
  },
  BackgroundComponent: FireBackground,
  available: true,
  createdAt: new Date('2024-09-26T13:00:00.000Z')
};

export default fireTheme;