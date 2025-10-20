import { ThemeDefinition } from '../types';
import colors from './colors';
import VishnuBackground from './VishnuBackground';
import './vishnu.css'; // Import the CSS file

// Use the Vishnu icon from the public assets
const vishnuIconPath = '/themes/vishnu/assets/Bhagwan_Vishnu.png';

const vishnuTheme: ThemeDefinition = {
  metadata: {
    id: 'vishnu',
    name: 'Lord Vishnu',
    description: '🌊💙 Sacred Vishnu theme - The Preserver who maintains cosmic order with deep blue wisdom and divine compassion. Experience the tranquil energy of the protector deity who sustains the universe.',
    deity: 'Lord Vishnu (The Preserver)',
    category: 'color-scheme',
    icon: vishnuIconPath,
    gradient: 'from-blue-900 via-blue-700 to-teal-800'
  },
  colors,
  assets: { icon: vishnuIconPath },
  BackgroundComponent: VishnuBackground,
  available: true,
  createdAt: new Date().toISOString()
};

export default vishnuTheme;