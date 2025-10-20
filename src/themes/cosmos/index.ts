import { ThemeDefinition } from '../types';
import colors from './colors.ts';
import CosmicBackground from './CosmicBackground';

export const cosmosTheme: ThemeDefinition = {
  metadata: {
    id: 'cosmos',
    name: 'Cosmos Theme',
    description: 'Cosmic admin panel design for regular users',
    category: 'color-scheme',
    // Removed the deity property to make it appear in general themes
    icon: '/themes/cosmos/assets/cosmos-icon.png',
    gradient: 'from-purple-600 via-cyan-500 to-gold-500'
  },
  colors,
  assets: {
    css: '/themes/cosmos/assets/cosmos-theme.css',
    icon: '/themes/cosmos/assets/cosmos-icon.svg'
  },
  BackgroundComponent: CosmicBackground,
  available: true,
  createdAt: new Date('2025-10-16T12:00:00.000Z')
};

export default cosmosTheme;