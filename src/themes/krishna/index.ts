import { ThemeDefinition } from '../types';
import colors from './colors';
import KrishnaBackground from './KrishnaBackground';
import './krishna.css'; // Import the CSS file

// Use the Krishna icon from the public assets
const krishnaIconPath = '/themes/krishna/assets/Bhagwan_Krishna.png';

const krishnaTheme: ThemeDefinition = {
  metadata: {
    id: 'krishna',
    name: 'Lord Krishna',
    description: '🎵💚 Sacred Krishna theme - The Divine Cowherd who plays the flute of love and wisdom. Experience the joyful energy of the playful deity who teaches through divine love and devotion.',
    deity: 'Lord Krishna (The Divine Cowherd)',
    category: 'color-scheme',
    icon: krishnaIconPath,
    gradient: 'from-green-900 via-green-700 to-emerald-800'
  },
  colors,
  assets: { icon: krishnaIconPath },
  BackgroundComponent: KrishnaBackground,
  available: true,
  createdAt: new Date().toISOString()
};

export default krishnaTheme;