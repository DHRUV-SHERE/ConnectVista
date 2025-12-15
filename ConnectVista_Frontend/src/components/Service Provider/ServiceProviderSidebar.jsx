import { Link } from 'react-router-dom';
import { LayoutDashboard, User, Calendar, Star, Bell, CreditCard, Settings, LogOut } from 'lucide-react';

const ServiceProviderSidebar = ({ sidebarOpen, setSidebarOpen, currentPath }) => {
  const navigation = [
    { name: 'Dashboard', href: '/service-provider/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/service-provider/profile', icon: User },
    { name: 'Bookings', href: '/service-provider/bookings', icon: Calendar },
    { name: 'Reviews', href: '/service-provider/reviews', icon: Star },
    { name: 'Notifications', href: '/service-provider/notifications', icon: Bell },
    { name: 'Subscription', href: '/service-provider/subscription', icon: CreditCard },
    { name: 'Settings', href: '/service-provider/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/service-provider/dashboard') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
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
                  text-base font-medium transition-all duration-200
                  ${active 
                    ? 'text-white bg-[var(--accent-color)]' 
                    : 'text-[var(--text-color)] hover:bg-[var(--hover-bg)]'
                  }
                `}
              >
                <Icon size={22} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button
              className="flex items-center gap-3 w-full rounded-lg px-3 py-3
                text-base font-medium text-red-500 hover:bg-red-50
                transition-all duration-200"
              onClick={() => {
                console.log('Logout clicked');
              }}
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