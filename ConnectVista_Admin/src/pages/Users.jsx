import { useState, useEffect } from 'react';
import { Search, User, Wrench, Ban, CheckCircle } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getSeekers, getProviders, updateUserStatus } from '../services/api';

export default function Users() {
  const [activeTab, setActiveTab] = useState('seekers');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seekers, setSeekers] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchData();
  }, [activeTab, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'seekers') {
        const response = await getSeekers({ status: statusFilter !== 'all' ? statusFilter : undefined });
        if (response.data.success) {
          setSeekers(response.data.data);
        }
      } else {
        const response = await getProviders({ status: statusFilter !== 'all' ? statusFilter : undefined });
        if (response.data.success) {
          setProviders(response.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSeekers = seekers.filter(user => {
    const userData = user.user || user.userId || user;
    const matchesSearch = 
      (user.name || userData?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (userData?.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredProviders = providers.filter(user => {
    const userData = user.userId || user;
    const matchesSearch = 
      (userData?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (userData?.businessName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const seekerColumns = [
    { 
      key: 'name', 
      header: 'User',
      render: (value, row) => {
        const userData = row.user || row.userId;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{row.name || userData?.name || 'N/A'}</p>
              <p className="text-sm text-gray-500">{userData?.email || 'N/A'}</p>
            </div>
          </div>
        );
      }
    },
    { 
      key: 'phone', 
      header: 'Phone',
      render: (value, row) => (row.user || row.userId)?.phone || 'N/A'
    },
    { 
      key: 'bookings', 
      header: 'Total Bookings',
      render: (value, row) => row.totalBookings || 0
    },
    { 
      key: 'joinedAt', 
      header: 'Joined',
      render: (value, row) => {
        const userData = row.user || row.userId;
        return userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A';
      }
    },
    { 
      key: 'isActive', 
      header: 'Status',
      render: (value, row) => {
        const userData = row.user || row.userId;
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${
            userData?.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {userData?.isActive !== false ? 'Active' : 'Inactive'}
          </span>
        );
      }
    },
  ];

  const providerColumns = [
    { 
      key: 'name', 
      header: 'Provider',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{row.businessName || row.name || 'N/A'}</p>
            <p className="text-sm text-gray-500">{row.userId?.email || 'N/A'}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'service', 
      header: 'Service',
      render: (value, row) => {
        const service = row.service;
        if (typeof service === 'string') return service;
        if (service?.name) return service.name;
        return 'N/A';
      }
    },
    { 
      key: 'plan', 
      header: 'Plan',
      render: () => <span className="text-gray-500">-</span>
    },
    { 
      key: 'totalEarnings', 
      header: 'Earnings',
      render: (value) => <span className="font-medium text-green-600">₹{(value || 0).toLocaleString()}</span>
    },
    { 
      key: 'totalJobsCompleted', 
      header: 'Jobs',
      render: (value) => value || 0
    },
    { 
      key: 'verificationStatus', 
      header: 'Verification',
      render: (value) => {
        const colors = {
          'verified': 'bg-green-100 text-green-700',
          'approved': 'bg-green-100 text-green-700',
          'pending': 'bg-yellow-100 text-yellow-700',
          'rejected': 'bg-red-100 text-red-700',
        };
        return (
          <span className={`px-2 py-1 text-xs rounded-full capitalize ${colors[value] || 'bg-gray-100 text-gray-700'}`}>
            {value || 'pending'}
          </span>
        );
      }
    },
  ];

  const handleView = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleStatusToggle = async (user) => {
    try {
      const userData = user.user || user.userId;
      const newStatus = userData?.isActive === false;
      await updateUserStatus(userData?._id || userData, { isActive: newStatus });
      fetchData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('seekers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'seekers' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <User className="w-4 h-4" />
            Service Seekers ({filteredSeekers.length})
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'providers' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Service Providers ({filteredProviders.length})
          </button>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            {activeTab === 'seekers' ? (
              <>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </>
            ) : (
              <>
                <option value="verified">Verified</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </>
            )}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : activeTab === 'seekers' ? (
        <DataTable 
          columns={seekerColumns} 
          data={filteredSeekers}
          onEdit={handleView}
        />
      ) : (
        <DataTable 
          columns={providerColumns} 
          data={filteredProviders}
          onEdit={handleView}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        title={activeTab === 'seekers' ? 'Service Seeker Details' : 'Service Provider Details'}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                {activeTab === 'seekers' ? (
                  <User className="w-8 h-8 text-gray-600" />
                ) : (
                  <Wrench className="w-8 h-8 text-gray-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {activeTab === 'seekers' 
                    ? (selectedUser.name || (selectedUser.user || selectedUser.userId)?.name)
                    : (selectedUser.businessName || selectedUser.name)}
                </h3>
                <p className="text-gray-500">{(selectedUser.user || selectedUser.userId)?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{(selectedUser.user || selectedUser.userId)?.phone || 'N/A'}</p>
              </div>
              {activeTab === 'seekers' ? (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <p className="font-medium text-gray-800">{selectedUser.totalBookings || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="font-medium text-gray-800">
                      {(selectedUser.user || selectedUser.userId)?.createdAt 
                        ? new Date((selectedUser.user || selectedUser.userId).createdAt).toLocaleDateString() 
                        : 'N/A'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium text-gray-800">
                      {typeof selectedUser.service === 'string' 
                        ? selectedUser.service 
                        : selectedUser.service?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Earnings</p>
                    <p className="font-medium text-green-600">₹{(selectedUser.totalEarnings || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed Jobs</p>
                    <p className="font-medium text-gray-800">{selectedUser.totalJobsCompleted || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <p className="font-medium text-gray-800">{selectedUser.rating?.average || 0} / 5</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => handleStatusToggle(selectedUser)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {(selectedUser.user || selectedUser.userId)?.isActive === false ? (
                  <><CheckCircle className="w-4 h-4" /> Activate</>
                ) : (
                  <><Ban className="w-4 h-4" /> Deactivate</>
                )}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
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
