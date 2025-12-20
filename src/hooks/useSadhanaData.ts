import { useState, useEffect } from 'react';
import { addDays, format, isAfter, isSameDay } from 'date-fns';
import { StoreSadhana } from '@/types/store';
import { useSadhanaProgressContext } from '@/contexts/SadhanaProgressContext';

export interface SadhanaTask {
  id: string;
  description: string;
  deadline: string;
  isCompleted: boolean;
}

export interface SadhanaData {
  purpose: string;
  goal: string;
  deity: string;
  message: string;
  offerings: string[];
  tasks: SadhanaTask[];
  startDate: string;
  endDate: string;
  durationDays: number;
  durationMinutes?: number;
  durationUnit?: 'days' | 'minutes';
}

export interface SadhanaState {
  hasStarted: boolean;
  isCreating: boolean;
  isSelecting: boolean;
  data: SadhanaData | null;
  startedAt?: string;
  completedAt?: string;
  brokenAt?: string;
  status: 'active' | 'completed' | 'broken';
  sadhanaId?: number;
  selectedStoreSadhana?: StoreSadhana;
}

const STORAGE_KEY = 'sadhana-state';

const getInitialState = (): SadhanaState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedState = JSON.parse(stored);
      if (parsedState.hasStarted && parsedState.data && !parsedState.sadhanaId) {
        parsedState.sadhanaId = Date.now();
      }
      return parsedState;
    }
  } catch (error) {
    console.log('Could not load sadhana state from localStorage');
  }

  return {
    hasStarted: false,
    isCreating: false,
    isSelecting: false,
    data: null,
    status: 'active'
  };
};

const createOrRefreshDailySadhanaTasks = (sadhanaData: SadhanaData, sadhanaId: number) => {
  try {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const sadhanaStartDate = new Date(sadhanaData.startDate);
    const sadhanaEndDate = new Date(sadhanaData.endDate);

    if (today < sadhanaStartDate || today > sadhanaEndDate) {
      console.log('Sadhana not active today');
      return;
    }

    const existingTasks = JSON.parse(localStorage.getItem('saadhanaTasks') || '[]');

    const filteredTasks = existingTasks.filter((task: Record<string, unknown>) =>
      !(task.sadhanaId === sadhanaId && task.dueDate === todayStr)
    );

    const todayTasks = sadhanaData.offerings.map((offering, index) => ({
      id: Date.now() + index + Math.random() * 1000,
      title: offering,
      description: `Daily sadhana offering for your ${sadhanaData.durationDays}-day spiritual practice dedicated to ${sadhanaData.deity}`,
      completed: false,
      category: 'daily' as const,
      dueDate: todayStr,
      priority: 'high' as const,
      tags: ['sadhana', 'daily-practice'],
      sadhanaId: sadhanaId,
      isRecurring: true
    }));

    const allTasks = [...filteredTasks, ...todayTasks];
    localStorage.setItem('saadhanaTasks', JSON.stringify(allTasks));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sadhana-tasks-refreshed'));
    }

    console.log(`Created/refreshed ${todayTasks.length} sadhana tasks for today (${todayStr})`);
  } catch (error) {
    console.log('Could not create/refresh daily sadhana tasks:', error);
  }
};

const removeSadhanaTasksFromLocalStorage = (sadhanaId: number) => {
  try {
    const existingTasks = JSON.parse(localStorage.getItem('saadhanaTasks') || '[]');
    const filteredTasks = existingTasks.filter((task: Record<string, unknown>) => task.sadhanaId !== sadhanaId);
    localStorage.setItem('saadhanaTasks', JSON.stringify(filteredTasks));

    localStorage.removeItem(`sadhana_last_refresh_${sadhanaId}`);

    console.log(`Removed sadhana tasks from localStorage for sadhanaId: ${sadhanaId}`);
  } catch (error) {
    console.log('Could not remove sadhana tasks:', error);
  }
};

