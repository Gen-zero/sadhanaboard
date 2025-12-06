import { ThemeColors } from '../types';

// Maa Tara – Blue (Dark)
// Primary (Background): #0B1026 (Abyssal Blue)
// Accent / Highlight: #4AC6FF (Neon Cyan Light)
// Text (Primary): #E0F7FF (Bright Cyan-White)
// Text (Secondary): #B8E8FF (Light Cyan)

const colors: ThemeColors = {
  background: '228 74% 10%', // #0B1026
  foreground: '195 100% 94%', // #E0F7FF - brightened
  card: '228 70% 13%',
  cardForeground: '195 100% 93%',
  popover: '228 65% 15%',
  popoverForeground: '195 100% 92%',
  primary: '228 74% 10%', // #0B1026 Abyssal Blue
  primaryForeground: '195 100% 94%',
  secondary: '228 50% 18%',
  secondaryForeground: '195 100% 92%',
  muted: '228 40% 22%',
  mutedForeground: '207 100% 85%', // Brightened from #A7D3FF
  accent: '196 100% 64%', // #4AC6FF Neon Cyan Light
  accentForeground: '228 60% 15%', // Dark blue
  destructive: '0 84.2% 58%',
  destructiveForeground: '195 100% 94%',
  border: '228 50% 20%',
  input: '228 60% 18%',
  ring: '196 100% 64%', // Cyan ring
  sidebarBackground: '228 74% 8%',
  sidebarForeground: '195 100% 94%', // Bright cyan
  sidebarPrimary: '196 100% 64%', // Neon cyan
  sidebarPrimaryForeground: '228 60% 15%', // Dark blue
  sidebarAccent: '228 50% 15%',
  sidebarAccentForeground: '195 100% 94%',
  sidebarBorder: '228 50% 18%',
  sidebarRing: '196 100% 64%'
};

export default colors;