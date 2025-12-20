import { useState, useEffect } from 'react';
import { SadhanaData } from './useSadhanaData';
import { customSadhanaService, CustomSadhana as APICustomSadhana, CreateCustomSadhanaRequest } from '@/services/customSadhanaService';

export interface CustomSadhana extends SadhanaData {
  id: string;
  createdAt: string;
  name?: string;
  description?: string;
}

export const useCustomSadhanas = () => {
  const [customSadhanas, setCustomSadhanas] = useState<CustomSadhana[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load custom sadhanas from backend API on mount
  useEffect(() => {
    const loadCustomSadhanas = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiSadhanas = await customSadhanaService.getAll();
        console.log('Loaded custom sadhanas from API:', apiSadhanas);
        
        // Convert API format to local format
        const convertedSadhanas: CustomSadhana[] = apiSadhanas.map(sadhana => ({
          id: sadhana.id,
          purpose: sadhana.purpose,
          goal: sadhana.goal,
          deity: sadhana.deity,
          message: sadhana.message,
          offerings: sadhana.offerings,
          tasks: [],
          startDate: new Date().toISOString().split('T')[0], // Default to today
          endDate: new Date(Date.now() + sadhana.duration_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          durationDays: sadhana.duration_days,
          createdAt: sadhana.created_at,
          name: sadhana.name,
          description: sadhana.description
        }));
        
        setCustomSadhanas(convertedSadhanas);
      } catch (err) {
        console.error('Could not load custom sadhanas from API', err);
        setError('Failed to load custom sadhanas');
      } finally {
        setLoading(false);
      }
    };

    loadCustomSadhanas();
  }, []);

  const saveCustomSadhana = async (sadhana: any) => {
    try {
      console.log('Saving custom sadhana to API:', sadhana);
      
      // Convert local format to API format
      const apiSadhanaData: CreateCustomSadhanaRequest = {
        name: sadhana.name || 'Untitled Practice',
        description: sadhana.description || '',
        purpose: sadhana.purpose,
        goal: sadhana.goal,
        deity: sadhana.deity,
        message: sadhana.message,
        offerings: sadhana.offerings,
        duration_days: sadhana.durationDays
      };
      
      const createdSadhana = await customSadhanaService.create(apiSadhanaData);
      console.log('Custom sadhana saved to API:', createdSadhana);
      
      // Convert API format back to local format
      const convertedSadhana: CustomSadhana = {
        id: createdSadhana.id,
        purpose: createdSadhana.purpose,
        goal: createdSadhana.goal,
        deity: createdSadhana.deity,
        message: createdSadhana.message,
        offerings: createdSadhana.offerings,
        tasks: [],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + createdSadhana.duration_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        durationDays: createdSadhana.duration_days,
        createdAt: createdSadhana.created_at,
        name: createdSadhana.name,
        description: createdSadhana.description
      };
      
      setCustomSadhanas(prev => [...prev, convertedSadhana]);
      return convertedSadhana;
    } catch (err) {
      console.error('Could not save custom sadhana to API', err);
      throw err;
    }
  };

  const deleteCustomSadhana = async (id: string) => {
    try {
      console.log('Deleting custom sadhana with id:', id);
      await customSadhanaService.delete(id);
      setCustomSadhanas(prev => prev.filter(sadhana => sadhana.id !== id));
    } catch (err) {
      console.error('Could not delete custom sadhana from API', err);
      throw err;
    }
  };

  const updateCustomSadhana = async (updatedSadhana: CustomSadhana) => {
    try {
      console.log('Updating custom sadhana:', updatedSadhana);
      
      // Convert local format to API format for update
      const apiUpdateData = {
        name: updatedSadhana.name,
        description: updatedSadhana.description,
        purpose: updatedSadhana.purpose,
        goal: updatedSadhana.goal,
        deity: updatedSadhana.deity,
        message: updatedSadhana.message,
        offerings: updatedSadhana.offerings,
        duration_days: updatedSadhana.durationDays
      };
      
      const updatedApiSadhana = await customSadhanaService.update(updatedSadhana.id, apiUpdateData);
      
      // Convert API format back to local format
      const convertedSadhana: CustomSadhana = {
        id: updatedApiSadhana.id,
        purpose: updatedApiSadhana.purpose,
        goal: updatedApiSadhana.goal,
        deity: updatedApiSadhana.deity,
        message: updatedApiSadhana.message,
        offerings: updatedApiSadhana.offerings,
        tasks: [],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + updatedApiSadhana.duration_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        durationDays: updatedApiSadhana.duration_days,
        createdAt: updatedApiSadhana.created_at,
        name: updatedApiSadhana.name,
        description: updatedApiSadhana.description
      };
      
      setCustomSadhanas(prev => 
        prev.map(sadhana => 
          sadhana.id === convertedSadhana.id ? convertedSadhana : sadhana
        )
      );
    } catch (err) {
      console.error('Could not update custom sadhana in API', err);
      throw err;
    }
  };

  return {
    customSadhanas,
    loading,
    error,
    saveCustomSadhana,
    deleteCustomSadhana,
    updateCustomSadhana
  };
};