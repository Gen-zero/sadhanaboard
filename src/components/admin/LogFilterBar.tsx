import React from 'react';
import type { AdminLog } from '@/types/admin-logs';

export default function LogFilterBar({ value, onChange, onExport }:{
  value: any,
  onChange: (v:any)=>void,
  onExport?: (format:string)=>void
}){
  return (
    <div className="flex items-center gap-2 mb-2">
      <input className="border p-1 flex-1" placeholder="Search query" value={value.q||''} onChange={(e)=>onChange({...value, q:e.target.value})} />
      <select value={value.severity||''} onChange={(e)=>onChange({...value, severity: e.target.value})} className="border p-1">
        <option value="">All severities</option>
        <option value="info">info</option>
        <option value="warn">warn</option>
        <option value="error">error</option>
      </select>
      <button className="px-2 py-1 border" onClick={()=>onExport?.('csv')}>Export CSV</button>
    </div>
  );
}
