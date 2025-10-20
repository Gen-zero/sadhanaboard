import React, { useEffect, useState, useRef } from 'react';
import LogStreamViewer from '@/components/admin/LogStreamViewer';
import LogFilterBar from '@/components/admin/LogFilterBar';
import LogSearchInterface from '@/components/admin/LogSearchInterface';
import SecurityEventPanel from '@/components/admin/SecurityEventPanel';
import LogAnalyticsDashboard from '@/components/admin/LogAnalyticsDashboard';
import AlertRuleManager from '@/components/admin/AlertRuleManager';
import { useLogStream } from '@/hooks/useLogStream';
import { adminApi } from '@/services/adminApi';
import type { AdminLog, PagedResult, SecurityEvent, AlertRule } from '@/types/admin-logs';

type Tab = 'stream'|'search'|'events'|'analytics'|'alerts';

const FILTERS_KEY = 'admin_logs_filters_v1';

export default function AdminLogsPage(){
  const [activeTab, setActiveTab] = useState<Tab>('stream');
  const [filters, setFilters] = useState<any>(()=>{
    try{ const raw = localStorage.getItem(FILTERS_KEY); return raw? JSON.parse(raw) : {}; }catch(e){ return {}; }
  });

  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [rules, setRules] = useState<AlertRule[]>([]);

  const [streamLogs, setStreamLogs] = useState<AdminLog[]>([]);
  const [searchResults, setSearchResults] = useState<AdminLog[]>([]);

  const searchInProgress = useRef(false);

  useEffect(()=>{ loadInitial(); }, []);

  const { connected } = useLogStream((l)=>{
    setStreamLogs(s=> [l, ...s].slice(0, 1000));
  }, (e)=>{
    setEvents(s=> [e, ...s].slice(0, 500));
  });

  useEffect(()=>{ 
    try{ 
      localStorage.setItem(FILTERS_KEY, JSON.stringify(filters)); 
    } catch(e) {
      console.error('Failed to save filters to localStorage:', e);
    } 
  }, [filters]);

  useEffect(()=>{
    const onKey = (e:KeyboardEvent)=>{
      if (e.key === '/') { e.preventDefault(); const el = document.querySelector<HTMLInputElement>('#admin-global-search'); el?.focus(); }
      if (e.key === 's' && e.ctrlKey) { e.preventDefault(); setActiveTab('search'); }
      // removed invalid comparison between unrelated keys
    };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, []);

  async function loadInitial(){
    const [s, ev, rl] = await Promise.allSettled([
      adminApi.getLogStatistics(),
      adminApi.getSecurityEvents(),
      adminApi.listAlertRules()
    ]);
    if (s.status === 'fulfilled') setStats(s.value);
    if (ev.status === 'fulfilled') setEvents(ev.value.items || []);
    if (rl.status === 'fulfilled') setRules(rl.value.items || []);
  }

  async function handleSearch(overrideFilters?: any){
    if (searchInProgress.current) return;
    searchInProgress.current = true;
    try{
      const f = { ...filters, ...(overrideFilters||{}) };
      const res = await adminApi.listLogs(f);
      setSearchResults(res.items || []);
      setActiveTab('search');
    }catch(e){ console.error('search failed', e); }
    finally{ searchInProgress.current = false; }
  }

  async function handleExport(format='csv'){
    try{ await adminApi.exportLogs(filters, format); }catch(e){ console.error('export failed', e); }
  }

  async function createRuleFromLog(log:AdminLog){
    const rule = { rule_name: `From log ${log.action}`, conditions: { action: log.action, severity: log.severity } } as any;
    try{ const r = await adminApi.createAlertRule(rule); setRules(prev=>[r, ...prev]); }catch(e){ console.error(e); }
  }

  async function createRuleFromEvent(ev:SecurityEvent){
    const rule = { rule_name: `From event ${ev.event_type}`, conditions: { event_type: ev.event_type, threat_level: ev.threat_level } } as any;
    try{ const r = await adminApi.createAlertRule(rule); setRules(prev=>[r, ...prev]); }catch(e){ console.error(e); }
  }

  async function handleResolveEvent(id:number){
    try{ await adminApi.resolveSecurityEvent(id); setEvents(prev=>prev.map(e=> e.id===id? {...e, resolved: true}: e)); }catch(e){ console.error(e); }
  }

  async function createRule(r:Partial<AlertRule>){ try { const created = await adminApi.createAlertRule(r); setRules(prev=>[created, ...prev]); } catch(e){ console.error(e); } }
  async function updateRule(r:AlertRule){ try { await adminApi.updateAlertRule(r.id, r); setRules(prev=> prev.map(x=> x.id===r.id? r: x)); } catch(e){ console.error(e); } }
  async function deleteRule(id:number){ try { await adminApi.deleteAlertRule(id); setRules(prev=> prev.filter(x=> x.id!==id)); } catch(e){ console.error(e); } }
  async function testRule(id:number){ try { await adminApi.testAlertRule(id); } catch(e){ console.error(e); } }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Monitoring Center — Admin Logs</h1>

      <div className="mb-4 flex items-center gap-2">
        <input id="admin-global-search" placeholder="Search logs (press /)" value={filters.q||''} onChange={(e)=>setFilters({...filters, q: e.target.value})} className="border p-2 flex-1" />
        <button onClick={()=>handleSearch()} className="px-3 py-1 bg-blue-600 text-white">Search</button>
        <div className="ml-4">
          <button onClick={()=>setActiveTab('stream')} className={`mr-2 ${activeTab==='stream'?'font-bold':''}`}>Stream</button>
          <button onClick={()=>setActiveTab('search')} className={`mr-2 ${activeTab==='search'?'font-bold':''}`}>Search</button>
          <button onClick={()=>setActiveTab('events')} className={`mr-2 ${activeTab==='events'?'font-bold':''}`}>Events</button>
          <button onClick={()=>setActiveTab('analytics')} className={`mr-2 ${activeTab==='analytics'?'font-bold':''}`}>Analytics</button>
          <button onClick={()=>setActiveTab('alerts')} className={`mr-2 ${activeTab==='alerts'?'font-bold':''}`}>Alerts</button>
        </div>
      </div>

      <div className="mb-4">
        {activeTab === 'stream' && (
          <LogStreamViewer logs={streamLogs} connected={connected} onCreateRule={createRuleFromLog} onViewRelated={(cid)=>{ setActiveTab('search'); setFilters({...filters, correlationId: cid}); handleSearch({...filters, correlationId: cid}); }} />
        )}

        {activeTab === 'search' && (
          <div>
            <LogFilterBar value={filters} onChange={setFilters} onExport={(fmt)=>handleExport(fmt)} />
            <LogSearchInterface filters={filters} results={searchResults} onSearch={handleSearch} onSavePreset={(name)=> setSavedSearches(prev=> [{ name, filters }, ...prev])} />
          </div>
        )}

        {activeTab === 'events' && (
          <SecurityEventPanel events={events} onResolve={handleResolveEvent} onCreateRule={createRuleFromEvent} />
        )}

        {activeTab === 'analytics' && (
          <LogAnalyticsDashboard stats={stats} onDrillDown={(partial)=>{ setFilters({...filters, ...partial}); setActiveTab('search'); handleSearch({...filters, ...partial}); }} />
        )}

        {activeTab === 'alerts' && (
          <AlertRuleManager rules={rules} onCreate={createRule} onUpdate={updateRule} onDelete={deleteRule} onTest={testRule} />
        )}
      </div>
    </div>
  );
}



