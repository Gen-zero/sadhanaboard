import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Voice announcement hook for screen readers
export const useVoiceAnnouncement = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // Create a live region for screen reader announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = message;
    
    document.body.appendChild(liveRegion);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  };

  return { announce };
};

// Focus management for mobile
export const useFocusManagement = () => {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(focusableSelectors);
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  };

  const focusFirst = (container: HTMLElement) => {
    const firstFocusable = container.querySelector(focusableSelectors) as HTMLElement;
    firstFocusable?.focus();
  };

  const focusLast = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(focusableSelectors);
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
    lastFocusable?.focus();
  };

  return { trapFocus, focusFirst, focusLast };
};

// High contrast mode detection and toggle
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(
    window.matchMedia('(prefers-contrast: high)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleHighContrast = () => {
    document.documentElement.classList.toggle('high-contrast');
    setIsHighContrast(prev => !prev);
  };

  return { isHighContrast, toggleHighContrast };
};

// Reduced motion detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return { prefersReducedMotion };
};

// Skip link component for keyboard navigation
interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:z-[100]"
      onFocus={() => {
        // Announce skip link
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'assertive');
        liveRegion.className = 'sr-only';
        liveRegion.textContent = 'Skip link focused';
        document.body.appendChild(liveRegion);
        setTimeout(() => {
          document.body.removeChild(liveRegion);
        }, 1000);
      }}
    >
      {children}
    </a>
  );
};

// Mobile-optimized button with full accessibility
interface AccessibleMobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  loading?: boolean;
  announcement?: string;
}

export const AccessibleMobileButton: React.FC<AccessibleMobileButtonProps> = ({
  children,
  variant = 'primary',
  loading = false,
  announcement,
  onClick,
  disabled,
  ...props
}) => {
  const { announce } = useVoiceAnnouncement();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }

    // Voice announcement
    if (announcement) {
      announce(announcement);
    }

    onClick?.(e);
  };

  return (
    <button
      className={`
        touch-target-large mobile-button transition-all duration-200
        active:scale-95 focus:ring-2 focus:ring-offset-2 focus:outline-none
        disabled:opacity-50 disabled:pointer-events-none
        ${variant === 'primary' ? 'bg-primary text-primary-foreground focus:ring-primary/20' : ''}
        ${variant === 'secondary' ? 'bg-secondary text-secondary-foreground focus:ring-secondary/20' : ''}
        ${variant === 'destructive' ? 'bg-destructive text-destructive-foreground focus:ring-destructive/20' : ''}
        ${loading ? 'opacity-70 pointer-events-none' : ''}
      `}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-pressed={props['aria-pressed']}
      aria-expanded={props['aria-expanded']}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2" aria-hidden="true">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

// Mobile-optimized form field with accessibility
interface AccessibleMobileFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  id: string;
}

export const AccessibleMobileField: React.FC<AccessibleMobileFieldProps> = ({
  label,
  children,
  error,
  hint,
  required,
  id
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-2">
      <label 
        htmlFor={id}
        className="text-sm font-medium text-foreground flex items-center"
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      
      <div>
        {React.cloneElement(children as React.ReactElement, {
          id,
          'aria-describedby': describedBy,
          'aria-invalid': error ? 'true' : 'false',
          'aria-required': required ? 'true' : 'false'
        })}
      </div>
      
      {error && (
        <p id={errorId} className="text-sm text-destructive font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Screen reader text component
interface ScreenReaderTextProps {
  children: React.ReactNode;
}

export const ScreenReaderText: React.FC<ScreenReaderTextProps> = ({ children }) => {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
};

// Mobile touch target checker
export const useTouchTargetSize = () => {
  const checkTouchTargets = () => {
    const minSize = 44; // WCAG AAA minimum
    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [role="link"]'
    );

    const violations: HTMLElement[] = [];

    interactiveElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width < minSize || rect.height < minSize) {
        violations.push(element as HTMLElement);
      }
    });

    if (violations.length > 0) {
      console.warn(`Found ${violations.length} touch targets smaller than ${minSize}px:`, violations);
    }

    return violations;
  };

  return { checkTouchTargets };
};

// Accessibility context for mobile settings
interface AccessibilityContextType {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'normal' | 'large' | 'extra-large';
  toggleHighContrast: () => void;
  setFontSize: (size: 'small' | 'normal' | 'large' | 'extra-large') => void;
}

const AccessibilityContext = React.createContext<AccessibilityContextType | null>(null);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isHighContrast, toggleHighContrast } = useHighContrast();
  const { prefersReducedMotion } = useReducedMotion();
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large' | 'extra-large'>('normal');

  useEffect(() => {
    // Apply font size to root element
    const fontSizeMap = {
      small: '14px',
      normal: '16px',
      large: '18px',
      'extra-large': '20px'
    };
    
    document.documentElement.style.fontSize = fontSizeMap[fontSize];
  }, [fontSize]);

  const value = {
    highContrast: isHighContrast,
    reducedMotion: prefersReducedMotion,
    fontSize,
    toggleHighContrast,
    setFontSize
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = React.useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};