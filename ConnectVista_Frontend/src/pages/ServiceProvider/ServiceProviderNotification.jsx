import { Calendar, Star, MessageSquare, TrendingUp, Bell, Check, X, Settings, Mail, DollarSign, AlertCircle, Clock, UserCheck, Loader2, RefreshCw, Shield } from 'lucide-react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { serviceAPI } from '../../services/serviceAPI';
import { useSocket } from '../../contexts/SocketContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { subscribe, setInitialUnreadCount } = useSocket();

  const [notificationSettings, setNotificationSettings] = useState({
    newBookings: true,
    newReviews: true,
    messages: true,
    payments: true,
    analytics: false,
    alerts: true,
    promotions: false
  });

  // Get icon for notification category
  const getCategoryIcon = (category, type) => {
    switch (category) {
      case 'booking':
        return Calendar;
      case 'payment':
        return DollarSign;
      case 'verification':
        return Shield;
      case 'review':
        return Star;
      case 'promotion':
        return TrendingUp;
      case 'system':
      default:
        if (type === 'success') return UserCheck;
        if (type === 'error') return AlertCircle;
        return Bell;
    }
  };

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getNotifications({
        page,
        limit: 20,
        category: activeFilter === 'all' || activeFilter === 'unread' ? undefined : activeFilter
      });

      if (response.success) {
        let notifs = response.data.notifications || [];
        // Filter for unread if that tab is active
        if (activeFilter === 'unread') {
          notifs = notifs.filter(n => !n.isRead);
        }
        setNotifications(notifs);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [page, activeFilter]);

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
    const unsubscribeNew = subscribe('booking:new', (data) => {
      toast.success('New booking request received!', { icon: '📅', duration: 5000 });
      fetchNotifications();
      fetchUnreadCount();
    });

    const unsubscribeCancelled = subscribe('booking:cancelled', () => {
      fetchNotifications();
      fetchUnreadCount();
    });

    return () => {
      unsubscribeNew();
      unsubscribeCancelled();
    };
  }, [subscribe, fetchNotifications, fetchUnreadCount]);

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

  const deleteNotification = async (id) => {
    try {
      const response = await serviceAPI.deleteNotification(id);
      if (response.success) {
        const notif = notifications.find(n => n._id === id);
        setNotifications(prev => prev.filter(n => n._id !== id));
        if (notif && !notif.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const toggleSetting = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
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

  const getTypeColor = (category) => {
    switch (category) {
      case 'booking':
        return { background: '#3b82f6', text: '#3b82f6' };
      case 'review':
        return { background: '#f59e0b', text: '#f59e0b' };
      case 'payment':
        return { background: '#10b981', text: '#10b981' };
      case 'verification':
        return { background: '#8b5cf6', text: '#8b5cf6' };
      case 'system':
        return { background: '#6b7280', text: '#6b7280' };
      default:
        return { background: '#6b7280', text: '#6b7280' };
    }
  };

  const filters = [
    { value: 'all', label: 'All', count: pagination?.total || notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'booking', label: 'Bookings', count: notifications.filter(n => n.category === 'booking').length },
    { value: 'payment', label: 'Payments', count: notifications.filter(n => n.category === 'payment').length },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      backgroundColor: 'var(--background)',
      color: 'var(--text-color)',
      padding: '1rem',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          width: '100%'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 'bold',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  fontWeight: '600',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  minWidth: '1.5rem',
                  textAlign: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={fetchNotifications}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                color: 'var(--text-color)',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                fontWeight: '600',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                opacity: loading ? 0.7 : 1
              }}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: 'var(--accent-color)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                <Check size={18} />
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        <p style={{
          color: 'var(--text-color)',
          opacity: 0.8,
          fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Stay updated with your business activities and customer interactions
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '0.5rem',
        paddingBottom: '0.75rem',
        width: '100%',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {filters.map((filter) => {
          const isActive = activeFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => {
                setActiveFilter(filter.value);
                setPage(1);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                backgroundColor: isActive ? 'var(--accent-color)' : 'var(--card-bg)',
                color: isActive ? 'white' : 'var(--text-color)',
                border: `1px solid ${isActive ? 'var(--accent-color)' : 'var(--border-color)'}`,
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
            >
              {filter.label}
              <span style={{
                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--border-color)',
                color: isActive ? 'white' : 'var(--text-color)',
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'
              }}>
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
        gap: '1.5rem',
        width: '100%'
      }}>
        {/* Notifications List */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '1rem',
          overflow: 'hidden',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{
            padding: '1.25rem 1.25rem 0 1.25rem',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Bell size={24} style={{ opacity: 0.8 }} />
                <h2 style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Recent Activity
                </h2>
              </div>
            </div>
          </div>

          <div style={{
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <Loader2 size={48} style={{ color: 'var(--accent-color)' }} className="animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                width: '100%'
              }}>
                <Bell size={48} style={{
                  margin: '0 auto 1rem',
                  opacity: 0.5
                }} />
                <h3 style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  No notifications
                </h3>
                <p style={{
                  opacity: 0.7,
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                }}>
                  {activeFilter === 'unread'
                    ? 'All notifications are read'
                    : `No ${activeFilter === 'all' ? '' : activeFilter + ' '}notifications found`
                  }
                </p>
              </div>
            ) : (
              <>
                {notifications.map((notification) => {
                  const Icon = getCategoryIcon(notification.category, notification.type);
                  const typeStyle = getTypeColor(notification.category);

                  return (
                    <div
                      key={notification._id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        transition: 'all 0.2s ease',
                        backgroundColor: !notification.isRead ? 'var(--background)' : 'transparent',
                        border: `1px solid ${!notification.isRead ? 'var(--border-color)' : 'transparent'}`,
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    >
                      {/* Notification Icon */}
                      <div style={{
                        position: 'relative',
                        flexShrink: 0
                      }}>
                        <div style={{
                          padding: '0.75rem',
                          borderRadius: '0.75rem',
                          backgroundColor: `${typeStyle.background}15`,
                          color: typeStyle.text,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon size={20} />
                        </div>

                        {/* Unread Indicator */}
                        {!notification.isRead && (
                          <div style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            height: '10px',
                            width: '10px',
                            borderRadius: '50%',
                            backgroundColor: '#ef4444',
                            border: '2px solid var(--card-bg)'
                          }} />
                        )}
                      </div>

                      {/* Notification Content */}
                      <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        minWidth: 0
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          flexWrap: 'wrap'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              flexWrap: 'wrap'
                            }}>
                              <p style={{
                                fontWeight: '600',
                                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                margin: 0
                              }}>
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <span style={{
                                  padding: '0.125rem 0.5rem',
                                  backgroundColor: 'var(--accent-color)',
                                  color: 'white',
                                  borderRadius: '9999px',
                                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                                  fontWeight: '600'
                                }}>
                                  New
                                </span>
                              )}
                            </div>

                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              flexWrap: 'wrap'
                            }}>
                              <span style={{
                                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                                opacity: 0.7,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}>
                                <Clock size={12} />
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              <span style={{
                                padding: '0.125rem 0.5rem',
                                backgroundColor: `${typeStyle.background}15`,
                                color: typeStyle.text,
                                borderRadius: '9999px',
                                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                                fontWeight: '500',
                                textTransform: 'capitalize'
                              }}>
                                {notification.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p style={{
                          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                          opacity: 0.8,
                          margin: 0,
                          lineHeight: '1.5'
                        }}>
                          {notification.message}
                        </p>

                        {/* Action Buttons */}
                        <div style={{
                          display: 'flex',
                          gap: '0.75rem',
                          flexWrap: 'wrap'
                        }}>
                          {notification.actionUrl && (
                            <Link
                              to={notification.actionUrl}
                              onClick={() => !notification.isRead && markAsRead(notification._id)}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: 'var(--accent-color)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                textDecoration: 'none',
                                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                                fontWeight: '600',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              View Details
                            </Link>
                          )}

                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--border-color)',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                                color: 'var(--text-color)',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Mark as Read
                            </button>
                          )}

                          <button
                            onClick={() => deleteNotification(notification._id)}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--border-color)',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              color: '#ef4444',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Delete notification"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        color: 'var(--text-color)',
                        opacity: page === 1 ? 0.5 : 1
                      }}
                    >
                      Previous
                    </button>
                    <span style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'var(--accent-color)',
                      color: 'white',
                      borderRadius: '0.5rem'
                    }}>
                      {page} / {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        color: 'var(--text-color)',
                        opacity: page === pagination.totalPages ? 0.5 : 1
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Notification Settings */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '1rem',
          overflow: 'hidden',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{
            padding: '1.25rem 1.25rem 0 1.25rem',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Settings size={24} style={{ opacity: 0.8 }} />
                <h2 style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Notification Preferences
                </h2>
              </div>
            </div>
          </div>

          <div style={{
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {/* Setting Items */}
            {[
              { key: 'newBookings', icon: Calendar, title: 'New Bookings', desc: 'Get notified when you receive new booking requests' },
              { key: 'newReviews', icon: Star, title: 'Reviews & Ratings', desc: 'Get notified about new reviews and ratings' },
              { key: 'messages', icon: MessageSquare, title: 'Customer Messages', desc: 'Get notified when customers send you messages' },
              { key: 'payments', icon: DollarSign, title: 'Payment Updates', desc: 'Get notified about payments and invoices' },
              { key: 'analytics', icon: TrendingUp, title: 'Analytics Reports', desc: 'Weekly reports about your business performance' },
              { key: 'alerts', icon: AlertCircle, title: 'Important Alerts', desc: 'Urgent notifications and system alerts' }
            ].map(({ key, icon: Icon, title, desc }) => (
              <div key={key} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: 'var(--background)',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={18} style={{ opacity: 0.8 }} />
                    <div>
                      <p style={{
                        fontWeight: '600',
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                        margin: '0 0 0.25rem 0'
                      }}>
                        {title}
                      </p>
                      <p style={{
                        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                        opacity: 0.7,
                        margin: 0,
                        lineHeight: '1.4'
                      }}>
                        {desc}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting(key)}
                  style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: notificationSettings[key] ? 'var(--accent-color)' : 'var(--border-color)',
                    color: notificationSettings[key] ? 'white' : 'var(--text-color)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    minWidth: '100px'
                  }}
                >
                  {notificationSettings[key] ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
