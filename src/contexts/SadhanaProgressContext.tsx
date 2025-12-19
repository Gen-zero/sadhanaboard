import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sadhanaProgressService, SadhanaProgress } from '@/services/sadhanaProgressService';

interface SadhanaProgressContextType {
  // Progress data for all sadhanas
  allProgress: Record<string, SadhanaProgress[]>;
  // Loading state
  loading: boolean;
  // Error state
  error: string | null;
  // Method to fetch progress for a specific sadhana
  fetchProgress: (sadhanaId: string) => Promise<void>;
  // Method to update progress for a specific sadhana
  updateProgress: (sadhanaId: string, progressData: Partial<SadhanaProgress>) => Promise<void>;
  // Method to check if a date is completed for a specific sadhana
  isDateCompleted: (sadhanaId: string, date: string) => boolean;
  // Method to get progress for a specific date and sadhana
  getProgressForDate: (sadhanaId: string, date: string) => SadhanaProgress | undefined;
}

const SadhanaProgressContext = createContext<SadhanaProgressContextType | undefined>(undefined);

export const useSadhanaProgressContext = () => {
  const context = useContext(SadhanaProgressContext);
  if (!context) {
    throw new Error('useSadhanaProgressContext must be used within a SadhanaProgressProvider');
  }
  return context;
};

interface SadhanaProgressProviderProps {
  children: React.ReactNode;
}

export const SadhanaProgressProvider: React.FC<SadhanaProgressProviderProps> = ({ children }) => {
  const [allProgress, setAllProgress] = useState<Record<string, SadhanaProgress[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch progress for a specific sadhana
  const fetchProgress = useCallback(async (sadhanaId: string) => {
    if (!sadhanaId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await sadhanaProgressService.getSadhanaProgress(sadhanaId);
      setAllProgress(prev => ({
        ...prev,
        [sadhanaId]: data
      }));
    } catch (err) {
      setError('Failed to fetch progress data');
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update progress for a specific sadhana
  const updateProgress = useCallback(async (sadhanaId: string, progressData: Partial<SadhanaProgress>) => {
    if (!sadhanaId) return;
    
    try {
      // Update the progress on the backend
      const updatedProgress = await sadhanaProgressService.upsertSadhanaProgress(
        sadhanaId,
        progressData
      );
      
      // Update local state
      setAllProgress(prev => {
        const sadhanaProgress = prev[sadhanaId] || [];
        const existingIndex = sadhanaProgress.findIndex(
          p => p.progressDate === updatedProgress.progressDate
        );
        
        let newProgress: SadhanaProgress[];
        if (existingIndex >= 0) {
          newProgress = [...sadhanaProgress];
          newProgress[existingIndex] = updatedProgress;
        } else {
          newProgress = [...sadhanaProgress, updatedProgress];
        }
        
        return {
          ...prev,
          [sadhanaId]: newProgress
        };
      });
      
      // Dispatch a global event to notify other components
      window.dispatchEvent(
        new CustomEvent('sadhana-progress-updated', {
          detail: { sadhanaId, progress: updatedProgress }
        })
      );
    } catch (err) {
      setError('Failed to update progress');
      console.error('Error updating progress:', err);
    }
  }, []);

  // Check if a date is completed for a specific sadhana
  const isDateCompleted = useCallback((sadhanaId: string, date: string): boolean => {
    const progressList = allProgress[sadhanaId] || [];
    const progressEntry = progressList.find(p => p.progressDate === date);
    return progressEntry?.completed ?? false;
  }, [allProgress]);

  // Get progress for a specific date and sadhana
  const getProgressForDate = useCallback((sadhanaId: string, date: string): SadhanaProgress | undefined => {
    const progressList = allProgress[sadhanaId] || [];
    return progressList.find(p => p.progressDate === date);
  }, [allProgress]);

  // Listen for global progress updates
  useEffect(() => {
    const handleProgressUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { sadhanaId, progress: updatedProgress } = customEvent.detail;
      
      // Update local state with the new progress data
      setAllProgress(prev => {
        const sadhanaProgress = prev[sadhanaId] || [];
        const existingIndex = sadhanaProgress.findIndex(
          p => p.progressDate === updatedProgress.progressDate
        );
        
        let newProgress: SadhanaProgress[];
        if (existingIndex >= 0) {
          newProgress = [...sadhanaProgress];
          newProgress[existingIndex] = updatedProgress;
        } else {
          newProgress = [...sadhanaProgress, updatedProgress];
        }
        
        return {
          ...prev,
          [sadhanaId]: newProgress
        };
      });
    };

    window.addEventListener('sadhana-progress-updated', handleProgressUpdate);
    
    return () => {
      window.removeEventListener('sadhana-progress-updated', handleProgressUpdate);
    };
  }, []);

  const value = {
    allProgress,
    loading,
    error,
    fetchProgress,
    updateProgress,
    isDateCompleted,
    getProgressForDate
  };

  return (
    <SadhanaProgressContext.Provider value={value}>
      {children}
    </SadhanaProgressContext.Provider>
  );
};