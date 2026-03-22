"use client";
import { useState, useMemo, lazy, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Calendar, Star, DollarSign, ArrowUpRight, ArrowDownRight, 
  Wrench, Clock, CheckCircle, AlertCircle, MoreVertical, Download, Filter,
  Search, ChevronRight, TrendingDown, Eye, Edit, Trash2, RefreshCw, BarChart3, Wallet, HelpCircle
} from 'lucide-react';
import { serviceAPI } from '../../services/serviceAPI';
import { walletAPI } from '../../services/walletAPI';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import NeedSupportModal from '../../components/NeedSupportModal';

// Lazy load charts for better performance
const PerformanceChart = lazy(() => import('../../components/Service Provider/PerformanceChart'));
const RevenueChart = lazy(() => import('../../components/Service Provider/RevenueChart'));

// Loading fallback for charts
const ChartLoadingFallback = () => (
  <div className="h-[300px] flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" 
        style={{ borderColor: 'var(--accent-color)' }} />
      <p className="mt-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
        Loading chart...
      </p>
    </div>
  </div>
);

// Service Status Badge Component
const ServiceStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      bgColor: 'var(--warning-light)',
      textColor: 'var(--warning-dark)',
      icon: <Clock size={14} />
    },
    confirmed: {
      label: 'Confirmed',
      bgColor: 'var(--info-light)',
      textColor: 'var(--info-dark)',
      icon: <CheckCircle size={14} />
    },
    'in-progress': {
      label: 'In Progress',
      bgColor: 'var(--processing-light)',
      textColor: 'var(--processing-dark)',
      icon: <AlertCircle size={14} />
    },
    completed: {
      label: 'Completed',
      bgColor: 'var(--success-light)',
      textColor: 'var(--success-dark)',
      icon: <CheckCircle size={14} />
    },
    cancelled: {
      label: 'Cancelled',
      bgColor: 'var(--error-light)',
      textColor: 'var(--error-dark)',
      icon: <AlertCircle size={14} />
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div 
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor
      }}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, trend, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="rounded-xl border p-5 hover:shadow-lg transition-all duration-300"
    style={{
      backgroundColor: 'var(--card-bg)',
      borderColor: 'var(--border-color)'
    }}
  >
    <div className="flex items-center justify-between mb-4">
      <p className="text-base font-medium" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
        {title}
      </p>
      <Icon size={18} style={{ opacity: 0.8, color: 'var(--accent-color)' }} />
    </div>
    
    <div className="space-y-2">
      <p className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
        {value}
      </p>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {trend === 'up' ? (
            <ArrowUpRight size={16} style={{ color: '#10b981' }} />
          ) : (
            <ArrowDownRight size={16} style={{ color: '#ef4444' }} />
          )}
          <span 
            className="text-sm font-medium"
            style={{ color: trend === 'up' ? '#10b981' : '#ef4444' }}
          >
            {change}
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--text-color)', opacity: 0.6 }}>
          vs last month
        </span>
      </div>
    </div>
  </motion.div>
);

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, onClick, variant = 'default' }) => {
  const variants = {
    default: {
      bg: 'var(--card-bg)',
      border: 'var(--border-color)',
      color: 'var(--text-color)',
      hover: 'var(--hover-bg)'
    },
    primary: {
      bg: 'var(--accent-color)',
      border: 'var(--accent-color)',
      color: 'white',
      hover: 'var(--accent-dark)'
    }
  };

  const style = variants[variant];

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
        color: style.color
      }}
    >
      <Icon size={24} className="transition-transform group-hover:scale-110" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

