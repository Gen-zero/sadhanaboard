export interface ThemePerformanceMetrics {
  themeSwitchStart: number;
  colorsAppliedTime?: number;
  cssLoadTime?: number;
  transitionCompleteTime?: number;
  totalTime?: number;
  themeId: string;
  cssUrl?: string;
  cached: boolean;
  deviceInfo?: {
    cores: number;
    memory: number;
    isMobile: boolean;
  };
}

export class PerformanceMonitor {
  private metrics: ThemePerformanceMetrics[] = [];
  private activeMetric: Partial<ThemePerformanceMetrics> | null = null;

  /**
   * Start measuring theme switch
   */
  startThemeSwitch(themeId: string, cached: boolean): void {
    this.activeMetric = {
      themeSwitchStart: performance.now(),
      themeId,
      cached,
      deviceInfo: {
        cores: navigator.hardwareConcurrency || 1,
        memory: (navigator as any).deviceMemory || 4,
        isMobile: window.innerWidth < 768,
      },
    };
  }

  /**
   * Record colors applied
   */
  recordColorsApplied(): void {
    if (this.activeMetric) {
      this.activeMetric.colorsAppliedTime = 
        performance.now() - this.activeMetric.themeSwitchStart!;
    }
  }

  /**
   * Record CSS load completion
   */
  recordCSSLoaded(cssUrl: string): void {
    if (this.activeMetric) {
      this.activeMetric.cssLoadTime = 
        performance.now() - this.activeMetric.themeSwitchStart!;
      this.activeMetric.cssUrl = cssUrl;
    }
  }

  /**
   * Complete theme switch measurement
   */
  completeThemeSwitch(): void {
    if (this.activeMetric && this.activeMetric.themeSwitchStart) {
      this.activeMetric.transitionCompleteTime = 
        performance.now() - this.activeMetric.themeSwitchStart;
      this.activeMetric.totalTime = this.activeMetric.transitionCompleteTime;
      
      this.metrics.push(this.activeMetric as ThemePerformanceMetrics);
      
      console.log(
        `[Performance] Theme switch (${this.activeMetric.themeId}): ` +
        `${this.activeMetric.totalTime.toFixed(2)}ms ` +
        `(cached: ${this.activeMetric.cached})`
      );
      
      this.activeMetric = null;
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): ThemePerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get average theme switch time
   */
  getAverageThemeSwitchTime(): number {
    if (this.metrics.length === 0) return 0;
    const sum = this.metrics.reduce((acc, m) => acc + (m.totalTime || 0), 0);
    return sum / this.metrics.length;
  }

  /**
   * Get cached vs non-cached comparison
   */
  getCachedComparison(): {
    cached: number;
    nonCached: number;
    improvement: string;
  } {
    const cached = this.metrics
      .filter(m => m.cached)
      .reduce((acc, m) => acc + (m.totalTime || 0), 0) / 
      (this.metrics.filter(m => m.cached).length || 1);

    const nonCached = this.metrics
      .filter(m => !m.cached)
      .reduce((acc, m) => acc + (m.totalTime || 0), 0) / 
      (this.metrics.filter(m => !m.cached).length || 1);

    const improvement = nonCached > 0 
      ? ((nonCached - cached) / nonCached * 100).toFixed(1)
      : '0';

    return {
      cached: Math.round(cached),
      nonCached: Math.round(nonCached),
      improvement: `${improvement}%`,
    };
  }

  /**
   * Clear metrics
   */
  clear(): void {
    this.metrics = [];
    this.activeMetric = null;
  }

  /**
   * Export metrics as JSON
   */
  export(): string {
    return JSON.stringify({
      metrics: this.metrics,
      averageTime: this.getAverageThemeSwitchTime(),
      comparison: this.getCachedComparison(),
    }, null, 2);
  }
}

export const performanceMonitor = new PerformanceMonitor();
