import React from 'react';
import type { AdminLog } from '@/types/admin-logs';
import { Button } from '@/components/ui/button';

export default function LogSearchInterface({ filters, results, onSearch, onSavePreset }:{
  filters:any,
  results: AdminLog[],
  onSearch:(f:any)=>void,
  onSavePreset?: (name:string)=>void
}){
  return (
    <div>
      <div className="mb-2">
        <Button onClick={()=>onSearch(filters)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Run</Button>
      </div>
      <div className="max-h-80 overflow-auto border p-2">
        {results.map(r=> (
          <div key={r.id} className="mb-2 border-b pb-1">
            <div className="text-xs text-gray-600">{r.created_at}</div>
            <div className="font-medium">{r.action}</div>
            <div className="text-sm">{JSON.stringify(r.details||r.metadata)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}