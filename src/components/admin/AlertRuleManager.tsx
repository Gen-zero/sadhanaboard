import React from 'react';
import type { AlertRule } from '@/types/admin-logs';

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
        <button onClick={()=>onCreate?.({ rule_name: 'New rule', conditions: {} } as any)} className="px-2 py-1 bg-blue-600 text-white">New Rule</button>
      </div>
      <div className="max-h-96 overflow-auto border p-2">
        {rules.map(r=> (
          <div key={r.id} className="mb-2 border-b pb-1">
            <div className="font-medium">{r.rule_name}</div>
            <div className="text-sm">{JSON.stringify(r.conditions)}</div>
            <div className="mt-1 text-xs">
              <button onClick={()=>onUpdate?.(r)} className="mr-2 text-yellow-600">Edit</button>
              <button onClick={()=>onTest?.(r.id)} className="mr-2 text-blue-600">Test</button>
              <button onClick={()=>onDelete?.(r.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
