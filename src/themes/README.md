# Themes

This directory contains all the themes available in the SadhanaBoard application.

## Available Themes

1. **Default Theme** - The base theme for the application
2. **Shiva Theme** - Inspired by Lord Shiva
3. **Mahakali Theme** - Inspired by Goddess Mahakali
4. **Mystery Theme** - A mysterious dark theme
5. **Earth Theme** - Earthy brown and green tones
6. **Water Theme** - Calming blue water tones
7. **Fire Theme** - Passionate red and orange tones
8. **Bhairava Theme** - Inspired by Lord Bhairava
9. **Serenity Theme** - Calming and peaceful theme
10. **Ganesha Theme** - Inspired by Lord Ganesha
11. **Neon Theme** - Modern neon colors
12. **Lakshmi Theme** - Premium golden theme inspired by Goddess Lakshmi - Abundance, prosperity, and divine feminine energy
13. **Mystical Forest Theme** - Immerse yourself in the ancient wisdom of the enchanted woods
14. **Tara Theme** - Sacred Tara Mahavidya - The Liberator who guides across the ocean of samsara
15. **Vishnu Theme** - Sacred Vishnu theme - The Preserver who maintains cosmic order
16. **Krishna Theme** - Sacred Krishna theme - The Divine Cowherd who plays the flute of love and wisdom
17. **Swamiji Theme** - Experience the divine wisdom and spiritual teachings of enlightened masters

## Adding New Themes

To add a new theme:

1. Create a new directory in this folder with the theme name
2. Create the following files in the theme directory:
   - `index.ts` - Main theme definition
   - `colors.ts` - Color definitions
   - `BackgroundComponent.tsx` (optional) - Animated background component
   - `README.md` - Theme documentation
   - `assets/` - Directory for theme assets (icons, logos, etc.)
3. Add the theme to the `RAW_THEME_REGISTRY` array in `index.ts`
4. Ensure all required fields are filled in the theme definition

### Asset Structure

All themes must follow the standardized asset structure:
- All theme-specific assets must be placed in the `assets/` directory
- Assets are automatically copied to the public directory during the build process
- Reference assets using the path format: `/themes/[theme-name]/assets/[asset-file]`
- See the Lakshmi and Mystical Forest themes for examples of proper asset organization

## Theme Structure

Each theme must export a `ThemeDefinition` object with the following properties:

- `metadata` - Theme information (id, name, description, deity, category, etc.)
- `colors` - Color definitions for all UI elements
- `assets` (optional) - Paths to theme assets
- `BackgroundComponent` (optional) - React component for animated backgrounds
- `available` - Whether the theme is available for use
- `createdAt` - Theme creation date

## Color Definitions

All themes must define the following colors:

- `background` - Main background color
- `foreground` - Main text color
- `card` - Card background color
- `cardForeground` - Card text color
- `popover` - Popover background color
- `popoverForeground` - Popover text color
- `primary` - Primary action color
- `primaryForeground` - Primary action text color
- `secondary` - Secondary action color
- `secondaryForeground` - Secondary action text color
- `muted` - Muted background color
- `mutedForeground` - Muted text color
- `accent` - Accent color
- `accentForeground` - Accent text color
- `destructive` - Destructive action color (e.g., delete)
- `destructiveForeground` - Destructive action text color
- `border` - Border color
- `input` - Input field background color
- `ring` - Focus ring color

## Theme Categories

Themes can belong to one of the following categories:

- `landing` - Themes specifically for landing pages
- `color-scheme` - General color scheme themes
- `hybrid` - Themes that combine multiple elements

## Validation

All themes are validated when the application starts. Themes that fail validation will be skipped and logged to the console.