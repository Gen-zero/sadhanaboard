import { useEffect, useRef, useState } from 'react';
import { adminApi } from '@/services/adminApi';

export function useRealTimeUsers(onUserUpdate: (user: any) => void) {
  const socketRef = useRef<any>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Connect to real-time user updates
    try {
      const socket = adminApi.connectUserStream(
        (user) => {
          if (mounted) {
            console.log('Real-time user update received:', user); // Debug log
            onUserUpdate(user);
          }
        },
        (error) => {
          console.error('User stream error:', error);
          if (mounted) {
            setConnected(false);
          }
        }
      );
      
      socketRef.current = socket;
      
      socket.on('connect', () => {
        if (mounted) {
          console.log('Real-time user stream connected'); // Debug log
          setConnected(true);
        }
      });
      
      socket.on('disconnect', () => {
        if (mounted) {
          console.log('Real-time user stream disconnected'); // Debug log
          setConnected(false);
        }
      });
    } catch (e) {
      console.error('Failed to connect to user stream:', e);
      if (mounted) {
        setConnected(false);
      }
    }

    return () => {
      mounted = false;
      try {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      } catch (e) {
        // Ignore disconnect errors
      }
      socketRef.current = null;
    };
  }, [onUserUpdate]);

  return { connected, socket: socketRef.current };
}