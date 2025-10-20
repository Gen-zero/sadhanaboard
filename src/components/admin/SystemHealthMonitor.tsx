import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { SystemHealth } from '@/types/system';
import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive, MemoryStick } from 'lucide-react';

// Custom radial progress component for cosmic effect
const RadialProgress = ({ value, max = 100, label, color }: { 
  value: number; 
  max?: number; 
  label: string;
  color: string;
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDasharray = 2 * Math.PI * 45;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold cosmic-metric-value">{Math.round(percentage)}%</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </div>
    </div>
  );
};

function renderPercentOrNA(val: number | null | undefined) {
  if (val === null || val === undefined) return <span className="text-sm text-muted-foreground">N/A</span>;
  return <Progress value={Math.max(0, Math.min(100, Number(val)))} />;
}

export default function SystemHealthMonitor({ health }: { health?: SystemHealth | null }) {
  if (!health) {
    return (
      <Card className="cosmic-card">
        <div className="cosmic-card-glow"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-400" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading cosmic metrics...</div>
        </CardContent>
      </Card>
    );
  }
  
  // Determine status color
  const statusColor = health.status === 'ok' ? 'text-green-400' : 
                     health.status === 'warning' ? 'text-yellow-400' : 'text-red-400';
  
  return (
    <Card className="cosmic-card">
      <div className="cosmic-card-glow"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-red-400" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Radial progress indicators */}
          <div className="grid grid-cols-3 gap-4">
            <RadialProgress 
              value={health.metrics?.cpu_usage_percent ?? 0} 
              label="CPU" 
              color="#f59e0b" 
            />
            <RadialProgress 
              value={health.metrics?.memory_usage_percent ?? 0} 
              label="Memory" 
              color="#8b5cf6" 
            />
            <RadialProgress 
              value={health.metrics?.disk_usage_percent ?? 0} 
              label="Disk" 
              color="#06b6d4" 
            />
          </div>
          
          {/* Status indicator */}
          <div className="text-center">
            <div className="text-sm">
              Status: <span className={`font-medium ${statusColor} cosmic-metric-value`}>
                {health.status}
              </span>
            </div>
            {health.error && (
              <div className="text-xs text-red-400 mt-1">
                {health.error}
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-2">
              Last updated: {new Date(health.timestamp).toLocaleTimeString()}
            </div>
          </div>
          
          {/* Cosmic info */}
          <motion.div 
            className="text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            ⚡ Monitoring universal energy channels
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}