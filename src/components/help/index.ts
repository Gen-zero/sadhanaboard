// Help System Components
export { default as HelpButton, FloatingHelpButton, HelpCenterAccess } from './HelpButton';
export { default as HelpModal } from './HelpModal';
export { default as OnboardingTooltip } from './OnboardingTooltip';
// export { default as EnhancedTooltip } from './EnhancedTooltip'; // Commented out as the file doesn't exist

// Help Context
export { HelpProvider, useHelp } from '@/contexts/HelpContext';

// Help Hooks
export { 
  useHelpTopic, 
  useFeatureDiscovery, 
  useOnboarding, 
  useHelpPreferences, 
  useHelpVisibility 
} from '@/hooks/useHelp';