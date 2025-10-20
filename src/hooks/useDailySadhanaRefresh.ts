import { useEffect } from 'react';
import { useSadhanaData } from './useSadhanaData';
import { format } from 'date-fns';

// Custom hook to manage daily sadhana task refresh
export const useDailySadhanaRefresh = () => {
  const { sadhanaState, sadhanaData } = useSadhanaData();

  useEffect(() => {
    // Check and refresh sadhana tasks on app load and daily
    const refreshSadhanaTasks = () => {
      if (sadhanaState.hasStarted && sadhanaData && sadhanaState.sadhanaId) {
        const today = new Date();
        const todayStr = format(today, 'yyyy-MM-dd');
        const sadhanaStartDate = new Date(sadhanaData.startDate);
        const sadhanaEndDate = new Date(sadhanaData.endDate);
        
        // Check if sadhana is active today
        if (today >= sadhanaStartDate && today <= sadhanaEndDate) {
          const lastRefreshDate = localStorage.getItem(`sadhana_last_refresh_${sadhanaState.sadhanaId}`);
          
          // Refresh if it's a new day
          if (lastRefreshDate !== todayStr) {
            try {
              const existingTasks = JSON.parse(localStorage.getItem('saadhanaTasks') || '[]');
              
              // Remove existing sadhana tasks for today
              const filteredTasks = existingTasks.filter((task: any) => 
                !(task.sadhanaId === sadhanaState.sadhanaId && task.dueDate === todayStr)
              );
              
              // Create fresh tasks for today
              const todayTasks = sadhanaData.offerings.map((offering, index) => ({
                id: Date.now() + index + Math.random() * 1000,
                title: offering,
                description: `Daily sadhana offering for your ${sadhanaData.durationDays}-day spiritual practice dedicated to ${sadhanaData.deity}`,
                completed: false,
                category: 'daily' as const,
                dueDate: todayStr,
                priority: 'high' as const,
                tags: ['sadhana', 'daily-practice'],
                sadhanaId: sadhanaState.sadhanaId,
                isRecurring: true
              }));
              
              // Save updated tasks
              const allTasks = [...filteredTasks, ...todayTasks];
              localStorage.setItem('saadhanaTasks', JSON.stringify(allTasks));
              localStorage.setItem(`sadhana_last_refresh_${sadhanaState.sadhanaId}`, todayStr);
              
              console.log(`Refreshed ${todayTasks.length} sadhana tasks for ${todayStr}`);
            } catch (error) {
              console.error('Failed to refresh sadhana tasks:', error);
            }
          }
        }
      }
    };

    // Refresh on component mount
    refreshSadhanaTasks();

    // Set up daily check at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const midnightTimer = setTimeout(() => {
      refreshSadhanaTasks();
      
      // Set up daily interval after first midnight trigger
      const dailyInterval = setInterval(refreshSadhanaTasks, 24 * 60 * 60 * 1000); // 24 hours
      
      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    return () => {
      clearTimeout(midnightTimer);
    };
  }, [sadhanaState.hasStarted, sadhanaState.sadhanaId, sadhanaData]);

  // Also provide manual refresh function
  const manualRefresh = () => {
    if (sadhanaState.hasStarted && sadhanaData && sadhanaState.sadhanaId) {
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');
      
      try {
        const existingTasks = JSON.parse(localStorage.getItem('saadhanaTasks') || '[]');
        
        // Remove existing sadhana tasks for today
        const filteredTasks = existingTasks.filter((task: any) => 
          !(task.sadhanaId === sadhanaState.sadhanaId && task.dueDate === todayStr)
        );
        
        // Create fresh tasks for today
        const todayTasks = sadhanaData.offerings.map((offering, index) => ({
          id: Date.now() + index + Math.random() * 1000,
          title: offering,
          description: `Daily sadhana offering for your ${sadhanaData.durationDays}-day spiritual practice dedicated to ${sadhanaData.deity}`,
          completed: false,
          category: 'daily' as const,
          dueDate: todayStr,
          priority: 'high' as const,
          tags: ['sadhana', 'daily-practice'],
          sadhanaId: sadhanaState.sadhanaId,
          isRecurring: true
        }));
        
        // Save updated tasks
        const allTasks = [...filteredTasks, ...todayTasks];
        localStorage.setItem('saadhanaTasks', JSON.stringify(allTasks));
        localStorage.setItem(`sadhana_last_refresh_${sadhanaState.sadhanaId}`, todayStr);
        
        // Dispatch custom event to notify Dashboard to reload tasks
        window.dispatchEvent(new CustomEvent('sadhana-tasks-refreshed'));
        
        console.log(`Manually refreshed ${todayTasks.length} sadhana tasks for ${todayStr}`);
      } catch (error) {
        console.error('Failed to manually refresh sadhana tasks:', error);
      }
    }
  };

  return {
    manualRefresh
  };
};