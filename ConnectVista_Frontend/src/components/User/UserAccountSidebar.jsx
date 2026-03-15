import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Bell, 
  User, 
  Heart,
  ChevronRight
} from 'lucide-react';

const UserAccountSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { name: 'My Bookings', path: '/user/bookings', icon: Calendar },
    { name: 'My Invoices', path: '/user/invoices', icon: FileText },
    { name: 'Notifications', path: '/user/notifications', icon: Bell },
    { name: 'My Profile', path: '/user/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <nav className="bg-white rounded-2xl border p-2 space-y-1 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center justify-between p-3 rounded-xl transition-all group ${
              isActive(item.path)
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                : 'hover:bg-gray-50'
            }`}
            style={{ 
              backgroundColor: isActive(item.path) ? 'var(--accent-color)' : 'transparent',
              color: isActive(item.path) ? 'white' : 'var(--text-color)'
            }}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className={isActive(item.path) ? 'text-white' : 'opacity-60 group-hover:opacity-100'} />
              <span className="font-bold text-sm">{item.name}</span>
            </div>
            <ChevronRight 
              size={16} 
              className={`transition-transform ${isActive(item.path) ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} 
            />
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default UserAccountSidebar;
