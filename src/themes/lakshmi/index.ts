import { ThemeDefinition } from '../types';
import colors from './colors';
import LakshmiBackground from './LakshmiBackground';

const lakshmiTheme: ThemeDefinition = {
  metadata: {
    id: 'lakshmi',
    name: 'Lakshmi',
    description: 'Premium golden theme inspired by Goddess Lakshmi - Abundance, prosperity, and divine feminine energy',
    deity: 'Goddess Lakshmi',
    category: 'color-scheme',
    icon: '/themes/lakshmi/assets/lakshmi-icon.png',
    gradient: 'from-amber-400 via-yellow-500 to-orange-600'
  },
  colors,
  assets: {
    icon: '/themes/lakshmi/assets/lakshmi-icon.png',
    backgroundImage: '/themes/lakshmi/assets/lakshmi-yantra.svg',
    logo: '/themes/lakshmi/assets/lakshmi-icon.png'
  },
  BackgroundComponent: LakshmiBackground,
  available: true,
  createdAt: new Date().toISOString()
};

export default lakshmiTheme;