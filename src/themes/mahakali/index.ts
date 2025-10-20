import { ThemeDefinition } from '../types';
import colors from './colors';
import MahakaliBackground from './background';
import './mahakali.css'; // Import the CSS file

// Resolve theme-local asset using import.meta-based URL so bundlers produce a proper URL
let skullPath: string;
try {
  skullPath = new URL('./assets/Skull and Bone Turnaround.gif', import.meta.url).href;
} catch (e) {
  console.warn('Failed to resolve Mahakali theme icon, using fallback');
  // Fallback to a more detailed skull SVG
  skullPath = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04IDIuNWMtMi4yMDkgMC00IDEuNzkxLTQgNHMxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNCAxLjc5MS00IDQtNHoiLz48cGF0aCBkPSJNMTIuNSA4YzAgMS4zODEtMS4xMTkgMi41LTIuNSAyLjVzLTIuNS0xLjExOS0yLjUtMi41IDIuNS0yLjUgMi41LTIuNSAyLjUtMS4xMTkgMi41LTIuNXoiLz48cGF0aCBkPSJNNSA1bDIgMi0yIDJtNi0ybC0yIDJNMiAxMmgydjJoMnYtMmgydjJoMnYtMmgydjJoMnYtMmgyIi8+PC9zdmc+';
}

export const mahakaliTheme: ThemeDefinition = {
  metadata: {
    id: 'mahakali',
    name: 'Maa Mahakali',
    description: '🔥💀🌺 Ultimate fierce divine feminine energy - The Destroyer who eliminates ego and illusion with intense reds, floating skulls, hibiscus, and bones. Experience the transformative power of the Divine Mother who removes obstacles and grants liberation through destruction of ignorance.',
    deity: 'Mahakali (First Mahavidya)',
    category: 'hybrid',
    isLandingPage: true,
    landingPagePath: '/MahakaliLandingpage',
    icon: skullPath,
    gradient: 'from-red-900 to-black'
  },
  colors,
  assets: { icon: skullPath },
  BackgroundComponent: MahakaliBackground,
  available: true,
  createdAt: new Date('2024-09-26T13:00:00.000Z')
};

export default mahakaliTheme;