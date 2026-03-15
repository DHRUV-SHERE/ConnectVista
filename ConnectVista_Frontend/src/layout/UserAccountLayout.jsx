import { Outlet } from 'react-router-dom';
import UserAccountSidebar from '../components/User/UserAccountSidebar';
import PageTransitionLoader from '../components/PageTransitionLoader';

const UserAccountLayout = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Horizontal on mobile, Vertical on desktop */}
        <UserAccountSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <PageTransitionLoader>
            <Outlet />
          </PageTransitionLoader>
        </div>
      </div>
    </div>
  );
};

export default UserAccountLayout;
