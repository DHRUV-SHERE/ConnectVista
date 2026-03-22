import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  Star, 
  Bell, 
  CreditCard, 
  Settings, 
  LogOut,
  CheckCircle,
  Clock,
  XCircle,
  Wallet,
  FileText,
  HeadsetIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { useEffect } from 'react';
import { notificationAPI } from '../../services/notificationAPI';

const ServiceProviderSidebar = ({ sidebarOpen, setSidebarOpen, currentPath }) => {
  const { user, profile, logout } = useAuth();
  const { unreadCount, categoryCounts, setInitialCounts } = useSocket();
  
  // Fetch unread count on mount
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await notificationAPI.getCategoryCounts();
        if (response.success) {
          setInitialCounts(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch unread counts:', error);
      }
    };
    fetchCounts();
  }, [setInitialCounts]);
  
  const navigation = [
    { name: 'Dashboard', href: '/service-provider/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/service-provider/profile', icon: User },
    { name: 'Bookings', href: '/service-provider/bookings', icon: Calendar, category: 'booking' },
    { name: 'Reviews', href: '/service-provider/reviews', icon: Star, category: 'review' },
    { name: 'Notifications', href: '/service-provider/notifications', icon: Bell, category: 'total' },
    { name: 'Subscription', href: '/service-provider/subscription', icon: CreditCard },
    { name: 'Wallet & Earnings', href: '/service-provider/wallet', icon: Wallet, category: 'payment' },
    { name: 'Invoices', href: '/service-provider/invoices', icon: FileText },
    { name: 'Support Requests', href: '/service-provider/support-requests', icon: HeadsetIcon },
    { name: 'Settings', href: '/service-provider/settings', icon: Settings },
  ];

  const getUnreadBadge = (item) => {
    let count = 0;
    if (item.category === 'total') {
      count = unreadCount;
    } else if (item.category) {
      count = categoryCounts[item.category] || 0;
    }

    if (count <= 0) return null;

    const active = isActive(item.href);

    return (
      <span 
        className="ml-auto min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5 text-white font-medium shadow-sm"
        style={{
          backgroundColor: active ? 'white' : 'var(--accent-color)',
          color: active ? 'var(--accent-color)' : 'white',
          fontSize: '10px'
        }}
      >
        {count > 99 ? '99+' : count}
      </span>
    );
  };

  const isActive = (path) => {
    if (path === '/service-provider/dashboard') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  // Get display name
  const getDisplayName = () => {
    if (profile?.businessName) return profile.businessName;
    if (user?.name) return user.name;
    return 'Business Account';
  };

  // Get user role/type
  const getUserType = () => {
    if (profile?.isVerified) return 'Verified Business';
    if (profile?.verificationStatus === 'pending') return 'Verification Pending';
    if (profile) return 'Business Account';
    return 'Provider Account';
  };

  // Get verification status icon
  const getVerificationIcon = () => {
    if (profile?.isVerified) {
      return <CheckCircle size={16} className="text-green-500" />;
    }
    if (profile?.verificationStatus === 'pending') {
      return <Clock size={16} className="text-amber-500 animate-pulse" />;
    }
    return <XCircle size={16} className="text-gray-400" />;
  };

  // Get verification text
  const getVerificationText = () => {
    if (profile?.isVerified) {
      return 'Verified';
    }
    if (profile?.verificationStatus === 'pending') {
      return 'Verification Pending';
    }
    return 'Not Verified';
  };

  // Get verification color class
  const getVerificationColor = () => {
    if (profile?.isVerified) {
      return 'text-green-600 bg-green-50 border-green-200';
    }
    if (profile?.verificationStatus === 'pending') {
      return 'text-amber-600 bg-amber-50 border-amber-200';
    }
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setSidebarOpen(false); // Close sidebar on mobile
      await logout(); // Call the logout function from AuthContext
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <aside
        className={`
          fixed lg:fixed top-16 left-0 bottom-0 z-40 
          w-64 border-r bg-[var(--card-bg)] 
          transition-transform duration-300 ease-in-out
          flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          borderColor: 'var(--border-color)',
          height: 'calc(100vh - 4rem)'
        }}
      >
        {/* User Profile Section */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-[var(--accent-color)] 
                bg-opacity-10 flex items-center justify-center border-2" 
                style={{ borderColor: 'var(--accent-color)' }}>
                {user?.name ? (
                  <span 
                    className="text-lg font-bold"
                    style={{ color: 'var(--accent-color)' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={20} style={{ color: 'var(--bg-color)' }} />
                )}
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate" style={{ color: 'var(--text-color)' }}>
                {getDisplayName()}
              </h3>
              
              {/* Email (if available) */}
              {user?.email && (
                <p className="text-sm opacity-70 truncate mb-1">
                  {user.email}
                </p>
              )}
              
              {/* Verification Status */}
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full 
                text-xs font-medium border ${getVerificationColor()}`}>
                {getVerificationIcon()}
                <span>{getVerificationText()}</span>
              </div>
            </div>
          </div>
          
          {/* Account Type & Quick Stats (Optional) */}
          <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-70">Account Type</span>
              <span className="text-xs font-medium" style={{ color: 'var(--accent-color)' }}>
                {getUserType()}
              </span>
            </div>
            
            {/* Quick Stats (if available in profile) */}
            {profile && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-70">Experience</span>
                <span className="text-xs font-medium">
                  {profile.experienceYears || 0} yrs
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-3
                  text-base font-medium transition-all duration-200 relative
                  ${active 
                    ? 'text-white bg-[var(--accent-color)]' 
                    : 'text-[var(--text-color)] hover:bg-[var(--hover-bg)]'
                  }
                `}
              >
                <Icon size={22} />
                <span>{item.name}</span>
                {getUnreadBadge(item)}
              </Link>
            );
          })}

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full rounded-lg px-3 py-3
                text-base font-medium text-red-500 hover:bg-red-50
                transition-all duration-200"
            >
              <LogOut size={22} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default ServiceProviderSidebar;
