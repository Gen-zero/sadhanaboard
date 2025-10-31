import React from 'react';
import { Button } from '@/components/ui/button';

export default function LogAnalyticsDashboard({ stats, onDrillDown }:{ stats:any, onDrillDown?: (partial:any)=>void }){
  return (
    <div>
      <h3 className="font-medium mb-2">Overview</h3>
      <pre className="p-2 bg-gray-100">{JSON.stringify(stats, null, 2)}</pre>
      <div className="mt-2">
        <Button onClick={()=>onDrillDown?.({ severity: 'error'})} variant="outline" size="sm">Show errors</Button>
      </div>
    </div>
  );
}