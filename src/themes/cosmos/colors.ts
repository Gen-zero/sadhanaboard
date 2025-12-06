import { ThemeColors } from '../types';

// Cosmos – Interstellar Nebula Theme
// Primary (Background): #0A0A1A (Deep Space Black)
// Accent / Highlight: #6A5ACD (Cosmic Slate Blue) with gradient effects
// Text (Primary): #E6E6FA (Cosmic Lavender)
// Text (Secondary): #D0C4FF (Light Lavender)

const colors: ThemeColors = {
  // Deep space background with subtle cosmic undertones
  background: '240 20% 6%',        // #0A0A1A - Deep space black
  foreground: '240 30% 92%',      // Brightened from 240 30% 90%
  card: '240 15% 12%',            // #1A1A2A - Dark cosmic card background
  cardForeground: '240 30% 91%',  // Brightened
  popover: '240 20% 15%',         // #222235 - Popover with deep space feel
  popoverForeground: '240 30% 90%', // Cosmic lavender text on popovers
  
  // Cosmic primary colors with gradient potential
  primary: '240 30% 20%',         // #2A2A4A - Cosmic slate blue
  primaryForeground: '0 0% 100%',  // Pure white for contrast
  
  // Secondary elements with stellar feel
  secondary: '240 25% 25%',       // #353555 - Stellar gray-blue
  secondaryForeground: '240 30% 85%', // Light lavender text
  
  // Muted colors for subtle elements
  muted: '240 20% 18%',           // #252538 - Muted cosmic background
  mutedForeground: '240 20% 80%', // Brightened from #B0B0C0
  
  // Accent colors with cosmic glow
  accent: '240 40% 60%',          // #6A5ACD - Cosmic slate blue (Nebula)
  accentForeground: '240 30% 15%', // Dark space instead of pure white
  
  // Destructive actions with cosmic warning
  destructive: '0 80% 60%',       // #F55 - Cosmic red
  destructiveForeground: '0 0% 100%', // White text on destructive elements
  
  // Borders and inputs with subtle cosmic shimmer
  border: '240 30% 30%',          // #454565 - Cosmic border with shimmer
  input: '240 20% 15%',           // #222235 - Input fields with space feel
  ring: '240 40% 60%',            // #6A5ACD - Cosmic slate blue ring
  
  // Sidebar with deep space navigation
  sidebarBackground: '240 25% 8%',  // #121225 - Deep space sidebar
  sidebarForeground: '240 30% 92%',    // Brightened lavender text
  sidebarPrimary: '240 40% 60%',    // #6A5ACD - Cosmic slate blue for sidebar
  sidebarPrimaryForeground: '0 0% 100%', // Pure white text
  sidebarAccent: '270 50% 70%',     // #9966CC - Cosmic purple accent
  sidebarAccentForeground: '240 30% 12%', // Dark space
  sidebarBorder: '240 30% 20%',     // #2A2A4A - Sidebar border
  sidebarRing: '270 50% 70%'        // #9966CC - Cosmic purple ring
};

export default colors;