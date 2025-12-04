import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Moon, Sun, Menu, X, Search, User } from 'lucide-react';
import PageTransitionLoader from '../components/PageTransitionLoader';
import ServiceProviderSidebar from '../components/Service Provider/ServiceProviderSidebar';
import resources from '../resources';

const ServiceProviderLayout = () => {
  const [theme, setTheme] = useState('light');
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--background)',
      color: 'var(--text-color)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header - Fixed at top */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--card-bg)',
        backdropFilter: 'blur(8px)',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          height: '4rem',
          alignItems: 'center',
          gap: '1rem',
          padding: '0 1rem'
        }}>
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'block'
            }}
            className="mobile-menu-toggle"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/service-provider/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: 'inherit'
          }}>
            <img
              src={resources.Logo.src}
              alt="ConnectVista Logo"
              style={{ height: '4rem', width: '5rem' }}
            />
            <span
            style={{
              fontFamily: 'ConnectVistaSecondary',
              fontSize: '2rem',
              fontWeight: 'bold',
              display: 'none'
            }} className="logo-text mt-1">Connect
            <span style={{color:"var(--accent-color)"}}>Vista</span>
            </span>
          </Link>

          <div style={{ flex: 1 }} />

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* User Avatar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              display: 'none',
              textAlign: 'right'
            }} className="user-info">
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>QuickFix Plumbing</p>
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--text-color)',
                opacity: 0.7
              }}>Business Account</p>
            </div>
            <div style={{
              height: '2.5rem',
              width: '2.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-color)',
              opacity: 0.1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={20} style={{ color: 'var(--accent-color)' }} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Starts below header */}
      <div style={{ 
        display: 'flex', 
        flex: 1,
        marginTop: '4rem', // Push content below fixed header
        height: 'calc(100vh - 4rem)', // Full height minus header
        position: 'relative'
      }}>
        {/* Sidebar */}
        <ServiceProviderSidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          currentPath={location.pathname}
        />

        {/* Main Content - Scrollable area */}
        <main style={{
          flex: 1,
          padding: '1rem',
          overflowY: 'auto',
          backgroundColor: 'var(--background)',
          height: '100%',
          width: '100%'
        }} className="main-content">
          <PageTransitionLoader>
            <Outlet />
          </PageTransitionLoader>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 30,
            backgroundColor: 'var(--overlay-bg)',
            backdropFilter: 'blur(4px)'
          }}
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style jsx>{`
        .mobile-menu-toggle {
          display: block;
        }
        .logo-text {
          display: none;
        }
        .user-info {
          display: none;
        }
        .main-content {
          margin-left: 0;
        }

        @media (min-width: 1024px) {
          .mobile-menu-toggle {
            display: none !important;
          }
          .logo-text {
            display: inline !important;
          }
          .user-info {
            display: block !important;
          }
          .main-content {
            margin-left: 16rem;
            width: calc(100% - 16rem);
          }
        }

        @media (min-width: 640px) {
          .logo-text {
            display: inline !important;
          }
          .user-info {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceProviderLayout;