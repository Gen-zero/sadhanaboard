import { FILTER_PRESETS, getPresetById, applyPreset, clearPreset } from './filterPresets';
import type { BookFilters } from '@/types/books';

describe('filterPresets', () => {
  describe('getPresetById', () => {
    it('should return the correct preset when given a valid ID', () => {
      const preset = getPresetById('recently-added');
      expect(preset).toBeDefined();
      expect(preset?.id).toBe('recently-added');
      expect(preset?.name).toBe('Recently Added');
    });

    it('should return null for an invalid ID', () => {
      const preset = getPresetById('invalid-id');
      expect(preset).toBeNull();
    });
  });

  describe('applyPreset', () => {
    it('should apply preset filters to current filters', () => {
      const currentFilters: BookFilters = {
        search: 'test',
        limit: 20,
        offset: 10
      };
      
      const newFilters = applyPreset('recently-added', currentFilters);
      
      // Should preserve existing filters not in preset
      expect(newFilters.search).toBe('test');
      
      // Should apply preset filters
      expect(newFilters.sortBy).toBe('created_at');
      expect(newFilters.sortOrder).toBe('desc');
      expect(newFilters.limit).toBe(40); // Preset value
      
      // Should reset offset to 0
      expect(newFilters.offset).toBe(0);
      
      // Should track which preset is active
      expect(newFilters.preset).toBe('recently-added');
    });

    it('should return original filters for invalid preset ID', () => {
      const currentFilters: BookFilters = { search: 'test' };
      const newFilters = applyPreset('invalid-id', currentFilters);
      expect(newFilters).toEqual(currentFilters);
    });
  });

  describe('clearPreset', () => {
    it('should remove preset tracking from filters', () => {
      const filtersWithPreset: BookFilters = {
        search: 'test',
        preset: 'recently-added'
      } as BookFilters;
      
      const clearedFilters = clearPreset(filtersWithPreset);
      
      // Should preserve other filters
      expect(clearedFilters.search).toBe('test');
      
      // Should remove preset tracking
      expect((clearedFilters as any).preset).toBeUndefined();
    });
  });

  describe('FILTER_PRESETS', () => {
    it('should contain all expected presets', () => {
      const expectedIds = [
        'recently-added',
        'classic-texts',
        'modern-translations',
        'vedic-tradition',
        'buddhist-texts',
        'yoga-meditation'
      ];
      
      expectedIds.forEach(id => {
        const preset = FILTER_PRESETS.find(p => p.id === id);
        expect(preset).toBeDefined();
        expect(preset?.name).toBeTruthy();
        expect(preset?.description).toBeTruthy();
      });
    });
  });
});