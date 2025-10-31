import React from 'react';
import type { AdminLog } from '@/types/admin-logs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LogFilterBar({ value, onChange, onExport }:{
  value: any,
  onChange: (v:any)=>void,
  onExport?: (format:string)=>void
}){
  return (
    <div className="flex items-center gap-2 mb-2">
      <Input className="flex-1" placeholder="Search query" value={value.q||''} onChange={(e)=>onChange({...value, q:e.target.value})} />
      <Select value={value.severity||''} onValueChange={(val)=>onChange({...value, severity: val})}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All severities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All severities</SelectItem>
          <SelectItem value="info">info</SelectItem>
          <SelectItem value="warn">warn</SelectItem>
          <SelectItem value="error">error</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" onClick={()=>onExport?.('csv')}>Export CSV</Button>
    </div>
  );
}