import { ThemeColors } from '../types';

// Maa Kali – Black (Dark)
// Primary (Background): #0B0B0B (Absolute Black)
// Accent / Highlight: #2BBFFF (Electric Blue Flames)
// Text (Primary): #FFFFFF (Pure White)
// Text (Secondary): #B8D4FF (Light Blue)

const colors: ThemeColors = {
  background: '0 0% 4%', // #0B0B0B
  foreground: '0 0% 100%', // #FFFFFF - Pure white
  card: '0 0% 7%',
  cardForeground: '0 0% 100%',
  popover: '0 0% 9%',
  popoverForeground: '0 0% 100%',
  primary: '0 0% 4%', // #0B0B0B Absolute Black
  primaryForeground: '0 0% 100%', // White text
  secondary: '0 0% 12%',
  secondaryForeground: '210 100% 95%', // Light blue text instead of #9AB2FF
  muted: '0 0% 15%',
  mutedForeground: '210 100% 85%', // Brightened from #9AB2FF
  accent: '197 100% 58%', // #2BBFFF Electric Blue Flames
  accentForeground: '0 0% 0%', // Pure black for contrast
  destructive: '0 84.2% 58%',
  destructiveForeground: '0 0% 100%',
  border: '0 0% 18%',
  input: '0 0% 15%',
  ring: '197 100% 58%', // Blue flames ring
  sidebarBackground: '0 0% 3%',
  sidebarForeground: '0 0% 100%', // Pure white
  sidebarPrimary: '197 100% 58%', // Electric blue
  sidebarPrimaryForeground: '0 0% 0%', // Black
  sidebarAccent: '0 0% 10%',
  sidebarAccentForeground: '0 0% 100%', // White
  sidebarBorder: '0 0% 15%',
  sidebarRing: '197 100% 58%'
};

export default colors;