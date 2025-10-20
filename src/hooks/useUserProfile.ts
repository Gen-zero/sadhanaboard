import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/profile';

interface UseUserProfileReturn {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<boolean>;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getProfile();
      setProfile(response.profile);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to fetch profile data');
      toast({
        title: 'Error',
        description: 'Failed to load profile data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateProfile = useCallback(async (data: Partial<Profile>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.updateProfile(data);
      setProfile(response.profile);
      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
      return true;
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      toast({
        title: 'Error',
        description: err.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
  };
};