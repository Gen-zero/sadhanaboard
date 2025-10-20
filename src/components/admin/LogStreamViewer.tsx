import React from 'react';
import type { AdminLog } from '@/types/admin-logs';

export default function LogStreamViewer({ logs, connected, onCreateRule, onViewRelated }:{
  logs: AdminLog[];
  connected: boolean;
  onCreateRule?: (log: AdminLog)=>void;
  onViewRelated?: (correlationId:string)=>void;
}){
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm">Live Stream {connected? '(connected)':'(disconnected)'}</div>
      </div>
      <div className="max-h-96 overflow-auto border p-2">
        {logs.map(l=> (
          <div key={l.id} className="mb-2 border-b pb-1">
            <div className="text-xs text-gray-600">{l.created_at} • {l.ip_address || 'unknown'}</div>
            <div className="font-medium">{l.action} <span className="text-sm text-gray-500">{l.severity}</span></div>
            <div className="text-sm">{JSON.stringify(l.details || l.metadata)}</div>
            <div className="mt-1 text-xs">
              {l.correlation_id && <button onClick={()=>onViewRelated?.(l.correlation_id!)} className="mr-2 text-blue-600">View related</button>}
              <button onClick={()=>onCreateRule?.(l)} className="text-red-600">Create alert</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
