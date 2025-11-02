import { useCallback, useRef, useEffect, useState } from 'react';

export const useVoiceAnnouncement = () => {
  const announceRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announceRef.current) {
      const div = document.createElement('div');
      div.setAttribute('role', 'status');
      div.setAttribute('aria-live', priority);
      div.setAttribute('aria-atomic', 'true');
      div.className = 'sr-only';
      document.body.appendChild(div);
      announceRef.current = div;
    }
    announceRef.current.textContent = message;
  }, []);

  return { announce };
};

export const useAccessibility = () => {
  const { announce } = useVoiceAnnouncement();
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState('normal');

  useEffect(() => {
    // Check for high contrast preference
    const highContrastMediaQuery = window.matchMedia('(prefers-contrast: more)');
    setHighContrast(highContrastMediaQuery.matches);
    highContrastMediaQuery.addEventListener('change', (e) => setHighContrast(e.matches));

    // Check for reduced motion preference
    const reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(reducedMotionMediaQuery.matches);
    reducedMotionMediaQuery.addEventListener('change', (e) => setReducedMotion(e.matches));

    return () => {
      highContrastMediaQuery.removeEventListener('change', () => {});
      reducedMotionMediaQuery.removeEventListener('change', () => {});
    };
  }, []);

  const focusTrap = useCallback((element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { announce, focusTrap, highContrast, reducedMotion, fontSize };
};
