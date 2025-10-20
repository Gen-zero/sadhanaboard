import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardSnapshot } from '@/types/admin-dashboard';
import { motion } from 'framer-motion';
import { Users, Zap, Heart, Star, BookOpen, Palette } from 'lucide-react';

export default function RealTimeMetricsCard({ stats }: { stats?: Partial<DashboardSnapshot> | null }) {
  // Animated counter component
  const AnimatedCounter = ({ value, label, icon: Icon, color }: { 
    value: number; 
    label: string; 
    icon: React.ComponentType<any>;
    color: string;
  }) => {
    const [displayValue, setDisplayValue] = React.useState(0);
    
    React.useEffect(() => {
      let start = 0;
      const end = value;
      if (start === end) return;
      
      const duration = 1000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          clearInterval(timer);
          setDisplayValue(end);
        } else {
          setDisplayValue(Math.ceil(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }, [value]);
    
    return (
      <motion.div
        className="text-center p-3 rounded-lg bg-background/40 backdrop-blur-sm"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="flex justify-center mb-2">
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="text-2xl font-bold cosmic-metric-value">
          {displayValue.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {label}
        </div>
      </motion.div>
    );
  };

  return (
    <Card className="cosmic-card">
      <div className="cosmic-card-glow"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          Real-time Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatedCounter 
            value={typeof stats?.totalUsers === 'number' ? stats.totalUsers : 0} 
            label="Total Souls" 
            icon={Users}
            color="text-blue-400"
          />
          <AnimatedCounter 
            value={typeof stats?.activeUsers === 'number' ? stats.activeUsers : 0} 
            label="Active Souls" 
            icon={Zap}
            color="text-yellow-400"
          />
          <AnimatedCounter 
            value={typeof stats?.activeSadhanas === 'number' ? stats.activeSadhanas : 0} 
            label="Active Sadhanas" 
            icon={Heart}
            color="text-pink-400"
          />
          <AnimatedCounter 
            value={typeof stats?.completedSadhanas === 'number' ? stats.completedSadhanas : 0} 
            label="Completed" 
            icon={Star}
            color="text-purple-400"
          />
          <AnimatedCounter 
            value={typeof stats?.uploadedBooks === 'number' ? stats.uploadedBooks : 0} 
            label="Sacred Texts" 
            icon={BookOpen}
            color="text-indigo-400"
          />
          <AnimatedCounter 
            value={typeof stats?.currentThemes === 'number' ? stats.currentThemes : 0} 
            label="Active Themes" 
            icon={Palette}
            color="text-cyan-400"
          />
        </div>
        
        <motion.div 
          className="mt-4 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          🌟 Updates in real-time
        </motion.div>
      </CardContent>
    </Card>
  );
}