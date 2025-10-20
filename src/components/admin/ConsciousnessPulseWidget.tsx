import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Activity, Users, Globe, Zap } from 'lucide-react';

const ConsciousnessPulseWidget: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [pulseStrength, setPulseStrength] = useState(0);
  
  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fluctuating active users
      const newUserCount = Math.floor(Math.random() * 50) + 100;
      setActiveUsers(newUserCount);
      
      // Simulate pulse strength based on activity
      const newPulseStrength = Math.min(100, Math.max(20, newUserCount / 2));
      setPulseStrength(newPulseStrength);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate pulse color based on strength
  const getPulseColor = () => {
    if (pulseStrength > 80) return 'text-red-400';
    if (pulseStrength > 60) return 'text-orange-400';
    if (pulseStrength > 40) return 'text-yellow-400';
    return 'text-green-400';
  };
  
  // Calculate pulse size based on strength
  const getPulseSize = () => {
    return 80 + (pulseStrength / 100) * 70;
  };

  return (
    <Card className="cosmic-card">
      <div className="cosmic-card-glow"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-cyan-400" />
          Global Consciousness Pulse
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-4">
          {/* Pulsing visualization */}
          <div className="relative flex items-center justify-center mb-6">
            <motion.div
              className={`absolute rounded-full ${getPulseColor()} opacity-20`}
              style={{ width: `${getPulseSize()}px`, height: `${getPulseSize()}px` }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div
              className={`absolute rounded-full ${getPulseColor()} opacity-40`}
              style={{ width: `${getPulseSize() * 0.7}px`, height: `${getPulseSize() * 0.7}px` }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            
            <motion.div
              className={`relative rounded-full ${getPulseColor()} flex items-center justify-center`}
              style={{ width: `${getPulseSize() * 0.4}px`, height: `${getPulseSize() * 0.4}px` }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            >
              <Activity className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <div className="text-center p-3 rounded-lg bg-background/40 backdrop-blur-sm">
              <Users className="h-5 w-5 text-blue-400 mx-auto mb-1" />
              <div className="text-xl font-bold cosmic-metric-value">
                {activeUsers}
              </div>
              <div className="text-xs text-muted-foreground">
                Active Souls
              </div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-background/40 backdrop-blur-sm">
              <Zap className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
              <div className="text-xl font-bold cosmic-metric-value">
                {Math.round(pulseStrength)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Pulse Strength
              </div>
            </div>
          </div>
        </div>
        
        <motion.div 
          className="mt-4 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          🌍 Monitoring global meditation activity in real-time
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ConsciousnessPulseWidget;