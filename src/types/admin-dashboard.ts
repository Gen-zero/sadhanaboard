export interface WeeklyEntry {
  date: string; // ISO date
  logins?: number;
  completions?: number;
}

export interface DBPoolStatus {
  active: number | null;
  idle: number | null;
  total: number | null;
}

import type { SystemHealth } from '@/types/system';

export interface EngagementStats {
  averagePracticeMinutes: number;
  topSessions: Array<{ user_id: string | number; sessions: number }>;
}

export interface DashboardSnapshot extends EngagementStats {
  totalUsers: number;
  activeUsers: number;
  activeSadhanas: number;
  completedSadhanas: number;
  uploadedBooks: number;
  currentThemes: number;
  recentLogins?: number;
  todaysSadhanas?: number;
  weeklyLogins: WeeklyEntry[];
  weeklySadhanaCompletions: WeeklyEntry[];
  systemHealth: SystemHealth | null;
}

export interface ProgressStats {
  weeklyLogins: WeeklyEntry[];
  weeklySadhanaCompletions: WeeklyEntry[];
}

export interface HealthStats {
  systemHealth: SystemHealth | null;
}
