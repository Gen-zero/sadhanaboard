import React, { useState } from 'react';
import type { ScheduledReport, ReportTemplate } from '@/types/bi-reports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
          <label htmlFor="template-select" className="block text-xs text-gray-600">Template</label>
          <Select value={templateId} onValueChange={setTemplateId}>
            <SelectTrigger id="template-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(templates || []).map(t => <SelectItem value={t.id} key={t.id}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="cron-input" className="block text-xs text-gray-600">Cron expression</label>
          <Input id="cron-input" value={cron} onChange={e=>setCron(e.target.value)} />
        </div>
        <div>
          <label htmlFor="recipient-input" className="block text-xs text-gray-600">Recipient</label>
          <Input id="recipient-input" value={recipient} onChange={e=>setRecipient(e.target.value)} />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleCreate}>Create Schedule</Button>
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