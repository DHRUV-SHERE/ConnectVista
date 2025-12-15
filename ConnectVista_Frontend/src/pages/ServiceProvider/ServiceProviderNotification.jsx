import { Calendar, Star, MessageSquare, TrendingUp, Bell, Check, X, Settings, Mail, DollarSign, AlertCircle, Clock, UserCheck, TrendingDown } from 'lucide-react';
import { useState, useMemo } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'booking',
      title: 'New Booking Request',
      message: 'John Smith requested "Emergency Pipe Repair" service for tomorrow at 10:00 AM',
      time: '5 minutes ago',
      read: false,
      icon: Calendar,
      priority: 'high',
      action: 'view_booking'
    },
    {
      id: 2,
      type: 'review',
      title: 'New 5-Star Review',
      message: 'Sarah Johnson left an excellent review for your bathroom renovation service',
      time: '1 hour ago',
      read: false,
      icon: Star,
      priority: 'medium',
      action: 'view_review'
    },
    {
      id: 3,
      type: 'message',
      title: 'Customer Inquiry',
      message: 'Mike Brown sent a message about urgent pipe installation needs',
      time: '2 hours ago',
      read: false,
      icon: MessageSquare,
      priority: 'high',
      action: 'reply_message'
    },
    {
      id: 4,
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Emily Davis confirmed the water heater installation for January 22',
      time: '3 hours ago',
      read: true,
      icon: Calendar,
      priority: 'low',
      action: 'view_booking'
    },
    {
      id: 5,
      type: 'analytics',
      title: 'Performance Update',
      message: 'Your profile views increased by 25% and bookings by 15% this week',
      time: '1 day ago',
      read: true,
      icon: TrendingUp,
      priority: 'low',
      action: 'view_analytics'
    },
    {
      id: 6,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $850 received for booking #BK-2024-002',
      time: '1 day ago',
      read: true,
      icon: DollarSign,
      priority: 'medium',
      action: 'view_payment'
    },
    {
      id: 7,
      type: 'alert',
      title: 'Service Reminder',
      message: 'You have 3 confirmed bookings scheduled for tomorrow',
      time: '2 days ago',
      read: true,
      icon: AlertCircle,
      priority: 'medium',
      action: 'view_schedule'
    },
    {
      id: 8,
      type: 'review',
      title: 'Review Response',
      message: 'David Lee appreciated your response to his review',
      time: '2 days ago',
      read: true,
      icon: UserCheck,
      priority: 'low',
      action: 'view_review'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [notificationSettings, setNotificationSettings] = useState({
    newBookings: true,
    newReviews: true,
    messages: true,
    payments: true,
    analytics: false,
    alerts: true,
    promotions: false
  });

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const clearAllRead = () => {
    setNotifications(notifications.filter(notif => !notif.read));
  };

  const toggleSetting = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'booking':
        return { background: '#3b82f6', text: '#3b82f6' };
      case 'review':
        return { background: '#f59e0b', text: '#f59e0b' };
      case 'message':
        return { background: '#8b5cf6', text: '#8b5cf6' };
      case 'payment':
        return { background: '#10b981', text: '#10b981' };
      case 'analytics':
        return { background: '#06b6d4', text: '#06b6d4' };
      case 'alert':
        return { background: '#ef4444', text: '#ef4444' };
      default:
        return { background: '#6b7280', text: '#6b7280' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const filters = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { value: 'booking', label: 'Bookings', count: notifications.filter(n => n.type === 'booking').length },
    { value: 'review', label: 'Reviews', count: notifications.filter(n => n.type === 'review').length },
    { value: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
    { value: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
  ];

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    if (activeFilter === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === activeFilter);
  }, [notifications, activeFilter]);

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
            <button 
              onClick={clearAllRead}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                color: 'var(--text-color)',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                fontWeight: '600',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              <X size={18} />
              Clear Read
            </button>
          </div>
        </div>
        
        <p style={{
          color: 'var(--text-color)',
          opacity: 0.8,
          fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Stay updated with your business activities, customer interactions, and important alerts
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
              onClick={() => setActiveFilter(filter.value)}
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
                  {filteredNotifications.length > 0 && (
                    <span style={{
                      marginLeft: '0.5rem',
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      fontWeight: '400',
                      opacity: 0.7
                    }}>
                      ({filteredNotifications.length})
                    </span>
                  )}
                </h2>
              </div>
              
              <span style={{
                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                color: 'var(--text-color)',
                opacity: 0.7
              }}>
                {filteredNotifications.length} {filteredNotifications.length === 1 ? 'notification' : 'notifications'}
              </span>
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
            {filteredNotifications.length === 0 ? (
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
              filteredNotifications.map((notification) => {
                const Icon = notification.icon;
                const typeStyle = getTypeColor(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      transition: 'all 0.2s ease',
                      backgroundColor: !notification.read ? 'var(--background)' : 'transparent',
                      border: `1px solid ${!notification.read ? 'var(--border-color)' : 'transparent'}`,
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                    className="notification-item"
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
                      
                      {/* Priority Indicator */}
                      {notification.priority === 'high' && !notification.read && (
                        <div style={{
                          position: 'absolute',
                          top: '-4px',
                          right: '-4px',
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: getPriorityColor(notification.priority),
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
                            {!notification.read && (
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
                              {notification.time}
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
                              {notification.type}
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
                        <button
                          onClick={() => {
                            // Handle notification action
                            alert(`Action: ${notification.action}`);
                            markAsRead(notification.id);
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--accent-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {notification.action.includes('view') ? 'View Details' : 'Reply'}
                        </button>
                        
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
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
                          onClick={() => deleteNotification(notification.id)}
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
              })
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
            gap: '1.25rem',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {/* Setting Item */}
            <div style={{ 
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
                  <Calendar size={18} style={{ opacity: 0.8 }} />
                  <div>
                    <p style={{ 
                      fontWeight: '600',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                      margin: '0 0 0.25rem 0'
                    }}>
                      New Bookings
                    </p>
                    <p style={{ 
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      opacity: 0.7,
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      Get notified when you receive new booking requests
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => toggleSetting('newBookings')}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: notificationSettings.newBookings ? 'var(--accent-color)' : 'var(--border-color)',
                  color: notificationSettings.newBookings ? 'white' : 'var(--text-color)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  minWidth: '100px'
                }}
              >
                {notificationSettings.newBookings ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Setting Item */}
            <div style={{ 
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
                  <Star size={18} style={{ opacity: 0.8 }} />
                  <div>
                    <p style={{ 
                      fontWeight: '600',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                      margin: '0 0 0.25rem 0'
                    }}>
                      Reviews & Ratings
                    </p>
                    <p style={{ 
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      opacity: 0.7,
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      Get notified about new reviews and ratings
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => toggleSetting('newReviews')}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: notificationSettings.newReviews ? 'var(--accent-color)' : 'var(--border-color)',
                  color: notificationSettings.newReviews ? 'white' : 'var(--text-color)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  minWidth: '100px'
                }}
              >
                {notificationSettings.newReviews ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Setting Item */}
            <div style={{ 
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
                  <MessageSquare size={18} style={{ opacity: 0.8 }} />
                  <div>
                    <p style={{ 
                      fontWeight: '600',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                      margin: '0 0 0.25rem 0'
                    }}>
                      Customer Messages
                    </p>
                    <p style={{ 
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      opacity: 0.7,
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      Get notified when customers send you messages
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => toggleSetting('messages')}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: notificationSettings.messages ? 'var(--accent-color)' : 'var(--border-color)',
                  color: notificationSettings.messages ? 'white' : 'var(--text-color)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  minWidth: '100px'
                }}
              >
                {notificationSettings.messages ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Setting Item */}
            <div style={{ 
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
                  <DollarSign size={18} style={{ opacity: 0.8 }} />
                  <div>
                    <p style={{ 
                      fontWeight: '600',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                      margin: '0 0 0.25rem 0'
                    }}>
                      Payment Updates
                    </p>
                    <p style={{ 
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      opacity: 0.7,
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      Get notified about payments and invoices
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => toggleSetting('payments')}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: notificationSettings.payments ? 'var(--accent-color)' : 'var(--border-color)',
                  color: notificationSettings.payments ? 'white' : 'var(--text-color)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  minWidth: '100px'
                }}
              >
                {notificationSettings.payments ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Setting Item */}
            <div style={{ 
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
                  <TrendingUp size={18} style={{ opacity: 0.8 }} />
                  <div>
                    <p style={{ 
                      fontWeight: '600',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                      margin: '0 0 0.25rem 0'
                    }}>
                      Analytics Reports
                    </p>
                    <p style={{ 
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      opacity: 0.7,
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      Weekly reports about your business performance
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => toggleSetting('analytics')}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: notificationSettings.analytics ? 'var(--accent-color)' : 'var(--border-color)',
                  color: notificationSettings.analytics ? 'white' : 'var(--text-color)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  minWidth: '100px'
                }}
              >
                {notificationSettings.analytics ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Setting Item */}
            <div style={{ 
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
                  <AlertCircle size={18} style={{ opacity: 0.8 }} />
                  <div>
                    <p style={{ 
                      fontWeight: '600',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                      margin: '0 0 0.25rem 0'
                    }}>
                      Important Alerts
                    </p>
                    <p style={{ 
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      opacity: 0.7,
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      Urgent notifications and system alerts
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => toggleSetting('alerts')}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: notificationSettings.alerts ? 'var(--accent-color)' : 'var(--border-color)',
                  color: notificationSettings.alerts ? 'white' : 'var(--text-color)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  minWidth: '100px'
                }}
              >
                {notificationSettings.alerts ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Responsive CSS */}
      <style jsx="true">{`
        @media (max-width: 768px) {
          div[style*="padding: 1rem"] {
            padding: 0.75rem !important;
          }
          
          div[style*="padding: 1.25rem"] {
            padding: 1rem !important;
          }
          
          div[style*="gap: 1.5rem"] {
            gap: 1rem !important;
          }
          
          div[style*="borderRadius: 1rem"] {
            border-radius: 0.75rem !important;
          }
          
          /* Stack notification content vertically on mobile */
          .notification-item {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          
          .notification-item > div:first-child {
            margin-bottom: 0.5rem;
          }
        }
        
        @media (max-width: 480px) {
          div[style*="padding: 1rem"] {
            padding: 0.5rem !important;
          }
          
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
          
          /* Make all buttons full width on very small screens */
          div[style*="flex-wrap: wrap"] button {
            width: 100% !important;
          }
        }
        
        /* Hide scrollbar for tabs */
        div[style*="overflowX: auto"]::-webkit-scrollbar {
          display: none;
        }
        
        /* Better touch targets */
        button {
          min-height: 44px;
        }
        
        /* Prevent text overflow */
        * {
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
        
        /* Hover effects */
        .notification-item:hover {
          background-color: var(--background) !important;
          border-color: var(--border-color) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default Notifications;