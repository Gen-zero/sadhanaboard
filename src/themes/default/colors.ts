import { ThemeColors } from '../types';
import { getAdaptiveColors } from '../colorAdaptation';

/**
 * Default Theme - Golden & Spiritual Harmony
 * A balanced, welcoming theme combining golden spirituality with mystical energy
 * Colors generated from adaptive color palette:
 * - Primary: Gold (#45) for divine radiance and spirituality
 * - Secondary: Purple-blue (#270) for mystical awareness
 * - Accent: Gold (#45) for auspicious highlights
 * - Background: Light with warm golden undertones
 */
const colors: ThemeColors = getAdaptiveColors('default');

export default colors;