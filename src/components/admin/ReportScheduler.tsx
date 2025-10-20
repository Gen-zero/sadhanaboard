import React, { useState } from 'react';
import type { ScheduledReport, ReportTemplate } from '@/types/bi-reports';

const ReportScheduler: React.FC<{ schedules: ScheduledReport[]; templates: ReportTemplate[]; onCreate: (p:any)=>Promise<any>; onRefresh: ()=>void }> = ({ schedules, templates, onCreate, onRefresh }) => {
  const [templateId, setTemplateId] = useState<string | undefined>(templates?.[0]?.id);
  const [cron, setCron] = useState('0 6 * * *');
  const [recipient, setRecipient] = useState('ops@example.com');

  const handleCreate = async () => {
    try {
      await onCreate({ template_id: templateId, name: `Scheduled ${new Date().toISOString()}`, cron_expression: cron, recipients: [recipient], output_format: 'pdf', timezone: 'UTC' });
      onRefresh();
    } catch (e) { 
      console.error('Failed to create scheduled report:', e); 
    }
  };

  return (
    <div className="p-3 bg-white rounded shadow">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Report Scheduler</div>
      </div>

      <div className="mt-3 space-y-2 text-sm">
        <div>
          <label className="block text-xs text-gray-600">Template</label>
          <select value={templateId} onChange={e=>setTemplateId(e.target.value)} className="border rounded px-2 py-1 w-full">
            {(templates || []).map(t => <option value={t.id} key={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600">Cron expression</label>
          <input className="border rounded px-2 py-1 w-full" value={cron} onChange={e=>setCron(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Recipient</label>
          <input className="border rounded px-2 py-1 w-full" value={recipient} onChange={e=>setRecipient(e.target.value)} />
        </div>
        <div className="flex justify-end">
          <button className="btn btn-primary" onClick={handleCreate}>Create Schedule</button>
        </div>

        <div className="mt-3">
          <div className="text-xs text-gray-500">Existing schedules</div>
          {schedules && schedules.length ? (
            <ul className="mt-2 space-y-2 text-sm">
              {schedules.map(s => (
                <li key={s.id} className="border rounded p-2">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.cron_expression} • next: {s.next_run}</div>
                </li>
              ))}
            </ul>
          ) : <div className="text-sm text-gray-500">No schedules</div>}
        </div>
      </div>
    </div>
  );
};

export default ReportScheduler;
