"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Bell, MessageSquare, Calendar, Star, CheckCircle, XCircle, Filter, Loader2, RefreshCw, DollarSign, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { serviceAPI } from "../../services/serviceAPI";
import { useSocket } from "../../contexts/SocketContext";

const UserNotifications = () => {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { subscribe, setInitialUnreadCount } = useSocket();

  // Get icon for notification category
  const getCategoryIcon = (category, type) => {
    const iconClass = "h-5 w-5";
    const iconStyle = { color: "var(--accent-color)" };

    switch (category) {
      case 'booking':
        return <Calendar className={iconClass} style={iconStyle} />;
      case 'payment':
        return <DollarSign className={iconClass} style={iconStyle} />;
      case 'verification':
        return <Shield className={iconClass} style={iconStyle} />;
      case 'review':
        return <Star className={iconClass} style={iconStyle} />;
      case 'system':
      default:
        if (type === 'success') return <CheckCircle className={iconClass} style={{ color: '#10b981' }} />;
        if (type === 'error') return <XCircle className={iconClass} style={{ color: '#ef4444' }} />;
        return <Bell className={iconClass} style={iconStyle} />;
    }
  };

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getNotifications({
        page,
        limit: 20,
        category: filter === 'all' ? undefined : filter
      });

      if (response.success) {
        setNotifications(response.data.notifications || []);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await serviceAPI.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.count);
        setInitialUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, [setInitialUnreadCount]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  // Subscribe to real-time events
  useEffect(() => {
    const unsubscribe = subscribe('all', (event) => {
      // Refresh notifications when any booking event occurs
      fetchNotifications();
      fetchUnreadCount();
    });

    return () => unsubscribe();
  }, [subscribe, fetchNotifications, fetchUnreadCount]);

  // Mark as read
  const markAsRead = async (id) => {
    try {
      const response = await serviceAPI.markNotificationAsRead(id);
      if (response.success) {
        setNotifications(prev =>
          prev.map(n => n._id === id ? { ...n, isRead: true, readAt: new Date() } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await serviceAPI.markAllNotificationsAsRead();
      if (response.success) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true, readAt: new Date() }))
        );
        setUnreadCount(0);
        toast.success(`${response.data.modifiedCount} notifications marked as read`);
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const notificationTypes = [
    { id: "all", label: "All", icon: <Bell className="h-4 w-4" /> },
    { id: "booking", label: "Bookings", icon: <Calendar className="h-4 w-4" /> },
    { id: "payment", label: "Payments", icon: <DollarSign className="h-4 w-4" /> },
    { id: "system", label: "System", icon: <Bell className="h-4 w-4" /> },
  ];

  // Calculate stats
  const stats = {
    total: notifications.length,
    unread: unreadCount,
    read: notifications.filter(n => n.isRead).length
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'var(--background)',
        color: 'var(--text-color)'
      }}
    >
      {/* Header */}
      <div
        className="py-8 px-4 sm:px-6"
        style={{
          background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--accent-dark) 100%)',
          color: 'white'
        }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center relative"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Bell className="h-8 w-8 sm:h-10 sm:w-10" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
                <p className="text-white/80 mt-2 text-base">
                  Stay updated with your service activities
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
                onClick={fetchNotifications}
                disabled={loading}
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {unreadCount > 0 && (
                <button
                  className="px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onClick={markAllAsRead}
                >
                  <CheckCircle className="h-5 w-5" />
                  Mark all as read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div
              className="rounded-2xl shadow-lg p-6 sticky top-6"
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)'
              }}
            >
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" style={{ color: 'var(--accent-color)' }} />
                Filter by Type
              </h2>
              <div className="space-y-2">
                {notificationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setFilter(type.id);
                      setPage(1);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left ${
                      filter === type.id
                        ? "font-bold"
                        : "hover:opacity-90"
                    }`}
                    style={{
                      backgroundColor: filter === type.id ? 'var(--accent-color)' : 'transparent',
                      color: filter === type.id ? 'white' : 'var(--text-color)'
                    }}
                  >
                    {type.icon}
                    <span className="text-base">{type.label}</span>
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <h3 className="font-bold mb-3 text-base">Notification Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Total</span>
                    <span className="font-bold" style={{ color: 'var(--text-color)' }}>{pagination?.total || stats.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Unread</span>
                    <span className="font-bold" style={{ color: 'var(--accent-color)' }}>
                      {unreadCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Read</span>
                    <span className="font-bold" style={{ color: 'var(--text-color)' }}>
                      {stats.read}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-12 w-12 animate-spin" style={{ color: 'var(--accent-color)' }} />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {notifications.length > 0 ? (
                  <>
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl ${
                          !notification.isRead ? 'border-l-4' : ''
                        }`}
                        style={{
                          backgroundColor: 'var(--card-bg)',
                          border: '1px solid var(--border-color)',
                          borderLeftColor: !notification.isRead ? 'var(--accent-color)' : 'transparent',
                          borderLeftWidth: !notification.isRead ? '4px' : '1px'
                        }}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="mt-1">
                              {getCategoryIcon(notification.category, notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="font-bold text-lg" style={{ color: 'var(--text-color)' }}>
                                  {notification.title}
                                </h3>
                                {!notification.isRead && (
                                  <span
                                    className="px-2 py-1 rounded-full text-xs font-bold"
                                    style={{
                                      backgroundColor: 'var(--accent-fade)',
                                      color: 'var(--accent-dark)'
                                    }}
                                  >
                                    New
                                  </span>
                                )}
                                <span
                                  className="px-2 py-1 rounded-full text-xs"
                                  style={{
                                    backgroundColor: 'var(--card-bg)',
                                    color: 'var(--text-color)',
                                    opacity: 0.7,
                                    border: '1px solid var(--border-color)'
                                  }}
                                >
                                  {notification.category}
                                </span>
                              </div>
                              <p className="text-base mb-3" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                                {notification.message}
                              </p>
                              <p className="text-base" style={{ color: 'var(--text-color)', opacity: 0.6 }}>
                                {formatTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification._id)}
                                className="px-4 py-2 rounded-lg font-medium transition-colors text-base"
                                style={{
                                  backgroundColor: 'var(--accent-fade)',
                                  color: 'var(--accent-dark)'
                                }}
                              >
                                Mark as read
                              </button>
                            )}
                            {notification.actionUrl && (
                              <a
                                href={notification.actionUrl}
                                className="px-4 py-2 rounded-lg font-medium transition-colors text-base"
                                style={{
                                  backgroundColor: 'var(--accent-color)',
                                  color: 'white'
                                }}
                              >
                                View
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-8">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="px-4 py-2 rounded-lg font-medium"
                          style={{
                            backgroundColor: 'var(--card-bg)',
                            color: 'var(--text-color)',
                            border: '1px solid var(--border-color)',
                            opacity: page === 1 ? 0.5 : 1
                          }}
                        >
                          Previous
                        </button>
                        <span
                          className="px-4 py-2 rounded-lg"
                          style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
                        >
                          {page} / {pagination.totalPages}
                        </span>
                        <button
                          onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                          disabled={page === pagination.totalPages}
                          className="px-4 py-2 rounded-lg font-medium"
                          style={{
                            backgroundColor: 'var(--card-bg)',
                            color: 'var(--text-color)',
                            border: '1px solid var(--border-color)',
                            opacity: page === pagination.totalPages ? 0.5 : 1
                          }}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="rounded-2xl shadow-lg p-12 text-center"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <Bell className="h-16 w-16 mx-auto mb-4" style={{ opacity: 0.3, color: "var(--text-color)" }} />
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>
                      No notifications found
                    </h3>
                    <p className="text-base mb-6" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                      {filter === "all"
                        ? "You're all caught up!"
                        : `No ${filter} notifications found`}
                    </p>
                    {filter !== "all" && (
                      <button
                        onClick={() => setFilter("all")}
                        className="px-5 py-2.5 rounded-lg font-medium transition-colors"
                        style={{
                          background: 'var(--accent-color)',
                          color: 'white'
                        }}
                      >
                        View all notifications
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotifications;
