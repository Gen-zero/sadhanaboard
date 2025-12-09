import { ThemeColors } from '../types';

// Default – Cosmic Purple Landing Theme
// Primary (Background): Deep purple cosmic tones matching landing page
// Accent / Highlight: #FFD700 (Bright Divine Gold)
// Text (Primary): Light amber/white for contrast
// Text (Secondary): Amber tones
// Matches the purplish landing page gradient: #4b0753, #2a0a3e, #1a0b2e

const colors: ThemeColors = {
  background: '280 85% 15%',          // Deep purple (#4b0753 ~ #2a0a3e) matching landing gradient
  foreground: '45 100% 95%',          // Light amber-white text for contrast
  primary: '280 80% 25%',             // Rich deep purple for primary elements
  primaryForeground: '45 100% 90%',   // Light golden text on purple
  secondary: '285 75% 20%',           // Darker purple-fuchsia for secondary elements
  secondaryForeground: '45 100% 85%', // Golden-white text
  accent: '45 100% 50%',              // Bright golden accent (unchanged)
  accentForeground: '0 0% 0%',        // Black text on gold
  card: '280 70% 18%',                // Deep purple card background
  cardForeground: '45 100% 90%',      // Light text on cards
  popover: '280 75% 20%',             // Purple popover
  popoverForeground: '45 100% 90%',   // Light text
  border: '280 60% 30%',              // Purple border with visibility
  input: '280 70% 22%',               // Deep purple input fields
  muted: '280 50% 25%',               // Muted purple background
  mutedForeground: '45 50% 70%',      // Muted amber text
  destructive: '0 84.2% 58%',         // Red for errors
  destructiveForeground: '0 0% 100%', // White text
  ring: '45 100% 50%',                // Golden focus ring
  sidebarBackground: '280 85% 12%',   // Very dark purple sidebar
  sidebarForeground: '45 100% 92%',   // Light golden-white sidebar text
  sidebarPrimary: '45 100% 50%',      // Golden sidebar primary
  sidebarPrimaryForeground: '0 0% 0%', // Black text on gold
  sidebarAccent: '280 70% 25%',       // Purple accent in sidebar
  sidebarAccentForeground: '45 100% 90%', // Light text
  sidebarBorder: '280 60% 20%',       // Dark purple border
  sidebarRing: '45 100% 50%'          // Golden sidebar ring
};

export default colors;