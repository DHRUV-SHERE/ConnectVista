import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { notificationAPI } from '../services/notificationAPI';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({
    booking: 0,
    payment: 0,
    verification: 0,
    system: 0,
    promotion: 0,
    review: 0
  });
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

    // Notification category counts update event
    socket.on('notification:counts', (data) => {
      console.log('Notification category counts update:', data);
      setCategoryCounts(prev => ({
        ...prev,
        ...data
      }));
      if (data.total !== undefined) setUnreadCount(data.total);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [isAuthenticated, user]);

  // Fetch initial counts when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchCounts = async () => {
      try {
        const response = await notificationAPI.getCategoryCounts();
        if (response.success) {
          if (response.data.total !== undefined) setUnreadCount(response.data.total);
          setCategoryCounts(prev => ({ ...prev, ...response.data }));
        }
      } catch (error) {
        console.error('Failed to fetch initial unread counts:', error);
      }
    };
    fetchCounts();
  }, [isAuthenticated]);

  // Handle new notification
  const handleNewNotification = useCallback((notification, eventType) => {
    if (!notification) return;

    // Add to notifications list
    setNotifications(prev => [notification, ...prev]);

    // Increment unread count
    setUnreadCount(prev => prev + 1);

    // Increment category count
    if (notification.category) {
      setCategoryCounts(prev => ({
        ...prev,
        [notification.category]: (prev[notification.category] || 0) + 1
      }));
    }

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
    setCategoryCounts({
      booking: 0,
      payment: 0,
      verification: 0,
      system: 0,
      promotion: 0,
      review: 0
    });
  }, []);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    resetUnreadCount();
  }, [resetUnreadCount]);

  // Set initial unread count and category counts
  const setInitialUnreadCount = useCallback((count) => {
    setUnreadCount(count);
  }, []);

  const setInitialCounts = useCallback((counts) => {
    if (counts.total !== undefined) setUnreadCount(counts.total);
    setCategoryCounts(prev => ({
      ...prev,
      ...counts
    }));
  }, []);

  // Update unread count (called when marking as read)
  const updateUnreadCount = useCallback((count) => {
    setUnreadCount(count);
  }, []);

  // Mark category as read
  const markCategoryAsRead = useCallback(async (category) => {
    try {
      const response = await notificationAPI.markByCategoryAsRead(category);
      if (response.success) {
        setCategoryCounts(prev => ({
          ...prev,
          ...response.data
        }));
        if (response.data.total !== undefined) setUnreadCount(response.data.total);
      }
    } catch (error) {
      console.error('Failed to mark category as read:', error);
    }
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
    categoryCounts,
    subscribe,
    emit,
    resetUnreadCount,
    clearNotifications,
    setInitialUnreadCount,
    setInitialCounts,
    updateUnreadCount,
    markCategoryAsRead
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
