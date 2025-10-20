import React from 'react';
import type { SystemMetrics } from '@/types/system';

const MetricRow: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div className="flex justify-between py-1">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="font-medium">{value ?? '-'}</div>
  </div>
);

const SystemMetricsCard: React.FC<{ metrics: SystemMetrics | null }> = ({ metrics }) => {
  if (!metrics) return <div className="p-3 bg-white rounded shadow">Loading metrics...</div>;
  return (
    <div className="p-3 bg-white rounded shadow space-y-2">
      <div className="text-sm font-medium">System Metrics</div>
      <MetricRow label="CPU %" value={metrics.cpu_usage_percent && typeof metrics.cpu_usage_percent === 'number' && isFinite(metrics.cpu_usage_percent) ? `${metrics.cpu_usage_percent.toFixed(1)}%` : '-'} />
      <MetricRow label="Memory %" value={metrics.memory_usage_percent && typeof metrics.memory_usage_percent === 'number' && isFinite(metrics.memory_usage_percent) ? `${metrics.memory_usage_percent.toFixed(1)}%` : '-'} />
      <MetricRow label="Disk %" value={metrics.disk_usage_percent && typeof metrics.disk_usage_percent === 'number' ? `${metrics.disk_usage_percent.toFixed(1)}%` : '-'} />
      <MetricRow label="Load (1m)" value={metrics.load_average && typeof metrics.load_average.one === 'number' && isFinite(metrics.load_average.one) ? metrics.load_average.one.toFixed(2) : '-'} />
      <MetricRow label="Active DB Connections" value={metrics.active_connections ?? '-'} />
      <MetricRow label="Uptime" value={metrics.uptime_seconds ? `${Math.floor(metrics.uptime_seconds / 3600)}h` : '-'} />
    </div>
  );
};

export default SystemMetricsCard;