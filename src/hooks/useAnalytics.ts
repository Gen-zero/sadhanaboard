import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * Query key factory for analytics
 */
export const analyticsKeys = {
  all: ['analytics'] as const,
  userProgress: () => [...analyticsKeys.all, 'userProgress'] as const,
  practiceTrends: (timeframe?: string, granularity?: string) =>
    [...analyticsKeys.all, 'practiceTrends', timeframe, granularity] as const,
  completionRates: (groupBy?: string, timeframe?: string) =>
    [...analyticsKeys.all, 'completionRates', groupBy, timeframe] as const,
  streakAnalytics: () => [...analyticsKeys.all, 'streakAnalytics'] as const,
  communityAverages: (timeframe?: string) =>
    [...analyticsKeys.all, 'communityAverages', timeframe] as const,
  categoryInsights: () => [...analyticsKeys.all, 'categoryInsights'] as const,
  comparativeAnalytics: (timeframe?: string) =>
    [...analyticsKeys.all, 'comparativeAnalytics', timeframe] as const,
};

/**
 * Hook: Fetch user progress metrics
 */
export const useUserProgress = (enabled: boolean = true) => {
  return useQuery({
    queryKey: analyticsKeys.userProgress(),
    queryFn: async () => {
      const response = await api.get('/sadhanas/analytics/user-progress');
      return response;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: 1,
  });
};

/**
 * Hook: Fetch practice trends
 */
export const usePracticeTrends = (
  timeframe: string = '30d',
  granularity: string = 'daily',
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: analyticsKeys.practiceTrends(timeframe, granularity),
    queryFn: async () => {
      const response = await api.get(
        `/sadhanas/analytics/practice-trends?timeframe=${timeframe}&granularity=${granularity}`
      );
      return response;
    },
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  });
};

/**
 * Hook: Fetch completion rates
 */
export const useCompletionRates = (
  groupBy: string = 'category',
  timeframe: string = '30d',
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: analyticsKeys.completionRates(groupBy, timeframe),
    queryFn: async () => {
      const response = await api.get(
        `/sadhanas/analytics/completion-rates?groupBy=${groupBy}&timeframe=${timeframe}`
      );
      return response;
    },
    enabled,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
};

/**
 * Hook: Fetch streak analytics
 */
