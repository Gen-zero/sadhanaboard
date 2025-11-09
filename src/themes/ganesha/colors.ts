import { ThemeColors } from '../types';

// Ganesha – Orange and Violet Blend
// Primary (Background): #FED8B1 (Soft Orange) mixed with violet undertones
// Accent / Highlight: #8A2BE2 (Violet) with orange accents
// Text (Primary): #4B0082 (Indigo)
// Text (Secondary): #6A5ACD (Slate Blue)

const colors: ThemeColors = {
  background: '30 70% 85%', // Soft Orange with violet undertones
  foreground: '270 100% 25%', // Indigo text
  card: '30 60% 90%',         // Card background with orange-violet blend
  cardForeground: '270 100% 25%',
  popover: '30 55% 93%',      // Popover with warm violet tones
  popoverForeground: '270 100% 25%',
  primary: '30 70% 85%', // Soft Orange primary
  primaryForeground: '270 100% 25%',
  secondary: '270 40% 70%', // Violet secondary
  secondaryForeground: '30 100% 95%',
  muted: '270 30% 80%',        // Muted violet background
  mutedForeground: '270 50% 40%', // Slate blue muted text
  accent: '270 60% 50%', // Violet accent
  accentForeground: '0 0% 100%',
  destructive: '0 84.2% 58%',
  destructiveForeground: '0 0% 100%',
  border: '270 40% 75%',       // Violet border
  input: '270 50% 88%',        // Violet input fields
  ring: '270 60% 50%', // Violet ring
  sidebarBackground: '270 50% 80%',  // Violet sidebar
  sidebarForeground: '30 100% 95%',
  sidebarPrimary: '270 60% 50%', // Violet
  sidebarPrimaryForeground: '0 0% 100%',
  sidebarAccent: '30 70% 70%', // Orange accent
  sidebarAccentForeground: '270 100% 25%',
  sidebarBorder: '270 40% 70%',       // Violet sidebar border
  sidebarRing: '270 60% 50%'
};

export default colors;