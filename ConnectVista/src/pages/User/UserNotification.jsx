"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, MessageSquare, Calendar, Star, CheckCircle, XCircle, Filter } from "lucide-react";

const UserNotifications = () => {
  const [filter, setFilter] = useState("all");
  
  const notifications = [
    { 
      id: 1, 
      type: "booking", 
      title: "Booking Confirmed", 
      message: "Your plumbing service with QuickFix Plumbing is confirmed for tomorrow at 10:00 AM", 
      time: "2 minutes ago", 
      read: false,
      icon: <Calendar className="h-5 w-5" style={{ color: "var(--accent-color)" }} />
    },
    { 
      id: 2, 
      type: "message", 
      title: "New Message", 
      message: "You have a new message from Clean Sweep Co. regarding your cleaning service", 
      time: "1 hour ago", 
      read: true,
      icon: <MessageSquare className="h-5 w-5" style={{ color: "var(--accent-color)" }} />
    },
    { 
      id: 3, 
      type: "reminder", 
      title: "Service Reminder", 
      message: "Reminder: Electrical service with Bright Spark Electric tomorrow at 10:00 AM", 
      time: "3 hours ago", 
      read: true,
      icon: <Bell className="h-5 w-5" style={{ color: "var(--accent-color)" }} />
    },
    { 
      id: 4, 
      type: "review", 
      title: "Review Published", 
      message: "Your review for Math Masters Tutoring has been published successfully", 
      time: "1 day ago", 
      read: true,
      icon: <Star className="h-5 w-5" style={{ color: "var(--accent-color)" }} />
    },
    { 
      id: 5, 
      type: "booking", 
      title: "Booking Completed", 
      message: "Your home repair service with HandyPro Services has been marked as completed", 
      time: "2 days ago", 
      read: true,
      icon: <CheckCircle className="h-5 w-5" style={{ color: "var(--accent-color)" }} />
    },
    { 
      id: 6, 
      type: "alert", 
      title: "Payment Successful", 
      message: "Payment of ₹1,499 for plumbing services has been processed successfully", 
      time: "3 days ago", 
      read: true,
      icon: <CheckCircle className="h-5 w-5" style={{ color: "var(--accent-color)" }} />
    },
  ];

  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const notificationTypes = [
    { id: "all", label: "All", icon: <Bell className="h-4 w-4" /> },
    { id: "booking", label: "Bookings", icon: <Calendar className="h-4 w-4" /> },
    { id: "message", label: "Messages", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "alert", label: "Alerts", icon: <Bell className="h-4 w-4" /> },
  ];

  const markAsRead = (id) => {
    // In a real app, you would update this in the backend
    console.log(`Marking notification ${id} as read`);
  };

  const markAllAsRead = () => {
    // In a real app, you would update all in the backend
    console.log("Marking all notifications as read");
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
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Bell className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
                <p className="text-white/80 mt-2 text-base">
                  Stay updated with your service activities
                </p>
              </div>
            </div>
            
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
                    onClick={() => setFilter(type.id)}
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
                    <span className="font-bold" style={{ color: 'var(--text-color)' }}>{notifications.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Unread</span>
                    <span className="font-bold" style={{ color: 'var(--accent-color)' }}>
                      {notifications.filter(n => !n.read).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Read</span>
                    <span className="font-bold" style={{ color: 'var(--text-color)' }}>
                      {notifications.filter(n => n.read).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="lg:w-3/4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl ${
                      !notification.read ? 'border-l-4' : ''
                    }`}
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderLeftColor: !notification.read ? 'var(--accent-color)' : 'transparent',
                      borderLeftWidth: !notification.read ? '4px' : '1px'
                    }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="mt-1">
                          {notification.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg" style={{ color: 'var(--text-color)' }}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
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
                          </div>
                          <p className="text-base mb-3" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                            {notification.message}
                          </p>
                          <p className="text-base" style={{ color: 'var(--text-color)', opacity: 0.6 }}>
                            {notification.time}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="px-4 py-2 rounded-lg font-medium transition-colors text-base"
                            style={{
                              backgroundColor: 'var(--accent-fade)',
                              color: 'var(--accent-dark)'
                            }}
                          >
                            Mark as read
                          </button>
                        )}
                        <button 
                          className="p-2 rounded-lg transition-colors"
                          style={{
                            backgroundColor: 'var(--card-bg)',
                            color: 'var(--text-color)',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
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

            {/* Load More */}
            {filteredNotifications.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  className="px-6 py-3 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  Load more notifications
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotifications;