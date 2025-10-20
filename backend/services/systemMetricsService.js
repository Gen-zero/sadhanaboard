const os = require('os');
const process = require('process');
const fs = require('fs').promises;
const path = require('path');

class SystemMetricsService {
  // Configuration
  static config = {
    // Alert thresholds
    thresholds: {
      cpu: {
        warning: 70,  // 70% CPU usage
        critical: 85  // 85% CPU usage
      },
      memory: {
        warning: 80,  // 80% memory usage
        critical: 90  // 90% memory usage
      },
      disk: {
        warning: 85,  // 85% disk usage
        critical: 95  // 95% disk usage
      },
      process: {
        memoryWarning: 500 * 1024 * 1024,  // 500MB
        memoryCritical: 1000 * 1024 * 1024 // 1GB
      }
    },
    // Metrics collection intervals
    collection: {
      shortTerm: 5000,   // 5 seconds
      mediumTerm: 30000, // 30 seconds
      longTerm: 300000   // 5 minutes
    }
  };

  // In-memory storage for recent metrics (for alerting and trending)
  static metricsHistory = [];
  static maxHistorySize = 100; // Keep last 100 metrics

  // Alert history
  static alertHistory = [];
  static maxAlertHistorySize = 50; // Keep last 50 alerts

  // Collect comprehensive system metrics
  static async collectSystemMetrics() {
    try {
      const metrics = {
        timestamp: new Date().toISOString(),
        cpu: this.getCpuMetrics(),
        memory: this.getMemoryMetrics(),
        disk: this.getDiskMetrics(),
        network: this.getNetworkMetrics(),
        process: this.getProcessMetrics(),
        uptime: process.uptime(),
        loadAverage: os.loadavg()
      };
      
      // Add to history
      this.addMetricsToHistory(metrics);
      
      return metrics;
    } catch (error) {
      console.error('Failed to collect system metrics:', error);
      return {
        timestamp: new Date().toISOString(),
        error: 'Failed to collect metrics'
      };
    }
  }
  
