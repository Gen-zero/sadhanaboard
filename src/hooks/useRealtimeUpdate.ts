import { useEffect, useCallback, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';

/**
 * Hook for managing real-time data updates via Socket.io
 * Handles subscription, cleanup, and integration with React Query
 */

interface UseRealtimeUpdateOptions {
  event: string;
  enabled?: boolean;
  onData: (data: any) => void;
  onError?: (error: any) => void;
  room?: string;
}

export const useRealtimeUpdate = ({
  event,
  enabled = true,
  onData,
  onError,
  room,
}: UseRealtimeUpdateOptions) => {
  const { socket, isConnected, on, off, joinRoom, leaveRoom } = useSocket();
  const eventRef = useRef(event);
  const roomRef = useRef(room);

  useEffect(() => {
    // Update refs if event or room changes
    eventRef.current = event;
    roomRef.current = room;
  }, [event, room]);

  useEffect(() => {
    if (!enabled || !isConnected || !socket) {
      return;
    }

    // Join room if specified
    if (room) {
      joinRoom(room);
    }

    // Subscribe to event
    const handleUpdate = (data: any) => {
      try {
        onData(data);
      } catch (error) {
        console.error(`Error processing ${event} update:`, error);
        onError?.(error);
      }
    };

    on(event, handleUpdate);

    // Cleanup
    return () => {
      off(event, handleUpdate);
      if (room) {
        leaveRoom(room);
      }
    };
  }, [enabled, isConnected, socket, event, room, on, off, joinRoom, leaveRoom, onData, onError]);

  return { isConnected };
};

/**
 * Hook for sending real-time events
 */
export const useRealtimeEmit = () => {
  const { socket, isConnected, emit } = useSocket();

  const sendEvent = useCallback(
    (event: string, data: any) => {
      if (!isConnected) {
        console.warn('Socket not connected, event not sent:', event);
        return false;
      }
      emit(event, data);
      return true;
    },
    [isConnected, emit]
  );

  return { sendEvent, isConnected };
};

/**
 * Hook for managing room subscriptions
 */
export const useSocketRoom = (room: string, enabled: boolean = true) => {
  const { joinRoom, leaveRoom, isConnected } = useSocket();

  useEffect(() => {
    if (!enabled || !isConnected) return;

    joinRoom(room);

    return () => {
      leaveRoom(room);
    };
  }, [room, enabled, isConnected, joinRoom, leaveRoom]);

  return { isConnected };
};
