import { ThemeDefinition } from '../types';
import colors from './colors';
import DurgaBackground from './DurgaBackground';

const iconPath = new URL('./assets/Maa_Durga_icon.png', import.meta.url).href;

export const durgaTheme: ThemeDefinition = {
  metadata: {
    id: 'durga',
    name: 'Maa Durga Theme',
    description: 'Fiery red, orange and yellow tones representing the powerful divine feminine energy of Maa Durga',
    deity: 'Durga',
    category: 'color-scheme',
    isLandingPage: false,
    gradient: 'from-red-900 via-red-700 to-orange-600'
  },
  colors,
  assets: { 
    icon: iconPath,
    css: '/themes/durga/durga-theme.css'
  },
  BackgroundComponent: DurgaBackground,
  available: true,
  createdAt: new Date().toISOString()
};

export default durgaTheme;