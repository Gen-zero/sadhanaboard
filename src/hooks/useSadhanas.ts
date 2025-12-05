import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * Query key factory for sadhanas
 * Ensures consistent cache key structure
 */
export const sadhanaKeys = {
  all: ['sadhanas'] as const,
  lists: () => [...sadhanaKeys.all, 'list'] as const,
  list: (filters?: any) => [...sadhanaKeys.lists(), { filters }] as const,
  details: () => [...sadhanaKeys.all, 'detail'] as const,
  detail: (id: string) => [...sadhanaKeys.details(), id] as const,
  progress: () => [...sadhanaKeys.all, 'progress'] as const,
  progressDetail: (id: string) => [...sadhanaKeys.progress(), id] as const,
};

/**
 * Hook: Fetch user's sadhanas
 */
export const useSadhanas = (filters?: {
  status?: string;
  category?: string;
  sortBy?: string;
}) => {
  return useQuery({
    queryKey: sadhanaKeys.list(filters),
    queryFn: async () => {
      const response = await api.getUserSadhanas();
      // Optional: Filter/sort on client side if needed
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });
};

/**
 * Hook: Fetch single sadhana by ID
 */
export const useSadhana = (id: string, enabled: boolean = true) => {
  const { data: sadhanas } = useSadhanas();

  // Try to get from list cache first
  const cachedSadhana = sadhanas?.find((s: any) => s._id === id);

  return useQuery({
    queryKey: sadhanaKeys.detail(id),
    queryFn: async () => {
      // Return cached version if available
      if (cachedSadhana) return cachedSadhana;

      // Otherwise fetch from API
      const response = await api.get(`/sadhanas/${id}`);
      return response;
    },
    enabled: !!id && enabled,
    initialData: cachedSadhana,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });
};

/**
 * Hook: Fetch sadhana progress
 */
export const useSadhanaProgress = (sadhanaId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: sadhanaKeys.progressDetail(sadhanaId),
    queryFn: async () => {
      const response = await api.getSadhanaProgress(sadhanaId);
      return response;
    },
    enabled: !!sadhanaId && enabled,
    staleTime: 1000 * 60 * 1, // 1 minute (progress changes frequently)
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });
};

/**
 * Hook: Create a new sadhana
 */
export const useCreateSadhana = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sadhanaData: any) => {
      const response = await api.createSadhana(sadhanaData);
      return response;
    },
    onSuccess: (newSadhana) => {
      // Invalidate sadhanas list to refetch
      queryClient.invalidateQueries({ queryKey: sadhanaKeys.lists() });
      // Add to detail cache
      queryClient.setQueryData(sadhanaKeys.detail(newSadhana._id), newSadhana);
    },
    onError: (error) => {
      console.error('Failed to create sadhana:', error);
    },
  });
};

/**
 * Hook: Update sadhana
 */
export const useUpdateSadhana = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sadhanaData: any) => {
      const response = await api.updateSadhana(id, sadhanaData);
      return response;
    },
    // Optimistic update
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: sadhanaKeys.detail(id) });

      // Snapshot the previous value
      const previousSadhana = queryClient.getQueryData(sadhanaKeys.detail(id));

      // Optimistically update to the new value
      queryClient.setQueryData(sadhanaKeys.detail(id), (old: any) => ({
        ...old,
        ...newData,
      }));

      return { previousSadhana };
    },
    onSuccess: (updatedSadhana) => {
      // Update cache
      queryClient.setQueryData(sadhanaKeys.detail(id), updatedSadhana);
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: sadhanaKeys.lists() });
    },
    onError: (error, newData, context: any) => {
      // Revert optimistic update on error
      if (context?.previousSadhana) {
        queryClient.setQueryData(sadhanaKeys.detail(id), context.previousSadhana);
      }
      console.error('Failed to update sadhana:', error);
    },
  });
};

/**
 * Hook: Delete sadhana
 */
export const useDeleteSadhana = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.deleteSadhana(id);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: sadhanaKeys.detail(deletedId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: sadhanaKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete sadhana:', error);
    },
  });
};

/**
 * Hook: Update sadhana progress
 */
export const useUpsertSadhanaProgress = (sadhanaId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (progressData: any) => {
      const response = await api.upsertSadhanaProgress(sadhanaId, progressData);
      return response;
    },
    // Optimistic update
    onMutate: async (newProgress) => {
      await queryClient.cancelQueries({ queryKey: sadhanaKeys.progressDetail(sadhanaId) });

      const previousProgress = queryClient.getQueryData(sadhanaKeys.progressDetail(sadhanaId));

      // Update progress cache optimistically
      queryClient.setQueryData(sadhanaKeys.progressDetail(sadhanaId), (old: any) => ({
        ...old,
        ...newProgress,
      }));

      return { previousProgress };
    },
    onSuccess: (updatedProgress) => {
      // Update cache with actual response
      queryClient.setQueryData(sadhanaKeys.progressDetail(sadhanaId), updatedProgress);
      // Invalidate sadhana detail (might include progress info)
      queryClient.invalidateQueries({ queryKey: sadhanaKeys.detail(sadhanaId) });
    },
    onError: (error, newProgress, context: any) => {
      // Revert on error
      if (context?.previousProgress) {
        queryClient.setQueryData(sadhanaKeys.progressDetail(sadhanaId), context.previousProgress);
      }
      console.error('Failed to update sadhana progress:', error);
    },
  });
};

/**
 * Hook: Get active sadhanas (status = 'active')
 */
export const useActiveSadhanas = () => {
  const { data: allSadhanas, ...rest } = useSadhanas();

  const activeSadhanas = allSadhanas?.filter((s: any) => s.status === 'active') || [];

  return {
    data: activeSadhanas,
    ...rest,
  };
};

/**
 * Hook: Get completed sadhanas (status = 'completed')
 */
export const useCompletedSadhanas = () => {
  const { data: allSadhanas, ...rest } = useSadhanas();

  const completedSadhanas = allSadhanas?.filter((s: any) => s.status === 'completed') || [];

  return {
    data: completedSadhanas,
    ...rest,
  };
};

/**
 * Hook: Calculate sadhana statistics
 */
export const useSadhanaStats = () => {
  const { data: sadhanas, isLoading, isError } = useSadhanas();

  const stats = {
    total: sadhanas?.length || 0,
    active: sadhanas?.filter((s: any) => s.status === 'active').length || 0,
    completed: sadhanas?.filter((s: any) => s.status === 'completed').length || 0,
    paused: sadhanas?.filter((s: any) => s.status === 'paused').length || 0,
  };

  return {
    stats,
    isLoading,
    isError,
  };
};
