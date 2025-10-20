import { useEffect, useRef, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import type { DashboardSnapshot } from '@/types/admin-dashboard';
import type { Socket } from 'socket.io-client';

export function useRealTimeDashboard(): { stats: DashboardSnapshot | null; error: unknown; socket: Socket | null; connection: 'connecting' | 'connected' | 'disconnected' } {
  const [stats, setStats] = useState<DashboardSnapshot | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [connectedState, setConnectedState] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    let backoffTimer: any = null;
    const onInit = (data: DashboardSnapshot) => { if (mounted) { setStats(data); setConnectedState('connected'); setError(null); } };
    const onUpdate = (data: DashboardSnapshot) => { if (mounted) { setStats(data); setError(null); } };
    const onError = (err: unknown) => { if (mounted) { setError(err); setConnectedState('disconnected'); } };

    const connect = () => {
      try {
        setConnectedState('connecting');
        const socket = adminApi.connectDashboardStream(onInit, onUpdate, onError);
        socketRef.current = socket as Socket;
        // clear any previous error/fallback state on successful connection
        if (mounted) {
          setError(null);
          setConnectedState('connected');
        }
        // reset retry count on success
        retryCount = 0;
        return socket;
      } catch (e) {
        console.error('Real-time connect failed:', e);
        setError(e);
        setConnectedState('disconnected');
        // schedule retry with exponential backoff
        retryCount += 1;
        const delay = Math.min(30000, Math.pow(2, retryCount) * 1000);
        backoffTimer = setTimeout(() => { if (mounted) connect(); }, delay);
        return null;
      }
    };

    const socket = connect();

    // handle reconnection lifecycle events if socket supports them
    if (socket && typeof socket.on === 'function') {
      setConnectedState('connecting');
      socket.on('reconnect_attempt', () => { if (mounted) setConnectedState('connecting'); });
      socket.on('reconnect_error', () => { if (mounted) setConnectedState('disconnected'); });
      socket.on('reconnect_failed', () => { if (mounted) setConnectedState('disconnected'); });
      socket.on('disconnect', () => { if (mounted) setConnectedState('disconnected'); });
    }

    return () => {
      mounted = false;
      try { adminApi.disconnectDashboardStream(); } catch (e) { /* ignore */ }
      if (backoffTimer) clearTimeout(backoffTimer);
      socketRef.current = null;
    };
  }, []);

  return { stats, error, socket: socketRef.current, connection: connectedState };
}
