import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';

const AdvancedAnalyticsCharts: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await adminApi.getSpiritualProgressAnalytics({ timeframe: '30d' });
        if (mounted) setData(res);
      } catch (e) { 
        console.error('Failed to load spiritual progress analytics:', e); 
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-3 bg-white rounded shadow">
      <div className="text-sm font-medium">Advanced Analytics</div>
      <div className="mt-2 text-sm text-gray-600">This panel shows a preview of spiritual progress analytics.</div>
      <div className="mt-3 text-xs">
        {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <div>Loading analytics...</div>}
      </div>
    </div>
  );
};

export default AdvancedAnalyticsCharts;
