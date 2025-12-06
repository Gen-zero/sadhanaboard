import { ThemeColors } from '../types';
import { getAdaptiveColors } from '../colorAdaptation';

/**
 * Mahakali Theme - Dark Destructive Power
 * Inspired by Maa Mahakali and the power to destroy ignorance
 * Colors generated from adaptive color palette:
 * - Primary: Deep red (#0) for transformation
 * - Secondary: Purple (#280) for spiritual power
 * - Accent: Crimson (#355) for divine destruction
 * - Background: Absolute dark with deep red gradient
 */
const colors: ThemeColors = getAdaptiveColors('mahakali');

// Override with Mahakali-specific enhancements
colors.accent = '0 100% 50%'; // Crimson accent
colors.accentForeground = '0 0% 100%';

export default colors;