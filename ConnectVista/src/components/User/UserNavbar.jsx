import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X, User, Bell, MessageSquare } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useState, useRef, useEffect } from "react";
import resources from "../../resources";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);

  // Mock notifications data
  const notifications = [
    { id: 1, type: "booking", message: "Your plumbing service is confirmed for tomorrow", time: "2 min ago", read: false },
    { id: 2, type: "message", message: "New message from Clean Sweep Co.", time: "1 hour ago", read: true },
    { id: 3, type: "reminder", message: "Reminder: Electrical service tomorrow at 10 AM", time: "3 hours ago", read: true },
    { id: 4, type: "review", message: "Your review has been published", time: "1 day ago", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { to: "/user/home", label: "Home" },
    { to: "/user/services", label: "Services" },
    { to: "/user/explore", label: "Explore" },
    { to: "/user/about", label: "About" },
    { to: "/user/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when opening notifications
  useEffect(() => {
    if (notificationsOpen && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [notificationsOpen, mobileMenuOpen]);

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b overflow-hidden"
      style={{
        background: "var(--overlay-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="mx-auto w-full max-w-full px-3 sm:px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Mobile Optimized */}
          <Link to="/user/home" className="flex items-center space-x-2 shrink-0 max-w-[140px] sm:max-w-none">
            <img
              src={resources.Logo.src}
              alt="ConnectVista Logo"
              className="h-10 w-auto object-contain transition-all sm:h-12 md:h-16"
              style={{ maxHeight: "64px" }}
            />
            <span
              className="font-bold text-xl sm:text-2xl md:text-3xl hidden sm:block"
              style={{ color: "var(--text-color)", fontFamily: "ConnectVistaSecondary" }}
            >
              Connect
              <span style={{ color: "var(--accent-color)" }}>Vista</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm lg:text-base font-medium transition-all duration-300 ${
                  isActive(link.to)
                    ? "text-white"
                    : "text-[var(--text-color)] hover:bg-[var(--accent-color)] hover:bg-opacity-10"
                }`}
                style={{
                  backgroundColor: isActive(link.to)
                    ? "var(--accent-color)"
                    : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Mobile Optimized */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (mobileMenuOpen) setMobileMenuOpen(false);
                }}
                className="p-1.5 sm:p-2 rounded-full border transition relative"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-color)",
                  color: "var(--text-color)",
                }}
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

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div 
                  className="fixed sm:absolute right-2 sm:right-0 top-16 mt-2 w-[calc(100vw-1rem)] sm:w-80 max-w-sm rounded-lg shadow-lg z-50 border md:block"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    maxHeight: "calc(100vh - 80px)",
                    overflowY: "auto"
                  }}
                >
                  <div className="p-3 sm:p-4 border-b" style={{ borderColor: "var(--border-color)" }}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-base sm:text-lg" style={{ color: "var(--text-color)" }}>
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button className="text-sm sm:text-base font-medium" style={{ color: "var(--accent-color)" }}>
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="py-2">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`px-3 sm:px-4 py-2 sm:py-3 hover:opacity-90 cursor-pointer transition-all ${
                            !notification.read ? 'opacity-100' : 'opacity-70'
                          }`}
                          style={{
                            backgroundColor: !notification.read ? 'var(--accent-fade)' : 'transparent',
                            borderBottom: '1px solid var(--border-color)'
                          }}
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="mt-0.5 sm:mt-1">
                              {notification.type === 'message' && (
                                <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: "var(--accent-color)" }} />
                              )}
                              {notification.type === 'booking' && (
                                <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: "var(--accent-color)" }} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm sm:text-base truncate" style={{ color: "var(--text-color)" }}>
                                {notification.message}
                              </p>
                              <p className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--text-color)", opacity: 0.7 }}>
                                {notification.time}
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
                      className="block text-center font-medium text-sm sm:text-base transition-colors"
                      style={{ color: "var(--accent-color)" }}
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

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full border transition"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
              }}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>

            {/* Profile Button */}
            <Link to="/user/profile" className="hidden md:block">
              <button
                className="px-4 py-2 lg:px-5 lg:py-2.5 rounded-lg transition flex items-center gap-2 font-medium text-sm lg:text-base"
                style={{
                  backgroundColor: "var(--accent-color)",
                  color: "white",
                }}
              >
                <User className="h-4 w-4 lg:h-5 lg:w-5" />
                Profile
              </button>
            </Link>

            {/* Mobile Profile Button (Icon Only) */}
            <Link to="/user/profile" className="md:hidden">
              <button
                className="p-1.5 sm:p-2.5 rounded-full transition"
                style={{
                  backgroundColor: "var(--accent-color)",
                  color: "white",
                }}
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
              className="p-1.5 sm:p-2.5 rounded-lg md:hidden transition border ml-1"
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
                color: "var(--text-color)",
              }}
              aria-label="Toggle menu"
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
            className="md:hidden py-3 space-y-1 border-t overflow-auto max-h-[calc(100vh-64px)]"
            style={{ borderColor: "var(--border-color)" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.to)
                    ? "text-white"
                    : "text-[var(--text-color)] hover:bg-[var(--accent-color)] hover:bg-opacity-10"
                }`}
                style={{
                  backgroundColor: isActive(link.to)
                    ? "var(--accent-color)"
                    : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Notifications */}
            <div className="px-3 py-2.5 mx-2">
              <Link 
                to="/user/notifications" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: "var(--text-color)" }}
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
              className="block px-3 py-2.5 mx-2 rounded-lg text-sm font-medium text-center transition-all duration-300"
              style={{
                backgroundColor: 'var(--accent-color)',
                color: 'white',
              }}
            >
              View Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;