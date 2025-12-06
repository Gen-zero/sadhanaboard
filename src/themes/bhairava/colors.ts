import { ThemeColors } from '../types';

// Bhairava – Bluish Purple
// Primary (Background): #190027 (Shadow Purple)
// Accent / Highlight: #7A00FF (Electric Violet)
// Text (Primary): #EBDFFF (Light Lavender)
// Text (Secondary): #D0B8FF (Lighter Lavender)

const colors: ThemeColors = {
  background: '277 100% 8%', // #190027
  foreground: '270 100% 94%', // #EBDFFF - Bright lavender
  card: '277 90% 11%',
  cardForeground: '270 100% 93%',
  popover: '277 85% 13%',
  popoverForeground: '270 100% 92%',
  primary: '277 100% 8%', // #190027 Shadow Purple
  primaryForeground: '270 100% 94%', // Bright lavender
  secondary: '277 70% 12%',
  secondaryForeground: '270 100% 90%', // Light text
  muted: '277 50% 16%',
  mutedForeground: '270 100% 85%', // Brightened from #A884FF
  accent: '272 100% 50%', // #7A00FF Electric Violet
  accentForeground: '270 50% 15%', // Dark purple instead of pure black
  destructive: '0 84.2% 58%',
  destructiveForeground: '270 100% 94%',
  border: '277 60% 15%',
  input: '277 70% 13%',
  ring: '272 100% 50%', // Electric violet ring
  sidebarBackground: '277 100% 6%',
  sidebarForeground: '270 100% 94%', // Bright lavender
  sidebarPrimary: '272 100% 50%', // Electric violet
  sidebarPrimaryForeground: '270 100% 98%', // Nearly white
  sidebarAccent: '277 70% 10%',
  sidebarAccentForeground: '270 100% 94%',
  sidebarBorder: '277 60% 13%',
  sidebarRing: '272 100% 50%'
};

export default colors;