  // Get CPU metrics
  static getCpuMetrics() {
    try {
      const cpus = os.cpus();
      const totalCpus = cpus.length;
      
      // Calculate average CPU usage
      let totalIdle = 0;
      let totalTick = 0;
      
      cpus.forEach(cpu => {
        for (const type in cpu.times) {
          totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
      });
      
      const idlePercentage = (totalIdle / totalTick) * 100;
      const usagePercentage = 100 - idlePercentage;
      
      return {
        count: totalCpus,
        usage: usagePercentage,
        idle: idlePercentage,
        model: cpus[0]?.model || 'Unknown',
        speed: cpus[0]?.speed || 0
      };
    } catch (error) {
      console.error('Failed to get CPU metrics:', error);
      return { error: 'Failed to get CPU metrics' };
    }
  }
  
  // Get memory metrics
  static getMemoryMetrics() {
    try {
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      
      return {
        total: totalMem,
        free: freeMem,
        used: usedMem,
        percentage: (usedMem / totalMem) * 100
      };
    } catch (error) {
      console.error('Failed to get memory metrics:', error);
      return { error: 'Failed to get memory metrics' };
    }
  }
  
  // Get disk metrics
  static getDiskMetrics() {
    try {
      // Try to get actual disk usage
      try {
        const diskUsage = require('diskusage');
        const diskPath = process.platform === 'win32' ? 'C:' : '/';
        const info = diskUsage.checkSync(diskPath);
        
        return {
          total: info.total,
          free: info.free,
          used: info.total - info.free,
          percentage: ((info.total - info.free) / info.total) * 100
        };
      } catch (diskError) {
        // Fallback to memory-based estimation
        const freeMem = os.freemem();
        const totalMem = os.totalmem();
        
        return {
          total: totalMem,
          free: freeMem,
          used: totalMem - freeMem,
          percentage: ((totalMem - freeMem) / totalMem) * 100,
          fallback: true
        };
      }
    } catch (error) {
      console.error('Failed to get disk metrics:', error);
      return { error: 'Failed to get disk metrics' };
    }
  }
  
  // Get network metrics
  static getNetworkMetrics() {
    try {
      // In a real implementation, we would collect actual network metrics
      const networkInterfaces = os.networkInterfaces();
      
      // Count active interfaces
      let activeInterfaces = 0;
      for (const [name, interfaces] of Object.entries(networkInterfaces)) {
        if (!name.startsWith('lo')) { // Skip loopback
          activeInterfaces += interfaces.filter(iface => !iface.internal && iface.address).length;
        }
      }
      
      return {
        interfaces: activeInterfaces,
        // Placeholder values - in a real implementation, we would collect actual metrics
        rxBytes: 0,
        txBytes: 0,
        rxPackets: 0,
        txPackets: 0
      };
    } catch (error) {
      console.error('Failed to get network metrics:', error);
      return { error: 'Failed to get network metrics' };
    }
  }
  
  // Get process metrics
  static getProcessMetrics() {
    try {
      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();
      
      return {
        pid: process.pid,
        memory: {
          rss: memoryUsage.rss,
          heapTotal: memoryUsage.heapTotal,
          heapUsed: memoryUsage.heapUsed,
          external: memoryUsage.external,
          arrayBuffers: memoryUsage.arrayBuffers
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system
        },
        uptime: process.uptime(),
        version: process.version,
        platform: process.platform,
        arch: process.arch
      };
    } catch (error) {
      console.error('Failed to get process metrics:', error);
      return { error: 'Failed to get process metrics' };
    }
  }
  
  // Add metrics to history
  static addMetricsToHistory(metrics) {
    this.metricsHistory.push(metrics);
    
    // Limit history size
    if (this.metricsHistory.length > this.maxHistorySize) {
      this.metricsHistory.shift();
    }
  }
  
  // Check system health and return status
  static async getSystemHealth() {
    try {
      const metrics = await this.collectSystemMetrics();
      
      // Determine health status
      const healthStatus = {
        overall: 'healthy',
        components: {
          cpu: 'healthy',
          memory: 'healthy',
          disk: 'healthy',
          process: 'healthy'
        },
        metrics: metrics
      };
      
      // Check CPU usage
      if (metrics.cpu && metrics.cpu.usage > this.config.thresholds.cpu.critical) {
        healthStatus.components.cpu = 'critical';
        healthStatus.overall = 'critical';
      } else if (metrics.cpu && metrics.cpu.usage > this.config.thresholds.cpu.warning) {
        healthStatus.components.cpu = 'warning';
        if (healthStatus.overall === 'healthy') {
          healthStatus.overall = 'warning';
        }
      }
      
      // Check memory usage
      if (metrics.memory && metrics.memory.percentage > this.config.thresholds.memory.critical) {
        healthStatus.components.memory = 'critical';
        healthStatus.overall = 'critical';
      } else if (metrics.memory && metrics.memory.percentage > this.config.thresholds.memory.warning) {
        healthStatus.components.memory = 'warning';
        if (healthStatus.overall === 'healthy') {
          healthStatus.overall = 'warning';
        }
      }
      
      // Check disk usage
      if (metrics.disk && metrics.disk.percentage > this.config.thresholds.disk.critical) {
        healthStatus.components.disk = 'critical';
        healthStatus.overall = 'critical';
      } else if (metrics.disk && metrics.disk.percentage > this.config.thresholds.disk.warning) {
        healthStatus.components.disk = 'warning';
        if (healthStatus.overall === 'healthy') {
          healthStatus.overall = 'warning';
        }
      }
      
      // Check process memory usage
      if (metrics.process && metrics.process.memory && 
          metrics.process.memory.rss > this.config.thresholds.process.memoryCritical) {
        healthStatus.components.process = 'critical';
        healthStatus.overall = 'critical';
      } else if (metrics.process && metrics.process.memory && 
                 metrics.process.memory.rss > this.config.thresholds.process.memoryWarning) {
        healthStatus.components.process = 'warning';
        if (healthStatus.overall === 'healthy') {
          healthStatus.overall = 'warning';
        }
      }
      
      return healthStatus;
    } catch (error) {
      console.error('Failed to get system health:', error);
      return {
        overall: 'unknown',
        error: 'Failed to determine system health'
      };
    }
  }
  
  // Get historical metrics
  static async getHistoricalMetrics(hours = 24) {
    try {
      // Return in-memory history for now
      // In a production system, this would query a database
      const cutoffTime = new Date(Date.now() - (hours * 60 * 60 * 1000));
      
      const filteredHistory = this.metricsHistory.filter(metric => {
        return new Date(metric.timestamp) > cutoffTime;
      });
      
      return {
        metrics: filteredHistory,
        count: filteredHistory.length,
        hours: hours
      };
    } catch (error) {
      console.error('Failed to get historical metrics:', error);
      return { error: 'Failed to get historical metrics' };
    }
  }
  
  // Get system alerts based on metrics
  static async getSystemAlerts() {
    try {
      const health = await this.getSystemHealth();
      const alerts = [];
      
      // Generate alerts based on health status
      if (health.overall === 'critical') {
        alerts.push({
          id: this.generateAlertId(),
          level: 'critical',
          message: 'System is in critical condition',
          timestamp: new Date().toISOString(),
          resolved: false
        });
      } else if (health.overall === 'warning') {
        alerts.push({
          id: this.generateAlertId(),
          level: 'warning',
          message: 'System has warnings that require attention',
          timestamp: new Date().toISOString(),
          resolved: false
        });
      }
      
      // Component-specific alerts
      for (const [component, status] of Object.entries(health.components)) {
        if (status === 'critical') {
          alerts.push({
            id: this.generateAlertId(),
            level: 'critical',
            message: `Critical issue with ${component}`,
            component: component,
            timestamp: new Date().toISOString(),
            resolved: false
          });
        } else if (status === 'warning') {
          alerts.push({
            id: this.generateAlertId(),
            level: 'warning',
            message: `Warning for ${component}`,
            component: component,
            timestamp: new Date().toISOString(),
            resolved: false
          });
        }
      }
      
      // Add to alert history
      this.addAlertsToHistory(alerts);
      
      return alerts;
    } catch (error) {
      console.error('Failed to get system alerts:', error);
      return [];
    }
  }
  
  // Generate unique alert ID
  static generateAlertId() {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Add alerts to history
  static addAlertsToHistory(alerts) {
    this.alertHistory.push(...alerts);
    
    // Limit history size
    if (this.alertHistory.length > this.maxAlertHistorySize) {
      this.alertHistory = this.alertHistory.slice(-this.maxAlertHistorySize);
    }
  }
  
  // Get alert history
  static getAlertHistory() {
    return this.alertHistory;
  }
  
  // Resolve an alert
  static resolveAlert(alertId) {
    const alert = this.alertHistory.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date().toISOString();
      return true;
    }
    return false;
  }
  
  // Get system metrics trends
  static async getMetricsTrends(hours = 1) {
    try {
      const historical = await this.getHistoricalMetrics(hours);
      
      if (!historical.metrics || historical.metrics.length === 0) {
        return { error: 'No historical data available' };
      }
      
      // Calculate trends for key metrics
      const metrics = historical.metrics;
      const first = metrics[0];
      const last = metrics[metrics.length - 1];
      
      // Only calculate trends if we have at least 2 data points
      if (metrics.length < 2) {
        return { error: 'Insufficient data for trend analysis' };
      }
      
      const trends = {
        cpu: {
          start: first.cpu.usage,
          end: last.cpu.usage,
          change: last.cpu.usage - first.cpu.usage,
          trend: last.cpu.usage > first.cpu.usage ? 'increasing' : 
                 last.cpu.usage < first.cpu.usage ? 'decreasing' : 'stable'
        },
        memory: {
          start: first.memory.percentage,
          end: last.memory.percentage,
          change: last.memory.percentage - first.memory.percentage,
          trend: last.memory.percentage > first.memory.percentage ? 'increasing' : 
                 last.memory.percentage < first.memory.percentage ? 'decreasing' : 'stable'
        },
        disk: {
          start: first.disk.percentage,
          end: last.disk.percentage,
          change: last.disk.percentage - first.disk.percentage,
          trend: last.disk.percentage > first.disk.percentage ? 'increasing' : 
                 last.disk.percentage < first.disk.percentage ? 'decreasing' : 'stable'
        }
      };
      
      return {
        trends: trends,
        period: {
          start: first.timestamp,
          end: last.timestamp,
          duration: hours
        }
      };
    } catch (error) {
      console.error('Failed to get metrics trends:', error);
      return { error: 'Failed to get metrics trends' };
    }
  }
  
  // Get system recommendations based on metrics
  static async getSystemRecommendations() {
    try {
      const health = await this.getSystemHealth();
      const recommendations = [];
      
      // CPU recommendations
      if (health.components.cpu === 'warning') {
        recommendations.push({
          type: 'cpu',
          priority: 'medium',
          recommendation: 'Consider optimizing CPU-intensive operations or adding more CPU cores',
          action: 'Review application performance and identify CPU bottlenecks'
        });
      } else if (health.components.cpu === 'critical') {
        recommendations.push({
          type: 'cpu',
          priority: 'high',
          recommendation: 'Immediate action required: CPU usage is critically high',
          action: 'Scale up CPU resources or optimize application code immediately'
        });
      }
      
      // Memory recommendations
      if (health.components.memory === 'warning') {
        recommendations.push({
          type: 'memory',
          priority: 'medium',
          recommendation: 'Consider increasing memory allocation or optimizing memory usage',
          action: 'Review memory usage patterns and identify memory leaks'
        });
      } else if (health.components.memory === 'critical') {
        recommendations.push({
          type: 'memory',
          priority: 'high',
          recommendation: 'Immediate action required: Memory usage is critically high',
          action: 'Scale up memory resources or fix memory leaks immediately'
        });
      }
      
      // Disk recommendations
      if (health.components.disk === 'warning') {
        recommendations.push({
          type: 'disk',
          priority: 'medium',
          recommendation: 'Consider cleaning up disk space or adding more storage',
          action: 'Review disk usage and remove unnecessary files'
        });
      } else if (health.components.disk === 'critical') {
        recommendations.push({
          type: 'disk',
          priority: 'high',
          recommendation: 'Immediate action required: Disk space is critically low',
          action: 'Free up disk space immediately or add more storage'
        });
      }
      
      // Process recommendations
      if (health.components.process === 'warning') {
        recommendations.push({
          type: 'process',
          priority: 'medium',
          recommendation: 'Application memory usage is high',
          action: 'Review application memory usage and optimize if necessary'
        });
      } else if (health.components.process === 'critical') {
        recommendations.push({
          type: 'process',
          priority: 'high',
          recommendation: 'Immediate action required: Application memory usage is critically high',
          action: 'Restart application or investigate memory leaks immediately'
        });
      }
      
      return recommendations;
    } catch (error) {
      console.error('Failed to get system recommendations:', error);
      return [];
    }
  }
}

module.exports = SystemMetricsService;