import { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Clock, FileText, Star, 
  MapPin, ArrowRight, Package, ShieldCheck,
  TrendingUp, Bell, Heart, Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { serviceAPI } from '../../services/serviceAPI';
import { invoiceAPI } from '../../services/invoiceAPI';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeBookings: 0,
    totalSpent: 0,
    completedJobs: 0,
    unreadNotifications: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch bookings and invoices in parallel
      const [bookingsRes, invoiceRes] = await Promise.all([
        serviceAPI.getSeekerBookings({ page: 1, limit: 10 }), // Standard object param
        invoiceAPI.getSeekerInvoices()
      ]);

      if (bookingsRes.success && bookingsRes.data?.bookings) {
        const bookingList = bookingsRes.data.bookings;
        setRecentBookings(bookingList.slice(0, 3));

        // Calculate stats from bookings
        const completed = bookingList.filter(b => b.status === 'completed').length;
        const active = bookingList.filter(b => ['pending', 'accepted', 'confirmed', 'in-progress'].includes(b.status)).length;

        setStats(prev => ({
          ...prev,
          activeBookings: active,
          completedJobs: completed
        }));
      }

      if (invoiceRes.success && Array.isArray(invoiceRes.data)) {
        setRecentInvoices(invoiceRes.data.slice(0, 3));
        const total = invoiceRes.data.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
        setStats(prev => ({
          ...prev,
          totalSpent: total
        }));
      }

    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Active Bookings', value: stats.activeBookings, icon: Calendar, color: 'blue' },
    { title: 'Total Spent', value: `₹${stats.totalSpent.toLocaleString()}`, icon: TrendingUp, color: 'green' },
    { title: 'Services Completed', value: stats.completedJobs, icon: Package, color: 'purple' },
    { title: 'Notifications', value: stats.unreadNotifications, icon: Bell, color: 'orange' },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-color)' }}>
            Welcome back! 👋
          </h1>
          <p className="mt-1 opacity-60">Here's what's happening with your service requests.</p>
        </div>
        <Link 
          to="/user/services"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          style={{ backgroundColor: 'var(--accent-color)' }}
        >
          <Search size={20} /> Find a Service
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.title}
            className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
          >
            <div className={`p-3 rounded-xl w-fit mb-4 bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-sm font-medium opacity-60">{stat.title}</h3>
            <p className="text-2xl font-black mt-1" style={{ color: 'var(--text-color)' }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="text-blue-600" /> Recent Bookings
            </h2>
            <Link to="/user/bookings" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div 
                  key={booking._id}
                  className="p-5 rounded-2xl border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 transition-all group"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                      {booking.providerId?.businessImages?.[0]?.url ? (
                        <img src={booking.providerId.businessImages[0].url} alt="Business" className="h-full w-full object-cover" />
                      ) : (
                        <Package size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-tight">{booking.providerId?.businessName || 'Service Provider'}</h4>
                      <p className="text-sm opacity-60 flex items-center gap-1 mt-1">
                        <MapPin size={14} /> {booking.serviceAddress?.city || 'Location'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold">₹{booking.totalPrice}</p>
                      <p className="text-[10px] uppercase font-black opacity-40">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-600' : 
                      booking.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {booking.status}
                    </span>
                    <button onClick={() => navigate(`/user/bookings`)} className="p-2 rounded-lg bg-gray-50 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl opacity-40">
                <p>No recent bookings found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Invoices & Trust */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="text-green-600" /> Recent Invoices
            </h2>
            <div className="p-1 rounded-2xl border space-y-1" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              {recentInvoices.length > 0 ? (
                recentInvoices.map(inv => (
                  <Link 
                    key={inv._id}
                    to="/user/invoices"
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-sm truncate w-32">{inv.providerId?.businessName}</p>
                      <p className="text-[10px] opacity-40">{new Date(inv.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="font-black text-blue-600">₹{inv.grandTotal}</p>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-sm opacity-40">No invoices yet.</div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-200">
            <ShieldCheck size={40} className="mb-4" />
            <h3 className="text-lg font-bold">ConnectVista Verified</h3>
            <p className="text-sm opacity-80 mt-2 leading-relaxed">
              Every service you book is protected by our secure payment and verification system.
            </p>
            <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">Secure Escrow</span>
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="h-6 w-6 rounded-full border-2 border-blue-600 bg-gray-200" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
