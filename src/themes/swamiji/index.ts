import { ThemeDefinition } from '../types';
import colors from './colors';
import SwamijiBackground from './SwamijiBackground';
import './swamiji.css'; // Import the CSS file

const swamijiTheme: ThemeDefinition = {
  metadata: {
    id: 'swamiji',
    name: 'Swamiji',
    description: 'Experience the divine wisdom and spiritual teachings of enlightened masters. A theme dedicated to the guidance of spiritual gurus and swamis.',
    deity: 'Divine Gurus & Enlightened Masters',
    category: 'color-scheme',
    icon: '/themes/swamiji/assets/swamiji.png',
    gradient: 'from-amber-900 via-orange-800 to-red-900'
  },
  colors,
  assets: {
    backgroundImage: '/themes/swamiji/assets/swamiji-background.png'
  },
  BackgroundComponent: SwamijiBackground,
  available: true,
  createdAt: new Date().toISOString()
};

export default swamijiTheme;