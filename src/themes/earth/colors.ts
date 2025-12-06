import { ThemeColors } from '../types';
import { getAdaptiveColors } from '../colorAdaptation';

/**
 * Earth Theme - Grounding and Stability
 * Inspired by the Earth element and natural green tones
 * Colors generated from adaptive color palette:
 * - Primary: Forest green (#120) for earth and nature
 * - Secondary: Brown (#25) for soil and stability
 * - Accent: Yellow-green (#60) for growth
 * - Background: Light green gradient representing natural harmony
 */
const colors: ThemeColors = getAdaptiveColors('earth');

// Override with theme-specific enhancements
colors.secondary = '25 70% 35%'; // Rich brown
colors.secondaryForeground = '0 0% 100%';

export default colors;