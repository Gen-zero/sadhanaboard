import { useEffect, useState, useRef, useCallback } from 'react';
import { adminApi } from '@/services/adminApi';
import type { SystemMetrics, SystemAlert, DeploymentInfo, ApiMetrics, SystemAlertRule, SystemHealth } from '@/types/system';

export function useSystemMonitoring() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [apiAnalytics, setApiAnalytics] = useState<ApiMetrics | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [alertRules, setAlertRules] = useState<SystemAlertRule[]>([]);
  const [deployment, setDeployment] = useState<DeploymentInfo | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { 
      const m = await adminApi.getSystemMetrics(); 
      setMetrics(m); 
    } catch (e) { 
      console.error('Failed to load system metrics:', e);
      setError('Failed to load system metrics');
    }
    
    try { 
      const h = await adminApi.getSystemMetricsHistory('24h'); 
      setHistory(h.items || h || []); 
    } catch (e) {
      console.error('Failed to load metrics history', e);
    }
    
    try { 
      const a = await adminApi.getSystemAlerts(); 
      setAlerts(a || []); 
    } catch (e) {
      console.error('Failed to load system alerts', e);
    }
    
    try { 
      const rules = await adminApi.getSystemAlertRules(); 
      setAlertRules(rules || []); 
    } catch (e) {
      console.error('Failed to load alert rules', e);
    }
    
    try { 
      const d = await adminApi.getDeploymentInfo(); 
      setDeployment(d); 
    } catch (e) {
      console.error('Failed to load deployment info', e);
    }
    
    try { 
      const h = await adminApi.getSystemHealth(); 
      setHealth(h); 
    } catch (e) {
      console.error('Failed to load system health', e);
    }
    
    try { 
      const api = await adminApi.getApiAnalytics('24h'); 
      setApiAnalytics(api); 
    } catch (e) {
      console.error('Failed to load API analytics', e);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    
    // Connect to real-time streaming
    try {
      const socket = adminApi.connectSystemMetricsStream(
        (metricsData: any) => {
          setMetrics(metricsData);
        },
        (alertData: any) => {
          setAlerts(prev => [alertData, ...prev]);
        },
        (error: any) => {
          console.error('System monitoring socket error:', error);
        }
      );
      
      socketRef.current = socket;
    } catch (e) { 
      console.error('System monitoring socket connection failed', e); 
    }
    
    return () => { 
      try { 
        if (socketRef.current) socketRef.current.disconnect(); 
      } catch (e) {
        console.error('Failed to disconnect system monitoring socket:', e);
      }
    };
  }, [load]);

  const refresh = () => load();
  
  const runOptimization = async (table?: string) => { 
    return adminApi.runDatabaseOptimization({ table }); 
  };
  
  const getSlowQueries = async (limit: number = 100) => {
    return adminApi.getSlowQueries(limit);
  };
  
  const getConnectionPoolStatus = async () => {
    return adminApi.getConnectionPoolStatus();
  };
  
  const getDatabaseAnalysis = async () => {
    return adminApi.getDatabaseAnalysis();
  };
  
  const createAlertRule = async (payload: any) => {
    const result = await adminApi.createSystemAlertRule(payload);
    if (result && !result.error) {
      // Refresh rules list
      try {
        const rules = await adminApi.getSystemAlertRules();
        setAlertRules(rules || []);
      } catch (e) {
        console.error('Failed to refresh alert rules', e);
      }
    }
    return result;
  };
  
  const updateAlertRule = async (id: string, updates: any) => {
    const result = await adminApi.updateSystemAlertRule(id, updates);
    if (result && !result.error) {
      // Refresh rules list
      try {
        const rules = await adminApi.getSystemAlertRules();
        setAlertRules(rules || []);
      } catch (e) {
        console.error('Failed to refresh alert rules', e);
      }
    }
    return result;
  };
  
  const deleteAlertRule = async (id: string) => {
    const result = await adminApi.deleteSystemAlertRule(id);
    if (result && !result.error) {
      // Refresh rules list
      try {
        const rules = await adminApi.getSystemAlertRules();
        setAlertRules(rules || []);
      } catch (e) {
        console.error('Failed to refresh alert rules', e);
      }
    }
    return result;
  };
  
  const resolveAlert = async (id: string) => {
    const result = await adminApi.resolveSystemAlert(id);
    if (result && !result.error) {
      // Refresh alerts list
      try {
        const alerts = await adminApi.getSystemAlerts();
        setAlerts(alerts || []);
      } catch (e) {
        console.error('Failed to refresh alerts', e);
      }
    }
    return result;
  };

  return { 
    metrics, 
    history, 
    apiAnalytics,
    alerts, 
    alertRules,
    deployment, 
    health,
    loading,
    error,
    refresh, 
    runOptimization,
    getSlowQueries,
    getConnectionPoolStatus,
    getDatabaseAnalysis,
    createAlertRule,
    updateAlertRule,
    deleteAlertRule,
    resolveAlert
  };
}

export default useSystemMonitoring;