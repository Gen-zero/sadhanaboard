import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

/**
 * Socket Context
 * Manages Socket.io connection and provides real-time event handling
 * throughout the application
 */

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = parseInt(
    import.meta.env.VITE_WS_RECONNECT_ATTEMPTS || '5'
  );
  const reconnectDelay = parseInt(
    import.meta.env.VITE_WS_RECONNECT_DELAY || '1000'
  );

  /**
   * Initialize Socket.io connection
   */
  useEffect(() => {
    const socketBaseUrl = import.meta.env.VITE_SOCKET_BASE_URL;
    
    if (!socketBaseUrl) {
      console.error('VITE_SOCKET_BASE_URL is not configured');
      setError('WebSocket URL not configured');
      return;
    }

    // Only connect if there's an authenticated user (token)
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No authentication token found, skipping WebSocket connection');
      return;
    }

    setIsConnecting(true);

    try {
      const newSocket = io(socketBaseUrl, {
        auth: {
          token: token,
        },
        reconnection: true,
        reconnectionDelay: reconnectDelay,
        reconnectionDelayMax: reconnectDelay * 10,
        reconnectionAttempts: maxReconnectAttempts,
        transports: ['websocket', 'polling'],
      });

      /**
       * Socket Event Listeners
       */

      // Connection established
      newSocket.on('connect', () => {
        console.log('✓ WebSocket connected:', newSocket.id);
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttempts.current = 0;
      });

      // Connection disconnected
      newSocket.on('disconnect', (reason) => {
        console.log('✗ WebSocket disconnected:', reason);
        setIsConnected(false);
        
        // Only set error if it's not a normal disconnect
        if (reason !== 'io client namespace disconnect' && reason !== 'io server namespace disconnect') {
          setError(`Disconnected: ${reason}`);
        }
      });

      // Connection error
      newSocket.on('connect_error', (error: any) => {
        console.error('✗ WebSocket connection error:', error);
        setError(error?.message || 'Connection error');
      });

      // Reconnection attempt
      newSocket.on('reconnect_attempt', () => {
        reconnectAttempts.current += 1;
        console.log(
          `Reconnection attempt ${reconnectAttempts.current}/${maxReconnectAttempts}`
        );
      });

      // Failed to reconnect
      newSocket.on('reconnect_failed', () => {
        console.error('✗ Failed to reconnect after maximum attempts');
        setError('Failed to establish WebSocket connection');
        setIsConnecting(false);
      });

      /**
       * Real-time Event Handlers
       */

      // User activity feed
      newSocket.on('feed:update', (data) => {
        console.log('📰 Feed update:', data);
        // This event will be handled by components listening to this socket
      });

      // Sadhana progress update
      newSocket.on('sadhana:progress', (data) => {
        console.log('📊 Sadhana progress:', data);
      });

      // New notification
      newSocket.on('notification:new', (data) => {
        console.log('🔔 New notification:', data);
      });

      // User activity (presence)
      newSocket.on('user:activity', (data) => {
        console.log('👤 User activity:', data);
      });

      // Server error
      newSocket.on('error', (error: any) => {
        console.error('🚨 Server error:', error);
        setError(error?.message || 'Server error');
      });

      setSocket(newSocket);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize WebSocket';
      console.error('Socket initialization error:', err);
      setError(errorMessage);
      setIsConnecting(false);
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []); // Empty dependency array - run once on mount

  /**
   * Register event listener
   */
  const on = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (!socket) return;
      socket.on(event, callback);
    },
    [socket]
  );

  /**
   * Unregister event listener
   */
  const off = useCallback(
    (event: string, callback?: (...args: any[]) => void) => {
      if (!socket) return;
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    },
    [socket]
  );

  /**
   * Emit event to server
   */
  const emit = useCallback(
    (event: string, ...args: any[]) => {
      if (!socket) {
        console.warn(`Socket not connected, cannot emit ${event}`);
        return;
      }
      socket.emit(event, ...args);
    },
    [socket]
  );

  /**
   * Join a room (for targeted broadcasts)
   */
  const joinRoom = useCallback(
    (room: string) => {
      if (!socket) {
        console.warn('Socket not connected, cannot join room');
        return;
      }
      socket.emit('join:room', room);
      console.log(`Joined room: ${room}`);
    },
    [socket]
  );

  /**
   * Leave a room
   */
  const leaveRoom = useCallback(
    (room: string) => {
      if (!socket) {
        console.warn('Socket not connected, cannot leave room');
        return;
      }
      socket.emit('leave:room', room);
      console.log(`Left room: ${room}`);
    },
    [socket]
  );

  const value: SocketContextType = {
    socket,
    isConnected,
    isConnecting,
    error,
    on,
    off,
    emit,
    joinRoom,
    leaveRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