export const useStreakAnalytics = (enabled: boolean = true) => {
  return useQuery({
    queryKey: analyticsKeys.streakAnalytics(),
    queryFn: async () => {
      const response = await api.get('/sadhanas/analytics/streak-analytics');
      return response;
    },
    enabled,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
};

/**
 * Hook: Fetch community averages
 */
export const useCommunityAverages = (
  timeframe: string = '30d',
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: analyticsKeys.communityAverages(timeframe),
    queryFn: async () => {
      const response = await api.get(`/sadhanas/analytics/community-averages?timeframe=${timeframe}`);
      return response;
    },
    enabled,
    staleTime: 1000 * 60 * 30, // 30 minutes (less frequently updated)
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
};

/**
 * Hook: Fetch category insights
 */
export const useCategoryInsights = (enabled: boolean = true) => {
  return useQuery({
    queryKey: analyticsKeys.categoryInsights(),
    queryFn: async () => {
      const response = await api.get('/sadhanas/analytics/category-insights');
      return response;
    },
    enabled,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
};

/**
 * Hook: Fetch comparative analytics (user vs community)
 */
export const useComparativeAnalytics = (
  timeframe: string = '30d',
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: analyticsKeys.comparativeAnalytics(timeframe),
    queryFn: async () => {
      const response = await api.get(`/sadhanas/analytics/comparative?timeframe=${timeframe}`);
      return response;
    },
    enabled,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
    retry: 1,
  });
};

/**
 * Hook: Get all analytics data combined (dashboard view)
 */
export const useAnalyticsDashboard = (timeframe: string = '30d', enabled: boolean = true) => {
  const userProgress = useUserProgress(enabled);
  const practiceTrends = usePracticeTrends(timeframe, 'daily', enabled);
  const completionRates = useCompletionRates('category', timeframe, enabled);
  const streakAnalytics = useStreakAnalytics(enabled);
  const communityAverages = useCommunityAverages(timeframe, enabled);
  const categoryInsights = useCategoryInsights(enabled);
  const comparativeAnalytics = useComparativeAnalytics(timeframe, enabled);

  const isLoading =
    userProgress.isLoading ||
    practiceTrends.isLoading ||
    completionRates.isLoading ||
    streakAnalytics.isLoading ||
    communityAverages.isLoading ||
    categoryInsights.isLoading ||
    comparativeAnalytics.isLoading;

  const isError =
    userProgress.isError ||
    practiceTrends.isError ||
    completionRates.isError ||
    streakAnalytics.isError ||
    communityAverages.isError ||
    categoryInsights.isError ||
    comparativeAnalytics.isError;

  return {
    userProgress: userProgress.data,
    practiceTrends: practiceTrends.data,
    completionRates: completionRates.data,
    streakAnalytics: streakAnalytics.data,
    communityAverages: communityAverages.data,
    categoryInsights: categoryInsights.data,
    comparativeAnalytics: comparativeAnalytics.data,
    isLoading,
    isError,
    refetch: () => {
      userProgress.refetch();
      practiceTrends.refetch();
      completionRates.refetch();
      streakAnalytics.refetch();
      communityAverages.refetch();
      categoryInsights.refetch();
      comparativeAnalytics.refetch();
    },
  };
};

/**
 * Hook: Get quick performance summary
 */
export const usePerformanceSummary = () => {
  const { data: userProgress } = useUserProgress();
  const { data: streakAnalytics } = useStreakAnalytics();
  const { data: completionRates } = useCompletionRates();

  const summary = {
    totalSadhanas: userProgress?.totalSadhanas || 0,
    completedSadhanas: userProgress?.completedSadhanas || 0,
    completionPercentage: userProgress?.totalSadhanas
      ? Math.round((userProgress.completedSadhanas / userProgress.totalSadhanas) * 100)
      : 0,
    averageSessionMinutes: userProgress?.averageSessionMinutes || 0,
    recentPracticeDays: userProgress?.recentPracticeDays || 0,
    currentStreak: streakAnalytics?.currentStreak || 0,
    longestStreak: streakAnalytics?.longestStreak || 0,
    overallCompletionRate: completionRates?.overall?.overallRate || 0,
  };

  return summary;
};

/**
 * Hook: Get weekly summary
 */
export const useWeeklySummary = () => {
  const { data: trends } = usePracticeTrends('7d', 'daily');

  const weeklyData = trends?.trends || [];
  const totalCompletions = weeklyData.reduce((sum: number, day: any) => sum + day.completions, 0);
  const totalDuration = weeklyData.reduce((sum: number, day: any) => sum + day.totalDuration, 0);
  const avgDuration = weeklyData.length ? totalDuration / weeklyData.length : 0;

  return {
    weeklyCompletions: totalCompletions,
    weeklyDuration: totalDuration,
    averageDailyDuration: Math.round(avgDuration * 10) / 10,
    daysActive: weeklyData.filter((d: any) => d.completions > 0).length,
  };
};

/**
 * Hook: Track progress over time
 */
export const useProgressTracking = (timeframe: string = '30d') => {
  const { data: trends } = usePracticeTrends(timeframe, 'daily');

  const progressData = trends?.trends || [];
  const cumulativeProgress = progressData.reduce((acc: any[], current: any, index: number) => {
    const previous = acc[index - 1];
    const cumulative = {
      ...current,
      cumulativeCompletions: (previous?.cumulativeCompletions || 0) + current.completions,
      cumulativeDuration: (previous?.cumulativeDuration || 0) + current.totalDuration,
    };
    acc.push(cumulative);
    return acc;
  }, []);

  return cumulativeProgress;
};
