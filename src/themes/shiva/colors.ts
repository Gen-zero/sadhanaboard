import { ThemeColors } from '../types';
import { getAdaptiveColors } from '../colorAdaptation';

/**
 * Shiva Theme - Deep Mystical Meditation
 * Inspired by Lord Shiva's meditation and cosmic consciousness
 * Colors generated from adaptive color palette:
 * - Primary: Deep purple-blue (#280) for meditation
 * - Secondary: Violet for spiritual depth
 * - Accent: Cyan (#200) for third-eye awakening
 * - Background: Dark mystical with gradient from slate to purple
 */
const colors: ThemeColors = getAdaptiveColors('shiva');

// Override with theme-specific enhancements if needed
colors.accent = '200 100% 50%'; // Cyan (third eye)
colors.accentForeground = '280 50% 15%'; // Dark purple text on cyan

export default colors;