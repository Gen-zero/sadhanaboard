import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';
import PracticeTrendsChart from '@/components/analytics/PracticeTrendsChart';
import CompletionRatesChart from '@/components/analytics/CompletionRatesChart';
import StreakChart from '@/components/analytics/StreakChart';
import ComparativeAnalyticsChart from '@/components/analytics/ComparativeAnalyticsChart';
import PracticeHeatmapCalendar from '@/components/analytics/PracticeHeatmapCalendar';
import InsightsPanel from '@/components/analytics/InsightsPanel';
import AnalyticsExportPanel from '@/components/analytics/AnalyticsExportPanel';

// Define types for the data structures
interface PracticeTrend {
  date: string;
  minutes: number;
  // Add other properties as needed
}

interface CompletionRate {
  date: string;
  rate: number;
  // Add other properties as needed
}

interface HeatmapData {
  date: string;
  count: number;
  // Add other properties as needed
}

interface ComparativeData {
  insights: string[];
  // Add other properties as needed
}

interface CategoryInsightDetail {
  category: string;
  completionRate: number;
  status: string;
  // Add other properties as needed
}

interface CategoryInsights {
  recommendations?: string[];
  details?: CategoryInsightDetail[];
  // Add other properties as needed
}

const AnalyticsPage = () => {
  const { user } = useAuth();
  const { practiceTrends, completionRates, streaks, comparative, heatmap, categoryInsights, fetchPracticeTrends, fetchCompletionRates, fetchStreaks, fetchComparative, fetchHeatmap, fetchCategoryInsights } = useUserAnalytics(user?.id || '');

  useEffect(() => {
    fetchPracticeTrends();
    fetchCompletionRates();
    fetchStreaks();
    fetchComparative();
    fetchHeatmap(new Date().getFullYear());
    fetchCategoryInsights();
  }, [fetchPracticeTrends, fetchCompletionRates, fetchStreaks, fetchComparative, fetchHeatmap, fetchCategoryInsights]);

  // Extract data from the API responses
  const trendsData = practiceTrends && Array.isArray(practiceTrends.trends) 
    ? practiceTrends.trends 
    : [];
    
  const completionRatesData = completionRates && Array.isArray(completionRates.completionRates) 
    ? completionRates.completionRates 
    : [];
    
  const heatmapData = heatmap && Array.isArray(heatmap.data) 
    ? heatmap.data 
    : [];

  // Extract insights from different sources
  const insightsData: string[] = [];
  
  // From comparative analytics
  if (comparative && Array.isArray(comparative.insights)) {
    insightsData.push(...comparative.insights);
  }
  
  // From category insights recommendations
  if (categoryInsights && Array.isArray(categoryInsights.recommendations)) {
    insightsData.push(...categoryInsights.recommendations);
  }
  
  // From category insights details
  if (categoryInsights && Array.isArray(categoryInsights.details)) {
    categoryInsights.details.forEach((detail) => {
      insightsData.push(`Your ${detail.category} practice has a ${detail.completionRate}% completion rate and is ${detail.status}.`);
    });
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PracticeTrendsChart data={trendsData} />
                <CompletionRatesChart data={completionRatesData} />
              </div>
              <div className="space-y-4">
                <StreakChart data={streaks} />
                <ComparativeAnalyticsChart data={comparative} />
                <AnalyticsExportPanel />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent>
                  <h3 className="font-medium mb-2">Heatmap</h3>
                  <PracticeHeatmapCalendar data={heatmapData} />
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardContent>
                  <h3 className="font-medium mb-2">Insights</h3>
                  <InsightsPanel insights={insightsData} />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;