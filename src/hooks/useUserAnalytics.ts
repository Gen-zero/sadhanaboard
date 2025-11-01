import { useEffect, useState, useCallback } from 'react';
import { analyticsApi } from '@/services/analyticsApi';

// Define types for the analytics data
interface PracticeTrend {
  date: string;
  count: number;
}

interface CompletionRate {
  category: string;
  rate: number;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string;
}

interface HeatmapData {
  date: string;
  count: number;
}

interface CategoryInsight {
  category: string;
  totalPractices: number;
  completionRate: number;
}

/**
 * Comprehensive useUserAnalytics hook
 * Provides methods to fetch practice trends, completion rates, streaks, comparative analytics, heatmap and category insights.
 */
export function useUserAnalytics(userId: string | number) {
  const [practiceTrends, setPracticeTrends] = useState<PracticeTrend[] | null>(null);
  const [completionRates, setCompletionRates] = useState<CompletionRate[] | null>(null);
  const [streaks, setStreaks] = useState<StreakData | null>(null);
  const [comparative, setComparative] = useState<unknown | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapData[] | null>(null);
  const [categoryInsights, setCategoryInsights] = useState<CategoryInsight[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const fetchPracticeTrends = useCallback(async (timeframe = '30d', granularity = 'daily') => {
    setLoading(true);
    try {
      const res = await analyticsApi.getPracticeTrends(userId, timeframe, granularity);
      setPracticeTrends(res);
      setError(null);
      setLoading(false);
      return res;
    } catch (e) { setError(e); setLoading(false); throw e; }
  }, [userId]);

  const fetchCompletionRates = useCallback(async (groupBy = 'category', timeframe = '30d') => {
    setLoading(true);
    try {
      const res = await analyticsApi.getCompletionRates(userId, groupBy, timeframe);
      setCompletionRates(res);
      setError(null);
      setLoading(false);
      return res;
    } catch (e) { setError(e); setLoading(false); throw e; }
  }, [userId]);

  const fetchStreaks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getStreaks(userId);
      setStreaks(res);
      setError(null);
      setLoading(false);
      return res;
    } catch (e) { setError(e); setLoading(false); throw e; }
  }, [userId]);

  const fetchComparative = useCallback(async (timeframe = '30d') => {
    setLoading(true);
    try {
      const res = await analyticsApi.getComparative(userId, timeframe);
      setComparative(res);
      setError(null);
      setLoading(false);
      return res;
    } catch (e) { setError(e); setLoading(false); throw e; }
  }, [userId]);

  const fetchHeatmap = useCallback(async (year?: number) => {
    setLoading(true);
    try {
      const res = await analyticsApi.getHeatmap(userId, year);
      setHeatmap(res);
      setError(null);
      setLoading(false);
      return res;
    } catch (e) { setError(e); setLoading(false); throw e; }
  }, [userId]);

  const fetchCategoryInsights = useCallback(async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getCategoryInsights(userId);
      setCategoryInsights(res);
      setError(null);
      setLoading(false);
      return res;
    } catch (e) { setError(e); setLoading(false); throw e; }
  }, [userId]);

  return {
    practiceTrends, completionRates, streaks, comparative, heatmap, categoryInsights,
    loading, error,
    fetchPracticeTrends, fetchCompletionRates, fetchStreaks, fetchComparative, fetchHeatmap, fetchCategoryInsights
  };
}