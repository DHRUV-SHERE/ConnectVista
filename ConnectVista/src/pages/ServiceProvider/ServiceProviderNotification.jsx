import { Calendar, Star, MessageSquare, TrendingUp, Bell, Check } from 'lucide-react';
import { useState } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'booking',
      title: 'New Booking Request',
      message: 'John Smith requested "Leak Repair" service for Jan 20, 2024',
      time: '5 minutes ago',
      read: false,
      icon: Calendar,
    },
    {
      id: 2,
      type: 'review',
      title: 'New Review',
      message: 'Sarah Johnson left a 5-star review for your service',
      time: '1 hour ago',
      read: false,
      icon: Star,
    },
    {
      id: 3,
      type: 'message',
      title: 'New Message',
      message: 'Mike Brown sent you a message about pipe installation',
      time: '2 hours ago',
      read: false,
      icon: MessageSquare,
    },
    {
      id: 4,
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your booking with Emily Davis has been confirmed',
      time: '3 hours ago',
      read: true,
      icon: Calendar,
    },
    {
      id: 5,
      type: 'analytics',
      title: 'Profile Views Increased',
      message: 'Your profile views increased by 25% this week',
      time: '1 day ago',
      read: true,
      icon: TrendingUp,
    },
    {
      id: 6,
      type: 'review',
      title: 'Review Reply',
      message: 'David Lee replied to your response',
      time: '2 days ago',
      read: true,
      icon: Star,
    },
  ]);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeColor = (type) => {
    switch (type) {
      case 'booking':
        return { background: '#3b82f6', opacity: '0.1', color: '#3b82f6' };
      case 'review':
        return { background: '#f59e0b', opacity: '0.1', color: '#f59e0b' };
      case 'message':
        return { background: 'var(--accent-color)', opacity: '0.1', color: 'var(--accent-color)' };
      case 'analytics':
        return { background: '#10b981', opacity: '0.1', color: '#10b981' };
      default:
        return { background: 'var(--border-color)', opacity: '0.5', color: 'var(--text-color)' };
    }
  };

  return (
    <div
    style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.5rem',
      backgroundColor: 'var(--background)',
      color: 'var(--text-color)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'flex-start'
      }} className="md:flex-row md:items-center md:justify-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px',
                minWidth: '1.5rem',
                textAlign: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </h1>
          <p style={{
            color: 'var(--text-color)',
            opacity: 0.7
          }}>Stay updated with your business activities</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              color: 'var(--text-color)'
            }}
          >
            <Check size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Bell size={20} />
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>Recent Activity</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {notifications.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem'
            }}>
              <Bell size={48} style={{ 
                margin: '0 auto 1rem', 
                opacity: 0.5 
              }} />
              <p style={{ opacity: 0.7 }}>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => {
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
                    borderRadius: '0.5rem',
                    transition: 'all 0.2s ease',
                    backgroundColor: !notification.read ? 'var(--border-color)' : 'transparent',
                    opacity: !notification.read ? 0.3 : 1
                  }}
                  className="notification-item"
                >
                  <div style={{
                    padding: '0.75rem',
                    borderRadius: '50%',
                    backgroundColor: typeStyle.background,
                    color: typeStyle.color,
                    opacity: typeStyle.opacity,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={20} />
                  </div>

                  <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.25rem' 
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      justifyContent: 'space-between',
                      gap: '0.5rem'
                    }}>
                      <p style={{ 
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}>{notification.title}</p>
                      {!notification.read && (
                        <div style={{
                          height: '0.5rem',
                          width: '0.5rem',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-color)',
                          flexShrink: 0,
                          marginTop: '0.25rem'
                        }} />
                      )}
                    </div>
                    <p style={{ 
                      fontSize: '0.875rem',
                      opacity: 0.7
                    }}>{notification.message}</p>
                    <p style={{ 
                      fontSize: '0.75rem',
                      opacity: 0.7
                    }}>{notification.time}</p>
                  </div>

                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        color: 'var(--text-color)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Mark as read
                    </button>
                  )}
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
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>Notification Preferences</h2>
        </div>
        <div style={{ 
          padding: '1.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <p style={{ 
                fontWeight: '500',
                fontSize: '0.875rem'
              }}>New Bookings</p>
              <p style={{ 
                fontSize: '0.75rem',
                opacity: 0.7
              }}>
                Get notified when you receive new booking requests
              </p>
            </div>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              opacity: 0.9
            }}>
              Enabled
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <p style={{ 
                fontWeight: '500',
                fontSize: '0.875rem'
              }}>Reviews & Ratings</p>
              <p style={{ 
                fontSize: '0.75rem',
                opacity: 0.7
              }}>
                Get notified about new reviews and ratings
              </p>
            </div>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              opacity: 0.9
            }}>
              Enabled
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <p style={{ 
                fontWeight: '500',
                fontSize: '0.875ssrem'
              }}>Messages</p>
              <p style={{ 
                fontSize: '0.75rem',
                opacity: 0.7
              }}>
                Get notified when customers send you messages
              </p>
            </div>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              opacity: 0.9
            }}>
              Enabled
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <p style={{ 
                fontWeight: '500',
                fontSize: '0.875rem'
              }}>Analytics Updates</p>
              <p style={{ 
                fontSize: '0.75rem',
                opacity: 0.7
              }}>
                Weekly reports about your business performance
              </p>
            </div>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              opacity: 0.9
            }}>
              Enabled
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .notification-item:hover {
          background-color: var(--border-color) !important;
          opacity: 0.8 !important;
        }
        
        @media (max-width: 768px) {
          .md\\:flex-row {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Notifications;