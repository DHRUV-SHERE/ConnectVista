import { useState, useEffect } from 'react';
import { Eye, Trash2, CheckCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactService } from '../services/adminServices.js';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const statusColors = {
    pending: '#FFA500',
    reviewed: '#1E90FF',
    resolved: '#32CD32'
  };

  const statusIcons = {
    pending: Clock,
    reviewed: Eye,
    resolved: CheckCircle
  };

  useEffect(() => {
    fetchContacts();
  }, [page, limit, search, statusFilter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (search) filters.search = search;
      if (statusFilter) filters.status = statusFilter;

      const response = await contactService.getContacts(page, limit, filters);
      if (response.success) {
        setContacts(response.data);
        setTotal(response.pagination.total);
      }
    } catch (error) {
      toast.error('Failed to load contacts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = async (contact) => {
    try {
      const response = await contactService.getContactById(contact._id);
      if (response.success) {
        setSelectedContact(response.data);
        setAdminNotes(response.data.adminNotes || '');
        setShowModal(true);
      }
    } catch (error) {
      toast.error('Failed to load contact details');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedContact) return;

    try {
      const response = await contactService.updateContact(selectedContact._id, {
        status: newStatus,
        adminNotes
      });

      if (response.success) {
        toast.success('Contact updated successfully');
        setSelectedContact(response.data);
        fetchContacts();
      }
    } catch (error) {
      toast.error('Failed to update contact');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await contactService.deleteContact(id);
      if (response.success) {
        toast.success('Contact deleted successfully');
        fetchContacts();
      }
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>
            Contact Submissions
          </h1>
          <p style={{ color: 'var(--text-color)' }}>
            Manage and respond to customer contact form submissions
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-2 p-3 rounded-lg border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <Search className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
            <input
              type="text"
              placeholder="Search by name, email or subject..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 bg-transparent outline-none"
              style={{ color: 'var(--text-color)' }}
            />
          </div>

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
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
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

        {/* Contacts Table */}
        <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--card-bg)', borderBottom: `1px solid var(--border-color)` }}>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-color)' }}>Name</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-color)' }}>Email</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-color)' }}>Subject</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-color)' }}>Status</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-color)' }}>Date</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-color)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center" style={{ color: 'var(--text-color)' }}>Loading...</td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center" style={{ color: 'var(--text-color)' }}>
                    No contacts found
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => {
                  const StatusIcon = statusIcons[contact.status];
                  return (
                    <tr key={contact._id} style={{ borderBottom: `1px solid var(--border-color)` }}>
                      <td className="px-6 py-4" style={{ color: 'var(--text-color)' }}>{contact.name}</td>
                      <td className="px-6 py-4" style={{ color: 'var(--text-color)' }}>{contact.email}</td>
                      <td className="px-6 py-4" style={{ color: 'var(--text-color)' }}>
                        <div className="max-w-xs truncate">{contact.subject}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" style={{ color: statusColors[contact.status] }} />
                          <span style={{ color: statusColors[contact.status], fontWeight: '600' }}>
                            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4" style={{ color: 'var(--text-color)' }}>
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewContact(contact)}
                            className="p-2 rounded-lg transition-all"
                            style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(contact._id)}
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
        <div className="mt-8 flex items-center justify-between">
          <div style={{ color: 'var(--text-color)' }}>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} contacts
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
              {Array.from({ length: totalPages }).map((_, i) => (
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
      </div>

      {/* Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                  Contact Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-2xl"
                  style={{ color: 'var(--text-color)' }}
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--text-color)' }}>Name</label>
                  <p style={{ color: 'var(--text-color)' }}>{selectedContact.name}</p>
                </div>
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--text-color)' }}>Email</label>
                  <p style={{ color: 'var(--text-color)' }}>{selectedContact.email}</p>
                </div>
                {selectedContact.phone && (
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: 'var(--text-color)' }}>Phone</label>
                    <p style={{ color: 'var(--text-color)' }}>{selectedContact.phone}</p>
                  </div>
                )}
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--text-color)' }}>Subject</label>
                  <p style={{ color: 'var(--text-color)' }}>{selectedContact.subject}</p>
                </div>
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--text-color)' }}>Message</label>
                  <p className="p-4 rounded bg-gray-100" style={{ color: 'var(--text-color)', backgroundColor: 'var(--bg-color)' }}>
                    {selectedContact.message}
                  </p>
                </div>
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--text-color)' }}>Submitted</label>
                  <p style={{ color: 'var(--text-color)' }}>
                    {new Date(selectedContact.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <label className="block font-semibold mb-2" style={{ color: 'var(--text-color)' }}>Status</label>
                  <div className="flex gap-2 mb-4">
                    {['pending', 'reviewed', 'resolved'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(status)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          selectedContact.status === status ? 'ring-2' : ''
                        }`}
                        style={{
                          backgroundColor: statusColors[status],
                          color: 'white',
                          ...(selectedContact.status === status && { ringColor: 'var(--accent-color)' })
                        }}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--text-color)' }}>Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full p-3 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
                    rows="4"
                    placeholder="Add internal notes about this contact..."
                  />
                  <button
                    onClick={() => handleUpdateStatus(selectedContact.status)}
                    className="mt-2 px-4 py-2 rounded-lg font-semibold text-white"
                    style={{ backgroundColor: 'var(--accent-color)' }}
                  >
                    Save Notes
                  </button>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
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

export default ContactsPage;
