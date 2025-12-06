import { ThemeColors } from '../types';

// Zen Garden – Green
// Primary (Background): #E8F5E9 (Pastel Green Mist)
// Accent / Highlight: #4CAF50 (Nature Emerald)
// Text (Primary): #1B5E20 (Deep Forest Green)
// Text (Secondary): #2E7D32 (Forest Green)

const colors: ThemeColors = {
  background: '123 47% 94%', // #E8F5E9
  foreground: '135 56% 18%', // #1B5E20 - Stronger deep green for better contrast
  card: '123 40% 96%',
  cardForeground: '135 56% 18%', // Matching strong foreground
  popover: '123 35% 97%',
  popoverForeground: '135 56% 18%',
  primary: '123 47% 94%', // #E8F5E9 Pastel Green Mist
  primaryForeground: '135 56% 18%', // Deep forest green on light background
  secondary: '123 30% 88%',
  secondaryForeground: '135 40% 22%', // Enhanced secondary foreground
  muted: '123 20% 92%',
  mutedForeground: '135 35% 30%', // Improved from #558B2F - darker green
  accent: '122 39% 49%', // #4CAF50 Nature Emerald
  accentForeground: '0 0% 100%',
  destructive: '0 84.2% 58%',
  destructiveForeground: '0 0% 100%',
  border: '123 30% 88%',
  input: '123 40% 90%',
  ring: '122 39% 49%', // Green ring
  sidebarBackground: '123 47% 92%',
  sidebarForeground: '135 56% 18%', // Strong text
  sidebarPrimary: '122 39% 49%', // Nature emerald
  sidebarPrimaryForeground: '0 0% 100%',
  sidebarAccent: '123 30% 85%',
  sidebarAccentForeground: '135 56% 18%', // Strong text on accent
  sidebarBorder: '123 30% 86%',
  sidebarRing: '122 39% 49%'
};

export default colors;