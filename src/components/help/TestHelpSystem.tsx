import React from 'react';
import { HelpProvider } from '@/contexts/HelpContext';
import { EnhancedTooltip } from '@/components/ui/EnhancedTooltip';
import { HelpButton, FloatingHelpButton } from '@/components/help/HelpButton';
import { OnboardingTooltip } from '@/components/help/OnboardingTooltip';

const TestHelpSystem: React.FC = () => {
  // Define onboarding steps for testing
  const testSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Help System Test',
      content: 'This is a test of the help system components.',
      targetElementId: 'test-header',
      position: 'bottom' as const
    }
  ];

  return (
    <HelpProvider>
      <div className="p-8">
        <h1 id="test-header" className="text-2xl font-bold mb-4">
          Help System Test
        </h1>
        
        <div className="mb-6">
          <EnhancedTooltip
            id="test-tooltip"
            title="Test Tooltip"
            content="This is a test of the EnhancedTooltip component."
            variant="help"
            position="right"
          >
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Hover for Tooltip
            </button>
          </EnhancedTooltip>
        </div>
        
        <div className="mb-6">
          <HelpButton variant="full" />
        </div>
        
        <div className="mb-6">
          <FloatingHelpButton />
        </div>
        
        <OnboardingTooltip
          title="Test Onboarding"
          content="This is a test of the OnboardingTooltip component."
          targetElementId="test-header"
          position="bottom"
        />
      </div>
    </HelpProvider>
  );
};

export default TestHelpSystem;