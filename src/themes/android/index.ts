import { ThemeDefinition } from '../types';

export const androidTheme: ThemeDefinition = {
  metadata: {
    id: 'android',
    name: 'Android Material',
    description: 'Android Material Design theme',
    category: 'color-scheme',
    icon: '/themes/android/assets/android-icon.png',
    gradient: 'from-blue-500 to-purple-500'
  },
  colors: {
    background: 'hsl(0, 0%, 98%)',
    foreground: 'hsl(0, 0%, 0%)',
    card: 'hsl(0, 0%, 100%)',
    cardForeground: 'hsl(0, 0%, 0%)',
    popover: 'hsl(0, 0%, 100%)',
    popoverForeground: 'hsl(0, 0%, 0%)',
    primary: 'hsl(217, 91%, 60%)', // Blue
    primaryForeground: 'hsl(0, 0%, 100%)',
    secondary: 'hsl(200, 100%, 90%)', // Light Blue
    secondaryForeground: 'hsl(217, 91%, 40%)',
    muted: 'hsl(0, 0%, 90%)',
    mutedForeground: 'hsl(0, 0%, 50%)',
    accent: 'hsl(270, 100%, 80%)', // Purple
    accentForeground: 'hsl(270, 100%, 20%)',
    destructive: 'hsl(0, 84%, 60%)', // Red
    destructiveForeground: 'hsl(0, 0%, 100%)',
    border: 'hsl(0, 0%, 90%)',
    input: 'hsl(0, 0%, 90%)',
    ring: 'hsl(217, 91%, 60%)',
    // sidebar variants
    sidebarBackground: 'hsl(0, 0%, 100%)',
    sidebarForeground: 'hsl(0, 0%, 0%)',
    sidebarPrimary: 'hsl(217, 91%, 60%)',
    sidebarPrimaryForeground: 'hsl(0, 0%, 100%)',
    sidebarAccent: 'hsl(200, 100%, 90%)',
    sidebarAccentForeground: 'hsl(217, 91%, 40%)',
    sidebarBorder: 'hsl(0, 0%, 90%)',
    sidebarRing: 'hsl(217, 91%, 60%)'
  },
  assets: {
    icon: '/themes/android/assets/android-icon.png',
    css: '/themes/android/assets/android-theme.css'
  },
  available: true,
  createdAt: new Date('2025-01-01T00:00:00.000Z')
};

export default androidTheme;