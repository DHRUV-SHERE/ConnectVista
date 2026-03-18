import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, Bell, MessageSquare, LogOut } from "lucide-react";
import { useSocket } from "../../contexts/SocketContext";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { serviceAPI } from "../../services/serviceAPI";
import resources from "../../resources";

const Navbar = () => {
  const { unreadCount, setInitialUnreadCount, updateUnreadCount } = useSocket();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef(null);

  // Fetch unread count on mount
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await serviceAPI.getUnreadCount();
        if (response.success) {
          setInitialUnreadCount(response.data.unreadCount);
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };
    fetchUnreadCount();
  }, [setInitialUnreadCount]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (notificationsOpen) {
      const fetchNotifications = async () => {
        try {
          const response = await serviceAPI.getNotifications({ limit: 5 });
          if (response.success) {
            setNotifications(response.data.notifications);
          }
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      };
      fetchNotifications();
    }
  }, [notificationsOpen]);

  const navLinks = [
    { to: "/user/home", label: "Home" },
    { to: "/user/services", label: "Services" },
    { to: "/user/bookings", label: "Bookings" },
    { to: "/user/invoices", label: "Invoices" },
    { to: "/user/about", label: "About" },
    { to: "/user/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle hover on desktop
  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) { // Desktop only
      const timeout = setTimeout(() => {
        setNotificationsOpen(true);
      }, 200); // Small delay for better UX
      setHoverTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    
    // Delay closing for better UX (allows moving cursor to dropdown)
    setTimeout(() => {
      if (window.innerWidth >= 768 && notificationsOpen) {
        // Check if mouse is still over the button or dropdown
        if (!notificationsRef.current?.contains(document.activeElement)) {
          setNotificationsOpen(false);
        }
      }
    }, 100);
  };

  // Handle click - redirect directly to notifications page
  const handleNotificationClick = () => {
    // Clear any pending hover timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    
    navigate("/user/notifications");
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
  };

  // Handle notification item click
  const handleNotificationItemClick = async (notificationId) => {
    try {
      await serviceAPI.markNotificationAsRead(notificationId);
      const response = await serviceAPI.getUnreadCount();
      if (response.success) {
        updateUnreadCount(response.data.unreadCount);
      }
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
    setNotificationsOpen(false);
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await serviceAPI.markAllNotificationsAsRead();
      updateUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          setHoverTimeout(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [notificationsOpen, hoverTimeout]);

  // Close mobile menu when opening notifications
  useEffect(() => {
    if (notificationsOpen && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [notificationsOpen, mobileMenuOpen]);

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b overflow-visible"
      style={{
        background: "var(--overlay-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="mx-auto w-full max-w-full px-3 sm:px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/user/home" 
            className="flex items-center space-x-2 shrink-0 max-w-[140px] sm:max-w-none cursor-pointer relative z-50"
          >
            <img
              src={resources.Logo.src}
              alt="ConnectVista Logo"
              className="h-10 w-auto object-contain transition-all sm:h-12 md:h-16"
              style={{ maxHeight: "64px" }}
            />
            <span
              className="font-bold text-xl sm:text-2xl md:text-3xl hidden sm:block hover:underline transition-all duration-300"
              style={{ 
                color: "var(--text-color)", 
                fontFamily: "ConnectVistaSecondary",
                textDecorationColor: "var(--accent-color)"
              }}
            >
              Connect
              <span style={{ color: "var(--accent-color)" }}>Vista</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 relative z-50">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm lg:text-base font-medium transition-all duration-300 cursor-pointer ${
                  isActive(link.to)
                    ? "text-white"
                    : "text-[var(--text-color)] hover:bg-[var(--accent-color)] hover:bg-opacity-10"
                } hover:underline`}
                style={{
                  backgroundColor: isActive(link.to)
                    ? "var(--accent-color)"
                    : "transparent",
                  textDecorationColor: "var(--accent-color)",
                  textUnderlineOffset: "4px",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-1 sm:space-x-2 relative z-50">
            {/* Notifications */}
            <div 
              className="relative" 
              ref={notificationsRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ zIndex: 100 }}
            >
              <button
                onClick={handleNotificationClick}
                className="p-1.5 sm:p-2 rounded-full border transition relative cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-color)",
                  color: "var(--text-color)",
                  zIndex: 100
                }}
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                {unreadCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-white font-medium"
                    style={{
                      backgroundColor: "var(--accent-color)",
                      fontSize: "10px"
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown - Shows on hover (desktop) */}
              {notificationsOpen && (
                <div 
                  className="fixed sm:absolute right-2 sm:right-0 top-16 mt-2 w-[calc(100vw-1rem)] sm:w-80 max-w-sm rounded-lg shadow-lg z-[9999] border md:block overflow-visible"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    maxHeight: "calc(100vh - 80px)",
                    overflowY: "auto",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                    zIndex: 9999
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="p-3 sm:p-4 border-b" style={{ borderColor: "var(--border-color)" }}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-base sm:text-lg" style={{ color: "var(--text-color)" }}>
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllAsRead}
                          className="text-sm sm:text-base font-medium cursor-pointer hover:underline transition-all duration-300"
                          style={{ 
                            color: "var(--accent-color)",
                            textDecorationColor: "var(--accent-color)"
                          }}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="py-2">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification._id}
                          className={`px-3 sm:px-4 py-2 sm:py-3 hover:opacity-90 cursor-pointer transition-all ${
                            !notification.isRead ? 'opacity-100' : 'opacity-70'
                          }`}
                          style={{
                            backgroundColor: !notification.isRead ? 'var(--accent-fade)' : 'transparent',
                            borderBottom: '1px solid var(--border-color)'
                          }}
                          onClick={() => handleNotificationItemClick(notification._id)}
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="mt-0.5 sm:mt-1">
                              <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: "var(--accent-color)" }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm sm:text-base" style={{ color: "var(--text-color)" }}>
                                {notification.title}
                              </p>
                              <p className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--text-color)", opacity: 0.7 }}>
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 sm:py-8 text-center">
                        <Bell className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2" style={{ opacity: 0.3, color: "var(--text-color)" }} />
                        <p className="text-sm sm:text-base" style={{ color: "var(--text-color)", opacity: 0.7 }}>
                          No notifications yet
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 sm:p-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                    <Link 
                      to="/user/notifications" 
                      className="block text-center font-medium text-sm sm:text-base transition-colors cursor-pointer hover:underline"
                      style={{ 
                        color: "var(--accent-color)",
                        textDecorationColor: "var(--accent-color)"
                      }}
                      onClick={() => {
                        setNotificationsOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Button */}
            <Link to="/user/profile" className="hidden md:block">
              <button
                className="px-4 py-2 lg:px-5 lg:py-2.5 rounded-lg transition flex items-center gap-2 font-medium text-sm lg:text-base cursor-pointer hover:scale-105 active:scale-95 hover:underline"
                style={{
                  backgroundColor: "var(--accent-color)",
                  color: "white",
                  textDecorationColor: "white",
                }}
              >
                <User className="h-4 w-4 lg:h-5 lg:w-5" />
                Profile
              </button>
            </Link>

            {/* Logout Button (Desktop) */}
            <button
              onClick={handleLogout}
              className="hidden md:flex p-2 sm:p-2.5 rounded-lg border transition cursor-pointer hover:scale-105 active:scale-95 items-center gap-2 font-medium text-red-500 hover:bg-red-50"
              style={{
                borderColor: "rgba(239, 68, 68, 0.2)",
              }}
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden lg:inline text-sm">Logout</span>
            </button>

            {/* Mobile Profile Button */}
            <Link to="/user/profile" className="md:hidden">
              <button
                className="p-1.5 sm:p-2.5 rounded-full transition cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "var(--accent-color)",
                  color: "white",
                }}
                aria-label="Profile"
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (notificationsOpen) setNotificationsOpen(false);
              }}
              className="p-1.5 sm:p-2.5 rounded-lg md:hidden transition border ml-1 cursor-pointer hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
                color: "var(--text-color)",
              }}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            className="md:hidden py-3 space-y-1 border-t overflow-auto max-h-[calc(100vh-64px)] z-40 relative"
            style={{ 
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-color)"
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer hover:underline ${
                  isActive(link.to)
                    ? "text-white"
                    : "text-[var(--text-color)] hover:bg-[var(--accent-color)] hover:bg-opacity-10"
                }`}
                style={{
                  backgroundColor: isActive(link.to)
                    ? "var(--accent-color)"
                    : "transparent",
                  textDecorationColor: "var(--accent-color)",
                  textUnderlineOffset: "4px",
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Notifications Link */}
            <div className="px-3 py-2.5 mx-2">
              <Link 
                to="/user/notifications" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:underline transition-all duration-300"
                style={{ 
                  color: "var(--text-color)",
                  textDecorationColor: "var(--accent-color)",
                  textUnderlineOffset: "4px",
                }}
              >
                <Bell className="h-4 w-4" />
                Notifications
                {unreadCount > 0 && (
                  <span 
                    className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-white font-medium"
                    style={{
                      backgroundColor: "var(--accent-color)",
                      fontSize: "10px"
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Profile Link Mobile */}
            <Link 
              to="/user/profile" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 mx-2 rounded-lg text-sm font-medium text-center transition-all duration-300 cursor-pointer hover:underline hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--accent-color)',
                color: 'white',
                textDecorationColor: 'white',
                textUnderlineOffset: '4px',
              }}
            >
              View Profile
            </Link>

            {/* Logout Link Mobile */}
            <div className="px-3 py-2.5 mx-2 border-t mt-2" style={{ borderColor: "var(--border-color)" }}>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-bold text-red-500 w-full"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
