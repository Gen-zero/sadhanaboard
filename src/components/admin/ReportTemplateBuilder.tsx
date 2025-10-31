import React, { useState } from 'react';
import type { ReportTemplate } from '@/types/bi-reports';
import { adminApi } from '@/services/adminApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ReportTemplateBuilder: React.FC<{ templates: ReportTemplate[]; onCreate: (p:any)=>Promise<any>; onRefresh: ()=>void }> = ({ templates, onCreate, onRefresh }) => {
  const [name, setName] = useState('Quick KPI Template');

  const handleCreate = async () => {
    try {
      await onCreate({ name, template_type: 'kpi_dashboard', template: { layout: {}, components: [] } });
      onRefresh();
    } catch (e) { 
      console.error('Failed to build report template:', e); 
    }
  };

  return (
    <div className="p-3 bg-white rounded shadow">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Report Templates</div>
        <div className="flex items-center gap-2">
          <Input className="w-48" value={name} onChange={e=>setName(e.target.value)} />
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </div>
      <div className="mt-3 text-sm">
        {templates && templates.length ? (
          <ul className="space-y-2">
            {templates.map(t => (
              <li key={t.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.description}</div>
                </div>
                <div className="text-xs text-gray-400">{new Date(t.created_at || '').toLocaleString()}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-500">No templates yet.</div>
        )}
      </div>
    </div>
  );
};

export default ReportTemplateBuilder;