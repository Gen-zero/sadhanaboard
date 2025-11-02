import React, { createContext, useContext } from 'react';
import { useLoadingState, LOADING_KEYS } from '../../hooks/useLoadingState';

// Create context with the return type of useLoadingState
const LoadingContext = createContext<ReturnType<typeof useLoadingState> | null>(null);

// Provider component
export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loadingState = useLoadingState();
  
  return (
    <LoadingContext.Provider value={loadingState}>
      {children}
    </LoadingContext.Provider>
  );
};

// Hook to use the loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Re-export LOADING_KEYS for convenience
export { LOADING_KEYS };

// Export the useLoadingState hook as well for direct usage
export { useLoadingState };