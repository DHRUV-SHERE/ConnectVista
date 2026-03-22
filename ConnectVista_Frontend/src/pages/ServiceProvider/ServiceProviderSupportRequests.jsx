import { useState, useEffect } from 'react';
import { Eye, Trash2, Plus, AlertCircle, Clock, CheckCircle, Search, Filter, Flag } from 'lucide-react';
import toast from 'react-hot-toast';
import { supportService } from '../../services/supportService';
import PageTransitionLoader from '../../components/PageTransitionLoader';
import NeedSupportModal from '../../components/NeedSupportModal';

const ProviderSupportRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const statusColors = {
    'open': '#FF6B6B',
    'in-progress': '#FFA500',
    'resolved': '#32CD32',
    'closed': '#708090'
  };

  const priorityColors = {
    'low': '#4CAF50',
    'medium': '#FFA500',
    'high': '#FF6B6B',
    'urgent': '#DC143C'
  };

  const statusIcons = {
    'open': AlertCircle,
    'in-progress': Clock,
    'resolved': CheckCircle,
    'closed': CheckCircle
  };

  useEffect(() => {
    fetchRequests();
  }, [page, limit, statusFilter, priorityFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;

      const response = await supportService.getMyRequests(page, limit, filters);
      if (response.success) {
        setRequests(response.data);
        setTotal(response.pagination.total);
      }
    } catch (error) {
      toast.error('Failed to load support requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this support request?')) return;

    try {
      const response = await supportService.deleteSupportRequest(id);
      if (response.success) {
        toast.success('Request deleted successfully');
        fetchRequests();
      }
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && page === 1) {
    return <PageTransitionLoader />;
  }

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>
              My Support Requests
            </h1>
            <p style={{ color: 'var(--text-color)' }}>
              View and manage your support requests
            </p>
          </div>
          <button
            onClick={() => setShowSupportModal(true)}
            className="px-6 py-3 rounded-lg font-semibold text-white flex items-center gap-2"
            style={{ backgroundColor: 'var(--accent-color)' }}
          >
            <Plus className="w-5 h-5" />
            New Request
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="p-3 rounded-lg border"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="p-3 rounded-lg border"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value));
              setPage(1);
            }}
            className="p-3 rounded-lg border"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--card-bg)', borderBottom: `1px solid var(--border-color)` }}>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-color)' }}>Title</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-color)' }}>Category</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-color)' }}>Priority</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-color)' }}>Status</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-color)' }}>Date</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-color)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center" style={{ color: 'var(--text-color)' }}>
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 opacity-50" />
                      <p>No support requests yet</p>
                      <button
                        onClick={() => setShowSupportModal(true)}
                        className="mt-2 px-4 py-2 rounded-lg text-white"
                        style={{ backgroundColor: 'var(--accent-color)' }}
                      >
                        Create Your First Request
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((request) => {
                  const StatusIcon = statusIcons[request.status];
                  return (
                    <tr key={request._id} style={{ borderBottom: `1px solid var(--border-color)` }}>
                      <td className="px-6 py-4" style={{ color: 'var(--text-color)' }}>
                        <div className="max-w-xs truncate">{request.title}</div>
                      </td>
                      <td className="px-6 py-4" style={{ color: 'var(--text-color)' }}>
                        {request.category.charAt(0).toUpperCase() + request.category.slice(1)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Flag className="w-4 h-4" style={{ color: priorityColors[request.priority] }} />
                          <span style={{ color: priorityColors[request.priority], fontWeight: '600' }}>
                            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" style={{ color: statusColors[request.status] }} />
                          <span style={{ color: statusColors[request.status], fontWeight: '600' }}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4" style={{ color: 'var(--text-color)' }}>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewRequest(request)}
                            className="p-2 rounded-lg transition-all"
                            style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(request._id)}
                            className="p-2 rounded-lg transition-all"
                            style={{ backgroundColor: '#dc3545', color: 'white' }}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {requests.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <div style={{ color: 'var(--text-color)' }}>
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} requests
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border disabled:opacity-50"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-2 rounded-lg ${page === i + 1 ? 'font-bold' : ''}`}
                    style={{
                      backgroundColor: page === i + 1 ? 'var(--accent-color)' : 'var(--card-bg)',
                      color: page === i + 1 ? 'white' : 'var(--text-color)',
                      border: `1px solid var(--border-color)`
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border disabled:opacity-50"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#000000' }}>
                  Request Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-2xl"
                  style={{ color: '#000000' }}
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: '#000000' }}>Title</label>
                  <p style={{ color: '#000000' }}>{selectedRequest.title}</p>
                </div>
                <div>
                  <label className="block font-semibold mb-1" style={{ color: '#000000' }}>Description</label>
                  <p className="p-4 rounded bg-gray-100" style={{ color: '#000000', backgroundColor: '#F8F8F8' }}>
                    {selectedRequest.description}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: '#000000' }}>Category</label>
                    <p style={{ color: '#000000' }}>
                      {selectedRequest.category.charAt(0).toUpperCase() + selectedRequest.category.slice(1)}
                    </p>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: '#000000' }}>Priority</label>
                    <p style={{ color: priorityColors[selectedRequest.priority] }}>
                      {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)}
                    </p>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: '#000000' }}>Status</label>
                    <p style={{ color: statusColors[selectedRequest.status] }}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </p>
                  </div>
                </div>
                {selectedRequest.adminNotes && (
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: '#000000' }}>Admin Notes</label>
                    <p className="p-4 rounded bg-gray-100" style={{ color: '#000000', backgroundColor: '#F8F8F8' }}>
                      {selectedRequest.adminNotes}
                    </p>
                  </div>
                )}
                <div className="pt-4 border-t" style={{ borderColor: '#E0E0E0' }}>
                  <p className="text-sm" style={{ color: '#666666', opacity: 0.7 }}>
                    Created: {new Date(selectedRequest.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border"
                  style={{ borderColor: '#E0E0E0', color: '#000000', backgroundColor: '#F8F8F8' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Support Modal */}
      <NeedSupportModal 
        isOpen={showSupportModal} 
        onClose={() => setShowSupportModal(false)}
        onSuccess={() => {
          fetchRequests();
        }}
      />
    </div>
  );
};

export default ProviderSupportRequests;
