import React from 'react';
import BIKPIDashboard from '@/components/admin/BIKPIDashboard';
import ReportTemplateBuilder from '@/components/admin/ReportTemplateBuilder';
import ReportScheduler from '@/components/admin/ReportScheduler';
import SpiritualInsightPanel from '@/components/admin/SpiritualInsightPanel';
import AdvancedAnalyticsCharts from '@/components/admin/AdvancedAnalyticsCharts';
import { useBIReports } from '@/hooks/useBIReports';

const AdminBIDashboardPage: React.FC = () => {
  const {
    kpi,
    templates,
    schedules,
    insights,
    refreshAll,
    createTemplate,
    createSchedule,
    generateInsights,
  } = useBIReports();

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-lg font-medium">BI Dashboard</h2>

      <BIKPIDashboard kpi={kpi} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <ReportTemplateBuilder templates={templates} onCreate={createTemplate} onRefresh={refreshAll} />
          <ReportScheduler schedules={schedules} templates={templates} onCreate={createSchedule} onRefresh={refreshAll} />
        </div>
        <div className="space-y-4">
          <SpiritualInsightPanel insights={insights} onGenerate={generateInsights} onRefresh={refreshAll} />
          <AdvancedAnalyticsCharts />
        </div>
      </div>
    </div>
  );
};

export default AdminBIDashboardPage;
