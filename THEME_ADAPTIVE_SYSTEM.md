# Theme-Adaptive Color System

## Overview

This document describes the comprehensive theme-adaptive color system implemented throughout the SadhanaBoard application. All UI components now automatically adapt their colors based on the currently active theme (default, earth, water, fire, shiva, bhairava, serenity, ganesha, mahakali, mystery, neon, lakshmi, tara, swamiji, cosmos, durga).

## Implementation Components

### 1. **useThemeColors Hook** (`src/hooks/useThemeColors.ts`)

A powerful hook that provides theme-aware color values and utilities:

```tsx
const { colors, classes, styles, scheme } = useThemeColors();

// Access raw HSL values
console.log(colors.primary); // "270 60% 50%"

// Use Tailwind utility classes
<div className={classes.primaryBg} />

// Use inline styles
<span style={styles.primary} />

// Check current theme
if (scheme === 'mahakali') { ... }
```

**Features:**
- Returns raw HSL color values for all theme colors
- Provides pre-built Tailwind utility classes
- Offers inline style objects
- Exposes current color scheme ID

### 2. **ThemeAwareIcon Component** (`src/components/ThemeAwareIcon.tsx`)

A wrapper component for Lucide React icons that automatically applies theme colors:

```tsx
import { ThemeAwareIcon } from '@/components/ThemeAwareIcon';
import { Star, CheckCircle } from 'lucide-react';

// Basic usage
<ThemeAwareIcon icon={Star} size="lg" />

// With custom className
<ThemeAwareIcon icon={CheckCircle} className="h-6 w-6" />

// Override with custom color
<ThemeAwareIcon icon={Settings} color="red" />

// HOC pattern
const ThemedStar = withThemeColor(Star);
<ThemedStar className="h-6 w-6" />
```

**Props:**
- `icon`: Lucide icon component
- `size`: Preset sizes ('sm', 'md', 'lg', 'xl')
- `useThemeColor`: Auto-apply theme color (default: true)
- `color`: Custom color override

### 3. **Theme Utility CSS Classes** (`src/styles/theme-utilities.css`)

A comprehensive set of utility classes for theme-aware styling:

#### Text Colors
```css
.text-theme-primary     /* Primary text color */
.text-theme-secondary   /* Secondary text color */
.text-theme-accent      /* Accent text color */
.text-theme-muted       /* Muted text color */
```

#### Background Colors
```css
.bg-theme-primary       /* Primary background */
.bg-theme-primary-soft  /* Primary with 10% opacity */
.bg-theme-secondary     /* Secondary background */
.bg-theme-accent        /* Accent background */
```

#### Border Colors
```css
.border-theme-primary      /* Primary border */
.border-theme-primary-soft /* Primary border with 20% opacity */
.border-theme-default      /* Default border color */
```

#### Special Effects
```css
.shadow-theme-primary      /* Primary colored shadow */
.glow-theme-primary        /* Primary colored glow */
.bg-gradient-theme-primary /* Primary gradient background */
.bg-gradient-theme-mixed   /* Mixed primary/accent gradient */
```

#### Interactive States
```css
.hover-theme-primary:hover /* Primary hover background */
.hover-theme-lift:hover    /* Lift effect with shadow */
.transition-theme          /* Smooth theme transitions */
```

#### Components
```css
.card-theme                /* Theme-aware card */
.card-theme-highlight      /* Highlighted card with primary border */
.badge-theme-primary       /* Primary themed badge */
.spinner-theme-primary     /* Primary colored spinner */
.input-theme               /* Theme-aware input */
.btn-theme-primary         /* Primary themed button */
```

## Best Practices

### ✅ DO: Use Theme-Aware Approaches

```tsx
// ✅ Use Tailwind theme classes
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Submit
</button>

// ✅ Use utility classes from theme-utilities.css
<div className="bg-theme-primary-soft border border-theme-primary-soft">
  Content
</div>

// ✅ Use useThemeColors hook for custom styling
const { colors } = useThemeColors();
<div style={{ borderLeft: `3px solid hsl(${colors.primary})` }}>
  Content
</div>

// ✅ Use ThemeAwareIcon for icons
<ThemeAwareIcon icon={Star} size="lg" />

// ✅ Use existing UI components (already theme-aware)
<Button variant="default">Action</Button>
<Badge variant="default">Status</Badge>
```

### ❌ DON'T: Use Hardcoded Colors

```tsx
// ❌ Don't use hardcoded Tailwind colors
<button className="bg-purple-500 text-white">
  Submit
</button>

// ❌ Don't use hardcoded hex values
<div style={{ backgroundColor: '#8b5cf6' }}>
  Content
</div>

// ❌ Don't use hardcoded color names in icons
<Star className="text-purple-500" />
```

## Component Examples

### Example 1: Theme-Aware Card

```tsx
import { useThemeColors } from '@/hooks/useThemeColors';

const MyCard = () => {
  const { classes } = useThemeColors();
  
  return (
    <div className="card-theme p-6 rounded-lg">
      <h3 className={`text-xl font-semibold ${classes.primaryText}`}>
        Title
      </h3>
      <p className="text-foreground">Content</p>
    </div>
  );
};
```

### Example 2: Theme-Aware Button with Icon

```tsx
import { ThemeAwareIcon } from '@/components/ThemeAwareIcon';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AddButton = () => (
  <Button variant="default" className="gap-2">
    <ThemeAwareIcon icon={Plus} size="sm" />
    Add Item
  </Button>
);
```

### Example 3: Theme-Aware Loading Spinner

