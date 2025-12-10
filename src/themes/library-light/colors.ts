import { ThemeColors } from '../types';

// Library Light Theme - Clean White and Light Colors
const colors: ThemeColors = {
  // Background colors with clean white/light scheme
  background: '0 0% 100%',           // Pure white background
  foreground: '0 0% 10%',            // Near black text for optimal readability
  card: '0 0% 98%',                  // Very light gray card background
  cardForeground: '0 0% 10%',        // Near black text on cards
  popover: '0 0% 99%',               // Almost white popover background
  popoverForeground: '0 0% 10%',     // Near black text on popovers
  
  // Primary action colors with professional blue
  primary: '210 100% 50%',           // Professional blue for primary actions
  primaryForeground: '0 0% 100%',    // White text on primary elements
  
  // Secondary elements with soft gray
  secondary: '0 0% 90%',             // Light gray for secondary elements
  secondaryForeground: '0 0% 15%',   // Dark gray text on secondary elements
  
  // Muted colors for less important elements
  muted: '0 0% 95%',                 // Very light gray for muted elements
  mutedForeground: '0 0% 50%',      // Medium gray for muted text
  
  // Accent colors for highlights
  accent: '210 100% 60%',            // Brighter blue for accents
  accentForeground: '0 0% 100%',     // White text on accent elements
  
  // Destructive actions (errors, warnings)
  destructive: '0 84.2% 60%',        // Soft red for destructive actions
  destructiveForeground: '0 0% 100%', // White text on destructive elements
  
  // Borders and inputs with subtle colors
  border: '0 0% 85%',                // Light gray border
  input: '0 0% 92%',                 // Input fields with very light gray
  ring: '210 100% 50%',              // Blue focus ring matching primary
  
  // Sidebar colors with contrasting scheme
  sidebarBackground: '0 0% 97%',     // Light sidebar background
  sidebarForeground: '0 0% 10%',     // Dark text for sidebar
  sidebarPrimary: '210 100% 50%',    // Blue for sidebar primary
  sidebarPrimaryForeground: '0 0% 100%', // White text on sidebar primary
  sidebarAccent: '210 100% 60%',     // Brighter blue for sidebar accent
  sidebarAccentForeground: '0 0% 100%', // White text on sidebar accent
  sidebarBorder: '0 0% 85%',         // Light border for sidebar
  sidebarRing: '210 100% 50%'        // Blue ring for sidebar
};

export default colors;