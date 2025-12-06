import { ThemeColors } from '../types';
import { getAdaptiveColors } from '../colorAdaptation';

/**
 * Serenity Theme - Peaceful Calm Energy
 * A soft, professional theme for meditation and mindfulness
 * Colors generated from adaptive color palette:
 * - Primary: Light blue (#200) for tranquility
 * - Secondary: Cyan (#180) for clarity
 * - Accent: Light violet (#240) for gentle awakening
 * - Background: Soft light blue gradient representing peaceful waters
 */
const colors: ThemeColors = getAdaptiveColors('serenity');

export default colors;