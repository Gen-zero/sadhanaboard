import { useEffect, useRef, useState } from 'react';
import { adminApi } from '@/services/adminApi';

export function useRealTimeLibrary(onBookUpdate: (book: any) => void) {
  const socketRef = useRef<any>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Connect to real-time library updates
    try {
      const socket = adminApi.connectLibraryStream(
        (book) => {
          if (mounted) {
            onBookUpdate(book);
          }
        },
        (error) => {
          console.error('Library stream error:', error);
          if (mounted) {
            setConnected(false);
          }
        }
      );
      
      socketRef.current = socket;
      
      socket.on('connect', () => {
        if (mounted) {
          setConnected(true);
        }
      });
      
      socket.on('disconnect', () => {
        if (mounted) {
          setConnected(false);
        }
      });
    } catch (e) {
      console.error('Failed to connect to library stream:', e);
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
  }, [onBookUpdate]);

  return { connected, socket: socketRef.current };
}