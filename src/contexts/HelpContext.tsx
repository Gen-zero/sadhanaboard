import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our help system
interface HelpTopic {
  id: string;
  title: string;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  priority?: number;
}

interface HelpStep {
  id: string;
  title: string;
  content: string;
  targetElementId?: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

interface HelpContextType {
  // Help visibility state
  isHelpVisible: boolean;
  showHelp: () => void;
  hideHelp: () => void;
  
  // Tooltip state
  activeTooltip: string | null;
  showTooltip: (id: string) => void;
  hideTooltip: () => void;
  
  // Help topics
  helpTopics: Record<string, HelpTopic>;
  registerHelpTopic: (topic: HelpTopic) => void;
  unregisterHelpTopic: (id: string) => void;
  
  // Onboarding state
  isOnboardingActive: boolean;
  startOnboarding: () => void;
  stopOnboarding: () => void;
  currentOnboardingStep: number;
  totalOnboardingSteps: number;
  nextOnboardingStep: () => void;
  prevOnboardingStep: () => void;
  goToOnboardingStep: (step: number) => void;
  onboardingSteps: HelpStep[];
  setOnboardingSteps: (steps: HelpStep[]) => void;
  
  // Feature discovery
  discoveredFeatures: string[];
  markFeatureAsDiscovered: (featureId: string) => void;
  isFeatureDiscovered: (featureId: string) => boolean;
  
  // Preferences
  showTooltips: boolean;
  toggleTooltips: () => void;
  showOnboarding: boolean;
  toggleOnboarding: () => void;
}

// Create the context with default values
const HelpContext = createContext<HelpContextType | undefined>(undefined);

// Create a provider component
export const HelpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Help visibility state
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  
  // Tooltip state
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  // Help topics registry
  const [helpTopics, setHelpTopics] = useState<Record<string, HelpTopic>>({});
  
  // Onboarding state
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);
  const [onboardingSteps, setOnboardingSteps] = useState<HelpStep[]>([]);
  
  // Feature discovery
  const [discoveredFeatures, setDiscoveredFeatures] = useState<string[]>(() => {
    const saved = localStorage.getItem('discoveredFeatures');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Preferences
  const [showTooltips, setShowTooltips] = useState(() => {
    const saved = localStorage.getItem('showTooltips');
    return saved === null ? true : JSON.parse(saved);
  });
  
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const saved = localStorage.getItem('showOnboarding');
    return saved === null ? true : JSON.parse(saved);
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const savedDiscoveredFeatures = localStorage.getItem('discoveredFeatures');
    if (savedDiscoveredFeatures) {
      setDiscoveredFeatures(JSON.parse(savedDiscoveredFeatures));
    }
    
    const savedShowTooltips = localStorage.getItem('showTooltips');
    if (savedShowTooltips !== null) {
      setShowTooltips(JSON.parse(savedShowTooltips));
    }
    
    const savedShowOnboarding = localStorage.getItem('showOnboarding');
    if (savedShowOnboarding !== null) {
      setShowOnboarding(JSON.parse(savedShowOnboarding));
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('discoveredFeatures', JSON.stringify(discoveredFeatures));
  }, [discoveredFeatures]);

  useEffect(() => {
    localStorage.setItem('showTooltips', JSON.stringify(showTooltips));
  }, [showTooltips]);

  useEffect(() => {
    localStorage.setItem('showOnboarding', JSON.stringify(showOnboarding));
  }, [showOnboarding]);

  // Help visibility methods
  const showHelp = () => setIsHelpVisible(true);
  const hideHelp = () => setIsHelpVisible(false);
  
  // Tooltip methods
  const showTooltip = (id: string) => {
    if (showTooltips) {
      setActiveTooltip(id);
    }
  };
  const hideTooltip = () => setActiveTooltip(null);
  
  // Help topic methods
  const registerHelpTopic = (topic: HelpTopic) => {
    setHelpTopics(prev => ({ ...prev, [topic.id]: topic }));
  };
  
  const unregisterHelpTopic = (id: string) => {
    setHelpTopics(prev => {
      const newTopics = { ...prev };
      delete newTopics[id];
      return newTopics;
    });
  };
  
  // Onboarding methods
  const startOnboarding = () => {
    if (showOnboarding) {
      setIsOnboardingActive(true);
      setCurrentOnboardingStep(0);
    }
  };
  
  const stopOnboarding = () => {
    setIsOnboardingActive(false);
    setCurrentOnboardingStep(0);
  };
  
  const nextOnboardingStep = () => {
    setCurrentOnboardingStep(prev => 
      Math.min(prev + 1, onboardingSteps.length - 1)
    );
  };
  
  const prevOnboardingStep = () => {
    setCurrentOnboardingStep(prev => Math.max(prev - 1, 0));
  };
  
  const goToOnboardingStep = (step: number) => {
    if (step >= 0 && step < onboardingSteps.length) {
      setCurrentOnboardingStep(step);
    }
  };
  
  // Feature discovery methods
  const markFeatureAsDiscovered = (featureId: string) => {
    if (!discoveredFeatures.includes(featureId)) {
      setDiscoveredFeatures(prev => [...prev, featureId]);
    }
  };
  
  const isFeatureDiscovered = (featureId: string) => {
    return discoveredFeatures.includes(featureId);
  };
  
  // Preference methods
  const toggleTooltips = () => setShowTooltips(prev => !prev);
  const toggleOnboarding = () => setShowOnboarding(prev => !prev);

  // Calculate total onboarding steps
  const totalOnboardingSteps = onboardingSteps.length;

  // Provide the context value
  const contextValue: HelpContextType = {
    // Help visibility
    isHelpVisible,
    showHelp,
    hideHelp,
    
    // Tooltip state
    activeTooltip,
    showTooltip,
    hideTooltip,
    
    // Help topics
    helpTopics,
    registerHelpTopic,
    unregisterHelpTopic,
    
    // Onboarding
    isOnboardingActive,
    startOnboarding,
    stopOnboarding,
    currentOnboardingStep,
    totalOnboardingSteps,
    nextOnboardingStep,
    prevOnboardingStep,
    goToOnboardingStep,
    onboardingSteps,
    setOnboardingSteps,
    
    // Feature discovery
    discoveredFeatures,
    markFeatureAsDiscovered,
    isFeatureDiscovered,
    
    // Preferences
    showTooltips,
    toggleTooltips,
    showOnboarding,
    toggleOnboarding
  };

  return (
    <HelpContext.Provider value={contextValue}>
      {children}
    </HelpContext.Provider>
  );
};

// Create a custom hook to use the help context
export const useHelp = () => {
  const context = useContext(HelpContext);
  if (context === undefined) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};

export default HelpContext;