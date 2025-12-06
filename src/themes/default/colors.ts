import { ThemeColors } from '../types';

// Default – Golden Purple Mix Theme
// Primary (Background): Light lavender with golden undertones
// Accent / Highlight: #FFD700 (Bright Divine Gold)
// Text (Primary): Rich purple text
// Text (Secondary): Medium purple text

const colors: ThemeColors = {
  background: '270 50% 95%',          // Light lavender background with golden undertones
  foreground: '270 60% 28%',          // Enhanced rich purple text for better contrast
  primary: '270 60% 60%',             // Purple-gold blend for primary elements
  primaryForeground: '0 0% 100%',     // White text
  secondary: '270 40% 70%',           // Lighter purple-gold for secondary elements
  secondaryForeground: '270 50% 25%', // Dark purple text
  accent: '45 100% 50%',              // Golden accent
  accentForeground: '270 30% 20%',    // Dark purple instead of black
  card: '270 30% 90%',                // Lavender card background
  cardForeground: '270 60% 28%',      // Strong dark purple
  popover: '270 40% 92%',             // Popover with golden undertones
  popoverForeground: '270 60% 28%',   // Strong text
  border: '270 50% 80%',              // Border with purple-gold mix
  input: '270 35% 93%',               // Input fields
  muted: '270 25% 85%',               // Muted background
  mutedForeground: '270 40% 40%',     // Improved muted text
  destructive: '0 84.2% 58%',
  destructiveForeground: '0 0% 100%',
  ring: '45 100% 50%',                // Golden focus ring
  sidebarBackground: '270 40% 90%',    // Sidebar
  sidebarForeground: '270 60% 25%',   // Strong text
  sidebarPrimary: '45 100% 50%',      // Golden primary
  sidebarPrimaryForeground: '270 40% 20%',
  sidebarAccent: '270 50% 75%',       // Light purple-gold accent
  sidebarAccentForeground: '270 60% 25%',
  sidebarBorder: '270 40% 80%',
  sidebarRing: '45 100% 50%'
};

export default colors;