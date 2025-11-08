import { ThemeColors } from '../types';

// Cosmos – White Theme
// Primary (Background): #FFFFFF (Pure White)
// Accent / Highlight: #9E6FFF (Nebula Violet)
// Text (Primary): #000000
// Text (Secondary): #444444

const colors: ThemeColors = {
  background: '0 0% 100%', // Pure white background
  foreground: '0 0% 0%',   // Black text
  card: '0 0% 95%',        // Light gray cards
  cardForeground: '0 0% 0%',
  popover: '0 0% 90%',     // Popover
  popoverForeground: '0 0% 0%',
  primary: '0 0% 100%',    // White primary
  primaryForeground: '0 0% 0%',
  secondary: '0 0% 90%',   // Light gray secondary
  secondaryForeground: '0 0% 0%',
  muted: '0 0% 85%',       // Muted background
  mutedForeground: '0 0% 40%', // Dark gray muted text
  accent: '260 100% 72%',  // #9E6FFF Nebula Violet
  accentForeground: '0 0% 100%',
  destructive: '0 84.2% 58%',
  destructiveForeground: '0 0% 100%',
  border: '0 0% 85%',      // Light gray border
  input: '0 0% 95%',       // Input fields
  ring: '260 100% 72%',    // Violet ring
  sidebarBackground: '0 0% 98%',  // Light sidebar
  sidebarForeground: '0 0% 0%',
  sidebarPrimary: '260 100% 72%', // Nebula violet
  sidebarPrimaryForeground: '0 0% 100%',
  sidebarAccent: '0 0% 90%',
  sidebarAccentForeground: '0 0% 0%',
  sidebarBorder: '0 0% 85%',       // Sidebar border
  sidebarRing: '260 100% 72%'
};

export default colors;