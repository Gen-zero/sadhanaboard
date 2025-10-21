export interface Book {
  id: string;
  title: string;
  author: string;
  traditions: string[];
  content: string;
  storage_url?: string;
  is_storage_file: boolean;
  description?: string;
  year?: number;
  language?: string;
  page_count?: number;
  cover_url?: string;
  file_size?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'suspended' | 'pending';
  lastActive: string;
  joinDate: string;
  practices: number;
}

export interface EnhancedUser extends User {
  profile?: {
    experience_level?: 'beginner' | 'intermediate' | 'advanced';
    traditions?: string[];
    onboarding_completed?: boolean;
    favorite_deity?: string;
  };
  analytics?: {
    total_sadhanas: number;
    streak: number;
    last_active: string;
  };
}

export interface UserSegmentationFilters {
  experience_level?: 'beginner' | 'intermediate' | 'advanced';
  onboarding_completed?: boolean;
  preset?: 'new_users' | 'active_practitioners' | 'advanced_students';
}

export interface SystemMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  icon: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}