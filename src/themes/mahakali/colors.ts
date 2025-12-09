import { ThemeColors } from '../types';

// Maa Kali – Black with Crimson Gradient Cards
// Primary (Background): #0B0B0B (Absolute Black)
// Card/Content Box: Crimson gradient (#8B0000 dark to #DC143C bright)
// Accent / Highlight: #2BBFFF (Electric Blue Flames)
// Text (Primary): #FFFFFF (Pure White)
// Text (Secondary): #B8D4FF (Light Blue)

const colors: ThemeColors = {
  background: '0 0% 4%', // #0B0B0B
  foreground: '0 0% 100%', // #FFFFFF - Pure white
  card: '0 100% 18%', // Dark crimson (#5C0000) for card backgrounds
  cardForeground: '0 0% 100%',
  popover: '0 100% 22%', // Slightly lighter crimson for popovers
  popoverForeground: '0 0% 100%',
  primary: '348 91% 47%', // Bright crimson (#DC143C)
  primaryForeground: '0 0% 100%', // White text
  secondary: '0 100% 27%', // Dark crimson (#8B0000)
  secondaryForeground: '0 0% 100%', // White text
  muted: '0 80% 15%', // Very dark crimson for muted areas
  mutedForeground: '0 40% 75%', // Light crimson-tinted text
  accent: '197 100% 58%', // #2BBFFF Electric Blue Flames (unchanged)
  accentForeground: '0 0% 0%', // Pure black for contrast
  destructive: '0 84.2% 58%',
  destructiveForeground: '0 0% 100%',
  border: '0 70% 25%', // Crimson border
  input: '0 80% 18%', // Dark crimson input fields
  ring: '197 100% 58%', // Blue flames ring
  sidebarBackground: '0 100% 10%', // Very dark crimson sidebar
  sidebarForeground: '0 0% 100%', // Pure white
  sidebarPrimary: '348 91% 47%', // Bright crimson
  sidebarPrimaryForeground: '0 0% 100%', // White
  sidebarAccent: '0 100% 20%', // Medium dark crimson
  sidebarAccentForeground: '0 0% 100%', // White
  sidebarBorder: '0 70% 20%', // Crimson border
  sidebarRing: '197 100% 58%' // Electric blue ring
};

export default colors;
