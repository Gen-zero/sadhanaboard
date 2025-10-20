import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  BookOpen, 
  Lightbulb, 
  Settings, 
  User, 
  Target,
  Sparkles,
  ChevronRight,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useHelp } from '@/contexts/HelpContext';
import { EnhancedTooltip } from '@/components/ui/EnhancedTooltip';
import { OnboardingTooltip } from '@/components/help/OnboardingTooltip';
import { HelpButton, FloatingHelpButton } from '@/components/help/HelpButton';

const HelpDemoPage: React.FC = () => {
  const { 
    showTooltips, 
    toggleTooltips, 
    showOnboarding, 
    toggleOnboarding,
    startOnboarding,
    isOnboardingActive
  } = useHelp();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Define onboarding steps for this demo
  const demoSteps = [
    {
      id: 'welcome',
      title: 'Welcome to the Help Demo',
      content: 'This is a demonstration of our comprehensive help system. You can navigate through different steps to see all features.',
      targetElementId: 'help-demo-header',
      position: 'bottom' as const
    },
    {
      id: 'tooltips',
      title: 'Interactive Tooltips',
      content: 'Hover over or click these icons to see contextual help tooltips. They provide quick information about features.',
      targetElementId: 'tooltip-section',
      position: 'right' as const
    },
    {
      id: 'form',
      title: 'Form Assistance',
      content: 'Fill out this form to see how tooltips can help users understand form fields.',
      targetElementId: 'demo-form',
      position: 'bottom' as const
    },
    {
      id: 'settings',
      title: 'Help Preferences',
      content: 'Adjust your help preferences to control when tooltips and onboarding appear.',
      targetElementId: 'help-settings',
      position: 'left' as const
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 id="help-demo-header" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Help System Demo
            </h1>
            <p className="text-muted-foreground mt-2">
              Explore our comprehensive tooltip and help system
            </p>
          </div>
          <div className="flex gap-2">
            <HelpButton variant="full" />
            <Button 
              onClick={() => {
                // Set the onboarding steps and start
                const event = new CustomEvent('setOnboardingSteps', { 
                  detail: demoSteps 
                });
                window.dispatchEvent(event);
                setTimeout(() => startOnboarding(), 100);
              }}
              disabled={isOnboardingActive}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Demo Tour
            </Button>
          </div>
        </div>

        {/* Floating Help Button */}
        <FloatingHelpButton />

        {/* Onboarding Tooltip Demo */}
        <OnboardingTooltip
          title="Help System Demo"
          content="This is a demonstration of our interactive onboarding tooltips. Click 'Next' to continue the tour."
          targetElementId="help-demo-header"
          position="bottom"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tooltip Demo Section */}
            <Card id="tooltip-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Interactive Tooltips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Hover over or click the help icons to see different types of tooltips:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EnhancedTooltip
                    id="default-tooltip"
                    title="Default Tooltip"
                    content="This is a standard tooltip with basic information."
                    position="top"
                  >
                    <div className="flex items-center gap-2 p-4 bg-muted rounded-lg cursor-pointer">
                      <HelpCircle className="w-5 h-5 text-muted-foreground" />
                      <span>Default Tooltip</span>
                    </div>
                  </EnhancedTooltip>
                  
                  <EnhancedTooltip
                    id="help-tooltip"
                    title="Help Tooltip"
                    content="This tooltip provides help information with a blue theme."
                    position="top"
                    variant="help"
                  >
                    <div className="flex items-center gap-2 p-4 bg-blue-500/10 rounded-lg cursor-pointer">
                      <HelpCircle className="w-5 h-5 text-blue-500" />
                      <span>Help Tooltip</span>
                    </div>
                  </EnhancedTooltip>
                  
                  <EnhancedTooltip
                    id="info-tooltip"
                    title="Info Tooltip"
                    content="This tooltip provides informational content with a purple theme."
                    position="bottom"
                    variant="info"
                  >
                    <div className="flex items-center gap-2 p-4 bg-purple-500/10 rounded-lg cursor-pointer">
                      <BookOpen className="w-5 h-5 text-purple-500" />
                      <span>Info Tooltip</span>
                    </div>
                  </EnhancedTooltip>
                  
                  <EnhancedTooltip
                    id="discovery-tooltip"
                    title="Discovery Tooltip"
                    content="This tooltip highlights new features with a yellow theme."
                    position="bottom"
                    variant="discovery"
                  >
                    <div className="flex items-center gap-2 p-4 bg-yellow-500/10 rounded-lg cursor-pointer">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      <span>Discovery Tooltip</span>
                    </div>
                  </EnhancedTooltip>
                </div>
              </CardContent>
            </Card>

            {/* Form Demo Section */}
            <Card id="demo-form">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  Form Assistance Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Fill out this form to see how tooltips can help users understand form fields.
                </p>
                
                <form className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="name">Full Name</Label>
                      <EnhancedTooltip
                        id="name-help"
                        content="Enter your full name as it appears on your identification documents."
                        variant="help"
                      >
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </EnhancedTooltip>
                    </div>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email">Email Address</Label>
                      <EnhancedTooltip
                        id="email-help"
                        content="We'll use this to send you important notifications and updates."
                        variant="help"
                      >
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </EnhancedTooltip>
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <Button 
                    type="button"
                    onClick={() => setIsSubmitted(true)}
                    disabled={!name || !email}
                  >
                    Submit Form
                  </Button>
                  
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-500">Form submitted successfully!</span>
                      </div>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Help Settings */}
            <Card id="help-settings">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  Help Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Tooltips</p>
                    <p className="text-sm text-muted-foreground">
                      Display helpful tooltips throughout the app
                    </p>
                  </div>
                  <Switch
                    checked={showTooltips}
                    onCheckedChange={toggleTooltips}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Onboarding</p>
                    <p className="text-sm text-muted-foreground">
                      Display guided tours for new features
                    </p>
                  </div>
                  <Switch
                    checked={showOnboarding}
                    onCheckedChange={toggleOnboarding}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const event = new CustomEvent('setOnboardingSteps', { 
                      detail: demoSteps 
                    });
                    window.dispatchEvent(event);
                    setTimeout(() => startOnboarding(), 100);
                  }}
                  disabled={isOnboardingActive}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Demo Tour
                </Button>
              </CardContent>
            </Card>

            {/* Feature Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-500" />
                  Feature Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Tooltips System</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Help Modal</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Onboarding Tooltips</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Contextual Help</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Feature Discovery</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
                    <span>Getting Started Guide</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
                    <span>FAQs</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
                    <span>Contact Support</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDemoPage;