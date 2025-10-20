import type { SavedFilter, BookFilters } from '@/types/books';

// Constants
const SAVED_FILTERS_KEY = 'library-saved-filters';
const LAST_FILTERS_KEY = 'library-last-filters';
const MAX_SAVED_FILTERS = 10;

// Load saved filters from localStorage
export function loadSavedFilters(): SavedFilter[] {
  try {
    const saved = localStorage.getItem(SAVED_FILTERS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate that parsed data is an array
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading saved filters:', error);
  }
  return [];
}

// Save filters to localStorage
export function saveSavedFilters(filters: SavedFilter[]): void {
  try {
    // Validate that filters is an array
    if (!Array.isArray(filters)) {
      throw new Error('Filters must be an array');
    }
    localStorage.setItem(SAVED_FILTERS_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Error saving filters:', error);
  }
}

// Add a new saved filter
export function addSavedFilter(name: string, filters: BookFilters): SavedFilter {
  // Validate inputs
  if (!name || typeof name !== 'string') {
    throw new Error('Name must be a non-empty string');
  }
  
  if (!filters || typeof filters !== 'object') {
    throw new Error('Filters must be an object');
  }
  
  const savedFilters = loadSavedFilters();
  
  // Create new saved filter object
  const newFilter: SavedFilter = {
    id: `filter-${Date.now()}`,
    name,
    filters,
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString()
  };
  
  // Add to array (limit to MAX_SAVED_FILTERS)
  const updatedFilters = [newFilter, ...savedFilters].slice(0, MAX_SAVED_FILTERS);
  
  // Save back to localStorage
  saveSavedFilters(updatedFilters);
  
  return newFilter;
}

// Delete a saved filter by ID
export function deleteSavedFilter(id: string): void {
  // Validate input
  if (!id || typeof id !== 'string') {
    console.warn('Invalid ID provided to deleteSavedFilter');
    return;
  }
  
  const savedFilters = loadSavedFilters();
  const updatedFilters = savedFilters.filter(filter => filter.id !== id);
  saveSavedFilters(updatedFilters);
}

// Update last used timestamp for a saved filter
export function updateLastUsed(id: string): void {
  // Validate input
  if (!id || typeof id !== 'string') {
    console.warn('Invalid ID provided to updateLastUsed');
    return;
  }
  
  const savedFilters = loadSavedFilters();
  const updatedFilters = savedFilters.map(filter => 
    filter.id === id 
      ? { ...filter, lastUsed: new Date().toISOString() } 
      : filter
  );
  saveSavedFilters(updatedFilters);
}

// Load last used filters from localStorage
export function loadLastFilters(): BookFilters | null {
  try {
    const saved = localStorage.getItem(LAST_FILTERS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate that parsed data is an object
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading last filters:', error);
  }
  return null;
}

// Save last used filters to localStorage
export function saveLastFilters(filters: BookFilters): void {
  try {
    // Validate that filters is an object
    if (!filters || typeof filters !== 'object') {
      throw new Error('Filters must be an object');
    }
    localStorage.setItem(LAST_FILTERS_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Error saving last filters:', error);
  }
}