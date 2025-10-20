import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, BookOpen, Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHelp } from '@/contexts/HelpContext';
import HelpModal from './HelpModal';

interface HelpButtonProps {
  className?: string;
  variant?: 'icon' | 'full';
}

export const HelpButton: React.FC<HelpButtonProps> = ({ 
  className = '',
  variant = 'icon'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showTooltips, toggleTooltips, showOnboarding, toggleOnboarding, startOnboarding } = useHelp();

  const handleOpenHelp = () => {
    setIsModalOpen(true);
  };

  const handleCloseHelp = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {variant === 'icon' ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenHelp}
            className={cn(
              "relative rounded-full bg-blue-500 hover:bg-blue-600 text-white",
              className
            )}
            aria-label="Help"
          >
            <HelpCircle className="w-5 h-5" />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <Button
            variant="outline"
            onClick={handleOpenHelp}
            className={cn(
              "gap-2 border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/5",
              className
            )}
          >
            <HelpCircle className="w-4 h-4" />
            Help & Support
          </Button>
        </motion.div>
      )}

      <HelpModal isOpen={isModalOpen} onClose={handleCloseHelp} />
    </>
  );
};

// Floating Help Button for new users
export const FloatingHelpButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { isFeatureDiscovered, markFeatureAsDiscovered } = useHelp();

  // Hide the floating button if the help feature has been discovered
  if (isFeatureDiscovered('help-center') || !isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 100, y: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      className="fixed bottom-6 right-6 z-[999] md:bottom-8 md:right-8"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          boxShadow: [
            '0 0 0 0 rgba(59, 130, 246, 0.7)',
            '0 0 0 10px rgba(59, 130, 246, 0)',
            '0 0 0 0 rgba(59, 130, 246, 0.7)'
          ]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        <Button
          size="lg"
          className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg h-14 w-14 p-0"
          onClick={() => {
            markFeatureAsDiscovered('help-center');
            setIsVisible(false);
            // Trigger the help modal or onboarding
            const event = new CustomEvent('openHelpCenter');
            window.dispatchEvent(event);
          }}
        >
          <div className="relative">
            <HelpCircle className="w-6 h-6" />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2"
      >
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-3 h-3 text-yellow-400" />
            <span>Need help? We're here!</span>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Help Center Access Component
export const HelpCenterAccess: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Listen for the custom event to open help center
  React.useEffect(() => {
    const handleOpenHelpCenter = () => {
      setIsModalOpen(true);
    };

    window.addEventListener('openHelpCenter', handleOpenHelpCenter);
    return () => {
      window.removeEventListener('openHelpCenter', handleOpenHelpCenter);
    };
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <BookOpen className="w-4 h-4" />
        <span>Help Center</span>
      </Button>
      
      <HelpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

// Helper function for class names
function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default HelpButton;