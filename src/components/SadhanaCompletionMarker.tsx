import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { useSadhanaProgress } from '@/hooks/useSadhanaProgress';
import { Button } from '@/components/ui/button';

interface SadhanaCompletionMarkerProps {
  sadhanaId: string;
  date: string; // YYYY-MM-DD format
  onStatusChange?: (completed: boolean) => void;
  showLabel?: boolean; // Whether to show the descriptive text below the marker
}

const SadhanaCompletionMarker: React.FC<SadhanaCompletionMarkerProps> = ({ 
  sadhanaId, 
  date,
  onStatusChange,
  showLabel = false
}) => {
  const { 
    isDateCompleted, 
    getProgressForDate,
    updateProgress,
    loading: progressLoading
  } = useSadhanaProgress(sadhanaId);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize completion status
  useEffect(() => {
    setIsCompleted(isDateCompleted(date));
  }, [date, isDateCompleted]);

  // Update when progress data changes
  useEffect(() => {
    const progress = getProgressForDate(date);
    if (progress) {
      setIsCompleted(progress.completed);
    }
  }, [date, getProgressForDate]);

  const toggleCompletion = async () => {
    if (isLoading || progressLoading) return;
    
    setIsLoading(true);
    try {
      const newStatus = !isCompleted;
      
      await updateProgress({
        progressDate: date,
        completed: newStatus
      });
      
      setIsCompleted(newStatus);
      onStatusChange?.(newStatus);
    } catch (error) {
      console.error('Failed to update completion status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center w-6 h-6">
        <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        variant="ghost"
        size="icon"
        className="w-6 h-6 p-0 hover:bg-transparent"
        onClick={toggleCompletion}
        disabled={isLoading || progressLoading}
      >
        {isCompleted ? (
          <CheckCircle className="w-5 h-5 text-green-500 hover:text-green-400 transition-colors" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
        )}
      </Button>
      {showLabel && (
        <p className="text-xs text-center mt-1 text-amber-200/80 max-w-[120px]">
          {isCompleted 
            ? 'Completed Today' 
            : 'Mark as Completed'}
        </p>
      )}
    </div>
  );
};

export default SadhanaCompletionMarker;