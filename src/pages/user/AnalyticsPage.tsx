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
  }, []);

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
                <PracticeTrendsChart data={practiceTrends?.trends || []} />
                <CompletionRatesChart data={completionRates?.completionRates || []} />
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
                  <PracticeHeatmapCalendar data={heatmap?.data || []} />
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardContent>
                  <h3 className="font-medium mb-2">Insights</h3>
                  <InsightsPanel insights={comparative?.insights || categoryInsights?.recommendations || []} />
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
