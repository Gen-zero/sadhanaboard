# Loading States System

A comprehensive, consistent loading state management system for the SadhanaBoard application.

## 🏗️ Architecture Overview

The loading system provides a global state management solution with standardized components and animations for all loading interactions across the application.

## 🎯 **FIXED Issues from Incomplete_and_missing.md:**

### ✅ **Standardized Loading States**
- Global loading state management with React Context
- Consistent loading patterns across all components
- Type-safe loading keys for better maintainability

### ✅ **Comprehensive Skeleton Loaders**
- Data-heavy component skeletons (Card, List, Table, Page)
- Responsive skeleton components
- Animated and static skeleton variants

### ✅ **Consistent Loading Animations**
- 6 different spinner variants (default, spiritual, cosmic, dots, pulse, bars)
- Hardware-accelerated CSS animations
- Reduced motion support for accessibility

### ✅ **Global Loading State Management**
- Centralized loading state provider
- Automatic loading state cleanup
- Parallel loading state support

## 📦 Components

### Core Loading Components

#### `LoadingSpinner`
Multi-variant loading spinner with spiritual themes:
```typescript
<LoadingSpinner 
  size="lg" 
  variant="spiritual" 
  color="hsl(var(--primary))" 
/>
```

**Variants:**
- `default` - Standard rotating spinner
- `spiritual` - Sparkles with rotation
- `cosmic` - Dual-ring cosmic animation
- `dots` - Animated dots sequence
- `pulse` - Pulsing circle
- `bars` - Animated bars

#### `Skeleton`
Flexible skeleton loader for content placeholders:
```typescript
<Skeleton 
  lines={3} 
  variant="rounded" 
  animated={true} 
/>
```

#### `LoadingButton`
Button with integrated loading state:
```typescript
<LoadingButton
  loading={isLoading}
  loadingText="Saving..."
  onClick={handleSave}
>
  Save Changes
</LoadingButton>
```

#### `LoadingOverlay`
Full-screen loading overlay:
```typescript
<LoadingOverlay
  isVisible={showLoading}
  message="Processing your spiritual journey..."
  variant="spiritual"
/>
```

### Specialized Skeletons

#### `CardSkeleton`
Pre-built skeleton for card layouts:
```typescript
<CardSkeleton className="w-full" />
```

#### `ListSkeleton`
Skeleton for list items:
```typescript
<ListSkeleton items={5} />
```

#### `TableSkeleton`
Skeleton for table data:
```typescript
<TableSkeleton rows={5} columns={4} />
```

#### `PageSkeleton`
Full page skeleton for initial loads:
```typescript
<PageSkeleton />
```

### Form Components with Loading

#### `LoadingInput`
Input with validation and loading states:
```typescript
<LoadingInput
  label="Email"
  onValidate={validateEmail}
  loading={isValidating}
  error={validationError}
  success="Email is valid"
/>
```

#### `LoadingTextarea`
Textarea with character count and loading:
```typescript
<LoadingTextarea
  label="Description"
  maxLength={500}
  showCharCount
  loading={isSaving}
/>
```

#### `LoadingFileUpload`
File upload with progress and drag-drop:
```typescript
<LoadingFileUpload
  label="Upload Files"
  accept="image/*"
  onUpload={handleUpload}
  progress={uploadProgress}
  loading={isUploading}
/>
```

#### `LoadingForm`
Complete form wrapper with loading states:
```typescript
<LoadingForm
  title="User Profile"
  onSubmit={handleSubmit}
  submitText="Save Profile"
>
  <FormField label="Name" required>
    <LoadingInput name="name" />
  </FormField>
</LoadingForm>
```

## 🎣 Hooks

### `useLoadingState()`
Global loading state management:
```typescript
const { setLoading, isLoading, isAnyLoading, withLoading } = useLoadingState();

// Set loading state
setLoading(LOADING_KEYS.DASHBOARD_LOAD, true);

// Check loading state
const isDashboardLoading = isLoading(LOADING_KEYS.DASHBOARD_LOAD);

// Wrap async function with loading
const loadData = withLoading(LOADING_KEYS.DATA_LOAD, async () => {
  const data = await fetchData();
  return data;
});
```

### `useLoading(key)`
Scoped loading hook for specific operations:
```typescript
const { loading, setLoading, withLoading } = useLoading(LOADING_KEYS.SADHANA_SAVE);

const saveSadhana = withLoading(async (data) => {
  await api.saveSadhana(data);
});
```

### `useAsyncOperation(key, asyncFn)`
Complete async operation with loading, error, and data state:
```typescript
const { loading, error, data, execute } = useAsyncOperation(
  LOADING_KEYS.USER_PROFILE,
  fetchUserProfile
);

// Execute the operation
await execute(userId);
```

## 🎨 Styling System

### CSS Classes
All components use consistent CSS classes from `loading.css`:

