import { ThemeColors } from '../types';

// Default – Golden Purple Mix Theme
// Primary (Background): Light lavender with golden undertones
// Accent / Highlight: #FFD700 (Bright Divine Gold)
// Text (Primary): Rich purple-gold text
// Text (Secondary): Lighter purple-gold

const colors: ThemeColors = {
  background: '270 50% 95%',          // Light lavender background with golden undertones
  foreground: '270 70% 25%',          // Rich purple-gold text
  primary: '270 60% 60%',             // Purple-gold blend for primary elements
  primaryForeground: '0 0% 100%',
  secondary: '270 40% 70%',           // Lighter purple-gold for secondary elements
  secondaryForeground: '0 0% 100%',
  accent: '45 100% 50%',              // Golden accent
  accentForeground: '0 0% 0%',
  card: '270 30% 90%',                // Lavender card background
  cardForeground: '270 70% 25%',
  popover: '270 40% 92%',             // Popover with golden undertones
  popoverForeground: '270 70% 25%',
  border: '270 50% 80%',              // Border with purple-gold mix
  input: '270 35% 93%',               // Input fields
  muted: '270 25% 85%',               // Muted background
  mutedForeground: '270 30% 60%',     // Muted purple-gold text
  destructive: '0 84.2% 58%',
  destructiveForeground: '0 0% 100%',
  ring: '45 100% 50%',                // Golden focus ring
  sidebarBackground: '270 40% 90%',    // Sidebar
  sidebarForeground: '270 70% 30%',   // Sidebar text
  sidebarPrimary: '45 100% 50%',      // Golden sidebar primary
  sidebarPrimaryForeground: '0 0% 100%',
  sidebarAccent: '270 50% 75%',       // Light purple-gold accent
  sidebarAccentForeground: '0 0% 100%',
  sidebarBorder: '270 40% 80%',       // Sidebar border
  sidebarRing: '45 100% 50%'          // Golden sidebar ring
};

export default colors;