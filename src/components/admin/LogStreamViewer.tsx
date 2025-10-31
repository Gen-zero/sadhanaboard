import React from 'react';
import type { AdminLog } from '@/types/admin-logs';
import { Button } from '@/components/ui/button';

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
            <div className="mt-1 text-xs space-x-2">
              {l.correlation_id && <Button onClick={()=>onViewRelated?.(l.correlation_id!)} size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">View related</Button>}
              <Button onClick={()=>onCreateRule?.(l)} size="sm" variant="ghost" className="text-red-600 hover:text-red-700">Create alert</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}