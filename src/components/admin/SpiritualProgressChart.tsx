import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WeeklyEntry } from '@/types/admin-dashboard';
import { motion } from 'framer-motion';
import { Brain, Heart } from 'lucide-react';

type Row = { day?: string; date: string; logins?: number; completions?: number };

export default function SpiritualProgressChart({ data }: { data?: Row[] }) {
  const [showCompletions, setShowCompletions] = useState(true);
  const [showLogins, setShowLogins] = useState(true);

  const merged = useMemo(() => (data || []).map((d, i) => ({ day: d.day ?? `D${i + 1}`, date: d.date, logins: d.logins ?? 0, completions: d.completions ?? 0 } as Row)), [data]);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/80 backdrop-blur-md p-3 rounded-lg border border-purple-500/20 shadow-lg">
          <p className="font-bold text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'logins' ? '👥 Souls Entering:' : '🏆 Practices Completed:'} {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="cosmic-card">
      <div className="cosmic-card-glow"></div>
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Spiritual Progress
          </CardTitle>
          <div className="flex items-center space-x-4">
            <label className="text-sm flex items-center space-x-2 cosmic-button px-2 py-1">
              <input 
                type="checkbox" 
                checked={showLogins} 
                onChange={() => setShowLogins(v => !v)} 
                className="mr-1"
              /> 
              <span>👥 Logins</span>
            </label>
            <label className="text-sm flex items-center space-x-2 cosmic-button px-2 py-1">
              <input 
                type="checkbox" 
                checked={showCompletions} 
                onChange={() => setShowCompletions(v => !v)} 
                className="mr-1"
              /> 
              <span>🏆 Completions</span>
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div 
          style={{ width: '100%', height: 300 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={merged}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(138, 43, 226, 0.2)" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                axisLine={{ stroke: 'rgba(138, 43, 226, 0.3)' }}
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                axisLine={{ stroke: 'rgba(138, 43, 226, 0.3)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {showLogins && (
                <Line 
                  dataKey="logins" 
                  stroke="url(#loginsGradient)" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#10b981' }} 
                  activeDot={{ r: 8, fill: '#10b981' }}
                />
              )}
              {showCompletions && (
                <Line 
                  dataKey="completions" 
                  stroke="url(#completionsGradient)" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#8b5cf6' }} 
                  activeDot={{ r: 8, fill: '#8b5cf6' }}
                />
              )}
              <defs>
                <linearGradient id="loginsGradient" x1="0" y1="0" x2="100%" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="completionsGradient" x1="0" y1="0" x2="100%" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
        
        <motion.div 
          className="mt-4 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          🌟 Tracking spiritual growth across the universe
        </motion.div>
      </CardContent>
    </Card>
  );
}