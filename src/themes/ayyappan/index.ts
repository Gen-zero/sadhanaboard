import { ThemeDefinition } from '../types';
import colors from './colors';
import './ayyappan.css';

const ayyappanTheme: ThemeDefinition = {
  metadata: {
    id: 'ayyappan',
    name: 'Swami Ayyappan',
    description: '🙏 💙 Swami Ayyappan theme - The deity of Sabarimala, symbolizing purity, unity, and peaceful devotion',
    deity: 'Swami Ayyappan (The Unifying Deity)',
    category: 'color-scheme',
    icon: '/themes/ayyappan/assets/ayyappan-icon.svg',
    gradient: 'from-blue-900 via-blue-700 to-cyan-800'
  },
  colors,
  assets: { icon: '/themes/ayyappan/assets/ayyappan-icon.svg' },
  available: true,
  createdAt: new Date().toISOString()
};

export default ayyappanTheme;
