import { api } from './api';

export interface CustomSadhana {
  id: string;
  user_id: string;
  name: string;
  description: string;
  purpose: string;
  goal: string;
  deity: string;
  message: string;
  offerings: string[];
  duration_days: number;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomSadhanaRequest {
  name: string;
  description: string;
  purpose: string;
  goal: string;
  deity: string;
  message: string;
  offerings: string[];
  duration_days: number;
}

export interface UpdateCustomSadhanaRequest {
  name?: string;
  description?: string;
  purpose?: string;
  goal?: string;
  deity?: string;
  message?: string;
  offerings?: string[];
  duration_days?: number;
  is_draft?: boolean;
}

export const customSadhanaService = {
  // Get all custom sadhanas for the current user
  getAll: async (): Promise<CustomSadhana[]> => {
    try {
      const customSadhanas = await api.get<{ customSadhanas: CustomSadhana[] }>('/custom-sadhanas');
      return customSadhanas.customSadhanas;
    } catch (error) {
      console.error('Error fetching custom sadhanas:', error);
      throw error;
    }
  },

  // Get a specific custom sadhana by ID
  getById: async (id: string): Promise<CustomSadhana> => {
    try {
      const customSadhana = await api.get<{ customSadhana: CustomSadhana }>(`/custom-sadhanas/${id}`);
      return customSadhana.customSadhana;
    } catch (error) {
      console.error(`Error fetching custom sadhana with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new custom sadhana
  create: async (data: CreateCustomSadhanaRequest): Promise<CustomSadhana> => {
    try {
      const customSadhana = await api.post<{ customSadhana: CustomSadhana }>('/custom-sadhanas', data);
      return customSadhana.customSadhana;
    } catch (error) {
      console.error('Error creating custom sadhana:', error);
      throw error;
    }
  },

  // Update an existing custom sadhana
  update: async (id: string, data: UpdateCustomSadhanaRequest): Promise<CustomSadhana> => {
    try {
      const customSadhana = await api.put<{ customSadhana: CustomSadhana }>(`/custom-sadhanas/${id}`, data);
      return customSadhana.customSadhana;
    } catch (error) {
      console.error(`Error updating custom sadhana with id ${id}:`, error);
      throw error;
    }
  },

  // Delete a custom sadhana
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/custom-sadhanas/${id}`);
    } catch (error) {
      console.error(`Error deleting custom sadhana with id ${id}:`, error);
      throw error;
    }
  }
};