import { api } from '@/services/api';

export interface SadhanaProgress {
  id: string;
  sadhanaId: string;
  userId: string;
  progressDate: string; // YYYY-MM-DD
  completed: boolean;
  durationMinutes?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertSadhanaProgressRequest {
  progressDate?: string;
  completed?: boolean;
  durationMinutes?: number;
  notes?: string;
}

export const sadhanaProgressService = {
  // Get progress for a specific sadhana
  getSadhanaProgress: async (sadhanaId: string): Promise<SadhanaProgress[]> => {
    try {
      const response = await api.getSadhanaProgress(sadhanaId);
      return response.progress || [];
    } catch (error) {
      console.error(`Error fetching progress for sadhana ${sadhanaId}:`, error);
      throw error;
    }
  },

  // Get progress for a specific date range
  getProgressForDateRange: async (
    startDate: string,
    endDate: string
  ): Promise<SadhanaProgress[]> => {
    try {
      // This would need to be implemented in the API service
      // For now, we'll return an empty array
      console.warn('getProgressForDateRange not implemented');
      return [];
    } catch (error) {
      console.error('Error fetching progress for date range:', error);
      throw error;
    }
  },

  // Create or update progress for a specific sadhana on a specific date
  upsertSadhanaProgress: async (
    sadhanaId: string,
    progressData: UpsertSadhanaProgressRequest
  ): Promise<SadhanaProgress> => {
    try {
      const response = await api.upsertSadhanaProgress(sadhanaId, progressData);
      return response.progress;
    } catch (error) {
      console.error(`Error updating progress for sadhana ${sadhanaId}:`, error);
      throw error;
    }
  },

  // Mark a sadhana as completed for today
  markCompletedForToday: async (sadhanaId: string): Promise<SadhanaProgress> => {
    const today = new Date().toISOString().split('T')[0];
    return sadhanaProgressService.upsertSadhanaProgress(sadhanaId, {
      progressDate: today,
      completed: true
    });
  },

  // Mark a sadhana as not completed for today
  markNotCompletedForToday: async (sadhanaId: string): Promise<SadhanaProgress> => {
    const today = new Date().toISOString().split('T')[0];
    return sadhanaProgressService.upsertSadhanaProgress(sadhanaId, {
      progressDate: today,
      completed: false
    });
  }
};