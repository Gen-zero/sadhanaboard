import { ThemeColors } from '../types';

const colors: ThemeColors = {
  background: '210 35% 8%',
  foreground: '210 35% 95%', // Brightened from 60 100% 98% for better contrast on dark
  card: '210 29% 13%',
  cardForeground: '210 35% 93%', // Enhanced contrast
  popover: '210 29% 16%',
  popoverForeground: '210 35% 93%', // Enhanced contrast
  primary: '200 80% 50%',
  primaryForeground: '0 0% 100%', // Pure white for maximum contrast
  secondary: '200 45% 30%',
  secondaryForeground: '210 35% 92%', // Light blue text
  muted: '210 12% 17%',
  mutedForeground: '210 25% 70%', // Improved from 210 11% 60%
  accent: '180 60% 45%',
  accentForeground: '210 35% 10%', // Dark blue instead of pure black
  destructive: '0 62.8% 35.6%',
  destructiveForeground: '210 35% 95%', // Light blue text
  border: '210 16% 18%',
  input: '210 18% 15%',
  ring: '200 80% 50%'
};

export default colors;