```css
/* Loading animations */
.loading-spin { animation: spin 1s linear infinite; }
.loading-pulse { animation: pulse 2s ease-in-out infinite; }
.loading-fade-in { animation: fade-in 0.3s ease-out forwards; }

/* Skeleton styles */
.skeleton { /* Animated shimmer effect */ }
.skeleton-static { /* Static placeholder */ }
.skeleton-rounded { border-radius: 0.375rem; }
.skeleton-circular { border-radius: 50%; }

/* Responsive adjustments */
@media (max-width: 768px) {
  .skeleton { animation-duration: 1s; }
}

/* Accessibility support */
@media (prefers-reduced-motion: reduce) {
  .loading-spin, .skeleton { animation: none; }
}
```

### Spiritual Theme Integration
Loading components inherit theme colors and spiritual aesthetics:
```typescript
// Spiritual loading spinner
<LoadingSpinner variant="spiritual" />

// Cosmic overlay
<LoadingOverlay variant="cosmic" />
```

## 🗝️ Loading Keys

Centralized loading keys for consistency:
```typescript
export const LOADING_KEYS = {
  // Global app states
  APP_INIT: 'app_init',
  AUTH: 'auth',
  THEME_LOAD: 'theme_load',
  
  // Dashboard states
  DASHBOARD_LOAD: 'dashboard_load',
  PROFILE_LOAD: 'profile_load',
  TASKS_LOAD: 'tasks_load',
  STATS_LOAD: 'stats_load',
  
  // Sadhana states
  SADHANA_LOAD: 'sadhana_load',
  SADHANA_SAVE: 'sadhana_save',
  SADHANA_DELETE: 'sadhana_delete',
  SADHANA_COMPLETE: 'sadhana_complete',
  
  // ... more keys
} as const;
```

## 🚀 Usage Examples

### Basic Loading States
```typescript
import { useLoadingState, LOADING_KEYS, LoadingButton } from '@/components/loading';

function MyComponent() {
  const { isLoading, withLoading } = useLoadingState();
  
  const handleSave = withLoading(LOADING_KEYS.SADHANA_SAVE, async () => {
    await saveSadhana(data);
  });
  
  return (
    <LoadingButton
      loading={isLoading(LOADING_KEYS.SADHANA_SAVE)}
      onClick={handleSave}
    >
      Save Sadhana
    </LoadingButton>
  );
}
```

### Dashboard with Loading States
```typescript
import { CardSkeleton, ListSkeleton, LoadingOverlay } from '@/components/loading';

function Dashboard() {
  const { isLoading } = useLoadingState();
  const isDashboardLoading = isLoading(LOADING_KEYS.DASHBOARD_LOAD);
  
  if (isDashboardLoading) {
    return (
      <LoadingOverlay
        isVisible={true}
        message="Loading your spiritual dashboard..."
        variant="spiritual"
      />
    );
  }
  
  return (
    <div>
      {isTasksLoading ? (
        <ListSkeleton items={5} />
      ) : (
        <TaskList tasks={tasks} />
      )}
    </div>
  );
}
```

### Form with Validation
```typescript
import { LoadingForm, LoadingInput, FormField } from '@/components/loading';

function UserForm() {
  const validateEmail = async (email: string) => {
    const response = await checkEmailAvailability(email);
    return response.available;
  };
  
  return (
    <LoadingForm
      title="User Registration"
      onSubmit={handleSubmit}
    >
      <FormField label="Email" required>
        <LoadingInput
          name="email"
          type="email"
          onValidate={validateEmail}
        />
      </FormField>
    </LoadingForm>
  );
}
```

## 🧪 Testing

Use the comprehensive loading demo component to test all states:
```typescript
import LoadingDemo from '@/components/loading/LoadingDemo';

// Add to your dev routes
<Route path="/loading-demo" element={<LoadingDemo />} />
```

The demo includes:
- All spinner variants and sizes
- Skeleton components
- Loading buttons
- Form components with validation
- File upload with progress
- Global loading state management
- Loading overlays and indicators

## ♿ Accessibility

The loading system includes comprehensive accessibility features:

- **Screen Reader Support**: ARIA labels and live regions
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **High Contrast**: Supports `prefers-contrast: high`
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus Management**: Proper focus handling during loading states

## 📱 Mobile Optimization

- Touch-friendly loading buttons (44px minimum)
- Reduced animation duration on mobile
- Optimized skeleton loading for mobile layouts
- Battery-aware loading states

## 🎯 Performance

- **Lightweight**: Minimal bundle impact with tree-shaking
- **Hardware Accelerated**: CSS animations use GPU acceleration
- **Memory Efficient**: Automatic cleanup of loading states
- **Debounced Validation**: Smart validation timing to reduce API calls

## 🔧 Configuration

The loading system is highly configurable:

```typescript
// Custom loading provider configuration
<LoadingProvider>
  <App />
</LoadingProvider>

// Custom animation durations
<LoadingSpinner 
  className="duration-500" // Custom duration
  style={{ animationDuration: '2s' }} // Inline override
/>

// Custom skeleton shimmer colors
<Skeleton 
  className="bg-gradient-to-r from-purple-100 to-purple-200" 
/>
```

This comprehensive loading system ensures consistent, accessible, and performant loading states throughout the entire SadhanaBoard application, addressing all the inconsistencies mentioned in the requirements.