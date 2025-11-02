import { useState, useCallback, useMemo } from 'react';

// Centralized loading keys for consistency
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
  FORM_SUBMIT: 'form_submit',
  
  // Library states
  LIBRARY_LOAD: 'library_load',
  
  // Sadhana states
  SADHANA_LOAD: 'sadhana_load',
  SADHANA_SAVE: 'sadhana_save',
  SADHANA_DELETE: 'sadhana_delete',
  SADHANA_COMPLETE: 'sadhana_complete',
  
  // User states
  USER_PROFILE: 'user_profile',
  USER_SETTINGS: 'user_settings',
  SETTINGS_SAVE: 'settings_save',
  
  // Data states
  DATA_LOAD: 'data_load',
  DATA_SAVE: 'data_save',
  DATA_SYNC: 'data_sync',
  EXPORT: 'export',
} as const;

type LoadingKey = keyof typeof LOADING_KEYS;

interface UseLoadingStateReturn {
  isLoading: (key: string) => boolean;
  setLoading: (key: string, loading: boolean) => void;
  isAnyLoading: boolean;
  withLoading: <T>(key: string, fn: () => Promise<T>) => () => Promise<T>;
}

export const useLoadingState = (): UseLoadingStateReturn => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const isLoading = useCallback((key: string): boolean => {
    return loadingStates[key] ?? false;
  }, [loadingStates]);

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading
    }));
  }, []);

  const isAnyLoading = useMemo(() => {
    return Object.values(loadingStates).some(state => state);
  }, [loadingStates]);

  const withLoading = useCallback(
    <T extends unknown>(key: string, fn: () => Promise<T>) => {
      return async (): Promise<T> => {
        setLoading(key, true);
        try {
          const result = await fn();
          return result;
        } finally {
          setLoading(key, false);
        }
      };
    },
    [setLoading]
  );

  return {
    isLoading,
    setLoading,
    isAnyLoading,
    withLoading
  };
};

export default useLoadingState;