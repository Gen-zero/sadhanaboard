# Theme System Documentation

## Overview
The theme system in this application provides a flexible way to customize the appearance and behavior of the UI. Each theme can define colors, backgrounds, icons, and custom styling.

## Theme Structure

### Core Components
Each theme consists of several key components:

1. **Color Definitions** - HSL color values for UI elements
2. **Theme Metadata** - Information about the theme (name, deity, category)
3. **Assets** - Icons, images, and CSS files
4. **Background Component** - Optional React component for custom backgrounds
5. **Theme Registration** - Integration into the central theme registry

## Example: Vishnu Theme

### Color Definitions (`src/themes/vishnu/colors.ts`)
```typescript
const colors: ThemeColors = {
  background: '240 100% 6%',       // Deep cosmic blue
  foreground: '210 100% 96%',      // Light blue-white
  primary: '240 100% 50%',         // Deep blue
  // ... other color definitions
};
```

### Theme Definition (`src/themes/vishnu/index.ts`)
```typescript
const vishnuTheme: ThemeDefinition = {
  metadata: {
    id: 'vishnu',
    name: 'Lord Vishnu',
    deity: 'Lord Vishnu (The Preserver)',
    category: 'color-scheme',
    icon: '/themes/vishnu/assets/Bhagwan_Vishnu.png',
    gradient: 'from-blue-900 via-blue-700 to-teal-800'
  },
  colors, // Imported from colors.ts
  assets: { 
    icon: '/themes/vishnu/assets/Bhagwan_Vishnu.png',
    css: '/themes/vishnu/vishnu.css'
  },
  BackgroundComponent: VishnuBackground, // Imported component
  available: true
};
```

### Background Component (`src/themes/vishnu/VishnuBackground.tsx`)
A React component that renders:
- Background image with gradients
- Floating animated particles
- Custom styling specific to the Vishnu theme

### Theme-Specific CSS (`src/themes/vishnu/vishnu.css`)
Contains CSS classes like:
- `.vishnu-card`, `.vishnu-button`, `.vishnu-text-glow`
- Animations like `@keyframes vishnu-pulse`
- Custom styling utilities for the theme

### Global Theme Variables (`src/styles/theme.css`)
Defines CSS custom properties for each theme:
```css
.theme-vishnu {
  --background: 240 100% 6%;
  --foreground: 210 100% 96%;
  --primary: 240 100% 50%;
  /* ... other variables */
  --vishnu-blue-glow: 0 0 25px hsla(var(--primary), 0.5);
}
```

## Theme Application Process

### Theme Provider (`src/components/ThemeProvider.tsx`)
1. Watches for theme changes in user settings
2. When theme changes:
   - Adds `theme-{themeId}` class to body
   - Calls `themeUtils.applyThemeColors()` to set CSS variables
   - Calls `themeUtils.applyThemeCSS()` to load theme-specific CSS

### Theme Utilities (`src/themes/utils.tsx`)
- `applyThemeColors()`: Converts theme colors to CSS custom properties
- `applyThemeCSS()`: Dynamically loads theme-specific CSS files
- `renderThemeIcon()`: Renders theme icons

### Background System (`src/components/ThemedBackground.tsx`)
1. Checks if theme has a custom `BackgroundComponent`
2. If yes: Renders that component (e.g., VishnuBackground)
3. If no: Uses canvas-based rendering with theme-specific patterns

### App Integration (`src/App.tsx`)
1. Determines background theme based on settings
2. Renders `<ThemedBackground theme={backgroundTheme} />`
3. Wraps app content in `<ThemeProvider settings={settings}>`

## How Themes Work Together

When a user selects the "Vishnu" theme:

1. **Settings Update**: User's appearance.colorScheme becomes 'vishnu'

2. **ThemeProvider Response**:
   - Adds `theme-vishnu` class to body
   - Applies CSS variables from `src/styles/theme.css`
   - Loads `/themes/vishnu/vishnu.css`

3. **Background System**:
   - ThemedBackground receives theme="vishnu"
   - Finds VishnuBackground component in theme registry
   - Renders `<VishnuBackground />` instead of canvas

4. **UI Styling**:
   - Components use Tailwind classes like `bg-primary`, `text-foreground`
   - These map to CSS variables set by ThemeProvider
   - Theme-specific classes like `vishnu-card` from vishnu.css are available

5. **Dynamic Elements**:
   - VishnuBackground renders animated particles
   - Theme-specific CSS provides animations and effects
   - Icons are loaded from `/themes/vishnu/assets/`

This system allows each theme to define its appearance through multiple layers:
- Color variables for consistent UI
- Custom CSS for unique styling
- Background components for animated visuals
- Asset files for imagery