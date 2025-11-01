import { useEffect } from 'react';

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