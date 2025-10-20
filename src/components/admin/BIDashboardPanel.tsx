import React from 'react';

const BIDashboardPanel: React.FC<{ kpi: any }> = ({ kpi }) => {
  if (!kpi) return <div className="text-sm text-muted-foreground">No KPI data yet</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 border rounded bg-background/50">
        <div className="text-xs text-muted-foreground">Daily Active Practitioners</div>
        <div className="text-2xl font-bold">{kpi.daily_active_practitioners ?? 0}</div>
      </div>
      <div className="p-4 border rounded bg-background/50">
        <div className="text-xs text-muted-foreground">Completion Rates</div>
        <div className="text-2xl font-bold">{kpi.completion_rates ?? 0}</div>
      </div>
      <div className="p-4 border rounded bg-background/50">
        <div className="text-xs text-muted-foreground">Avg Session (s)</div>
        <div className="text-2xl font-bold">{kpi.average_session_duration_seconds ?? 0}</div>
      </div>
    </div>
  );
};

export default BIDashboardPanel;
