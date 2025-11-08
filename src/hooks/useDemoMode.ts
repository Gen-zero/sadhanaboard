import { useEffect, useState } from 'react';

/**
 * Hook to check if the current session is in demo mode
 */
export const useDemoMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          setIsDemoMode(payload.mode === 'demo');
        }
      }
    } catch (error) {
      console.error('Error checking demo mode:', error);
      setIsDemoMode(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isDemoMode, isLoading };
};

/**
 * Helper function to check demo mode synchronously
 */
export const isDemoModeSync = (): boolean => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload.mode === 'demo';
  } catch (error) {
    return false;
  }
};
