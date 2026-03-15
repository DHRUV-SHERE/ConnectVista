import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  Bell, 
  FileText,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Search,
  Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';

const UserDashboardSidebar = ({ sidebarOpen, setSidebarOpen, currentPath }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useSocket();
  
  const navigation = [
    { name: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/user/bookings', icon: Calendar },
    { name: 'My Invoices', href: '/user/invoices', icon: FileText },
    { name: 'Notifications', href: '/user/notifications', icon: Bell },
    { name: 'My Profile', href: '/user/profile', icon: User },
  ];

  const secondaryNav = [
    { name: 'Back to Marketplace', href: '/user/home', icon: Home },
    { name: 'Find Services', href: '/user/services', icon: Search },
  ];

  const isActive = (path) => currentPath === path;

  const handleLogout = async () => {
    try {
      setSidebarOpen(false);
      await logout();
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
      
      {/* Sidebar */}
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
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-[var(--accent-color)] bg-opacity-10 flex items-center justify-center border-2 border-[var(--accent-color)]">
              <span className="font-bold text-[var(--accent-color)]">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate">{user?.name || 'User Account'}</h3>
              <p className="text-[10px] opacity-60 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
            <ShieldCheck size={14} />
            <span>Verified Seeker</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 flex flex-col gap-6 p-4 overflow-y-auto custom-scrollbar">
          {/* Main Nav */}
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 px-3">Management</p>
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-xl px-3 py-2.5
                    text-sm font-bold transition-all duration-200
                    ${active 
                      ? 'text-white bg-[var(--accent-color)] shadow-lg shadow-blue-100' 
                      : 'text-[var(--text-color)] hover:bg-[var(--hover-bg)]'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                  {item.name === 'Notifications' && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Marketplace Nav */}
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 px-3">Marketplace</p>
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-[var(--text-color)] hover:bg-[var(--hover-bg)] transition-all"
                >
                  <Icon size={20} className="opacity-60" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full rounded-xl px-3 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default UserDashboardSidebar;
