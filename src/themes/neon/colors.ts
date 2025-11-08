import { ThemeColors } from '../types';

// Neon – Mixed Glow
// Primary (Background): #10001A (Dark Cosmic Purple)
// Accent / Highlight: Gradient (#00FFB0 → #FF00E0 → #7C4DFF)
// Text (Primary): #FFFFFF
// Text (Secondary): #D5D5D5

const colors: ThemeColors = {
  background: '277 100% 5%', // #10001A
  foreground: '0 0% 100%', // #FFFFFF
  card: '277 90% 8%',
  cardForeground: '0 0% 100%',
  popover: '277 85% 10%',
  popoverForeground: '0 0% 100%',
  primary: '277 100% 5%', // #10001A Dark Cosmic Purple
  primaryForeground: '0 0% 100%',
  secondary: '277 70% 12%',
  secondaryForeground: '0 0% 100%',
  muted: '277 50% 15%',
  mutedForeground: '0 0% 84%', // #D5D5D5
  accent: '160 100% 50%', // #00FFB0 Neon Green (primary gradient color)
  accentForeground: '0 0% 0%',
  destructive: '0 84.2% 58%',
  destructiveForeground: '0 0% 100%',
  border: '277 60% 18%',
  input: '277 70% 15%',
  ring: '320 100% 50%', // #FF00E0 Neon Pink (for variety)
  sidebarBackground: '277 100% 4%',
  sidebarForeground: '0 0% 100%',
  sidebarPrimary: '160 100% 50%', // Neon green
  sidebarPrimaryForeground: '0 0% 0%',
  sidebarAccent: '260 100% 66%', // #7C4DFF Neon Purple
  sidebarAccentForeground: '0 0% 100%',
  sidebarBorder: '277 60% 15%',
  sidebarRing: '320 100% 50%'
};

export default colors;