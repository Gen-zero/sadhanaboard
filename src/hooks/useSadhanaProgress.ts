import { useState, useEffect, useCallback } from 'react';
import { sadhanaProgressService, SadhanaProgress, UpsertSadhanaProgressRequest } from '@/services/sadhanaProgressService';
import { useToast } from '@/components/ui/use-toast';

export const useSadhanaProgress = (sadhanaId: string) => {
  const [progress, setProgress] = useState<SadhanaProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch progress for the sadhana
  const fetchProgress = useCallback(async () => {
    if (!sadhanaId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await sadhanaProgressService.getSadhanaProgress(sadhanaId);
      setProgress(data);
    } catch (err) {
      setError('Failed to fetch progress data');
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
    }
  }, [sadhanaId]);

  // Update progress for a specific date
  const updateProgress = useCallback(async (
    progressData: UpsertSadhanaProgressRequest
  ): Promise<SadhanaProgress | null> => {
    try {
      const updatedProgress = await sadhanaProgressService.upsertSadhanaProgress(
        sadhanaId,
        progressData
      );
      
      // Update local state
      setProgress(prev => {
        const existingIndex = prev.findIndex(
          p => p.progressDate === updatedProgress.progressDate
        );
        
        if (existingIndex >= 0) {
          const newProgress = [...prev];
          newProgress[existingIndex] = updatedProgress;
          return newProgress;
        } else {
          return [...prev, updatedProgress];
        }
      });
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(
        new CustomEvent('sadhana-progress-updated', {
          detail: { sadhanaId, progress: updatedProgress }
        })
      );
      
      return updatedProgress;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update progress',
        variant: 'destructive'
      });
      console.error('Error updating progress:', err);
      return null;
    }
  }, [sadhanaId, toast]);

  // Mark as completed for today
  const markCompletedForToday = useCallback(async () => {
    try {
      const updatedProgress = await sadhanaProgressService.markCompletedForToday(sadhanaId);
      
      // Update local state
      setProgress(prev => {
        const existingIndex = prev.findIndex(
          p => p.progressDate === updatedProgress.progressDate
        );
        
        if (existingIndex >= 0) {
          const newProgress = [...prev];
          newProgress[existingIndex] = updatedProgress;
          return newProgress;
        } else {
          return [...prev, updatedProgress];
        }
      });
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(
        new CustomEvent('sadhana-progress-updated', {
          detail: { sadhanaId, progress: updatedProgress }
        })
      );
      
      toast({
        title: 'Success',
        description: 'Marked as completed for today!'
      });
      
      return updatedProgress;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to mark as completed',
        variant: 'destructive'
      });
      console.error('Error marking as completed:', err);
      return null;
    }
  }, [sadhanaId, toast]);

  // Mark as not completed for today
  const markNotCompletedForToday = useCallback(async () => {
    try {
      const updatedProgress = await sadhanaProgressService.markNotCompletedForToday(sadhanaId);
      
      // Update local state
      setProgress(prev => {
        const existingIndex = prev.findIndex(
          p => p.progressDate === updatedProgress.progressDate
        );
        
        if (existingIndex >= 0) {
          const newProgress = [...prev];
          newProgress[existingIndex] = updatedProgress;
          return newProgress;
        } else {
          return [...prev, updatedProgress];
        }
      });
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(
        new CustomEvent('sadhana-progress-updated', {
          detail: { sadhanaId, progress: updatedProgress }
        })
      );
      
      toast({
        title: 'Success',
        description: 'Marked as not completed for today.'
      });
      
      return updatedProgress;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update progress',
        variant: 'destructive'
      });
      console.error('Error marking as not completed:', err);
      return null;
    }
  }, [sadhanaId, toast]);

  // Check if a specific date is completed
  const isDateCompleted = useCallback((date: string): boolean => {
    const progressEntry = progress.find(p => p.progressDate === date);
    return progressEntry?.completed ?? false;
  }, [progress]);

  // Get progress for a specific date
  const getProgressForDate = useCallback((date: string): SadhanaProgress | undefined => {
    return progress.find(p => p.progressDate === date);
  }, [progress]);

  // Initialize
  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Listen for progress updates from other components
  useEffect(() => {
    const handleProgressUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.sadhanaId === sadhanaId) {
        // Update local state with the new progress data
        const updatedProgress = customEvent.detail.progress;
        setProgress(prev => {
          const existingIndex = prev.findIndex(
            p => p.progressDate === updatedProgress.progressDate
          );
          
          if (existingIndex >= 0) {
            const newProgress = [...prev];
            newProgress[existingIndex] = updatedProgress;
            return newProgress;
          } else {
            return [...prev, updatedProgress];
          }
        });
      }
    };

    window.addEventListener('sadhana-progress-updated', handleProgressUpdate);
    
    return () => {
      window.removeEventListener('sadhana-progress-updated', handleProgressUpdate);
    };
  }, [sadhanaId]);

  return {
    progress,
    loading,
    error,
    fetchProgress,
    updateProgress,
    markCompletedForToday,
    markNotCompletedForToday,
    isDateCompleted,
    getProgressForDate
  };
};