import type { ThemeDefinition } from './types';

const androidTheme: ThemeDefinition = {
  metadata: {
    id: 'android',
    name: 'Android',
    description: 'Material Design inspired theme for mobile devices',
    category: 'color-scheme',
    deity: 'None',
    icon: '/themes/android/assets/android-icon.png',
    isLandingPage: false
  },
  available: true,
  colors: {
    background: '0 0% 100%',
    foreground: '222.2 47.4% 11.2%',
    card: '0 0% 100%',
    cardForeground: '222.2 47.4% 11.2%',
    popover: '0 0% 100%',
    popoverForeground: '222.2 47.4% 11.2%',
    primary: '225 73% 52%', // Android blue
    primaryForeground: '0 0% 100%',
    secondary: '210 40% 96.1%',
    secondaryForeground: '222.2 47.4% 11.2%',
    muted: '210 40% 96.1%',
    mutedForeground: '215.4 16.3% 46.9%',
    accent: '225 73% 52%',
    accentForeground: '0 0% 100%',
    destructive: '0 84% 60%',
    destructiveForeground: '0 0% 98%',
    border: '214.3 31.8% 91.4%',
    input: '214.3 31.8% 91.4%',
    ring: '225 73% 52%'
  },
  assets: {
    icon: '/themes/android/assets/android-icon.png',
    css: '/themes/android/assets/android-theme.css'
  }
};

export default androidTheme;