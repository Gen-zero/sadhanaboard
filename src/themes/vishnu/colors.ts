import { ThemeColors } from '../types';

// Vishnu – Blue
// Primary (Background): #041C3E (Deep Vishnu Blue)
// Accent / Highlight: #00B7FF (Oceanic Blue Glow)
// Text (Primary): #D9EFFF (Light Blue-White)
// Text (Secondary): #A8D0FF (Light Blue)

const colors: ThemeColors = {
  background: '240 100% 6%',       // Deep cosmic blue
  foreground: '210 100% 96%',      // Light blue-white - brightened
  card: '240 95% 10%',             // Card background
  cardForeground: '210 100% 95%',  // Bright text
  popover: '240 90% 12%',          // Popover
  popoverForeground: '210 100% 94%',
  primary: '240 100% 50%',         // Deep blue
  primaryForeground: '0 0% 100%',  // Pure white
  secondary: '230 40% 20%',        // Blue-grey
  secondaryForeground: '210 100% 93%',
  muted: '230 30% 25%',            // Muted background
  mutedForeground: '210 100% 80%', // Brightened from 220 25% 70%
  accent: '180 80% 45%',           // Turquoise
  accentForeground: '230 50% 15%', // Dark blue
  destructive: '0 84.2% 58%',
  destructiveForeground: '210 100% 96%',
  border: '235 50% 22%',           // Border
  input: '240 60% 12%',            // Input
  ring: '240 100% 55%',
  sidebarBackground: '240 100% 4%',       // Sidebar
  sidebarForeground: '210 100% 96%',      // Bright text
  sidebarPrimary: '240 100% 50%',
  sidebarPrimaryForeground: '0 0% 100%',  // White
  sidebarAccent: '180 80% 45%',
  sidebarAccentForeground: '230 50% 15%',
  sidebarBorder: '235 50% 20%',          // Sidebar border
  sidebarRing: '240 100% 55%'
};

export default colors;