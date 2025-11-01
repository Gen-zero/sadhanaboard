
export interface Sadhana {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  category: 'daily' | 'goal';
  dueDate?: string;
  time?: string;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  reflection?: string;
  sadhanaId?: number; // Link to the sadhana that created this task
  streak?: number; // Add streak property
}


