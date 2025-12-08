import { ThemeColors } from '../types';

// Default – Golden Purple Mix Theme
// Primary (Background): Light lavender with golden undertones
// Accent / Highlight: #FFD700 (Bright Divine Gold)
// Text (Primary): Rich purple text
// Text (Secondary): Medium purple text

const colors: ThemeColors = {
  background: '270 50% 95%',          // Light lavender background with golden undertones
  foreground: '270 70% 35%',          // Brighter rich purple text for better visibility
  primary: '270 60% 60%',             // Purple-gold blend for primary elements
  primaryForeground: '0 0% 100%',     // White text
  secondary: '270 40% 70%',           // Lighter purple-gold for secondary elements
  secondaryForeground: '270 65% 30%', // Brighter purple text
  accent: '45 100% 50%',              // Golden accent
  accentForeground: '270 60% 25%',    // Brighter purple instead of black
  card: '270 30% 90%',                // Lavender card background
  cardForeground: '270 70% 35%',      // Brighter strong purple
  popover: '270 40% 92%',             // Popover with golden undertones
  popoverForeground: '270 70% 35%',   // Brighter strong text
  border: '270 50% 80%',              // Border with purple-gold mix
  input: '270 35% 93%',               // Input fields
  muted: '270 25% 85%',               // Muted background
  mutedForeground: '270 40% 40%',     // Improved muted text
  destructive: '0 84.2% 58%',
  destructiveForeground: '0 0% 100%',
  ring: '45 100% 50%',                // Golden focus ring
  sidebarBackground: '270 40% 90%',    // Sidebar
  sidebarForeground: '270 70% 32%',   // Brighter strong text
  sidebarPrimary: '45 100% 50%',      // Golden primary
  sidebarPrimaryForeground: '270 65% 28%',
  sidebarAccent: '270 60% 65%',       // Brighter purple-gold accent
  sidebarAccentForeground: '270 70% 32%',
  sidebarBorder: '270 40% 80%',
  sidebarRing: '45 100% 50%'
};

export default colors;