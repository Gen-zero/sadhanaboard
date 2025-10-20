import { useEffect, useRef, useState } from 'react';
import type { AdminLog, SecurityEvent } from '@/types/admin-logs';

const SOCKET_URL = (import.meta.env.VITE_SOCKET_BASE_URL as string) || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3004');

export function useLogStream(onLog: (l: AdminLog) => void, onEvent?: (e: SecurityEvent) => void) {
  const socketRef = useRef<any>(null);
  const esRef = useRef<EventSource | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Attempt a client-only dynamic import of socket.io-client. If it fails or we're not
    // running in the browser, fall back to SSE.
    (async () => {
      if (typeof window === 'undefined') return;

      try {
        const mod: any = await import('socket.io-client');
        const factory = mod && (mod.default || mod) ? (mod.default || mod) : null;
        if (factory) {
          const sock: any = factory(SOCKET_URL, { withCredentials: true, path: '/socket.io' });
          socketRef.current = sock;

          sock.on('connect', () => { if (mounted) setConnected(true); });
          sock.on('logs:new', (payload: AdminLog) => { try { onLog && onLog(payload); } catch (e) { console.error(e); } });
          sock.on('security:alert', (payload: any) => { try { onEvent && onEvent(payload); } catch (e) { /* ignore */ } });

          return; // socket established
        }
      } catch (e) {
        // dynamic import failed — fall through to SSE fallback
        console.warn('Socket.IO dynamic import failed, falling back to SSE', e);
      }

      // SSE fallback
      try {
        const es = new EventSource(`${(import.meta.env.VITE_ADMIN_API_BASE as string) || '/api/admin'}/logs/stream`, { withCredentials: true } as any);
        esRef.current = es;
        es.onmessage = (ev) => {
          try {
            const data = JSON.parse(ev.data || '{}');
            if (data && data.type === 'logs:new' && data.payload) onLog && onLog(data.payload);
          } catch (err) { console.error('SSE parse error', err); }
        };
        es.onerror = () => { if (mounted) setConnected(false); };
      } catch (e) {
        console.error('SSE init failed', e);
      }
    })();

    return () => {
      mounted = false;
      try { if (socketRef.current) socketRef.current.disconnect(); } catch (e) { /* ignore */ }
      try { if (esRef.current) esRef.current.close(); } catch (e) { /* ignore */ }
      socketRef.current = null;
      esRef.current = null;
    };
  }, [onLog, onEvent]);

  return { connected, socket: socketRef.current };
}
