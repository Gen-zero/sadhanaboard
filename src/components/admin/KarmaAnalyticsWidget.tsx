import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Zap } from 'lucide-react';
import CosmicChart from './CosmicChart';

const KarmaAnalyticsWidget: React.FC = () => {
  // Mock data for karma analytics
  const karmaData = [
    { day: 'Mon', karma: 65 },
    { day: 'Tue', karma: 78 },
    { day: 'Wed', karma: 82 },
    { day: 'Thu', karma: 71 },
    { day: 'Fri', karma: 89 },
    { day: 'Sat', karma: 95 },
    { day: 'Sun', karma: 87 },
  ];

  const karmaStats = [
    { label: 'Weekly Karma', value: '1,248', change: '+12%', icon: Award },
    { label: 'Best Day', value: 'Saturday', change: '95 pts', icon: Target },
    { label: 'Avg. Daily', value: '81', change: '+5%', icon: TrendingUp },
    { label: 'Active Souls', value: '142', change: '+8%', icon: Zap },
  ];

  return (
    <Card className="cosmic-card">
      <div className="cosmic-card-glow"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-400" />
          Karma Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {karmaStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="text-center p-3 rounded-lg bg-background/40 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Icon className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                <div className="text-lg font-bold cosmic-metric-value">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
                <div className="text-xs text-green-400 mt-1">
                  {stat.change}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="h-64">
          <CosmicChart 
            data={karmaData} 
            type="line" 
            dataKey="karma" 
            xAxisKey="day"
            colors={['#ffd700', '#ff6b6b']}
          />
        </div>
        
        <motion.div 
          className="mt-4 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          🌟 Tracking spiritual growth through karma points
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default KarmaAnalyticsWidget;