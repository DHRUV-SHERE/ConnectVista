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

  // Improved active state check
  const isActive = (path) => {
    // Exact match for dashboard, partial match for others
    if (path === '/service-provider/dashboard') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <>
      <aside
        style={{
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          position: 'fixed',
          top: '4rem',
          left: 0,
          bottom: 0,
          zIndex: 40,
          width: '16rem',
          borderRight: '1px solid var(--border-color)',
          backgroundColor: 'var(--card-bg)',
          transition: 'transform 200ms ease-in-out',
          overflowY: 'auto', // Allow sidebar to scroll if content is too long
          height: 'calc(100vh - 4rem)'
        }}
        className="sidebar"
      >
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          padding: '1rem',
          minHeight: '100%'
        }}>
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  color: active ? 'white' : 'var(--text-color)',
                  backgroundColor: active ? 'var(--accent-color)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg, rgba(0,0,0,0.05))';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}

          <div style={{
            marginTop: 'auto',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            <button
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                gap: '0.75rem',
                borderRadius: '0.375rem',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#ef4444',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--hover-bg, rgba(0,0,0,0.05))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => {
                // Handle logout
                console.log('Logout clicked');
              }}
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      <style jsx>{`
        .sidebar {
          transform: translateX(-100%);
        }

        @media (min-width: 1024px) {
          .sidebar {
            transform: translateX(0) !important;
            position: fixed !important;
            top: 4rem;
            left: 0;
            bottom: 0;
          }
        }
      `}</style>
    </>
  );
};

export default ServiceProviderSidebar;