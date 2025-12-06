import { ThemeColors } from '../types';
import { getAdaptiveColors } from '../colorAdaptation';

/**
 * Neon Theme - Cyberpunk Digital Energy
 * A bright, modern theme with cyberpunk aesthetic and neon glow effects
 * Colors generated from adaptive color palette:
 * - Primary: Neon green (#120) for energetic vibrancy
 * - Secondary: Neon purple (#280) for mystique
 * - Accent: Neon red (#0) for intensity
 * - Background: Dark cosmic with neon glow potential
 */
const colors: ThemeColors = getAdaptiveColors('neon');

export default colors;