import { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, CreditCard, Wallet, Eye, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DataTable from '../components/DataTable';
import { getRevenue } from '../services/api';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Revenue() {
  const [dateRange, setDateRange] = useState('6months');
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    subscriptionRevenue: 0,
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
      const response = await getRevenue();
      if (response.data.success) {
        const data = response.data.data;
        setRevenueData({
          totalRevenue: data.totalRevenue || 0,
          subscriptionRevenue: data.subscriptionRevenue || 0,
          monthlyRevenue: data.monthlyRevenue || [],
          topProviders: data.topProviders || [],
          recentTransactions: data.recentTransactions || [],
          planDistribution: data.planDistribution || []
        });
      }
    } catch (err) {
      console.error('Failed to fetch revenue:', err);
    } finally {
      setLoading(false);
    }
  };

  const monthlyData = (revenueData.monthlyRevenue || []).map(m => ({ 
    month: months[m._id - 1] || 'Unknown', 
    total: m.total || 0,
    bookings: m.bookings || 0,
    subscriptions: m.subscriptions || 0,
    bookingsCount: m.bookingsCount || 0,
    subsCount: m.subsCount || 0
  }));

  const planDistribution = revenueData.planDistribution || [];

  const topProviders = (revenueData.topProviders || []).slice(0, 5).map((p, i) => ({
    id: i + 1,
    name: p.businessName || 'N/A',
    service: p.service || 'N/A',
    totalRevenue: p.totalEarnings || 0,
    bookings: p.totalJobsCompleted || 0,
    plan: 'N/A'
  }));

  const transactions = (revenueData.recentTransactions || []).map((t, i) => ({
    id: t.paymentDetails?.transactionId || (t.type === 'booking' ? `BK-${t._id.toString().slice(-6)}` : `TXN-${i}`),
    provider: t.providerId?.businessName || 'N/A',
    type: t.type,
    providerId: t.providerId?._id,
    providerEmail: t.providerId?.email,
    providerPhone: t.providerId?.phone,
    providerCity: t.providerId?.city,
    plan: t.plan || 'N/A',
    duration: t.duration || 'N/A',
    paymentMethod: t.paymentDetails?.method || 'N/A',
    cardType: t.paymentDetails?.cardType || '',
    cardLast4: t.paymentDetails?.cardLast4 || '',
    amount: t.amount || 0,
    date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A',
    startDate: t.startDate ? new Date(t.startDate).toLocaleDateString() : 'N/A',
    endDate: t.endDate ? new Date(t.endDate).toLocaleDateString() : 'N/A',
    status: t.status || 'active',
    rawData: t
  }));

  const totalBookingRevenue = revenueData.totalRevenue || 0;
  const totalSubscriptionRevenue = revenueData.subscriptionRevenue || 0;
  const totalRevenue = totalBookingRevenue + totalSubscriptionRevenue;
  const totalBookingsCount = monthlyData.reduce((acc, item) => acc + (item.bookingsCount || 0), 0);
  const totalSubsCount = monthlyData.reduce((acc, item) => acc + (item.subsCount || 0), 0);

  const columns = [
    { key: 'id', header: 'ID' },
    { 
      key: 'type', 
      header: 'Type',
      render: (value) => (
        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
          value === 'subscription' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'provider', header: 'Provider' },
    { 
      key: 'plan', 
      header: 'Plan/Service',
      render: (value, row) => row.type === 'subscription' ? value : 'Booking'
    },
    { 
      key: 'paymentMethod', 
      header: 'Payment',
      render: (value, row) => (
        <span className="text-sm">
          {value} {row.cardType ? `(${row.cardType})` : ''}
        </span>
      )
    },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value) => <span className="font-medium text-green-600">₹{value}</span>
    },
    { key: 'date', header: 'Date' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => setSelectedTransaction(row)}
          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
        >
          <Eye className="w-4 h-4" />
          Details
        </button>
      )
    }
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
              <p className="text-2xl font-bold text-gray-800">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Combined Earnings</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Booking Revenue</p>
              <p className="text-2xl font-bold text-gray-800">₹{totalBookingRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">From {totalBookingsCount} bookings</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Subscription Revenue</p>
              <p className="text-2xl font-bold text-gray-800">₹{totalSubscriptionRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-2">From {totalSubsCount} plans</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-800">{revenueData.recentTransactions.filter(t => t.type === 'subscription' && t.status === 'active').length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Current active plans</p>
        </div>
      </div>

      {monthlyData.length > 0 && (
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
              <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} name="Total Revenue" />
              <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} name="Bookings" />
              <Line type="monotone" dataKey="subscriptions" stroke="#a855f7" strokeWidth={2} name="Subscriptions" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">All Transactions</h3>
        </div>
        <DataTable columns={columns} data={transactions} actions={false} />
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Transaction Details</h3>
              <button onClick={() => setSelectedTransaction(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-3">Payment Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Transaction ID</p>
                    <p className="font-medium">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-medium text-green-600">₹{selectedTransaction.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="font-medium">{selectedTransaction.paymentMethod}</p>
                  </div>
                  {selectedTransaction.cardType && (
                    <div>
                      <p className="text-xs text-gray-500">Card Details</p>
                      <p className="font-medium">{selectedTransaction.cardType} •••• {selectedTransaction.cardLast4}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium">{selectedTransaction.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      selectedTransaction.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-500 mb-3">Subscription Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Plan</p>
                    <p className="font-medium">{selectedTransaction.plan}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium">{selectedTransaction.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="font-medium">{selectedTransaction.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="font-medium">{selectedTransaction.endDate}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-500 mb-3">Provider Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Business Name</p>
                    <p className="font-medium">{selectedTransaction.provider}</p>
                  </div>
                  {selectedTransaction.providerEmail && (
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">{selectedTransaction.providerEmail}</p>
                    </div>
                  )}
                  {selectedTransaction.providerPhone && (
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium">{selectedTransaction.providerPhone}</p>
                    </div>
                  )}
                  {selectedTransaction.providerCity && (
                    <div>
                      <p className="text-xs text-gray-500">City</p>
                      <p className="font-medium">{selectedTransaction.providerCity}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