const createOneTimeSadhanaTasks = (sadhanaData: SadhanaData, sadhanaId: number) => {
  try {
    if (!sadhanaData.tasks || sadhanaData.tasks.length === 0) return;

    const existingTasks = JSON.parse(localStorage.getItem('saadhanaTasks') || '[]');

    const goalTasks = sadhanaData.tasks.map(task => ({
      id: task.id || Date.now() + Math.random() * 1000,
      title: task.description,
      description: `Goal task for your spiritual practice dedicated to ${sadhanaData.deity}`,
      completed: false,
      category: 'goal' as const,
      dueDate: task.deadline,
      priority: 'medium' as const,
      tags: ['sadhana', 'goal-task'],
      sadhanaId: sadhanaId,
      isRecurring: false
    }));

    const allTasks = [...existingTasks, ...goalTasks];
    localStorage.setItem('saadhanaTasks', JSON.stringify(allTasks));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sadhana-tasks-refreshed'));
    }

    console.log(`Created ${goalTasks.length} goal tasks for sadhanaId: ${sadhanaId}`);
  } catch (error) {
    console.log('Could not create goal tasks:', error);
  }
};

export const useSadhanaData = () => {
  const [sadhanaState, setSadhanaState] = useState<SadhanaState>(getInitialState);
  const { isDateCompleted, getProgressForDate } = useSadhanaProgressContext();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sadhanaState));
    } catch (error) {
      console.log('Could not save sadhana state to localStorage');
    }
  }, [sadhanaState]);

  const startSadhanaCreation = () => {
    setSadhanaState(prev => ({
      ...prev,
      isSelecting: true
    }));
  };

  const cancelSadhanaCreation = () => {
    setSadhanaState(prev => ({
      ...prev,
      isCreating: false,
      isSelecting: false
    }));
  };

  const createCustomSadhana = () => {
    setSadhanaState(prev => ({
      ...prev,
      isSelecting: false,
      isCreating: true
    }));
  };

  const selectStoreSadhana = (storeSadhana: StoreSadhana) => {
    const today = new Date();
    const endDate = addDays(today, storeSadhana.duration);

    const sadhanaData: SadhanaData = {
      purpose: `Embark on the ${storeSadhana.title} spiritual journey`,
      goal: storeSadhana.benefits.join(', '),
      deity: storeSadhana.deity || 'Divine Universal Consciousness',
      message: `I commit to this ${storeSadhana.duration}-day practice with devotion and discipline.`,
      offerings: storeSadhana.practices,
      tasks: [],
      startDate: format(today, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      durationDays: storeSadhana.duration
    };

    createSadhana(sadhanaData);
  };

  const createSadhana = (data: SadhanaData) => {
    // In a real implementation, this would create a sadhana on the backend
    // For now, we'll generate a mock ID
    const sadhanaId = Date.now();

    setSadhanaState({
      hasStarted: true,
      isCreating: false,
      isSelecting: false,
      data,
      startedAt: new Date().toISOString(),
      status: 'active',
      sadhanaId
    });
    
    // In a real implementation, we would create tasks on the backend
    // For now, we'll keep the existing local storage approach
    createOrRefreshDailySadhanaTasks(data, sadhanaId);
    createOneTimeSadhanaTasks(data, sadhanaId);
  };

  const updateSadhana = (data: SadhanaData) => {
    setSadhanaState(prev => ({
      ...prev,
      data
    }));
  };

  const completeSadhana = () => {
    if (!sadhanaState.data) return;

    const historicalSadhana = {
      id: Date.now().toString(),
      title: `${sadhanaState.data.durationDays}-Day Spiritual Practice`,
      ...sadhanaState.data,
      completedAt: new Date().toISOString(),
      status: 'completed' as const,
      actualDuration: sadhanaState.data.durationDays
    };

    window.dispatchEvent(new CustomEvent('sadhana-completed', { detail: historicalSadhana }));

    setSadhanaState(prev => ({
      ...prev,
      completedAt: new Date().toISOString(),
      status: 'completed'
    }));
  };

  // Mark a specific date as completed for the current sadhana
  const markDateAsCompleted = async (date: string, completed: boolean = true) => {
    if (!sadhanaState.sadhanaId) return;
    
    try {
      // In a real implementation, this would call our progress service
      // For now, we'll just dispatch an event to simulate the behavior
      window.dispatchEvent(
        new CustomEvent('sadhana-progress-updated', {
          detail: { 
            sadhanaId: sadhanaState.sadhanaId, 
            progress: { 
              progressDate: date, 
              completed 
            } 
          }
        })
      );
      
      console.log(`Marked date ${date} as ${completed ? 'completed' : 'not completed'} for sadhana ${sadhanaState.sadhanaId}`);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  // Check if a specific date is completed for the current sadhana
  const isDateCompletedForCurrentSadhana = (date: string): boolean => {
    if (!sadhanaState.sadhanaId) return false;
    return isDateCompleted(sadhanaState.sadhanaId.toString(), date);
  };

  // Get progress for a specific date for the current sadhana
  const getProgressForCurrentSadhanaDate = (date: string) => {
    if (!sadhanaState.sadhanaId) return undefined;
    return getProgressForDate(sadhanaState.sadhanaId.toString(), date);
  };

  const breakSadhana = () => {
    if (!sadhanaState.data) return;

    const sadhanaId = sadhanaState.sadhanaId || Date.now();

    const today = new Date();
    const startDate = new Date(sadhanaState.data.startDate);
    const diffTime = today.getTime() - startDate.getTime();
    const actualDuration = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const historicalSadhana = {
      id: Date.now().toString(),
      title: `${sadhanaState.data.durationDays}-Day Spiritual Practice (Broken)`,
      ...sadhanaState.data,
      brokenAt: new Date().toISOString(),
      status: 'broken' as const,
      actualDuration
    };

    window.dispatchEvent(new CustomEvent('sadhana-broken', { detail: historicalSadhana }));

    removeSadhanaTasksFromLocalStorage(sadhanaId);

    setSadhanaState(prev => ({
      ...prev,
      brokenAt: new Date().toISOString(),
      status: 'broken'
    }));
  };

  const resetSadhana = () => {
    if (sadhanaState.sadhanaId) {
      removeSadhanaTasksFromLocalStorage(sadhanaState.sadhanaId);
    }

    setSadhanaState({
      hasStarted: false,
      isCreating: false,
      isSelecting: false,
      data: null,
      status: 'active'
    });
  };

  const canComplete = (): boolean => {
    if (!sadhanaState.data) return false;
    const today = new Date();
    const endDate = new Date(sadhanaState.data.endDate);
    return isAfter(today, endDate) || isSameDay(today, endDate);
  };

  const getDaysRemaining = (): number => {
    if (!sadhanaState.data) return 0;
    const today = new Date();
    const endDate = new Date(sadhanaState.data.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getDaysCompleted = (): number => {
    if (!sadhanaState.data) return 0;
    const today = new Date();
    const startDate = new Date(sadhanaState.data.startDate);
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(diffDays, sadhanaState.data.durationDays));
  };

  const getProgress = (): number => {
    if (!sadhanaState.data) return 0;
    const completed = getDaysCompleted();
    return Math.min(100, (completed / sadhanaState.data.durationDays) * 100);
  };

  const formatPaperContent = (data: SadhanaData): string => {
    // Format duration based on unit
    let durationText = '';
    if (data.durationUnit === 'minutes') {
      durationText = `${data.durationMinutes} minute${data.durationMinutes && data.durationMinutes > 1 ? 's' : ''}`;
    } else {
      durationText = `${data.durationDays} days (${format(new Date(data.startDate), 'MMM dd, yyyy')} - ${format(new Date(data.endDate), 'MMM dd, yyyy')})`;
    }
    
    return `
Purpose:
${data.purpose}

Goal:
${data.goal}

Divine Focus:
${data.deity}

Duration:
${durationText}

Message:
"${data.message}"

My Offerings:
${data.offerings.map((o, i) => `${i + 1}. ${o}`).join('\n')}

My Goal Tasks:
${data.tasks && data.tasks.length > 0
        ? data.tasks.map((t, i) => `${i + 1}. ${t.description} (Target: ${format(new Date(t.deadline), 'MMM dd')})`).join('\n')
        : 'None defined'}
    `;
  };

  return {
    sadhanaState,
    sadhanaData: sadhanaState.data,
    paperContent: sadhanaState.data ? formatPaperContent(sadhanaState.data) : '',
    startSadhanaCreation,
    cancelSadhanaCreation,
    createCustomSadhana,
    selectStoreSadhana,
    createSadhana,
    updateSadhana,
    completeSadhana,
    breakSadhana,
    resetSadhana,
    markDateAsCompleted,
    isDateCompletedForCurrentSadhana,
    getProgressForCurrentSadhanaDate,
    canComplete: canComplete(),
    daysRemaining: getDaysRemaining(),
    daysCompleted: getDaysCompleted(),
    progress: getProgress()
  };
};