```tsx
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);
```

### Example 4: Theme-Aware Container

```tsx
const Container = ({ children }) => (
  <div className="bg-theme-primary-soft border border-theme-primary-soft rounded-lg p-4 hover-theme-primary transition-theme">
    {children}
  </div>
);
```

## Updated Components

The following components have been updated to use theme-adaptive colors:

### Core Components
- ✅ `App.tsx` - Loading spinners now use `border-primary`
- ✅ `Layout.tsx` - Loading spinner uses theme colors
- ✅ `AddSadhana.tsx` - All purple hardcoded colors replaced with theme colors
- ✅ `ChakraVisualization.tsx` - UI elements (not chakra colors) use theme colors

### UI Components (Already Theme-Aware)
- ✅ `Button` - Uses `bg-primary`, `bg-secondary`, etc.
- ✅ `Badge` - Uses theme color variants
- ✅ `Card` - Uses `bg-card` and `border-border`
- ✅ All Radix UI components - Properly themed via CSS variables

## Theme Color Tokens

All themes include these standardized color tokens:

```typescript
{
  background: string;           // Main background
  foreground: string;           // Main text color
  card: string;                 // Card background
  cardForeground: string;       // Card text
  primary: string;              // Primary brand color
  primaryForeground: string;    // Text on primary
  secondary: string;            // Secondary color
  secondaryForeground: string;  // Text on secondary
  accent: string;               // Accent color
  accentForeground: string;     // Text on accent
  muted: string;                // Muted background
  mutedForeground: string;      // Muted text
  border: string;               // Border color
  input: string;                // Input background
  ring: string;                 // Focus ring color
  destructive: string;          // Error/delete color
  destructiveForeground: string; // Text on destructive
}
```

## Migration Guide

To migrate existing components to use theme-adaptive colors:

### Step 1: Identify Hardcoded Colors

```bash
# Search for hardcoded purple colors
grep -r "purple-[0-9]" src/

# Search for hardcoded hex colors
grep -r "#[0-9a-fA-F]\{6\}" src/
```

### Step 2: Replace with Theme-Aware Alternatives

| Old (Hardcoded) | New (Theme-Aware) |
|----------------|-------------------|
| `bg-purple-500` | `bg-primary` |
| `text-purple-600` | `text-primary` |
| `border-purple-500` | `border-primary` |
| `bg-purple-500/10` | `bg-primary/10` or `bg-theme-primary-soft` |
| `hover:bg-purple-500/20` | `hover:bg-primary/20` or `hover-theme-primary` |
| `text-purple-300` | `text-primary` |

### Step 3: Update Icons

```tsx
// Before
<Star className="text-purple-500" />

// After - Option 1
<ThemeAwareIcon icon={Star} size="md" />

// After - Option 2
<Star className="text-primary" />

// After - Option 3
<Star className="icon-theme-primary" />
```

### Step 4: Test Across All Themes

Navigate to Settings → Appearance and test your component with all available themes to ensure proper color adaptation.

## Theming Architecture

```
┌─────────────────────────────────────────┐
│  Theme Registry (src/themes/index.ts)   │
│  - Loads all theme definitions          │
│  - Validates theme structure            │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  ThemeProvider (src/components/)        │
│  - Applies theme CSS variables          │
│  - Manages theme transitions            │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  CSS Custom Properties (:root)          │
│  --primary, --secondary, --accent, etc. │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
┌──────────────────┐  ┌────────────────┐
│  Tailwind CSS    │  │  Utility CSS   │
│  bg-primary      │  │  .bg-theme-*   │
│  text-primary    │  │  .text-theme-* │
└──────────────────┘  └────────────────┘
```

## Performance Considerations

- **CSS Variables**: Theme colors use CSS custom properties, enabling instant updates without re-renders
- **Memoization**: `useThemeColors` hook uses `useMemo` to prevent unnecessary recalculations
- **Class-based**: Most styling uses classes rather than inline styles for better performance
- **Transition Smoothing**: Theme changes include smooth transitions (300ms) for better UX

## Accessibility

All theme-aware components maintain:
- ✅ WCAG AA contrast ratios
- ✅ Proper focus states using `ring` color
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ High contrast mode support

## Future Enhancements

- [ ] Custom theme creator UI
- [ ] Theme preview before applying
- [ ] Export/import custom themes
- [ ] Per-component theme overrides
- [ ] Automatic dark/light mode variants
- [ ] Theme animation preferences

## Troubleshooting

### Colors Not Updating
1. Check if `ThemeProvider` is wrapping your component
2. Verify theme CSS variables are loaded
3. Ensure you're using theme-aware classes (`bg-primary` not `bg-purple-500`)

### Wrong Colors Displayed
1. Clear browser cache
2. Check localStorage for `sadhanaSettings`
3. Verify theme definition in theme registry
4. Inspect CSS custom properties in DevTools

### Icons Not Theme-Colored
1. Use `ThemeAwareIcon` component
2. Or use `text-primary` class
3. Or use `icon-theme-primary` utility class

## Resources

- **Hook Documentation**: `/src/hooks/useThemeColors.ts`
- **Component Examples**: `/src/components/examples/ThemeAwareExamples.tsx`
- **Utility Classes**: `/src/styles/theme-utilities.css`
- **Theme Definitions**: `/src/themes/*/colors.ts`
- **Theme Provider**: `/src/components/ThemeProvider.tsx`

## Support

For questions or issues with the theme system:
1. Check this documentation
2. Review example components
3. Inspect theme definitions in `/src/themes/`
4. Test with different themes in Settings
