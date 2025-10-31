import React from 'react';
import type { SecurityEvent } from '@/types/admin-logs';
import { Button } from '@/components/ui/button';

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
            <div className="mt-1 text-xs space-x-2">
              <Button onClick={()=>onResolve?.(ev.id)} size="sm" variant="ghost" className="text-green-600 hover:text-green-700">Resolve</Button>
              <Button onClick={()=>onCreateRule?.(ev)} size="sm" variant="ghost" className="text-red-600 hover:text-red-700">Create rule</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}