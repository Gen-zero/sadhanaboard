import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardSnapshot } from '@/types/admin-dashboard';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, TrendingUp, Award, Clock } from 'lucide-react';

interface UserEngagementAnalyticsProps {
  data?: Partial<DashboardSnapshot> | null;
}

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-md p-3 rounded-lg border border-purple-500/20 shadow-lg">
        <p className="font-bold text-foreground">{label}</p>
        <p className="text-sm text-cyan-400">Engagement: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function UserEngagementAnalytics({ data }: UserEngagementAnalyticsProps) {
  // Mock engagement data - in a real app, this would come from the API
  const engagementData = [
    { day: 'Mon', engagement: 65 },
    { day: 'Tue', engagement: 72 },
    { day: 'Wed', engagement: 68 },
    { day: 'Thu', engagement: 80 },
    { day: 'Fri', engagement: 75 },
    { day: 'Sat', engagement: 85 },
    { day: 'Sun', engagement: 90 },
  ];

  // Top users data
  const topUsers = [
    { name: 'Alex Morgan', score: 98, practices: 12 },
    { name: 'Sam Wilson', score: 95, practices: 11 },
    { name: 'Taylor Kim', score: 92, practices: 10 },
    { name: 'Jordan Lee', score: 89, practices: 9 },
    { name: 'Casey Smith', score: 87, practices: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Engagement Chart Card */}
      <Card className="cosmic-card">
        <div className="cosmic-card-glow"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            Weekly Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            style={{ width: '100%', height: 250 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(138, 43, 226, 0.2)" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                  axisLine={{ stroke: 'rgba(138, 43, 226, 0.3)' }}
                />
                <YAxis 
                  tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                  axisLine={{ stroke: 'rgba(138, 43, 226, 0.3)' }}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="engagement" radius={[4, 4, 0, 0]}>
                  {engagementData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index % 2 === 0 ? 'url(#engagementGradient1)' : 'url(#engagementGradient2)'} 
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="engagementGradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  </linearGradient>
                  <linearGradient id="engagementGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </CardContent>
      </Card>

      {/* Top Users Card */}
      <Card className="cosmic-card">
        <div className="cosmic-card-glow"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-400" />
            Top Devotees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <motion.div
                key={user.name}
                className="flex items-center justify-between p-3 rounded-lg bg-background/40 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 mr-3">
                    <span className="text-sm font-bold text-purple-300">#{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.practices} practices</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold cosmic-metric-value mr-1">{user.score}</span>
                  <span className="text-xs text-muted-foreground">pts</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary Card */}
      <Card className="cosmic-card">
        <div className="cosmic-card-glow"></div>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-background/40 backdrop-blur-sm">
              <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold cosmic-metric-value">
                {typeof data?.totalUsers === 'number' ? data.totalUsers : '0'}
              </div>
              <div className="text-xs text-muted-foreground">Total Souls</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/40 backdrop-blur-sm">
              <Clock className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-xl font-bold cosmic-metric-value">
                {typeof data?.averagePracticeMinutes === 'number' ? Math.round(data.averagePracticeMinutes) : '0'}
              </div>
              <div className="text-xs text-muted-foreground">Avg. Minutes/Day</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}