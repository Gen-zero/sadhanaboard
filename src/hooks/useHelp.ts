import React from 'react';
import { useHelp } from '@/contexts/HelpContext';

// Re-export the useHelp hook for convenience
export { useHelp };

// Custom hook for registering help topics
export const useHelpTopic = (topic: {
  id: string;
  title: string;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  priority?: number;
}) => {
  const { registerHelpTopic, unregisterHelpTopic } = useHelp();

  // Register the topic when the component mounts
   
  React.useEffect(() => {
    registerHelpTopic(topic);
    return () => {
      unregisterHelpTopic(topic.id);
    };
  }, [topic, registerHelpTopic, unregisterHelpTopic]);
};

// Custom hook for feature discovery
export const useFeatureDiscovery = (featureId: string) => {
  const { 
    isFeatureDiscovered, 
    markFeatureAsDiscovered,
    discoveredFeatures
  } = useHelp();

  const isDiscovered = isFeatureDiscovered(featureId);
  
  const markAsDiscovered = React.useCallback(() => {
    markFeatureAsDiscovered(featureId);
  }, [featureId, markFeatureAsDiscovered]);

  return {
    isDiscovered,
    markAsDiscovered,
    discoveredFeatures
  };
};

// Custom hook for onboarding steps
export const useOnboarding = () => {
  const {
    isOnboardingActive,
    startOnboarding,
    stopOnboarding,
    currentOnboardingStep,
    totalOnboardingSteps,
    nextOnboardingStep,
    prevOnboardingStep,
    goToOnboardingStep,
    onboardingSteps,
    setOnboardingSteps
  } = useHelp();

  return {
    isActive: isOnboardingActive,
    start: startOnboarding,
    stop: stopOnboarding,
    currentStep: currentOnboardingStep,
    totalSteps: totalOnboardingSteps,
    next: nextOnboardingStep,
    prev: prevOnboardingStep,
    goTo: goToOnboardingStep,
    steps: onboardingSteps,
    setSteps: setOnboardingSteps
  };
};

// Custom hook for help preferences
export const useHelpPreferences = () => {
  const {
    showTooltips,
    toggleTooltips,
    showOnboarding,
    toggleOnboarding
  } = useHelp();

  return {
    tooltips: {
      enabled: showTooltips,
      toggle: toggleTooltips
    },
    onboarding: {
      enabled: showOnboarding,
      toggle: toggleOnboarding
    }
  };
};

// Custom hook for help visibility
export const useHelpVisibility = () => {
  const {
    isHelpVisible,
    showHelp,
    hideHelp
  } = useHelp();

  return {
    isVisible: isHelpVisible,
    show: showHelp,
    hide: hideHelp
  };
};

export default useHelp;