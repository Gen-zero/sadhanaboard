import React, { useState } from 'react';
import type { SpiritualInsight, InsightType } from '@/types/bi-reports';

const SpiritualInsightPanel: React.FC<{ insights: SpiritualInsight[]; onGenerate: (type: InsightType, params?: any)=>Promise<any>; onRefresh: ()=>void }> = ({ insights, onGenerate, onRefresh }) => {
  const [type, setType] = useState<InsightType>('practice_recommendation');

  const handleGenerate = async () => {
    try {
      await onGenerate(type, {});
      onRefresh();
    } catch (e) { 
      console.error('Failed to generate spiritual insights:', e); 
    }
  };

  return (
    <div className="p-3 bg-white rounded shadow">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Spiritual Insights</div>
        <div className="flex items-center gap-2">
          <select value={type} onChange={e=>setType(e.target.value as InsightType)} className="border rounded px-2 py-1">
            <option value="practice_recommendation">Practice recommendation</option>
            <option value="milestone_celebration">Milestone celebration</option>
            <option value="consistency_improvement">Consistency improvement</option>
          </select>
          <button className="btn btn-sm" onClick={handleGenerate}>Generate</button>
        </div>
      </div>

      <div className="mt-3 text-sm">
        {insights && insights.length ? (
          <ul className="space-y-2">
            {insights.map(i => (
              <li key={i.id} className="border rounded p-2">
                <div className="text-xs text-gray-500">{i.insight_type} • {i.generated_at}</div>
                <pre className="text-xs mt-2">{JSON.stringify(i.content, null, 2)}</pre>
              </li>
            ))}
          </ul>
        ) : <div className="text-sm text-gray-500">No insights yet.</div>}
      </div>
    </div>
  );
};

export default SpiritualInsightPanel;
