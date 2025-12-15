import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Moon, Sun, Menu, X, User } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-color)'
      }}>
      {/* Custom scrollbar styles */}
      <style>
        {`
          /* Hide default scrollbar */
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          /* Track */
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          /* Handle */
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 3px;
          }
          
          /* Handle on hover */
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: var(--accent-color);
            opacity: 0.7;
          }
          
          /* For Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: var(--border-color) transparent;
          }
          
          /* Main content area styling */
          .main-content {
            height: calc(100vh - 4rem);
            overflow-y: auto;
          }
          
          /* Responsive adjustments */
          @media (max-width: 1023px) {
            .main-content {
              width: 100%;
              margin-left: 0;
            }
          }
          
          @media (min-width: 1024px) {
            .main-content {
              width: calc(100% - 256px);
              margin-left: 256px;
            }
          }
        `}
      </style>

      {/* Top Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b 
        bg-[var(--card-bg)] backdrop-blur-sm flex-shrink-0"
        style={{ borderColor: 'var(--border-color)' }}>
        <div className="h-16 flex items-center gap-4 px-4 lg:px-6">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/service-provider/dashboard" className="flex items-center gap-3 
            no-underline text-inherit">
            <img
              src={resources.Logo.src}
              alt="ConnectVista Logo"
              className="h-16 w-auto object-contain"
            />
            <span
              className="font-bold text-2xl lg:text-3xl mt-1 hidden sm:block"
              style={{ 
                fontFamily: 'ConnectVistaSecondary',
                color: 'var(--text-color)'
              }}>
              Connect
              <span style={{color:"var(--accent-color)"}}>Vista</span>
            </span>
          </Link>

          <div className="flex-1" />

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
          >
            {theme === 'light' ? 
              <Moon size={22} style={{ color: 'var(--text-color)' }} /> : 
              <Sun size={22} style={{ color: 'var(--text-color)' }} />
            }
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-base font-medium">QuickFix Plumbing</p>
              <p className="text-sm opacity-70">Business Account</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--accent-color)] 
              bg-opacity-10 flex items-center justify-center">
              <User size={20} style={{ color: 'var(--accent-color)' }} />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar - Fixed on desktop */}
      <ServiceProviderSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        currentPath={location.pathname}
      />

      {/* Main Content Area - Scrollable with custom scrollbar */}
      <main 
        className="main-content custom-scrollbar fixed top-16 right-0 bg-[var(--background)] 
          transition-all duration-300"
      >
        <div className="p-4 lg:p-6 min-h-full">
          <PageTransitionLoader>
            <Outlet />
          </PageTransitionLoader>
        </div>
      </main>
    </div>
  );
};

export default ServiceProviderLayout;