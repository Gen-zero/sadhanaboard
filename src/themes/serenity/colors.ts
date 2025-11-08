import { ThemeColors } from '../types';

// Serenity – Light Blue
// Primary (Background): #E0F7FA (Aqua Sky Blue)
// Accent / Highlight: #00ACC1 (Teal Calm)
// Text (Primary): #002B36
// Text (Secondary): #4B636E

const colors: ThemeColors = {
  background: '187 78% 93%', // #E0F7FA
  foreground: '240 100% 15%', // Deep blue text (changed from 192 100% 11%)
  card: '187 70% 95%',        // Card background
  cardForeground: '240 100% 15%', // Deep blue text (changed from 193 100% 11%)
  popover: '187 65% 96%',     // Popover
  popoverForeground: '240 100% 15%', // Deep blue text (changed from 193 100% 11%)
  primary: '187 78% 93%', // #E0F7FA Aqua Sky Blue
  primaryForeground: '240 100% 15%', // Deep blue text (changed from 193 100% 11%)
  secondary: '187 50% 88%',
  secondaryForeground: '240 100% 15%', // Deep blue text (changed from 193 100% 11%)
  muted: '187 30% 90%',       // Muted background
  mutedForeground: '240 100% 25%', // Darker deep blue (changed from 195 19% 36%)
  accent: '187 100% 38%', // #00ACC1 Teal Calm
  accentForeground: '0 0% 100%',
  destructive: '0 84.2% 58%',
  destructiveForeground: '0 0% 100%',
  border: '187 40% 85%',      // Border
  input: '187 50% 88%',       // Input
  ring: '187 100% 38%', // Teal ring
  sidebarBackground: '240 100% 15%',  // Deep blue sidebar
  sidebarForeground: '210 100% 96%', // Light blue-white text
  sidebarPrimary: '240 100% 50%', // Deep blue primary
  sidebarPrimaryForeground: '0 0% 100%', // White text
  sidebarAccent: '240 90% 70%', // Lighter blue accent
  sidebarAccentForeground: '0 0% 100%', // White text
  sidebarBorder: '235 50% 25%',       // Blue border
  sidebarRing: '240 100% 50%' // Deep blue ring
};

export default colors;