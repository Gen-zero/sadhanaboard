import React from 'react';
import type { AlertRule } from '@/types/admin-logs';
import { Button } from '@/components/ui/button';

export default function AlertRuleManager({ rules, onCreate, onUpdate, onDelete, onTest }:{
  rules: AlertRule[],
  onCreate?: (r:Partial<AlertRule>)=>void,
  onUpdate?: (r:AlertRule)=>void,
  onDelete?: (id:number)=>void,
  onTest?: (id:number)=>void
}){
  return (
    <div>
      <div className="mb-2">
        <Button onClick={()=>onCreate?.({ rule_name: 'New rule', conditions: {} } as any)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">New Rule</Button>
      </div>
      <div className="max-h-96 overflow-auto border p-2">
        {rules.map(r=> (
          <div key={r.id} className="mb-2 border-b pb-1">
            <div className="font-medium">{r.rule_name}</div>
            <div className="text-sm">{JSON.stringify(r.conditions)}</div>
            <div className="mt-1 text-xs space-x-2">
              <Button onClick={()=>onUpdate?.(r)} size="sm" variant="ghost" className="text-yellow-600 hover:text-yellow-700">Edit</Button>
              <Button onClick={()=>onTest?.(r.id)} size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">Test</Button>
              <Button onClick={()=>onDelete?.(r.id)} size="sm" variant="ghost" className="text-red-600 hover:text-red-700">Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}