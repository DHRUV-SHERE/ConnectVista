import { useState, useEffect } from 'react';
import { Users, Wrench, Calendar, DollarSign, Shield, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import StatCard from '../components/StatCard';
import { getDashboardStats, getVerifications } from '../services/api';

const mockMonthlyData = [
  { month: 'Jan', users: 120, providers: 15, bookings: 180, revenue: 12500 },
  { month: 'Feb', users: 150, providers: 22, bookings: 220, revenue: 15800 },
  { month: 'Mar', users: 180, providers: 28, bookings: 280, revenue: 18200 },
  { month: 'Apr', users: 210, providers: 35, bookings: 340, revenue: 21400 },
  { month: 'May', users: 250, providers: 42, bookings: 420, revenue: 24600 },
  { month: 'Jun', users: 290, providers: 50, bookings: 510, revenue: 28900 },
];

const mockRecentProviders = [
  { id: '1', name: 'Tom Brown', service: 'Electrical', status: 'pending', submittedAt: '2024-12-20' },
  { id: '2', name: 'Lisa Anderson', service: 'Gardening', status: 'pending', submittedAt: '2024-12-19' },
  { id: '3', name: 'David Lee', service: 'Pest Control', status: 'verified', submittedAt: '2024-12-18' },
];

const mockRecentBookings = [
  { id: 'ORD-001', service: 'Plumbing', seeker: 'John Doe', provider: 'Mike Smith', status: 'Completed', amount: 150 },
  { id: 'ORD-002', service: 'Electrical', seeker: 'Jane Wilson', provider: 'Tom Brown', status: 'In Progress', amount: 200 },
  { id: 'ORD-003', service: 'House Cleaning', seeker: 'Bob Johnson', provider: 'Sarah Davis', status: 'Pending', amount: 80 },
  { id: 'ORD-004', service: 'Painting', seeker: 'Alice Brown', provider: 'Mike Wilson', status: 'Completed', amount: 350 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingVerifications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const pendingVerifications = stats.pendingVerifications || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-gray-500">Overview of your platform's performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers?.toLocaleString() || '0'} 
          icon={Users} 
          color="blue"
          trend={12}
        />
        <StatCard 
          title="Service Providers" 
          value={stats.totalProviders?.toLocaleString() || '0'} 
          icon={Wrench} 
          color="purple"
          trend={8}
        />
        <StatCard 
          title="Total Bookings" 
          value={stats.totalBookings?.toLocaleString() || '0'} 
          icon={Calendar} 
          color="orange"
          trend={15}
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${(stats.totalRevenue || 0).toLocaleString()}`} 
          icon={DollarSign} 
          color="green"
          trend={22}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Platform Growth</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line yAxisId="left" type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Users" />
              <Line yAxisId="left" type="monotone" dataKey="providers" stroke="#8b5cf6" strokeWidth={2} name="Providers" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Pending Verifications</h3>
            {pendingVerifications > 0 ? (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                {pendingVerifications} pending
              </span>
            ) : (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                All clear
              </span>
            )}
          </div>
          <div className="space-y-4">
            {mockRecentProviders.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${provider.status === 'pending' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                    {provider.status === 'pending' ? (
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{provider.name}</p>
                    <p className="text-sm text-gray-500">{provider.service}</p>
                  </div>
                </div>
                <a href="/admin/verification" className="text-sm text-primary-600 hover:underline">
                  Review
                </a>
              </div>
            ))}
          </div>
          <a href="/admin/verification" className="block text-center text-sm text-primary-600 hover:underline mt-4">
            View All Verifications →
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Bookings</h3>
            <Calendar className="w-5 h-5 text-orange-500" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="bookings" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
            <a href="/admin/bookings" className="text-sm text-primary-600 hover:underline">View All</a>
          </div>
          <div className="space-y-4">
            {mockRecentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{booking.service}</p>
                  <p className="text-sm text-gray-500">{booking.seeker} → {booking.provider}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    booking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {booking.status}
                  </span>
                  <p className="text-sm font-medium text-gray-800 mt-1">${booking.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
