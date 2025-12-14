import { BeadType, BeadConfig } from '@/types/beadTypes';

export const BEAD_CONFIGS: Record<BeadType, BeadConfig> = {
  [BeadType.TULSI]: {
    type: BeadType.TULSI,
    name: 'Tulsi',
    description: 'Holy Basil wood, sacred to Vishnu/Krishna.',
    color: 'bg-[#8B5A2B]', // Wood brown
    textColor: 'text-amber-900',
    shadowColor: 'shadow-amber-900/50',
    textureClass: 'bg-[radial-gradient(circle_at_30%_30%,_#A06835,_#5C3A1A)]'
  },
  [BeadType.RUDRAKSHA]: {
    type: BeadType.RUDRAKSHA,
    name: 'Rudraksha',
    description: 'Seeds associated with Shiva. Rough texture.',
    color: 'bg-[#5D2E2E]', // Dark reddish brown
    textColor: 'text-red-950',
    shadowColor: 'shadow-red-950/50',
    textureClass: 'bg-[radial-gradient(circle_at_30%_30%,_#7f2e2e,_#3f1818)] ring-1 ring-black/20 border-2 border-[#4a1c1c] border-dashed'
  },
  [BeadType.SPHATIK]: {
    type: BeadType.SPHATIK,
    name: 'Sphatik',
    description: 'Quartz Crystal. Cooling and clarifying.',
    color: 'bg-[#E0F2F1]', // Very light teal/white
    textColor: 'text-slate-600',
    shadowColor: 'shadow-slate-400/50',
    textureClass: 'bg-[radial-gradient(circle_at_35%_35%,_#ffffff,_#b2dfdb)] opacity-90 backdrop-blur-sm border border-white/40'
  },
  [BeadType.HALDI]: {
    type: BeadType.HALDI,
    name: 'Haldi',
    description: 'Turmeric. Used for Bagalamukhi/Jupiter.',
    color: 'bg-[#FBC02D]', // Turmeric yellow
    textColor: 'text-yellow-950',
    shadowColor: 'shadow-yellow-700/50',
    textureClass: 'bg-[radial-gradient(circle_at_40%_40%,_#FDD835,_#F57F17)]'
  },
  [BeadType.CHANDAN]: {
    type: BeadType.CHANDAN,
    name: 'Chandan',
    description: 'White Sandalwood. Cooling and soothing.',
    color: 'bg-[#D7CCC8]', // Beige
    textColor: 'text-brown-900',
    shadowColor: 'shadow-brown-900/30',
    textureClass: 'bg-[radial-gradient(circle_at_30%_30%,_#EFEBE9,_#A1887F)]'
  },
  [BeadType.RED_SANDALWOOD]: {
    type: BeadType.RED_SANDALWOOD,
    name: 'Rakta Chandan',
    description: 'Red Sandalwood. Used for Shakti sadhana.',
    color: 'bg-[#8D6E63]',
    textColor: 'text-red-950',
    shadowColor: 'shadow-red-900/40',
    textureClass: 'bg-[radial-gradient(circle_at_30%_30%,_#bcaaa4,_#5d4037)]'
  },
  [BeadType.KAMAL_GATTA]: {
    type: BeadType.KAMAL_GATTA,
    name: 'Kamal Gatta',
    description: 'Lotus seeds. Associated with Lakshmi.',
    color: 'bg-[#212121]', // Black
    textColor: 'text-gray-800',
    shadowColor: 'shadow-black/50',
    textureClass: 'bg-[radial-gradient(circle_at_30%_30%,_#424242,_#000000)]'
  }
};