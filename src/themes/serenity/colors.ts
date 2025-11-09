import { ThemeColors } from '../types';

// Serenity – Professional Light Blue Theme
// Primary (Background): #F0F9FF (Professional Light Blue)
// Accent / Highlight: #0EA5E9 (Professional Sky Blue)
// Text (Primary): #0F172A (Deep Navy Blue)
// Text (Secondary): #64748B (Cool Gray)

const colors: ThemeColors = {
  // Background colors with improved contrast and transparency
  background: '210 100% 97%',     // #F0F9FF - Professional light blue background
  foreground: '222 47% 11%',      // #0F172A - Deep navy blue text for optimal readability
  card: '210 80% 98%',            // Lighter card background with subtle blue tint
  cardForeground: '222 47% 11%',  // Deep navy blue text on cards
  popover: '210 90% 99%',         // Very light popover background
  popoverForeground: '222 47% 11%', // Deep navy blue text on popovers
  
  // Primary action colors with enhanced contrast
  primary: '202 96% 46%',         // #0EA5E9 - Professional sky blue for primary actions
  primaryForeground: '210 20% 98%', // Soft off-white with slight blue tint instead of pure white
  
  // Secondary elements with refined palette
  secondary: '210 40% 90%',       // Subtle blue-gray for secondary elements
  secondaryForeground: '222 47% 11%', // Deep navy blue text on secondary elements
  
  // Muted colors for less important elements
  muted: '210 30% 93%',           // Muted background with gentle blue undertone
  mutedForeground: '215 20% 40%', // Cool gray for muted text (#64748B)
  
  // Accent colors for highlights and interactive elements
  accent: '199 89% 48%',          // #06B6D4 - Vibrant teal for accents
  accentForeground: '210 20% 98%',  // Soft off-white with slight blue tint instead of pure white
  
  // Destructive actions (errors, warnings)
  destructive: '0 84.2% 60%',     // Softer red for destructive actions
  destructiveForeground: '210 20% 98%', // Soft off-white with slight blue tint instead of pure white
  
  // Borders and inputs with appropriate transparency
  border: '210 40% 85%',          // Soft blue-gray border
  input: '210 35% 90%',           // Input fields with subtle blue tint
  ring: '202 96% 46%',            // Sky blue focus ring matching primary
  
  // Sidebar colors with enhanced contrast and professional appearance
  sidebarBackground: '210 100% 15%',  // Deep professional blue (#0C4A6E)
  sidebarForeground: '0 0% 95%',      // Nearly white text for better contrast (#F2F2F2)
  sidebarPrimary: '202 96% 55%',      // Lighter sky blue for sidebar primary (#38BDF8)
  sidebarPrimaryForeground: '0 0% 95%', // Nearly white text for better contrast
  sidebarAccent: '199 89% 55%',       // Lighter teal accent (#0891B2)
  sidebarAccentForeground: '0 0% 95%', // Nearly white text for better contrast
  sidebarBorder: '210 40% 25%',       // Darker blue border for sidebar
  sidebarRing: '202 96% 55%'          // Light sky blue ring for sidebar
};

export default colors;