import React from 'react';
import type { KPISnapshot } from '@/types/bi-reports';

const KpiCard: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div className="p-3 bg-white rounded shadow">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-2xl font-semibold">{value ?? '-'}</div>
  </div>
);

const BIKPIDashboard: React.FC<{ kpi: KPISnapshot | null }> = ({ kpi }) => {
  if (!kpi) return <div className="p-4">Loading KPI snapshot...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <KpiCard label="Daily Active Practitioners" value={kpi.daily_active_practitioners} />
      <KpiCard label="Average Session (s)" value={kpi.average_session_duration_seconds} />
      <KpiCard label="Milestone Achievements" value={kpi.milestone_achievements?.total ?? '-'} />
      <div className="sm:col-span-3 bg-white p-3 rounded shadow">
        <div className="text-sm text-gray-500">Completion rates</div>
        <pre className="text-xs mt-2">{JSON.stringify(kpi.completion_rates || {}, null, 2)}</pre>
      </div>
    </div>
  );
};

export default BIKPIDashboard;
