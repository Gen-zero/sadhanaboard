import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Activity, 
  Cpu, 
  Database, 
  HardDrive, 
  MemoryStick, 
  Shield, 
  Wifi 
} from 'lucide-react';

const CosmosShowcase: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Cosmos Theme Showcase</h1>
        <p className="text-muted-foreground mt-2">
          Experience the cosmic admin panel design adapted for regular users
        </p>
      </div>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cosmos-card">
          <div className="cosmos-card-glow"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold cosmos-metric-value">99.98%</div>
            <p className="text-xs text-muted-foreground">+0.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="cosmos-card">
          <div className="cosmos-card-glow"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Wifi className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold cosmos-metric-value">42ms</div>
            <p className="text-xs text-muted-foreground">-2ms from last month</p>
          </CardContent>
        </Card>

        <Card className="cosmos-card">
          <div className="cosmos-card-glow"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Rating</CardTitle>
            <Shield className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold cosmos-metric-value">A+</div>
            <p className="text-xs text-muted-foreground">Excellent security posture</p>
          </CardContent>
        </Card>

        <Card className="cosmos-card">
          <div className="cosmos-card-glow"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold cosmos-metric-value">1,248</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="cosmos-card lg:col-span-2">
          <div className="cosmos-card-glow"></div>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>
              Real-time metrics of system resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Cpu className="h-4 w-4 text-purple-400 mr-2" />
                  <span>CPU Usage</span>
                </div>
                <span className="font-medium">65%</span>
              </div>
              <div className="cosmos-progress-bar">
                <div 
                  className="cosmos-progress-fill" 
                  style={{ width: '65%' }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MemoryStick className="h-4 w-4 text-cyan-400 mr-2" />
                  <span>Memory Usage</span>
                </div>
                <span className="font-medium">42%</span>
              </div>
              <div className="cosmos-progress-bar">
                <div 
                  className="cosmos-progress-fill" 
                  style={{ width: '42%' }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="h-4 w-4 text-gold-400 mr-2" />
                  <span>Disk Usage</span>
                </div>
                <span className="font-medium">28%</span>
              </div>
              <div className="cosmos-progress-bar">
                <div 
                  className="cosmos-progress-fill" 
                  style={{ width: '28%' }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cosmos-card">
          <div className="cosmos-card-glow"></div>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="cosmos-button w-full justify-start">
              <Database className="h-4 w-4 mr-2" />
              Backup Database
            </Button>
            <Button className="cosmos-button w-full justify-start" variant="secondary">
              <Shield className="h-4 w-4 mr-2" />
              Run Security Scan
            </Button>
            <Button className="cosmos-button w-full justify-start" variant="secondary">
              <Activity className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button className="cosmos-button w-full justify-start" variant="secondary">
              <Wifi className="h-4 w-4 mr-2" />
              Check Connectivity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Settings Form */}
      <Card className="cosmos-card">
        <div className="cosmos-card-glow"></div>
        <CardHeader>
          <CardTitle>Cosmic Settings</CardTitle>
          <CardDescription>
            Configure your cosmic experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your name" 
                  className="cosmos-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  className="cosmos-input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                placeholder="Tell us about yourself"
                className="cosmos-input w-full min-h-[120px]"
              />
            </div>
            <div className="flex justify-end">
              <Button className="cosmos-button">
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CosmosShowcase;