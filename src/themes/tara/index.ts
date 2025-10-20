import { ThemeDefinition } from '../types';
import colors from './colors';
import TaraBackground from './background';

// Use a blue lotus / Tara icon path; keep a robust fallback if import.meta is unavailable
const taraIconPath = '/themes/tara/assets/tara-icon.svg';

const taraTheme: ThemeDefinition = {
  metadata: {
    id: 'tara',
    name: 'Maa Tara (Mahavidya)',
    description: '💀🌺 Sacred Tara Mahavidya - The Liberator who guides across the ocean of samsara with deep blue wisdom, blue lotus compassion, and fierce cremation ground power. Experience the transformative energy of the Divine Mother who removes obstacles and grants liberation.',
    deity: 'Tara (Second Mahavidya)',
    category: 'color-scheme',
    icon: taraIconPath,
    gradient: 'from-blue-950 via-blue-900 to-indigo-950'
  },
  colors,
  assets: { icon: taraIconPath, backgroundImage: '/themes/tara/assets/tara-yantra.svg' },
  BackgroundComponent: TaraBackground,
  available: true,
  createdAt: new Date().toISOString()
};

export default taraTheme;