import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const listenersRef = useRef(new Map());

  // Connect to socket when user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Disconnect if not authenticated
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    // Create socket connection
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
    });

    // Booking events - these trigger notifications
    socket.on('booking:new', (data) => {
      console.log('New booking received:', data);
      handleNewNotification(data.notification, 'booking:new');
    });

    socket.on('booking:accepted', (data) => {
      console.log('Booking accepted:', data);
      handleNewNotification(data.notification, 'booking:accepted');
    });

    socket.on('booking:rejected', (data) => {
      console.log('Booking rejected:', data);
      handleNewNotification(data.notification, 'booking:rejected');
    });

    socket.on('booking:cancelled', (data) => {
      console.log('Booking cancelled:', data);
      handleNewNotification(data.notification, 'booking:cancelled');
    });

    // General notification event
    socket.on('notification:new', (data) => {
      console.log('New notification:', data);
      handleNewNotification(data, 'notification:new');
    });

    // Notification count update event
    socket.on('notification:count', (data) => {
      console.log('Notification count update:', data);
      setUnreadCount(data.count || 0);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [isAuthenticated, user]);

  // Handle new notification
  const handleNewNotification = useCallback((notification, eventType) => {
    if (!notification) return;

    // Add to notifications list
    setNotifications(prev => [notification, ...prev]);

    // Increment unread count
    setUnreadCount(prev => prev + 1);

    // Notify all listeners for this event type
    const listeners = listenersRef.current.get(eventType);
    if (listeners) {
      listeners.forEach(callback => callback(notification));
    }

    // Also notify 'all' listeners
    const allListeners = listenersRef.current.get('all');
    if (allListeners) {
      allListeners.forEach(callback => callback({ type: eventType, data: notification }));
    }
  }, []);

  // Subscribe to socket events
  const subscribe = useCallback((eventType, callback) => {
    if (!listenersRef.current.has(eventType)) {
      listenersRef.current.set(eventType, new Set());
    }
    listenersRef.current.get(eventType).add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = listenersRef.current.get(eventType);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }, []);

  // Reset unread count
  const resetUnreadCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Set initial unread count (called when fetching from API)
  const setInitialUnreadCount = useCallback((count) => {
    setUnreadCount(count);
  }, []);

  // Update unread count (called when marking as read)
  const updateUnreadCount = useCallback((count) => {
    setUnreadCount(count);
  }, []);

  // Emit event to socket
  const emit = useCallback((event, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  }, [isConnected]);

  const value = {
    socket: socketRef.current,
    isConnected,
    notifications,
    unreadCount,
    subscribe,
    emit,
    resetUnreadCount,
    clearNotifications,
    setInitialUnreadCount,
    updateUnreadCount
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;
