import type { FilterPreset, BookFilters } from '@/types/books';

// Define the available filter presets
export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'recently-added',
    name: 'Recently Added',
    description: 'Most recently uploaded books',
    icon: 'Clock',
    filters: { 
      sortBy: 'created_at', 
      sortOrder: 'desc', 
      limit: 40 
    }
  },
  {
    id: 'classic-texts',
    name: 'Classic Texts',
    description: 'Books published before 1950',
    icon: 'BookMarked',
    filters: { 
      maxYear: 1950, 
      sortBy: 'year', 
      sortOrder: 'asc' 
    }
  },
  {
    id: 'modern-translations',
    name: 'Modern Translations',
    description: 'Books published after 2000',
    icon: 'Sparkles',
    filters: { 
      minYear: 2000, 
      sortBy: 'year', 
      sortOrder: 'desc' 
    }
  },
  {
    id: 'vedic-tradition',
    name: 'Vedic Tradition',
    description: 'Books from the Vedic and Hindu traditions',
    icon: 'Star',
    filters: { 
      traditions: ['Vedic', 'Hindu'], 
      sortBy: 'title', 
      sortOrder: 'asc' 
    }
  },
  {
    id: 'buddhist-texts',
    name: 'Buddhist Texts',
    description: 'Books from Buddhist traditions',
    icon: 'Star',
    filters: { 
      traditions: ['Buddhist', 'Zen', 'Tibetan'], 
      sortBy: 'title', 
      sortOrder: 'asc' 
    }
  },
  {
    id: 'yoga-meditation',
    name: 'Yoga & Meditation',
    description: 'Books on yoga and meditation practices',
    icon: 'Flame',
    filters: { 
      traditions: ['Yoga', 'Meditation'], 
      sortBy: 'created_at', 
      sortOrder: 'desc' 
    }
  }
];

// Helper function to get a preset by ID
export function getPresetById(id: string): FilterPreset | null {
  // Validate input
  if (!id || typeof id !== 'string') {
    return null;
  }
  
  return FILTER_PRESETS.find(preset => preset.id === id) || null;
}

// Helper function to apply a preset to current filters
export function applyPreset(presetId: string, currentFilters: BookFilters): BookFilters {
  // Validate inputs
  if (!presetId || typeof presetId !== 'string') {
    return currentFilters;
  }
  
  if (!currentFilters || typeof currentFilters !== 'object') {
    return {} as BookFilters;
  }
  
  const preset = getPresetById(presetId);
  if (!preset) return currentFilters;
  
  // Merge preset filters with current filters, but reset pagination
  const newFilters: BookFilters = {
    ...currentFilters,
    ...preset.filters,
    offset: 0, // Reset to first page
    preset: presetId // Track which preset is active
  };
  
  return newFilters;
}

// Helper function to clear preset from filters
export function clearPreset(filters: BookFilters): BookFilters {
  // Validate input
  if (!filters || typeof filters !== 'object') {
    return {} as BookFilters;
  }
  
  const { preset, ...rest } = filters;
  return rest as BookFilters;
}