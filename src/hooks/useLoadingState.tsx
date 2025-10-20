import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// Loading state types
export interface LoadingState {
  [key: string]: boolean;
}

export interface LoadingContextType {
  loadingStates: LoadingState;
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key: string) => boolean;
  isAnyLoading: () => boolean;
  clearAllLoading: () => void;
  withLoading: <T extends any[]>(
    key: string,
    asyncFn: (...args: T) => Promise<any>
  ) => (...args: T) => Promise<any>;
}

// Loading context
const LoadingContext = createContext<LoadingContextType | null>(null);

// Loading provider component
export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  const setLoading = useCallback((key: string, loading: boolean) => {
    // Clear any existing timeout for this key
    const existingTimeout = timeoutsRef.current.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      timeoutsRef.current.delete(key);
    }

    if (loading) {
      setLoadingStates(prev => ({ ...prev, [key]: true }));
    } else {
      // Add a small delay before removing loading state to prevent flicker
      const timeout = setTimeout(() => {
        setLoadingStates(prev => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });
        timeoutsRef.current.delete(key);
      }, 100);
      
      timeoutsRef.current.set(key, timeout);
    }
  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(loading => loading);
  }, [loadingStates]);

  const clearAllLoading = useCallback(() => {
    // Clear all timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
    setLoadingStates({});
  }, []);

  const withLoading = useCallback(<T extends any[]>(
    key: string,
    asyncFn: (...args: T) => Promise<any>
  ) => {
    return async (...args: T) => {
      setLoading(key, true);
      try {
        const result = await asyncFn(...args);
        return result;
      } finally {
        setLoading(key, false);
      }
    };
  }, [setLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const value: LoadingContextType = {
    loadingStates,
    setLoading,
    isLoading,
    isAnyLoading,
    clearAllLoading,
    withLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use loading context
export const useLoadingState = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoadingState must be used within a LoadingProvider');
  }
  return context;
};

// Individual loading hook for specific keys
export const useLoading = (key: string) => {
  const { isLoading, setLoading, withLoading } = useLoadingState();
  
  return {
    loading: isLoading(key),
    setLoading: (loading: boolean) => setLoading(key, loading),
    withLoading: withLoading.bind(null, key)
  };
};

// Hook for async operations with automatic loading state
export const useAsyncOperation = <T extends any[], R = any>(
  key: string,
  asyncFn: (...args: T) => Promise<R>
) => {
  const { loading, withLoading } = useLoading(key);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<R | null>(null);

  const execute = useCallback(
    withLoading(async (...args: T) => {
      try {
        setError(null);
        const result = await asyncFn(...args);
        setData(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      }
    }),
    [asyncFn, withLoading]
  );

  return {
    loading,
    error,
    data,
    execute,
    reset: () => {
      setError(null);
      setData(null);
    }
  };
};

// Loading state constants for consistency
export const LOADING_KEYS = {
  // Global app states
  APP_INIT: 'app_init',
  AUTH: 'auth',
  THEME_LOAD: 'theme_load',
  
  // Dashboard states
  DASHBOARD_LOAD: 'dashboard_load',
  PROFILE_LOAD: 'profile_load',
  TASKS_LOAD: 'tasks_load',
  STATS_LOAD: 'stats_load',
  
  // Sadhana states
  SADHANA_LOAD: 'sadhana_load',
  SADHANA_SAVE: 'sadhana_save',
  SADHANA_DELETE: 'sadhana_delete',
  SADHANA_COMPLETE: 'sadhana_complete',
  
  // Library states
  LIBRARY_LOAD: 'library_load',
  BOOK_LOAD: 'book_load',
  BOOK_SEARCH: 'book_search',
  
  // Settings states
  SETTINGS_LOAD: 'settings_load',
  SETTINGS_SAVE: 'settings_save',
  
  // Form states
  FORM_SUBMIT: 'form_submit',
  LOGIN: 'login',
  SIGNUP: 'signup',
  
  // Data operations
  DATA_SYNC: 'data_sync',
  EXPORT: 'export',
  IMPORT: 'import',
  
  // Media operations
  IMAGE_UPLOAD: 'image_upload',
  FILE_UPLOAD: 'file_upload'
} as const;

export type LoadingKey = typeof LOADING_KEYS[keyof typeof LOADING_KEYS];