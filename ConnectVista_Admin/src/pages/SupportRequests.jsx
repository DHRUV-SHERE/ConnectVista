import { useState, useEffect } from 'react';
import { Eye, Trash2, AlertCircle, Clock, CheckCircle, Search, Flag, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { supportService } from '../services/adminServices.js';

const statusColors = {
  'open': 'text-red-500',
  'in-progress': 'text-orange-500',
  'resolved': 'text-green-500',
  'closed': 'text-slate-500',
};

const statusBg = {
  'open': 'bg-red-500',
  'in-progress': 'bg-orange-500',
  'resolved': 'bg-green-500',
  'closed': 'bg-slate-500',
};

const priorityColors = {
  'low': 'text-green-600',
  'medium': 'text-orange-500',
  'high': 'text-red-500',
  'urgent': 'text-red-700 font-bold',
};

const statusIcons = {
  'open': AlertCircle,
  'in-progress': Clock,
  'resolved': CheckCircle,
  'closed': CheckCircle,
};

const SupportRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [page, search, statusFilter, priorityFilter, categoryFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (search) filters.search = search;
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;
      if (categoryFilter) filters.category = categoryFilter;

      const response = await supportService.getSupportRequests(page, limit, filters);
      if (response.success) {
        setRequests(response.data);
        setTotal(response.pagination.total);
      }
    } catch {
      toast.error('Failed to load support requests');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequest = async (request) => {
    try {
      const response = await supportService.getSupportRequestById(request._id);
      if (response.success) {
        setSelectedRequest(response.data);
        setAdminNotes(response.data.adminNotes || '');
        setShowModal(true);
      }
    } catch {
      toast.error('Failed to load request details');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedRequest) return;
    try {
      setUpdating(true);
      const response = await supportService.updateSupportRequest(selectedRequest._id, {
        status: newStatus,
        adminNotes,
      });
      if (response.success) {
        toast.success('Updated successfully');
        setSelectedRequest(response.data);
        fetchRequests();
      }
    } catch {
      toast.error('Failed to update request');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this support request?')) return;
    try {
      const response = await supportService.deleteSupportRequest(id);
      if (response.success) {
        toast.success('Deleted successfully');
        fetchRequests();
      }
    } catch {
      toast.error('Failed to delete request');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Support Requests</h1>
          <p className="text-gray-500 mt-1">Manage and track provider support requests</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg md:col-span-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or provider..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700"
            />
          </div>
          {[
            { value: statusFilter, setter: setStatusFilter, options: ['open', 'in-progress', 'resolved', 'closed'], label: 'All Status' },
            { value: priorityFilter, setter: setPriorityFilter, options: ['low', 'medium', 'high', 'urgent'], label: 'All Priority' },
            { value: categoryFilter, setter: setCategoryFilter, options: ['technical', 'billing', 'account', 'booking', 'verification', 'other'], label: 'All Categories' },
          ].map(({ value, setter, options, label }) => (
            <select
              key={label}
              value={value}
              onChange={(e) => { setter(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none"
            >
              <option value="">{label}</option>
              {options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
            </select>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['Provider', 'Title', 'Category', 'Priority', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="px-5 py-10 text-center text-gray-400">Loading...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan="7" className="px-5 py-10 text-center text-gray-400">No support requests found</td></tr>
              ) : requests.map((req) => {
                const StatusIcon = statusIcons[req.status] || AlertCircle;
                return (
                  <tr key={req._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-700 font-medium">{req.providerId?.name || 'N/A'}</td>
                    <td className="px-5 py-3 text-gray-700 max-w-[180px] truncate">{req.title}</td>
                    <td className="px-5 py-3 text-gray-600">{req.category.charAt(0).toUpperCase() + req.category.slice(1)}</td>
                    <td className="px-5 py-3">
                      <span className={`flex items-center gap-1 font-semibold ${priorityColors[req.priority]}`}>
                        <Flag className="w-3.5 h-3.5" />
                        {req.priority.charAt(0).toUpperCase() + req.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`flex items-center gap-1 font-semibold ${statusColors[req.status]}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewRequest(req)}
                          className="p-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                          title="View & Update"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1.5 text-sm rounded-lg border ${page === i + 1 ? 'bg-indigo-500 text-white border-indigo-500' : 'border-gray-200 hover:bg-gray-100'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">

              {/* Modal Header */}
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Support Request Details</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Provider Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Provider</p>
                  <p className="font-semibold text-gray-800">{selectedRequest.providerId?.name || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  <p className="font-semibold text-gray-800">{selectedRequest.providerId?.email || 'N/A'}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Category</p>
                  <p className="font-semibold text-gray-800">{selectedRequest.category.charAt(0).toUpperCase() + selectedRequest.category.slice(1)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Priority</p>
                  <p className={`font-semibold ${priorityColors[selectedRequest.priority]}`}>
                    {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Submitted</p>
                  <p className="font-semibold text-gray-800">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-1">Title</p>
                <p className="font-semibold text-gray-800">{selectedRequest.title}</p>
              </div>
              <div className="mb-5">
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="bg-gray-50 rounded-lg p-3 text-gray-700 text-sm leading-relaxed">{selectedRequest.description}</p>
              </div>

              {/* Status Update */}
              <div className="mb-5 p-4 border border-gray-200 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['open', 'in-progress', 'resolved', 'closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(status)}
                      disabled={updating}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60 ${statusBg[status]} ${selectedRequest.status === status ? 'ring-2 ring-offset-2 ring-gray-400' : 'opacity-70 hover:opacity-100'}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Current: <span className={`font-semibold ${statusColors[selectedRequest.status]}`}>{selectedRequest.status}</span>
                </p>
              </div>

              {/* Admin Notes */}
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">Admin Notes</p>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows="3"
                  placeholder="Add internal notes..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-indigo-400 resize-none"
                />
                <button
                  onClick={() => handleUpdateStatus(selectedRequest.status)}
                  disabled={updating}
                  className="mt-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
                >
                  {updating ? 'Saving...' : 'Save Notes'}
                </button>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportRequestsPage;
