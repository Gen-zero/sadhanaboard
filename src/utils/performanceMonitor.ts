// Performance monitoring utilities
import React, { useEffect } from 'react';

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  
  private constructor() {}
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  // Start timing a metric
  start(name: string): string {
    const id = `${name}-${Date.now()}-${Math.random()}`;
    performance.mark(`${id}-start`);
    return id;
  }
  
  // End timing and record metric
  end(id: string): void {
    const name = id.split('-')[0];
    performance.mark(`${id}-end`);
    const measure = performance.measure(name, `${id}-start`, `${id}-end`);
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name)!.push(measure.duration);
  }
  
  // Get average time for a metric
  getAverage(name: string): number {
    const times = this.metrics.get(name);
    if (!times || times.length === 0) return 0;
    
    const sum = times.reduce((acc, time) => acc + time, 0);
    return sum / times.length;
  }
  
  // Log all metrics
  logMetrics(): void {
    console.log('=== Performance Metrics ===');
    this.metrics.forEach((times, name) => {
      const avg = this.getAverage(name);
      const min = Math.min(...times);
      const max = Math.max(...times);
      console.log(`${name}: avg=${avg.toFixed(2)}ms, min=${min.toFixed(2)}ms, max=${max.toFixed(2)}ms`);
    });
  }
  
  // Clear metrics
  clear(): void {
    this.metrics.clear();
  }
}

// Utility hook for React components
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    start: monitor.start.bind(monitor),
    end: monitor.end.bind(monitor),
    logMetrics: monitor.logMetrics.bind(monitor)
  };
};

// HOC for monitoring component performance
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
): React.FC<P> {
  const ComponentWithMonitoring: React.FC<P> = (props) => {
    const monitor = PerformanceMonitor.getInstance();
    const id = monitor.start(componentName);
    
    // Use useEffect to end timing after component mounts
    useEffect(() => {
      monitor.end(id);
    }, []);
    
    return React.createElement(WrappedComponent, props);
  };
  
  ComponentWithMonitoring.displayName = `withPerformanceMonitoring(${componentName})`;
  
  return ComponentWithMonitoring;
}