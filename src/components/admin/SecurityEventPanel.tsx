import React from 'react';
import type { SecurityEvent } from '@/types/admin-logs';

export default function SecurityEventPanel({ events, onResolve, onCreateRule }:{
  events: SecurityEvent[],
  onResolve?: (id:number)=>void,
  onCreateRule?: (e:SecurityEvent)=>void
}){
  return (
    <div>
      <div className="max-h-96 overflow-auto border p-2">
        {events.map(ev=> (
          <div key={ev.id} className="mb-2 border-b pb-1">
            <div className="text-xs text-gray-600">{ev.created_at} • {ev.threat_level}</div>
            <div className="font-medium">{ev.event_type}</div>
            <div className="text-sm">{ev.notes}</div>
            <div className="mt-1 text-xs">
              <button onClick={()=>onResolve?.(ev.id)} className="mr-2 text-green-600">Resolve</button>
              <button onClick={()=>onCreateRule?.(ev)} className="text-red-600">Create rule</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
