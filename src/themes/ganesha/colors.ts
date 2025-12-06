import { ThemeColors } from '../types';
import { getAdaptiveColors } from '../colorAdaptation';

/**
 * Ganesha Theme - Auspicious Prosperity
 * Inspired by Lord Ganesha, the remover of obstacles and bringer of good fortune
 * Colors generated from adaptive color palette:
 * - Primary: Red (#0) for auspiciousness
 * - Secondary: Gold (#45) for prosperity
 * - Accent: Orange (#30) for divine energy
 * - Background: Light warm gradient with red and gold tones
 */
const colors: ThemeColors = getAdaptiveColors('ganesha');

export default colors;