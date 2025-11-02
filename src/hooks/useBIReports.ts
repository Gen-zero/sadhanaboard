import { useEffect, useState, useRef, useCallback } from 'react';
import { adminApi } from '@/services/adminApi';
import type { KPISnapshot, ReportTemplate, ScheduledReport, SpiritualInsight } from '@/types/bi-reports';
import { EnergyLevelResult } from '@/data/energyLevelQuestions';

// Extend the types to include energy level data
interface ExtendedKPISnapshot extends KPISnapshot {
  energy_level_distribution?: {
    sattva: number;
    rajas: number;
    tamas: number;
  };
  average_energy_balance?: {
    sattva: number;
    rajas: number;
    tamas: number;
  };
}

interface CommunityEnergyInsight {
  id: string;
  insight_type: 'energy_balance';
  user_id?: string | null;
  content: {
    title: string;
    description: string;
    recommendations: string[];
    energy_data: EnergyLevelResult;
  };
  score?: number;
  generated_at?: string;
  expires_at?: string | null;
}

export function useBIReports() {
  const [kpi, setKpi] = useState<ExtendedKPISnapshot | null>(null);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [schedules, setSchedules] = useState<ScheduledReport[]>([]);
  const [insights, setInsights] = useState<SpiritualInsight[]>([]);
  const [energyInsights, setEnergyInsights] = useState<CommunityEnergyInsight[]>([]);
  const socketRef = useRef<any>(null);

  const loadAll = useCallback(async () => {
    try {
      const snap = await adminApi.getBIKPISnapshot();
      setKpi(snap);
    } catch (e) { console.error('load KPIs', e); }
    try {
      const t = await adminApi.getBIReportTemplates();
      setTemplates(t.items || []);
    } catch (e) { console.error('load templates', e); }
    try {
      const s = await adminApi.getScheduledReports();
      setSchedules(s.items || []);
    } catch (e) { console.error('load schedules', e); }
    try {
      const ins = await adminApi.getCommunityInsights();
      setInsights(ins.items || []);
    } catch (e) { console.error('load insights', e); }
    try {
      // Load energy insights if available
      // This would be implemented in the backend API
    } catch (e) { console.error('load energy insights', e); }
  }, []);

  useEffect(() => {
    loadAll();
    // connect socket
    try {
      const socket = adminApi.connectBIStream(
        (d:any) => { if (d) setKpi(prev => ({ ...(prev as any), ...(d.kpi || d) } as ExtendedKPISnapshot)); },
        (d:any) => {
          // execution status updates could be used to refresh executions/schedules
          // for now we trigger a schedules refresh when executions change
          loadAll();
        },
        (d:any) => {
          // insights pushed
          if (d && d.items) setInsights(prev => [...(d.items || []), ...prev]);
        },
        (err:any) => console.error('BI socket error', err)
      );
      socketRef.current = socket;
      // join rooms so server-side will send updates; emit subscribe if available
      try { socket.emit('bi:subscribe', { rooms: ['bi-kpis','bi-executions','bi-insights'] }); } catch (e) {
        console.error('Failed to subscribe to BI rooms:', e);
      }
    } catch (e) {
      console.error('Failed to connect BI socket', e);
    }

    return () => {
      try { if (socketRef.current) socketRef.current.disconnect(); } catch (e) {
        console.error('Failed to disconnect BI socket:', e);
      }
    };
  }, [loadAll]);

  const refreshAll = useCallback(() => { loadAll(); }, [loadAll]);

  const createTemplate = useCallback(async (payload: Partial<ReportTemplate>) => {
    const res = await adminApi.createBIReportTemplate(payload as any);
    await loadAll();
    return res;
  }, [loadAll]);

  const createSchedule = useCallback(async (payload: Partial<ScheduledReport>) => {
    const res = await adminApi.createScheduledReport(payload as any);
    await loadAll();
    return res;
  }, [loadAll]);

  const generateInsights = useCallback(async (type: any, params = {}) => {
    const res = await adminApi.generateInsights(type, params);
    await loadAll();
    return res;
  }, [loadAll]);

  // New function to generate energy level insights
  const generateEnergyInsights = useCallback(async (userId?: string) => {
    try {
      // This would call a specific API endpoint for energy insights
      // For now, we'll simulate the functionality
      const mockInsight: CommunityEnergyInsight = {
        id: 'energy-' + Date.now(),
        insight_type: 'energy_balance',
        user_id: userId || null,
        content: {
          title: 'Energy Balance Insight',
          description: 'Your energy balance shows opportunities for growth',
          recommendations: [
            'Increase sattvic practices like meditation',
            'Reduce tamasic activities like excessive sleep',
            'Channel rajasic energy toward spiritual goals'
          ],
          energy_data: {
            sattva: 45,
            rajas: 35,
            tamas: 20,
            total: 100,
            percentages: {
              sattva: 45,
              rajas: 35,
              tamas: 20
            }
          }
        },
        score: 75,
        generated_at: new Date().toISOString()
      };
      
      setEnergyInsights(prev => [mockInsight, ...prev]);
      return mockInsight;
    } catch (error) {
      console.error('Error generating energy insights:', error);
      throw error;
    }
  }, []);

  return {
    kpi,
    templates,
    schedules,
    insights,
    energyInsights,
    refreshAll,
    createTemplate,
    createSchedule,
    generateInsights,
    generateEnergyInsights
  };
}

export default useBIReports;