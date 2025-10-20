import { useEffect, useState, useRef } from 'react';
import type { DashboardSnapshot, ProgressStats, WeeklyEntry } from '@/types/admin-dashboard';
import type { SystemHealth } from '@/types/system';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/services/adminApi';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Users, Activity, BookOpen, Palette, UserCheck, TrendingUp, Zap, Heart, Brain, Star } from 'lucide-react';
import { useRealTimeDashboard } from '@/hooks/useRealTimeDashboard';
import RealTimeMetricsCard from '@/components/admin/RealTimeMetricsCard';
import SpiritualProgressChart from '@/components/admin/SpiritualProgressChart';
import SystemHealthMonitor from '@/components/admin/SystemHealthMonitor';
import UserEngagementAnalytics from '@/components/admin/UserEngagementAnalytics';
import { motion } from 'framer-motion';
import CosmicBackground from '@/components/admin/CosmicBackground';
import KarmaAnalyticsWidget from '@/components/admin/KarmaAnalyticsWidget';
import ConsciousnessPulseWidget from '@/components/admin/ConsciousnessPulseWidget';
import CosmicAIAssistant from '@/components/admin/CosmicAIAssistant';

// Import cosmic styles
import '@/styles/admin-cosmic.css';

const AdminDashboardPage = () => {
  const { stats, error, connection } = useRealTimeDashboard();
  const [loading] = useState(false);
  const [usingHttpFallback, setUsingHttpFallback] = useState(false);
  const [httpStats, setHttpStats] = useState<DashboardSnapshot | null>(null);
  const [animatedValues, setAnimatedValues] = useState({
    totalUsers: 0,
    activeUsers: 0,
    activeSadhanas: 0,
    completedSadhanas: 0,
    uploadedBooks: 0,
    currentThemes: 0
  });

  // if stats is null after N seconds or error set, fallback to HTTP
  useEffect(() => {
    let cancelled = false;
    const FALLBACK_MS = 6000; // N seconds
    const timer = setTimeout(async () => {
      if (cancelled) return;
      // If the socket is disconnected, or we have no stats yet, or an error occurred, attempt HTTP fallback
      if (!stats || error || connection === 'disconnected') {
        try {
          const r = await adminApi.stats();
          const progress = await adminApi.getProgressStats().catch(() => null);
          const health = await adminApi.getHealthStats().catch(() => null);
          setUsingHttpFallback(true);

          const fallbackHealth: SystemHealth = {
            status: 'error',
            timestamp: new Date().toISOString(),
            error: 'Health unavailable',
          };

          const normalized: DashboardSnapshot = {
            totalUsers: r.totalUsers,
            activeUsers: r.activeUsers,
            activeSadhanas: r.activeSadhanas,
            completedSadhanas: r.completedSadhanas,
            uploadedBooks: r.uploadedBooks,
            currentThemes: r.currentThemes,
            recentLogins: r.recentLogins,
            todaysSadhanas: r.todaysSadhanas,
            weeklyLogins: progress?.weeklyLogins ?? r.weeklyLogins ?? [],
            weeklySadhanaCompletions: progress?.weeklySadhanaCompletions ?? r.weeklySadhanaCompletions ?? [],
            averagePracticeMinutes: (progress as any)?.averagePracticeMinutes ?? 0,
            topSessions: (progress as any)?.topSessions ?? [],
            systemHealth: (health && health.systemHealth) ? health.systemHealth : fallbackHealth,
          };

          setHttpStats(normalized);
        } catch (e) {
          // keep using socket state; show banner
          setUsingHttpFallback(true);
        }
      } else {
        // connection looks healthy — clear any HTTP fallback state
        if (usingHttpFallback) setUsingHttpFallback(false);
        if (httpStats) setHttpStats(null);
      }
    }, FALLBACK_MS);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [stats, error, connection]);

  // Animate metrics when they change
  useEffect(() => {
    if (stats || httpStats) {
      const targetStats = stats || httpStats;
      const duration = 1000; // 1 second
      const steps = 30;
      const interval = duration / steps;
      
      const startValues = { ...animatedValues };
      const targetValues = {
        totalUsers: targetStats?.totalUsers || 0,
        activeUsers: targetStats?.activeUsers || 0,
        activeSadhanas: targetStats?.activeSadhanas || 0,
        completedSadhanas: targetStats?.completedSadhanas || 0,
        uploadedBooks: targetStats?.uploadedBooks || 0,
        currentThemes: targetStats?.currentThemes || 0
      };
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setAnimatedValues({
          totalUsers: Math.floor(startValues.totalUsers + (targetValues.totalUsers - startValues.totalUsers) * progress),
          activeUsers: Math.floor(startValues.activeUsers + (targetValues.activeUsers - startValues.activeUsers) * progress),
          activeSadhanas: Math.floor(startValues.activeSadhanas + (targetValues.activeSadhanas - startValues.activeSadhanas) * progress),
          completedSadhanas: Math.floor(startValues.completedSadhanas + (targetValues.completedSadhanas - startValues.completedSadhanas) * progress),
          uploadedBooks: Math.floor(startValues.uploadedBooks + (targetValues.uploadedBooks - startValues.uploadedBooks) * progress),
          currentThemes: Math.floor(startValues.currentThemes + (targetValues.currentThemes - startValues.currentThemes) * progress)
        });
        
        if (step >= steps) {
          clearInterval(timer);
          setAnimatedValues(targetValues);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [stats, httpStats]);

  // Prepare chart data
  const mergeWeekly = (logins: WeeklyEntry[] = [], completions: WeeklyEntry[] = []) => {
    // build a map by date to merge values
    const m = new Map<string, { date: string; logins?: number; completions?: number }>();
    (logins || []).forEach(l => {
      m.set(l.date, { date: l.date, logins: l.logins ?? 0, completions: 0 });
    });
    (completions || []).forEach(c => {
      const existing = m.get(c.date);
      if (existing) existing.completions = c.completions ?? 0;
      else m.set(c.date, { date: c.date, logins: 0, completions: c.completions ?? 0 });
    });
    // sort by date ascending
    const arr = Array.from(m.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return arr.map((it, i) => ({ day: `D${i + 1}`, date: new Date(it.date).toLocaleDateString(), logins: it.logins, completions: it.completions }));
  };

  const effective = (stats as DashboardSnapshot | null) || httpStats || null;
  const mergedChartData = effective ? mergeWeekly(effective.weeklyLogins || [], effective.weeklySadhanaCompletions || []) : [];

  // Cosmic metrics cards with animations
  const metricsCards = [
    { 
      title: "👥 Total Souls", 
      value: animatedValues.totalUsers, 
      icon: Users, 
      color: "text-blue-400",
      description: "Registered souls in the universe"
    },
    { 
      title: "⚡ Active Souls", 
      value: animatedValues.activeUsers, 
      icon: Zap, 
      color: "text-yellow-400",
      description: "Spirits currently in meditation"
    },
    { 
      title: "🧘 Sadhanas Active", 
      value: animatedValues.activeSadhanas, 
      icon: Heart, 
      color: "text-pink-400",
      description: "Ongoing spiritual practices"
    },
    { 
      title: "🏆 Sadhanas Completed", 
      value: animatedValues.completedSadhanas, 
      icon: Star, 
      color: "text-purple-400",
      description: "Achieved spiritual milestones"
    },
    { 
      title: "📚 Sacred Texts", 
      value: animatedValues.uploadedBooks, 
      icon: BookOpen, 
      color: "text-indigo-400",
      description: "Wisdom preserved in the library"
    },
    { 
      title: "🎨 Active Themes", 
      value: animatedValues.currentThemes, 
      icon: Palette, 
      color: "text-cyan-400",
      description: "Cosmic themes in circulation"
    }
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-background/60 backdrop-blur-md border-purple-500/20 animate-pulse">
              <CardHeader><div className="h-4 bg-gray-300 rounded w-3/4"></div></CardHeader>
              <CardContent><div className="h-8 bg-gray-300 rounded w-1/2"></div></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Cosmic Background */}
      <div className="fixed inset-0 z-[-1]">
        <CosmicBackground />
      </div>
      
      {/* Cosmic AI Assistant */}
      <CosmicAIAssistant />
      
      {/* Cosmic Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          🌌 Cosmic Command Center
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitoring the spiritual universe in real-time
        </p>
      </motion.div>

      {usingHttpFallback && (
        <motion.div 
          className="p-3 rounded-md bg-yellow-100 text-yellow-800 border border-yellow-200"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Running in HTTP fallback mode — real-time socket is unavailable. Data updates will be polled by the client.
        </motion.div>
      )}
      
      {/* Cosmic Metrics Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {metricsCards.map((card, index) => (
          <motion.div
            key={card.title}
            className="cosmic-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
          >
            <div className="cosmic-card-glow"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold cosmic-metric-value">
                {card.value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </motion.div>
        ))}
      </motion.div>

      {/* New Cosmic Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KarmaAnalyticsWidget />
        <ConsciousnessPulseWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RealTimeMetricsCard stats={effective} />
        <SystemHealthMonitor health={effective?.systemHealth ?? null} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpiritualProgressChart data={mergedChartData} />
        <div className="space-y-6">
          <UserEngagementAnalytics data={effective} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="cosmic-card">
          <div className="cosmic-card-glow"></div>
          <CardHeader>
            <CardTitle>Today's Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Recent Logins (24h)</span>
              <span className="text-lg font-semibold cosmic-metric-value">{effective?.recentLogins ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">New Sadhanas Today</span>
              <span className="text-lg font-semibold cosmic-metric-value">{effective?.todaysSadhanas ?? 0}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cosmic-card">
          <div className="cosmic-card-glow"></div>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-md bg-purple-500/10 hover:bg-purple-500/20 transition-colors cosmic-button">
              View Recent Users
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md bg-purple-500/10 hover:bg-purple-500/20 transition-colors cosmic-button">
              Export Data
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md bg-purple-500/10 hover:bg-purple-500/20 transition-colors cosmic-button">
              System Health
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;