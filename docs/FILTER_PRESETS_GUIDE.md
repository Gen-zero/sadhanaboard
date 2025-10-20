# Library Filter Presets and Saved Filters Guide

This guide explains how to use the new filter presets and saved filters functionality in the SadhanaBoard library.

## Filter Presets

Filter presets are predefined filter combinations that allow you to quickly apply common filter scenarios. The following presets are available:

1. **Recently Added** - Shows the most recently uploaded books
2. **Classic Texts** - Books published before 1950
3. **Modern Translations** - Books published after 2000
4. **Vedic Tradition** - Books from the Vedic and Hindu traditions
5. **Buddhist Texts** - Books from Buddhist traditions
6. **Yoga & Meditation** - Books on yoga and meditation practices

### Using Filter Presets

1. Navigate to the Library section
2. In the filter area, you'll see a row of preset buttons
3. Click any preset button to apply that filter combination
4. The preset will be highlighted to indicate it's active
5. To remove a preset, click the "Clear All" button or manually adjust filters

## Saved Filters

Saved filters allow you to save your custom filter configurations and restore them later.

### Saving Filters

1. Apply any combination of filters you want to save
2. Click the "Save Filters" button that appears next to the presets
3. Enter a name for your filter configuration
4. Click "Save"
5. Your filter will now appear in the "Saved Filters" section

### Using Saved Filters

1. In the "Saved Filters" section, you'll see all your saved filter configurations
2. Click any saved filter to apply it
3. The filters will be applied to the library view

### Deleting Saved Filters

1. In the "Saved Filters" section, each saved filter has a delete button (X icon)
2. Click the delete button to remove a saved filter
3. A confirmation toast will appear when the filter is deleted

## Filter Persistence

The library automatically remembers your last used filters. When you return to the library:
- Your previous filter configuration will be restored
- Pagination position will be maintained
- Search terms will be preserved

This works across browser sessions as long as you don't clear your browser's localStorage.

## Technical Implementation

### Files Modified

1. **src/types/books.ts** - Added `FilterPreset` and `SavedFilter` interfaces
2. **src/lib/filterPresets.ts** - Contains preset definitions and helper functions
3. **src/lib/filterStorage.ts** - Handles localStorage operations for saved filters
4. **src/components/library/AdvancedFilters.tsx** - UI for presets and saved filters
5. **src/components/library/SearchBar.tsx** - Enhanced keyboard navigation for suggestions
6. **src/components/library/FilterChips.tsx** - Improved visual design and "Clear All" button
7. **src/components/library/LibraryContainer.tsx** - Integration of all features

### Key Features

- **LocalStorage Integration** - All saved filters are stored in browser localStorage
- **Keyboard Navigation** - Search suggestions now support arrow keys and Enter
- **Responsive Design** - Works well on both desktop and mobile devices
- **Visual Feedback** - Toast notifications for all user actions
- **Performance Optimized** - Saved filters are limited to prevent localStorage bloat

### Customizing Presets

To add new filter presets:
1. Edit `src/lib/filterPresets.ts`
2. Add a new entry to the `FILTER_PRESETS` array
3. Define the filter configuration in the `filters` property
4. The preset will automatically appear in the UI

Each preset supports:
- `id` - Unique identifier
- `name` - Display name
- `description` - Brief description
- `icon` - Optional icon name (from lucide-react)
- `filters` - The filter configuration to apply

### Storage Limits

- Maximum of 10 saved filters per user
- Filters are stored in localStorage with keys:
  - `library-saved-filters` - Saved filter configurations
  - `library-last-filters` - Last used filter configuration