# Help System Components

This directory contains all components related to the SaadhanaBoard help system, designed to assist new joiners and provide contextual help throughout the application.

## Components Overview

### 1. HelpContext.tsx
The central context provider that manages the entire help system state:
- Tooltip visibility
- Onboarding state
- Feature discovery
- User preferences
- Help topic registry

### 2. EnhancedTooltip.tsx
A versatile tooltip component with multiple variants:
- **Default**: Standard tooltip
- **Help**: Blue-themed help tooltip
- **Info**: Purple-themed informational tooltip
- **Discovery**: Yellow-themed feature discovery tooltip

### 3. HelpModal.tsx
A comprehensive help center modal with:
- Search functionality
- Category filtering
- Detailed topic views
- Pro tips for each feature

### 4. OnboardingTooltip.tsx
Interactive step-by-step onboarding tooltips:
- Element highlighting
- Progress tracking
- Navigation controls
- Customizable positioning

### 5. HelpButton.tsx
Help access components:
- Standard help button
- Floating help button for new users
- Help center access button

## Hooks

### useHelp.ts
Custom hooks for easy integration:
- `useHelp`: Main hook for accessing all help functionality
- `useHelpTopic`: For registering help topics
- `useFeatureDiscovery`: For tracking discovered features
- `useOnboarding`: For managing onboarding steps
- `useHelpPreferences`: For managing help preferences
- `useHelpVisibility`: For controlling help visibility

## Integration Guide

### 1. Provider Setup
Wrap your application with the HelpProvider in your main App component:

```tsx
import { HelpProvider } from '@/contexts/HelpContext';

function App() {
  return (
    <HelpProvider>
      {/* Your app components */}
    </HelpProvider>
  );
}
```

### 2. Using Tooltips
Add tooltips to any component:

```tsx
import { EnhancedTooltip } from '@/components/ui/EnhancedTooltip';

<EnhancedTooltip
  id="unique-id"
  title="Tooltip Title"
  content="This is the tooltip content"
  variant="help"
  position="right"
>
  <button>Hover me</button>
</EnhancedTooltip>
```

### 3. Registering Help Topics
Register help topics for the help center:

```tsx
import { useHelpTopic } from '@/hooks/useHelp';

useHelpTopic({
  id: 'dashboard',
  title: 'Dashboard Overview',
  content: 'Your dashboard is the central hub for tracking your spiritual progress.',
  category: 'Getting Started'
});
```

### 4. Creating Onboarding Tours
Set up interactive onboarding steps:

```tsx
import { useOnboarding } from '@/hooks/useHelp';
import { OnboardingTooltip } from '@/components/help/OnboardingTooltip';

const { setSteps, start } = useOnboarding();

const steps = [
  {
    id: 'step-1',
    title: 'Welcome',
    content: 'This is the first step',
    targetElementId: 'target-element',
    position: 'bottom'
  }
];

// Set steps and start onboarding
setSteps(steps);
start();
```

## For New Joiners

The help system includes special features for new users:
- **FloatingHelpButton**: A prominent button that appears for new users to discover help
- **Feature Discovery**: Tracks which features users have seen to avoid repeated notifications
- **Customizable Preferences**: Users can control when tooltips and onboarding appear
- **Comprehensive Help Center**: Central location for all help topics with search functionality

## Accessibility

All help components are designed with accessibility in mind:
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA attributes
- Focus management
- Color contrast compliance

## Styling

Components use Tailwind CSS for consistent styling and include:
- Responsive design for all screen sizes
- Dark mode support
- Customizable positioning
- Smooth animations with Framer Motion