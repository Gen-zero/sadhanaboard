import { ThemeDefinition } from '../types';
import colors from './colors.ts';
import CosmicBackground from './CosmicBackground';

export const cosmosTheme: ThemeDefinition = {
  metadata: {
    id: 'cosmos',
    name: 'Cosmic Nebula Theme',
    description: 'Interstellar cosmic theme with deep space blacks, nebula purples, and stellar accents. Features animated cosmic dust particles and dynamic constellation effects.',
    category: 'color-scheme',
    // Removed the deity property to make it appear in general themes
    icon: '/themes/cosmos/assets/cosmos-icon.svg',
    gradient: 'from-indigo-900 via-purple-800 to-violet-900' // Updated gradient to match new cosmic palette
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