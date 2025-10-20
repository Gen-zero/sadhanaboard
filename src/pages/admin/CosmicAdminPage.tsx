import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Activity, 
  Settings,
  BarChart3,
  Shield,
  FileText
} from 'lucide-react';
import CosmicBackground from '@/components/admin/CosmicBackground';
import KarmaAnalyticsWidget from '@/components/admin/KarmaAnalyticsWidget';
import ConsciousnessPulseWidget from '@/components/admin/ConsciousnessPulseWidget';
import CosmicAIAssistant from '@/components/admin/CosmicAIAssistant';
import CosmicSettingsPanel from '@/components/admin/CosmicSettingsPanel';

const CosmicAdminPage: React.FC = () => {
  const quickActions = [
    { title: 'View Users', icon: Users, color: 'bg-blue-500/20', href: '/admin/users' },
    { title: 'Manage Library', icon: BookOpen, color: 'bg-purple-500/20', href: '/admin/library' },
    { title: 'System Health', icon: Activity, color: 'bg-green-500/20', href: '/admin/system' },
    { title: 'Audit Logs', icon: FileText, color: 'bg-yellow-500/20', href: '/admin/logs' },
    { title: 'Security', icon: Shield, color: 'bg-red-500/20', href: '/admin/security' },
    { title: 'Reports', icon: BarChart3, color: 'bg-cyan-500/20', href: '/admin/reports' }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Cosmic Background */}
      <div className="fixed inset-0 z-[-1]">
        <CosmicBackground />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            🌌 Cosmic Command Center
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Guardian of the SādhanaBoard Universe
          </p>
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                className="cosmic-card cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="cosmic-card-glow"></div>
                <div className="p-5 flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="font-medium text-center text-sm">{action.title}</h3>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Cosmic Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <KarmaAnalyticsWidget />
              <ConsciousnessPulseWidget />
            </div>
            
            {/* System Overview */}
            <div className="cosmic-card">
              <div className="cosmic-card-glow"></div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <LayoutDashboard className="mr-2 h-6 w-6 text-purple-400" />
                  Universal Overview
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-background/40 backdrop-blur-sm">
                    <div className="text-3xl font-bold cosmic-metric-value mb-1">12,054</div>
                    <div className="text-sm text-muted-foreground">Souls in Meditation</div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-background/40 backdrop-blur-sm">
                    <div className="text-3xl font-bold cosmic-metric-value mb-1">8,421</div>
                    <div className="text-sm text-muted-foreground">Active Sadhanas</div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-background/40 backdrop-blur-sm">
                    <div className="text-3xl font-bold cosmic-metric-value mb-1">1,248</div>
                    <div className="text-sm text-muted-foreground">New This Week</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-bold mb-3">AI Insights</h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <p className="text-sm">Engagement rose 12% this week due to new Sādhanā listings</p>
                    </div>
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <p className="text-sm">Most popular deity worship: Goddess Lakshmi (24% increase)</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-sm">Community participation up 18% in group meditations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <CosmicSettingsPanel />
            
            <div className="cosmic-card">
              <div className="cosmic-card-glow"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-purple-400" />
                  Quick Stats
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Server Load</span>
                      <span>42%</span>
                    </div>
                    <div className="w-full bg-background/60 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Memory Usage</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full bg-background/60 rounded-full h-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-400 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Storage</span>
                      <span>23%</span>
                    </div>
                    <div className="w-full bg-background/60 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-teal-400 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-purple-500/20">
                  <h4 className="font-bold mb-2">Recent Activity</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                      <span>New user registered</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                      <span>Library text uploaded</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></div>
                      <span>System backup completed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Assistant */}
      <CosmicAIAssistant />
    </div>
  );
};

export default CosmicAdminPage;