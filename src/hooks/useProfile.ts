import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuth } from '@/lib/auth-context';
import { useSocket } from '@/contexts/SocketContext';

/**
 * Query key factory for profile
 */
export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
  settings: () => [...profileKeys.all, 'settings'] as const,
};

/**
 * Hook: Fetch user profile
 */
export const useProfile = (enabled: boolean = true) => {
  const { user, isLoading: authLoading } = useAuth();

  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: async () => {
      const response = await api.getProfile();
      // Handle both formats: { profile: {...} } and direct profile object
      return 'profile' in response ? response.profile : response;
    },
    enabled: enabled && !!user && !authLoading,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  });
};

/**
 * Hook: Update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: any) => {
      const response = await api.updateProfile(profileData);
      return response.profile || response;
    },
    // Optimistic update
    onMutate: async (newProfileData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: profileKeys.detail() });

      // Snapshot previous
      const previousProfile = queryClient.getQueryData(profileKeys.detail());

      // Update optimistically
      queryClient.setQueryData(profileKeys.detail(), (old: any) => ({
        ...old,
        ...newProfileData,
      }));

      return { previousProfile };
    },
    onSuccess: (updatedProfile) => {
      // Update cache with server response
      queryClient.setQueryData(profileKeys.detail(), updatedProfile);
    },
    onError: (error, newData, context: any) => {
      // Revert on error
      if (context?.previousProfile) {
        queryClient.setQueryData(profileKeys.detail(), context.previousProfile);
      }
      console.error('Failed to update profile:', error);
    },
  });
};

/**
 * Hook: Check/fetch onboarding status
 */
export const useOnboardingStatus = () => {
  const { isOnboardingComplete, checkOnboardingStatus, refreshOnboardingStatus } = useAuth();

  return {
    isComplete: isOnboardingComplete,
    checkStatus: checkOnboardingStatus,
    refresh: refreshOnboardingStatus,
  };
};

/**
 * Hook: Complete onboarding
 */
export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();
  const { refreshOnboardingStatus } = useAuth();

  return useMutation({
    mutationFn: async (onboardingData: any) => {
      // Update profile with onboarding_completed flag
      const response = await api.updateProfile({
        onboarding_completed: true,
        ...onboardingData,
      });
      return response;
    },
    onSuccess: async () => {
      // Refresh onboarding status in auth context
      await refreshOnboardingStatus();
      // Invalidate profile cache
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
    },
    onError: (error) => {
      console.error('Failed to complete onboarding:', error);
    },
  });
};

/**
 * Hook: Fetch user settings
 */
export const useUserSettings = (enabled: boolean = true) => {
  const { user, isLoading: authLoading } = useAuth();

  return useQuery({
    queryKey: profileKeys.settings(),
    queryFn: async () => {
      const response = await api.getUserSettings();
      return response;
    },
    enabled: enabled && !!user && !authLoading,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  });
};

/**
 * Hook: Update user settings
 */
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: any) => {
      const response = await api.updateUserSettings(settings);
      return response;
    },
    // Optimistic update
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: profileKeys.settings() });

      const previousSettings = queryClient.getQueryData(profileKeys.settings());

      queryClient.setQueryData(profileKeys.settings(), (old: any) => ({
        ...old,
        ...newSettings,
      }));

      return { previousSettings };
    },
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(profileKeys.settings(), updatedSettings);
    },
    onError: (error, newSettings, context: any) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(profileKeys.settings(), context.previousSettings);
      }
      console.error('Failed to update settings:', error);
    },
  });
};

/**
 * Hook: Watch/subscribe to profile changes via real-time updates
 */
export const useProfileRealtime = () => {
  const queryClient = useQueryClient();
  const { isConnected } = useSocket();

  // When real-time updates come in, invalidate profile cache
  const invalidateProfile = () => {
    queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
  };

  return {
    isRealtimeConnected: isConnected,
    invalidateProfile,
  };
};

/**
 * Hook: Get complete user data (profile + settings + auth info)
 */
export const useUserData = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: settings, isLoading: settingsLoading } = useUserSettings();

  return {
    user,
    profile,
    settings,
    isLoading: authLoading || profileLoading || settingsLoading,
    isReady: !!user && !!profile && !!settings,
  };
};
