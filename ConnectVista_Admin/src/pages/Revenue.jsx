import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, Wallet, DollarSign as Money } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DataTable from '../components/DataTable';
import { getRevenue } from '../services/api';

const mockTransactions = [
  { id: 'TXN-001', provider: 'Mike Smith', service: 'Plumbing', type: 'Booking', amount: 150, date: '2024-12-20', status: 'Completed' },
  { id: 'TXN-002', provider: 'Sarah Davis', service: 'House Cleaning', type: 'Subscription', amount: 79, date: '2024-12-19', status: 'Completed' },
  { id: 'TXN-003', provider: 'Tom Brown', service: 'Electrical', type: 'Booking', amount: 200, date: '2024-12-19', status: 'Completed' },
  { id: 'TXN-004', provider: 'John Smith', service: 'AC Repair', type: 'Booking', amount: 180, date: '2024-12-18', status: 'Completed' },
  { id: 'TXN-005', provider: 'Lisa Anderson', service: 'Gardening', type: 'Subscription', amount: 29, date: '2024-12-18', status: 'Completed' },
  { id: 'TXN-006', provider: 'Mike Wilson', service: 'Painting', type: 'Booking', amount: 350, date: '2024-12-17', status: 'Completed' },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export default function Revenue() {
  const [dateRange, setDateRange] = useState('6months');
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    monthlyRevenue: [],
    topProviders: [],
    recentTransactions: [],
    planDistribution: []
  });

  useEffect(() => {
    fetchRevenue();
  }, [dateRange]);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const response = await getRevenue({ period: dateRange });
      if (response.data.success) {
        setRevenueData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch revenue:', err);
    } finally {
      setLoading(false);
    }
  };

  const monthlyData = revenueData.monthlyRevenue.length > 0 
    ? revenueData.monthlyRevenue.map(m => ({ month: months[m._id - 1], revenue: m.total, bookings: m.bookings }))
    : [
        { month: 'Jan', revenue: 12500, subscriptions: 4500, bookings: 8000 },
        { month: 'Feb', revenue: 15800, subscriptions: 5200, bookings: 10600 },
        { month: 'Mar', revenue: 18200, subscriptions: 6100, bookings: 12100 },
        { month: 'Apr', revenue: 21400, subscriptions: 7800, bookings: 13600 },
        { month: 'May', revenue: 24600, subscriptions: 9200, bookings: 15400 },
        { month: 'Jun', revenue: 28900, subscriptions: 10500, bookings: 18400 },
      ];

  const planDistribution = revenueData.planDistribution.length > 0
    ? revenueData.planDistribution
    : [
        { name: 'Basic', value: 150, color: '#64748b' },
        { name: 'Professional', value: 85, color: '#0ea5e9' },
        { name: 'Business', value: 42, color: '#8b5cf6' },
        { name: 'Enterprise', value: 15, color: '#f97316' },
      ];

  const topProviders = revenueData.topProviders.length > 0
    ? revenueData.topProviders.slice(0, 5).map((p, i) => ({
        id: i + 1,
        name: p.businessName,
        service: p.service || 'N/A',
        totalRevenue: p.totalEarnings || 0,
        bookings: p.totalJobsCompleted || 0,
        plan: 'N/A'
      }))
    : [
        { id: '1', name: 'Mike Smith', service: 'Plumbing', totalRevenue: 12450, bookings: 156, plan: 'Business' },
        { id: '2', name: 'Sarah Davis', service: 'House Cleaning', totalRevenue: 9820, bookings: 124, plan: 'Professional' },
        { id: '3', name: 'Tom Brown', service: 'Electrical', totalRevenue: 8760, bookings: 98, plan: 'Business' },
        { id: '4', name: 'John Smith', service: 'AC Repair', totalRevenue: 7650, bookings: 85, plan: 'Professional' },
        { id: '5', name: 'Lisa Anderson', service: 'Gardening', totalRevenue: 5430, bookings: 72, plan: 'Basic' },
      ];

  const transactions = revenueData.recentTransactions.length > 0
    ? revenueData.recentTransactions.map((t, i) => ({
        id: i + 1,
        provider: t.providerId?.businessName || 'N/A',
        service: t.serviceId?.name || 'N/A',
        type: 'Booking',
        amount: t.amount || 0,
        date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A',
        status: t.paymentStatus || 'pending'
      }))
    : mockTransactions;

  const totalRevenue = revenueData.totalRevenue || monthlyData.reduce((acc, item) => acc + item.revenue, 0);
  const totalSubscriptions = monthlyData.reduce((acc, item) => acc + (item.subscriptions || 0), 0);
  const totalBookingRevenue = monthlyData.reduce((acc, item) => acc + item.bookings, 0);

  const columns = [
    { key: 'id', header: 'Transaction ID' },
    { key: 'provider', header: 'Provider' },
    { key: 'service', header: 'Service' },
    { 
      key: 'type', 
      header: 'Type',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'Subscription' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value) => <span className="font-medium">${value}</span>
    },
    { key: 'date', header: 'Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
          {value}
        </span>
      )
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Revenue Dashboard</h2>
          <p className="text-gray-500">Track revenue from bookings and plan purchases</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="6months">Last 6 months</option>
          <option value="1year">Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +15.2% from last month
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Booking Revenue</p>
              <p className="text-2xl font-bold text-gray-800">${totalBookingRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">From service bookings</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Subscription Revenue</p>
              <p className="text-2xl font-bold text-gray-800">${totalSubscriptions.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-2">From plan purchases</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Providers</p>
              <p className="text-2xl font-bold text-gray-800">292</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2">+8 this month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
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
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#' + Math.floor(Math.random()*16777215).toString(16)} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {planDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color || '#64748b' }} />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Earning Providers</h3>
          <div className="space-y-4">
            {topProviders.map((provider, idx) => (
              <div key={provider.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                  <div>
                    <p className="font-medium text-gray-800">{provider.name}</p>
                    <p className="text-sm text-gray-500">{provider.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">${provider.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{provider.bookings} bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{txn.provider}</p>
                  <p className="text-sm text-gray-500">{txn.type} - {txn.service}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+${txn.amount}</p>
                  <p className="text-sm text-gray-500">{txn.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">All Transactions</h3>
        </div>
        <DataTable columns={columns} data={transactions} actions={false} />
      </div>
    </div>
  );
}
