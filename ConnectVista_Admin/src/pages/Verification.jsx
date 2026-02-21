import { useState, useEffect } from 'react';
import { Search, Check, X, Eye, FileText, Building, IdCard } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getVerifications, updateVerification } from '../services/api';

export default function Verification() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifications, setVerifications] = useState([]);

  useEffect(() => {
    fetchVerifications();
  }, [statusFilter]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const response = await getVerifications({ 
        status: statusFilter !== 'all' ? statusFilter : undefined 
      });
      if (response.data.success) {
        setVerifications(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVerifications = verifications.filter(verification => {
    const provider = verification.providerId || {};
    const service = provider.service;
    const serviceName = typeof service === 'string' ? service : (service?.name || verification.service || '');
    const matchesSearch = 
      (provider.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    { 
      key: 'businessName', 
      header: 'Provider Name',
      render: (value, row) => row.providerId?.businessName || 'N/A'
    },
    { 
      key: 'service', 
      header: 'Service Type',
      render: (value, row) => {
        const service = row.providerId?.service;
        if (typeof service === 'string') return service;
        if (service?.name) return service.name;
        return row.service || 'N/A';
      }
    },
    { 
      key: 'submittedAt', 
      header: 'Submitted Date',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => {
        const colors = {
          'pending': 'bg-yellow-100 text-yellow-700',
          'approved': 'bg-green-100 text-green-700',
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

  const handleView = (verification) => {
    setSelectedVerification(verification);
    setIsModalOpen(true);
  };

  const handleApprove = async (verification) => {
    try {
      await updateVerification(verification._id, { status: 'approved' });
      fetchVerifications();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to approve:', err);
    }
  };

  const handleReject = async (verification) => {
    try {
      await updateVerification(verification._id, { status: 'rejected' });
      fetchVerifications();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to reject:', err);
    }
  };

  const pendingCount = verifications.filter(v => v.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Verifications</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Search className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved This Month</p>
              <p className="text-3xl font-bold text-green-600">
                {verifications.filter(v => v.status === 'approved').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected This Month</p>
              <p className="text-3xl font-bold text-red-600">
                {verifications.filter(v => v.status === 'rejected').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <X className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by provider or service..."
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
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
          data={filteredVerifications}
          onEdit={handleView}
          actions={true}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVerification(null);
        }}
        title="Provider Verification Details"
        size="lg"
      >
        {selectedVerification && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <Building className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedVerification.providerId?.businessName || 'N/A'}
                </h3>
                <p className="text-gray-500">
                  {typeof selectedVerification.providerId?.service === 'string' 
                    ? selectedVerification.providerId.service 
                    : selectedVerification.providerId?.service?.name || selectedVerification.service || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedVerification.providerId?.userId?.email || 'N/A'} • {selectedVerification.providerId?.userId?.phone || 'N/A'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-3">Submitted Documents</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <IdCard className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-800">ID Card</p>
                      <p className="text-sm text-gray-500">
                        {selectedVerification.idCard?.originalName || 'Document uploaded'}
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-800">Business Permit</p>
                      <p className="text-sm text-gray-500">
                        {selectedVerification.businessPermit?.originalName || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  {selectedVerification.businessPermit ? (
                    <button className="flex items-center gap-1 px-3 py-1.5 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  ) : (
                    <span className="text-sm text-red-500">Missing</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">Submitted Date</p>
                <p className="font-medium text-gray-800">
                  {selectedVerification.submittedAt ? new Date(selectedVerification.submittedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Status</p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedVerification.status === 'approved' ? 'bg-green-100 text-green-700' :
                  selectedVerification.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedVerification.status || 'pending'}
                </span>
              </div>
            </div>

            {selectedVerification.status === 'pending' && (
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => handleReject(selectedVerification)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedVerification)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
