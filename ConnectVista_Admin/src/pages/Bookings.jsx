import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getBookings } from '../services/api';

export default function Bookings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getBookings({ 
        status: statusFilter !== 'all' ? statusFilter : undefined 
      });
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      (booking._id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.serviceId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.seekerId?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    { 
      key: 'bookingId', 
      header: 'Order ID',
      render: (value, row) => row.bookingId || row._id?.slice(-8).toUpperCase() || 'N/A'
    },
    { 
      key: 'service', 
      header: 'Service',
      render: (value, row) => row.serviceId?.name || 'N/A'
    },
    { 
      key: 'seeker', 
      header: 'Seeker',
      render: (value, row) => row.seekerId?.name || 'N/A'
    },
    { 
      key: 'provider', 
      header: 'Provider',
      render: (value, row) => row.providerId?.businessName || 'N/A'
    },
    { 
      key: 'scheduledDate', 
      header: 'Date',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value) => <span className="font-medium">${value || 0}</span>
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => {
        const colors = {
          'Completed': 'bg-green-100 text-green-700',
          'In Progress': 'bg-blue-100 text-blue-700',
          'Pending': 'bg-yellow-100 text-yellow-700',
          'Cancelled': 'bg-red-100 text-red-700',
        };
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${colors[value] || 'bg-gray-100 text-gray-700'}`}>
            {value || 'pending'}
          </span>
        );
      }
    },
    { 
      key: 'paymentStatus', 
      header: 'Payment',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {value || 'pending'}
        </span>
      )
    },
  ];

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={filteredBookings}
          onEdit={handleView}
          actions={true}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
        }}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium text-gray-800">
                  {selectedBooking.bookingId || selectedBooking._id?.slice(-8).toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium text-gray-800">{selectedBooking.serviceId?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Service Seeker</p>
                <p className="font-medium text-gray-800">{selectedBooking.seekerId?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Service Provider</p>
                <p className="font-medium text-gray-800">{selectedBooking.providerId?.businessName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Scheduled Date</p>
                <p className="font-medium text-gray-800">
                  {selectedBooking.scheduledDate ? new Date(selectedBooking.scheduledDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium text-gray-800">${selectedBooking.amount || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedBooking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  selectedBooking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {selectedBooking.status || 'pending'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment</p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedBooking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedBooking.paymentStatus || 'pending'}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
