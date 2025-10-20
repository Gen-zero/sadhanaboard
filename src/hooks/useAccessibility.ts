import { useState, useEffect } from 'react';

/**
 * Hook for managing accessibility preferences and features
 */
export const useAccessibility = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);
  const [prefersDarkMode, setPrefersDarkMode] = useState(false);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    
    const motionHandler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    motionQuery.addEventListener('change', motionHandler);
    
    // Check for high contrast preference
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(contrastQuery.matches);
    
    const contrastHandler = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };
    
    contrastQuery.addEventListener('change', contrastHandler);
    
    // Check for dark mode preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setPrefersDarkMode(darkModeQuery.matches);
    
    const darkModeHandler = (e: MediaQueryListEvent) => {
      setPrefersDarkMode(e.matches);
    };
    
    darkModeQuery.addEventListener('change', darkModeHandler);
    
    // Detect keyboard navigation
    const handleKeyDown = () => {
      setIsKeyboardUser(true);
    };
    
    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    
    // Check for screen reader (simplified detection)
    const handleFocusVisible = () => {
      document.body.classList.add('user-is-tabbing');
    };
    
    window.addEventListener('keydown', handleFocusVisible);
    
    return () => {
      motionQuery.removeEventListener('change', motionHandler);
      contrastQuery.removeEventListener('change', contrastHandler);
      darkModeQuery.removeEventListener('change', darkModeHandler);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleFocusVisible);
    };
  }, []);

  /**
   * Announce content to screen readers
   */
  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement is read
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  /**
   * Focus trap for modals and dialogs
   */
  const useFocusTrap = (isActive: boolean) => {
    useEffect(() => {
      if (!isActive) return;
      
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };
      
      document.addEventListener('keydown', handleTabKey);
      
      // Focus first element
      firstElement?.focus();
      
      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    }, [isActive]);
  };

  /**
   * Skip to content functionality
   */
  const useSkipToContent = () => {
    useEffect(() => {
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) {
        skipLink.addEventListener('click', (e) => {
          e.preventDefault();
          const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
          if (mainContent) {
            (mainContent as HTMLElement).focus();
            mainContent.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
          }
        });
      }
    }, [prefersReducedMotion]);
  };

  /**
   * Enhanced touch target validation
   */
  const validateTouchTargets = () => {
    if (process.env.NODE_ENV === 'development') {
      const elements = document.querySelectorAll('.touch-target-validation');
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          console.warn('Touch target too small:', element);
        }
      });
    }
  };

  return {
    // Preferences
    prefersReducedMotion,
    prefersHighContrast,
    prefersDarkMode,
    isKeyboardUser,
    fontSizeMultiplier,
    isScreenReaderActive,
    
    // Methods
    announceToScreenReader,
    useFocusTrap,
    useSkipToContent,
    validateTouchTargets,
    
    // Setters
    setFontSizeMultiplier,
    setIsScreenReaderActive
  };
};