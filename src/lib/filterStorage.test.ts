import { 
  loadSavedFilters, 
  saveSavedFilters, 
  addSavedFilter, 
  deleteSavedFilter, 
  updateLastUsed, 
  loadLastFilters, 
  saveLastFilters 
} from './filterStorage';
import type { SavedFilter, BookFilters } from '@/types/books';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('filterStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadSavedFilters', () => {
    it('should return an empty array when no saved filters exist', () => {
      const filters = loadSavedFilters();
      expect(filters).toEqual([]);
    });

    it('should return saved filters when they exist', () => {
      const mockFilters: SavedFilter[] = [{
        id: '1',
        name: 'Test Filter',
        filters: { search: 'test' },
        createdAt: '2023-01-01T00:00:00Z'
      }];
      
      localStorage.setItem('library-saved-filters', JSON.stringify(mockFilters));
      
      const filters = loadSavedFilters();
      expect(filters).toEqual(mockFilters);
    });

    it('should return an empty array when saved filters are invalid', () => {
      localStorage.setItem('library-saved-filters', 'invalid json');
      
      const filters = loadSavedFilters();
      expect(filters).toEqual([]);
    });
  });

  describe('saveSavedFilters', () => {
    it('should save filters to localStorage', () => {
      const filters: SavedFilter[] = [{
        id: '1',
        name: 'Test Filter',
        filters: { search: 'test' },
        createdAt: '2023-01-01T00:00:00Z'
      }];
      
      saveSavedFilters(filters);
      
      const saved = localStorage.getItem('library-saved-filters');
      expect(saved).toBe(JSON.stringify(filters));
    });
  });

  describe('addSavedFilter', () => {
    it('should add a new saved filter', () => {
      const filters: BookFilters = { search: 'test' };
      const savedFilter = addSavedFilter('Test Filter', filters);
      
      expect(savedFilter.id).toMatch(/^filter-/);
      expect(savedFilter.name).toBe('Test Filter');
      expect(savedFilter.filters).toEqual(filters);
      expect(savedFilter.createdAt).toBeTruthy();
      expect(savedFilter.lastUsed).toBeTruthy();
      // Check that createdAt and lastUsed are valid ISO date strings
      expect(new Date(savedFilter.createdAt).toString()).not.toBe('Invalid Date');
      expect(new Date(savedFilter.lastUsed).toString()).not.toBe('Invalid Date');
    });
  });

  describe('deleteSavedFilter', () => {
    it('should delete a saved filter by ID', () => {
      const filters: SavedFilter[] = [
        {
          id: '1',
          name: 'Test Filter 1',
          filters: { search: 'test1' },
          createdAt: '2023-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Test Filter 2',
          filters: { search: 'test2' },
          createdAt: '2023-01-01T00:00:00Z'
        }
      ];
      
      localStorage.setItem('library-saved-filters', JSON.stringify(filters));
      
      deleteSavedFilter('1');
      
      const savedFilters = loadSavedFilters();
      expect(savedFilters).toHaveLength(1);
      expect(savedFilters[0].id).toBe('2');
    });
  });

  describe('updateLastUsed', () => {
    it('should update the lastUsed timestamp for a filter', () => {
      const initialTime = '2023-01-01T00:00:00Z';
      const filters: SavedFilter[] = [
        {
          id: '1',
          name: 'Test Filter',
          filters: { search: 'test' },
          createdAt: initialTime,
          lastUsed: initialTime
        }
      ];
      
      localStorage.setItem('library-saved-filters', JSON.stringify(filters));
      
      updateLastUsed('1');
      
      const savedFilters = loadSavedFilters();
      // Check that lastUsed was updated to a valid date different from initial
      expect(savedFilters[0].lastUsed).toBeTruthy();
      expect(new Date(savedFilters[0].lastUsed).toString()).not.toBe('Invalid Date');
      // It should be different from the initial time
      expect(savedFilters[0].lastUsed).not.toBe(initialTime);
    });
  });

  describe('loadLastFilters', () => {
    it('should return null when no last filters exist', () => {
      const filters = loadLastFilters();
      expect(filters).toBeNull();
    });

    it('should return last filters when they exist', () => {
      const mockFilters: BookFilters = { search: 'test' };
      localStorage.setItem('library-last-filters', JSON.stringify(mockFilters));
      
      const filters = loadLastFilters();
      expect(filters).toEqual(mockFilters);
    });
  });

  describe('saveLastFilters', () => {
    it('should save last filters to localStorage', () => {
      const filters: BookFilters = { search: 'test' };
      saveLastFilters(filters);
      
      const saved = localStorage.getItem('library-last-filters');
      expect(saved).toBe(JSON.stringify(filters));
    });
  });
});