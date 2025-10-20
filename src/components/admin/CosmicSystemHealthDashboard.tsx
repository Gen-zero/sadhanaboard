import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Wifi, 
  Database, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import CosmicProgressBar from './CosmicProgressBar';
import CosmicChart from './CosmicChart';
import { adminSystemApi } from '@/lib/adminApi';
import { SystemMetric, SystemLog } from '@/types/admin';

const CosmicSystemHealthDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [uptime, setUptime] = useState('99.98%');
  const [responseTime, setResponseTime] = useState('42ms');
  
  // Fetch system data from API
  useEffect(() => {
    fetchSystemData();
    
    // Set up interval for real-time updates
    const interval = setInterval(() => {
      fetchSystemData();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      
      // Fetch metrics and logs in parallel
      const [metricsData, logsData] = await Promise.all([
        adminSystemApi.getSystemMetrics(),
        adminSystemApi.getSystemLogs()
      ]);
      
      setMetrics(metricsData);
      setLogs(logsData);
    } catch (error) {
      console.error('Failed to fetch system data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-400" />;
      default: return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
  };

  const getLogIcon = (level: 'info' | 'warning' | 'error') => {
    switch (level) {
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-400" />;
    }
  };

  const getLogColor = (level: 'info' | 'warning' | 'error') => {
    switch (level) {
      case 'info': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  // Chart data for system performance over time
  const performanceData = [
    { time: '00:00', cpu: 30, memory: 45, network: 60 },
    { time: '04:00', cpu: 25, memory: 40, network: 55 },
    { time: '08:00', cpu: 65, memory: 70, network: 80 },
    { time: '12:00', cpu: 75, memory: 80, network: 85 },
    { time: '16:00', cpu: 60, memory: 65, network: 75 },
    { time: '20:00', cpu: 40, memory: 50, network: 65 }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="cosmic-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center">
          <Activity className="mr-2 h-6 w-6 text-purple-400" />
          ⚡ System Prana Dashboard
        </h2>
        <p className="text-muted-foreground mt-1">
          Monitor the vital energy channels of the cosmic system
        </p>
      </div>
      
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="cosmic-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="cosmic-card-glow"></div>
          <div className="flex items-center">
            <Activity className="h-10 w-10 text-purple-400 mr-4" />
            <div>
              <div className="text-3xl font-bold cosmic-metric-value">{uptime}</div>
              <div className="text-muted-foreground">System Uptime</div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="cosmic-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="cosmic-card-glow"></div>
          <div className="flex items-center">
            <Wifi className="h-10 w-10 text-cyan-400 mr-4" />
            <div>
              <div className="text-3xl font-bold cosmic-metric-value">{responseTime}</div>
              <div className="text-muted-foreground">Avg. Response</div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="cosmic-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="cosmic-card-glow"></div>
          <div className="flex items-center">
            <Shield className="h-10 w-10 text-green-400 mr-4" />
            <div>
              <div className="text-3xl font-bold cosmic-metric-value">A+</div>
              <div className="text-muted-foreground">Security Rating</div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = {
            'Cpu': Cpu,
            'MemoryStick': MemoryStick,
            'HardDrive': HardDrive,
            'Wifi': Wifi,
            'Database': Database,
            'Shield': Shield
          }[metric.icon] || Activity;
          
          return (
            <motion.div
              key={metric.name}
              className="cosmic-card p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="cosmic-card-glow"></div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <IconComponent className="h-5 w-5 text-purple-400 mr-2" />
                  <span className="font-medium">{metric.name}</span>
                </div>
                {getStatusIcon(metric.status)}
              </div>
              <CosmicProgressBar 
                value={metric.value} 
                label="" 
                showPercentage={false}
                color={
                  metric.status === 'healthy' 
                    ? 'from-green-500 to-cyan-400' 
                    : metric.status === 'warning' 
                      ? 'from-yellow-500 to-orange-400' 
                      : 'from-red-500 to-orange-400'
                }
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Current</span>
                <span className="text-xs font-medium">{metric.value}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="cosmic-card">
          <div className="cosmic-card-glow"></div>
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Cpu className="mr-2 h-5 w-5 text-purple-400" />
              System Performance Trends
            </h3>
            <div className="h-64">
              <CosmicChart 
                data={performanceData} 
                type="line" 
                dataKey="cpu"
                xAxisKey="time"
                colors={['#8a2be2', '#00bfff', '#ffd700']}
              />
            </div>
          </div>
        </div>
        
        {/* System Logs */}
        <div className="cosmic-card">
          <div className="cosmic-card-glow"></div>
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Database className="mr-2 h-5 w-5 text-purple-400" />
              Akashic Records (System Logs)
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  className="flex items-start p-3 rounded-lg bg-background/40 backdrop-blur-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`mr-3 mt-0.5 ${getLogColor(log.level)}`}>
                    {getLogIcon(log.level)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium truncate">{log.message}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {log.level.charAt(0).toUpperCase() + log.level.slice(1)} Level
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CosmicSystemHealthDashboard;