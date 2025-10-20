import React from 'react';
export default function LogAnalyticsDashboard({ stats, onDrillDown }:{ stats:any, onDrillDown?: (partial:any)=>void }){
  return (
    <div>
      <h3 className="font-medium mb-2">Overview</h3>
      <pre className="p-2 bg-gray-100">{JSON.stringify(stats, null, 2)}</pre>
      <div className="mt-2">
        <button onClick={()=>onDrillDown?.({ severity: 'error'})} className="px-2 py-1 border">Show errors</button>
      </div>
    </div>
  );
}
