
import { useState, useEffect } from 'react';
import { Sadhana } from '@/types/sadhana';
import { isToday, isPast, isFuture, parseISO, format } from 'date-fns';

interface GroupedSaadhanas {
  overdue: Sadhana[];
  today: Sadhana[];
  upcoming: Sadhana[];
  noDueDate: Sadhana[];
  completed: Sadhana[];
}

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  category: 'daily' | 'goal';
  dueDate?: string;
  time?: string;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  sadhanaId?: number;
  isRecurring?: boolean;
}

const STORAGE_KEY = 'saadhanas';
const TASKS_STORAGE_KEY = 'saadhanaTasks';

export const useSaadhanas = () => {
  const [saadhanas, setSaadhanas] = useState<Sadhana[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [reflectingSadhana, setReflectingSadhana] = useState<Sadhana | null>(null);
  const [reflectionText, setReflectionText] = useState('');

  // Load saadhanas from localStorage on mount
  useEffect(() => {
    const loadSaadhanas = () => {
      try {
        let allSaadhanas: Sadhana[] = [];
        
        // Load regular saadhanas
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedSaadhanas = JSON.parse(stored);
          allSaadhanas = [...parsedSaadhanas];
        }
        
        // Load and convert sadhana tasks to saadhana format
        const tasksStored = localStorage.getItem(TASKS_STORAGE_KEY);
        if (tasksStored) {
          const tasks: Task[] = JSON.parse(tasksStored);
          
          // Filter for sadhana tasks and convert to Sadhana format
          const sadhanaTasksConverted = tasks
            .filter(task => task.sadhanaId && task.category === 'daily')
            .map(task => ({
              id: task.id,
              title: task.title,
              description: task.description || `🙏 Daily sadhana practice - ${task.title}`,
              completed: task.completed,
              category: task.category,
              dueDate: task.dueDate || format(new Date(), 'yyyy-MM-dd'),
              time: task.time,
              priority: task.priority,
              tags: [...(task.tags || []), 'sadhana', 'daily-practice'],
              sadhanaId: task.sadhanaId,
              isSadhanaTask: true // Mark as sadhana task
            } as Sadhana & { isSadhanaTask: boolean }));
          
          allSaadhanas = [...allSaadhanas, ...sadhanaTasksConverted];
        }
        
        setSaadhanas(allSaadhanas);
      } catch (error) {
        console.log('Could not load saadhanas from localStorage');
      }
    };

    loadSaadhanas();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === TASKS_STORAGE_KEY) {
        loadSaadhanas();
      }
    };
    
    // Listen for sadhana task refresh events
    const handleTasksRefreshed = () => {
      loadSaadhanas();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sadhana-tasks-refreshed', handleTasksRefreshed);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sadhana-tasks-refreshed', handleTasksRefreshed);
    };
  }, []);

  // Save only regular saadhanas to localStorage (not sadhana tasks)
  useEffect(() => {
    try {
      const regularSaadhanas = saadhanas.filter(sadhana => !('isSadhanaTask' in sadhana));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(regularSaadhanas));
    } catch (error) {
      console.log('Could not save saadhanas to localStorage');
    }
  }, [saadhanas]);

  const handleAddSadhana = (newSadhana: Omit<Sadhana, 'id'>) => {
    const sadhana: Sadhana = {
      ...newSadhana,
      id: Date.now(),
    };
    setSaadhanas(prev => [...prev, sadhana]);
  };

  const handleUpdateSadhana = (updatedSadhana: Sadhana) => {
    setSaadhanas(prev => 
      prev.map(sadhana => 
        sadhana.id === updatedSadhana.id ? updatedSadhana : sadhana
      )
    );
  };

  const handleDeleteSadhana = (id: number) => {
    setSaadhanas(prev => prev.filter(sadhana => sadhana.id !== id));
  };

  const handleToggleCompletion = (sadhana: Sadhana) => {
    const updatedSadhana = { ...sadhana, completed: !sadhana.completed };
    
    // If this is a sadhana task, update it in the tasks storage as well
    if ('isSadhanaTask' in sadhana && (sadhana as any).isSadhanaTask) {
      try {
        const tasksStored = localStorage.getItem(TASKS_STORAGE_KEY);
        if (tasksStored) {
          const tasks: Task[] = JSON.parse(tasksStored);
          const updatedTasks = tasks.map(task => 
            task.id === sadhana.id 
              ? { ...task, completed: updatedSadhana.completed }
              : task
          );
          localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
        }
      } catch (error) {
        console.log('Could not update task completion in tasks storage');
      }
    }
    
    handleUpdateSadhana(updatedSadhana);
    
    if (updatedSadhana.completed) {
      setReflectingSadhana(updatedSadhana);
      setReflectionText(updatedSadhana.reflection || '');
    }
  };

  const handleSaveReflection = () => {
    if (reflectingSadhana) {
      const updatedSadhana = { ...reflectingSadhana, reflection: reflectionText };
      handleUpdateSadhana(updatedSadhana);
      setReflectingSadhana(null);
      setReflectionText('');
    }
  };

  // Filter and search saadhanas
  const filteredSaadhanas = saadhanas.filter(sadhana => {
    const matchesSearch = sadhana.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sadhana.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sadhana.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filter === 'all' || sadhana.priority === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Group saadhanas by status and due date
  const groupedSaadhanas: GroupedSaadhanas = filteredSaadhanas.reduce(
    (groups, sadhana) => {
      if (sadhana.completed) {
        groups.completed.push(sadhana);
      } else if (!sadhana.dueDate) {
        groups.noDueDate.push(sadhana);
      } else {
        const dueDate = parseISO(sadhana.dueDate);
        if (isToday(dueDate)) {
          groups.today.push(sadhana);
        } else if (isPast(dueDate)) {
          groups.overdue.push(sadhana);
        } else if (isFuture(dueDate)) {
          groups.upcoming.push(sadhana);
        }
      }
      return groups;
    },
    {
      overdue: [] as Sadhana[],
      today: [] as Sadhana[],
      upcoming: [] as Sadhana[],
      noDueDate: [] as Sadhana[],
      completed: [] as Sadhana[]
    }
  );

  return {
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    reflectingSadhana,
    setReflectingSadhana,
    reflectionText,
    setReflectionText,
    groupedSaadhanas,
    handleAddSadhana,
    handleUpdateSadhana,
    handleDeleteSadhana,
    handleToggleCompletion,
    handleSaveReflection
  };
};