// Service Card Component
const ServiceCard = ({ service, onView, onEdit, onDelete }) => {
  return (
    <div 
      className="rounded-xl border p-4 hover:shadow-lg transition-all duration-300 group"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left Section */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ServiceStatusBadge status={service.status} />
                <span className="font-semibold" style={{ color: 'var(--text-color)' }}>
                  {service.customer}
                </span>
              </div>
              <h4 className="text-base font-medium" style={{ color: 'var(--text-color)' }}>
                {service.service}
              </h4>
            </div>
            
            {/* Action Menu - Desktop */}
            <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onView(service)}
                  className="p-1.5 rounded hover:opacity-80 transition"
                  style={{ color: 'var(--text-color)', backgroundColor: 'var(--hover-bg)' }}
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => onEdit(service)}
                  className="p-1.5 rounded hover:opacity-80 transition"
                  style={{ color: 'var(--text-color)', backgroundColor: 'var(--hover-bg)' }}
                  title="Edit Service"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(service)}
                  className="p-1.5 rounded hover:opacity-80 transition"
                  style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                  title="Delete Service"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              <Calendar size={14} />
              <span>{service.date}</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              <Clock size={14} />
              <span>{service.time}</span>
            </div>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:justify-end gap-3">
          <div className="text-right">
            <p className="text-lg font-bold" style={{ color: 'var(--accent-color)' }}>
              {service.amount}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-color)', opacity: 0.6 }}>
              Service Fee
            </p>
          </div>
          
          {/* Action Menu - Mobile */}
          <div className="sm:hidden flex items-center gap-1">
            <button
              onClick={() => onView(service)}
              className="p-1.5 rounded hover:opacity-80 transition"
              style={{ color: 'var(--text-color)', backgroundColor: 'var(--hover-bg)' }}
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onEdit(service)}
              className="p-1.5 rounded hover:opacity-80 transition"
              style={{ color: 'var(--text-color)', backgroundColor: 'var(--hover-bg)' }}
              title="Edit Service"
            >
              <Edit size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentServicesData, setRecentServicesData] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const fetchDashboardData = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      else setLoading(true);

      const [statsRes, servicesRes, walletRes] = await Promise.all([
        serviceAPI.getProviderDashboardStats(),
        serviceAPI.getRecentServices(),
        walletAPI.getWalletDetails()
      ]);

      if (statsRes.success) setDashboardStats(statsRes.data);
      if (servicesRes.success) setRecentServicesData(servicesRes.data);
      if (walletRes.success) setWalletBalance(walletRes.data.walletBalance);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Memoized stats data
  const stats = useMemo(() => [
    {
      title: 'Total Services',
      value: dashboardStats?.totalServices?.value || '0',
      change: dashboardStats?.totalServices?.change || '+0%',
      trend: dashboardStats?.totalServices?.trend || 'up',
      icon: Wrench,
      tooltip: 'Total services provided this month'
    },
    {
      title: 'Active Bookings',
      value: dashboardStats?.activeBookings?.value || '0',
      change: dashboardStats?.activeBookings?.change || '+0%',
      trend: dashboardStats?.activeBookings?.trend || 'up',
      icon: Calendar,
      tooltip: 'Currently active bookings'
    },
    {
      title: 'Wallet Balance',
      value: `₹${walletBalance.toLocaleString()}`,
      change: walletBalance < 100 ? 'Low Balance' : 'Available',
      trend: walletBalance < 100 ? 'down' : 'up',
      icon: Wallet,
      tooltip: 'Prepaid credit for cash payments'
    },
    {
      title: 'Monthly Revenue',
      value: dashboardStats?.monthlyRevenue?.value || '₹0',
      change: dashboardStats?.monthlyRevenue?.change || '+0%',
      trend: dashboardStats?.monthlyRevenue?.trend || 'up',
      icon: DollarSign,
      tooltip: 'Revenue generated this month'
    },
  ], [dashboardStats, walletBalance]);

  // Performance data with memoization (Placeholder - can be made dynamic later)
  const performanceData = useMemo(() => [
    { name: 'Mon', completed: 8, pending: 2 },
    { name: 'Tue', completed: 12, pending: 1 },
    { name: 'Wed', completed: 6, pending: 3 },
    { name: 'Thu', completed: 14, pending: 0 },
    { name: 'Fri', completed: 10, pending: 2 },
    { name: 'Sat', completed: 7, pending: 1 },
    { name: 'Sun', completed: 4, pending: 0 },
  ], []);

  // Revenue data with memoization (Placeholder - can be made dynamic later)
  const revenueData = useMemo(() => [
    { name: 'Jan', revenue: 5200 },
    { name: 'Feb', revenue: 6800 },
    { name: 'Mar', revenue: 4500 },
    { name: 'Apr', revenue: 7200 },
    { name: 'May', revenue: 6100 },
    { name: 'Jun', revenue: 8240 },
  ], []);

  // Recent services data
  const recentServices = useMemo(() => recentServicesData, [recentServicesData]);

  // Quick actions
  const quickActions = [
    { icon: Users, label: 'Manage Clients', variant: 'default', path: '/service-provider/bookings' },
    { icon: Calendar, label: 'Schedule', variant: 'primary', path: '/service-provider/bookings' },
    { icon: Star, label: 'Reviews', variant: 'default', path: '/service-provider/reviews' },
    { icon: BarChart3, label: 'Analytics', variant: 'default', path: '/service-provider/revenue' },
    { icon: HelpCircle, label: 'Need Support', variant: 'default', action: 'support' },
  ];

  // Filter services based on search and status
  const filteredServices = useMemo(() => {
    return recentServices.filter(service => {
      const matchesSearch = searchQuery === '' || 
        service.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.service.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [recentServices, searchQuery, statusFilter]);

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Handle service actions
  const handleViewService = (service) => {
    navigate('/service-provider/bookings');
  };

  const handleEditService = (service) => {
    navigate('/service-provider/bookings');
  };

  const handleDeleteService = (service) => {
    // In dynamic mode, we just refer to bookings page
    navigate('/service-provider/bookings');
  };

  // Export data
  const handleExportData = () => {
    console.log('Exporting data...');
    // Export logic here
  };

  return (
    <div 
      className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-color)'
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold">Service Dashboard</h1>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-full border transition hover:opacity-80 disabled:opacity-50"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--card-bg)'
              }}
              title="Refresh Data"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
          <p className="text-base" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
            Welcome back! Here's your service performance overview.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg border transition hover:opacity-80"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--card-bg)'
            }}
          >
            <Download size={18} />
            <span className="font-medium">Export</span>
          </button>
          
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'white'
            }}
          >
            <TrendingUp size={18} />
            <span className="font-medium">Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div 
          className="rounded-xl border p-5"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold">Weekly Performance</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1.5 rounded-lg border text-sm"
              style={{
                backgroundColor: 'var(--bg-color)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)'
              }}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          
          <Suspense fallback={<ChartLoadingFallback />}>
            <PerformanceChart data={performanceData} timeRange={timeRange} />
          </Suspense>
        </div>

        {/* Revenue Chart */}
        <div 
          className="rounded-xl border p-5"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold">Monthly Revenue</h3>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              <TrendingUp size={16} style={{ color: '#10b981' }} />
              <span>+12.3% from last month</span>
            </div>
          </div>
          
          <Suspense fallback={<ChartLoadingFallback />}>
            <RevenueChart data={revenueData} />
          </Suspense>
        </div>
      </div>

      {/* Recent Services Section */}
      <div 
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b"
          style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="text-lg font-semibold">Recent Services</h3>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                size={18} 
                style={{ opacity: 0.5 }}
              />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: 'var(--bg-color)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)'
                }}
              />
            </div>
            
            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{
                backgroundColor: 'var(--bg-color)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)'
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        <div className="p-5 space-y-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onView={handleViewService}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4" style={{ opacity: 0.3 }}>🔍</div>
              <h4 className="text-lg font-semibold mb-2">No services found</h4>
              <p style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                {searchQuery ? 'Try adjusting your search' : 'No services available'}
              </p>
            </div>
          )}
        </div>
        
        <div className="p-5 border-t flex justify-between items-center"
          style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
            Showing {filteredServices.length} of {recentServices.length} services
          </p>
          <button 
            onClick={() => navigate('/service-provider/bookings')}
            className="flex items-center gap-1 text-sm font-medium transition hover:opacity-80"
            style={{ color: 'var(--accent-color)' }}
          >
            View All Services
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div 
        className="rounded-xl border p-5"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              variant={action.variant}
              onClick={() => {
                if (action.action === 'support') {
                  setShowSupportModal(true);
                } else {
                  navigate(action.path);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity Timeline (Optional) */}
      <div 
        className="rounded-xl border p-5"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { time: '2 hours ago', action: 'Completed service for John Doe', type: 'success' },
            { time: '4 hours ago', action: 'Received new booking from Sarah Smith', type: 'info' },
            { time: '1 day ago', action: 'Updated service pricing', type: 'warning' },
            { time: '2 days ago', action: 'Received 5-star review from Mike Johnson', type: 'success' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                }`} />
              </div>
              <div>
                <p style={{ color: 'var(--text-color)' }}>{activity.action}</p>
                <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.6 }}>
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Modal */}
      <NeedSupportModal 
        isOpen={showSupportModal} 
        onClose={() => setShowSupportModal(false)}
        onSuccess={() => {
          toast.success('Thank you! We will review your request soon.');
        }}
      />
    </div>
  );
};

export default ProviderDashboard;