import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Moon, Sun, Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Add this import
import PageTransitionLoader from '../components/PageTransitionLoader';
import ServiceProviderSidebar from '../components/Service Provider/ServiceProviderSidebar';
import ScrollToTop from '../components/Common/ScrollToTop';
import resources from '../resources';

const ServiceProviderLayout = () => {
  const [theme, setTheme] = useState('light');
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Get user data from auth context
  const { user, profile } = useAuth();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Get display name - priority: profile business name > user name > fallback
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

          /* Verification status badge */
          .verification-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 500;
          }

          .verified-badge {
            background-color: rgba(34, 197, 94, 0.1);
            color: rgb(22, 163, 74);
          }

          .pending-badge {
            background-color: rgba(245, 158, 11, 0.1);
            color: rgb(217, 119, 6);
          }

          .unverified-badge {
            background-color: rgba(107, 114, 128, 0.1);
            color: rgb(107, 114, 128);
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
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? 
              <Moon size={22} style={{ color: 'var(--text-color)' }} /> : 
              <Sun size={22} style={{ color: 'var(--text-color)' }} />
            }
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="flex items-center justify-end gap-2">
                <p className="text-base font-medium truncate max-w-[200px]">
                  {getDisplayName()}
                </p>
                
                {/* Verification Status Badge */}
                {profile && (
                  <span className={`verification-badge ${
                    profile.isVerified ? 'verified-badge' : 
                    profile.verificationStatus === 'pending' ? 'pending-badge' : 
                    'unverified-badge'
                  }`}>
                    {profile.isVerified ? (
                      <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </>
                    ) : profile.verificationStatus === 'pending' ? (
                      <>
                        <svg className="w-3 h-3 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
                        </svg>
                        Pending
                      </>
                    ) : (
                      'Unverified'
                    )}
                  </span>
                )}
              </div>
              <p className="text-sm opacity-70 truncate max-w-[200px]">
                {getUserType()}
              </p>
            </div>
            
            {/* User Avatar with Profile Link */}
            <Link 
              to="/service-provider/profile" 
              className="h-10 w-10 rounded-full bg-[var(--accent-color)] 
                bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 
                transition-all duration-200 relative group"
            >
              {/* User Initials or Icon */}
              {user?.name ? (
                <span 
                  className="text-sm font-semibold"
                  style={{ color: 'var(--accent-color)' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User size={20} style={{ color: 'var(--bg-color)' }} />
              )}
              
              {/* Tooltip on hover */}
              <span className="absolute -bottom-10 right-0 w-48 px-3 py-2 bg-gray-900 
                text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 
                transition-opacity duration-200 pointer-events-none z-10 shadow-lg">
                <div className="font-medium">View Profile</div>
                <div className="text-xs opacity-80 mt-1">
                  Click to edit your business profile
                </div>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar - Fixed on desktop */}
      <ServiceProviderSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        currentPath={location.pathname}
        userName={getDisplayName()}
        userType={getUserType()}
        isVerified={profile?.isVerified}
      />

      {/* Main Content Area - Scrollable with custom scrollbar */}
      <main 
        className="main-content custom-scrollbar fixed top-16 right-0 bg-[var(--background)] 
          transition-all duration-300"
      >
        <ScrollToTop />
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