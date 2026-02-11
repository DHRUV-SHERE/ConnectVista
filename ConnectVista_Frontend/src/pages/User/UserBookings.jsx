import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, XCircle, Loader2, RefreshCw, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { serviceAPI } from '../../services/serviceAPI';
import { useSocket } from '../../contexts/SocketContext';

const UserBookings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const { subscribe } = useSocket();

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getSeekerBookings({
        status: activeTab === 'all' ? undefined : activeTab,
        page,
        limit: 10
      });

      if (response.success) {
        setBookings(response.data.bookings || []);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    const unsubscribeAccepted = subscribe('booking:accepted', () => {
      toast.success('Your booking has been accepted!');
      fetchBookings();
    });

    const unsubscribeRejected = subscribe('booking:rejected', () => {
      toast.error('Your booking was rejected');
      fetchBookings();
    });

    return () => {
      unsubscribeAccepted();
      unsubscribeRejected();
    };
  }, [subscribe, fetchBookings]);

  const handleCancel = useCallback(async (id) => {
    const reason = window.prompt('Please provide a reason for cancellation:');
    if (reason === null) return;

    try {
      setActionLoading(id);
      const response = await serviceAPI.cancelBooking(id, reason);

      if (response.success) {
        toast.success('Booking cancelled.');
        fetchBookings();
      } else {
        toast.error(response.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setActionLoading(null);
    }
  }, [fetchBookings]);

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: 'var(--accent-color)', text: 'Pending' },
      accepted: { bg: '#3b82f6', text: 'Accepted' },
      confirmed: { bg: '#3b82f6', text: 'Confirmed' },
      completed: { bg: '#10b981', text: 'Completed' },
      cancelled: { bg: '#ef4444', text: 'Cancelled' },
      rejected: { bg: '#ef4444', text: 'Rejected' }
    };
    return colors[status] || { bg: 'var(--border-color)', text: 'Unknown' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.providerId?.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.providerId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { value: 'all', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      backgroundColor: 'var(--background)',
      color: 'var(--text-color)',
      padding: '1rem',
      minHeight: 'calc(100vh - 4rem)'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', margin: 0 }}>
              My Bookings
            </h1>
            <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}>
              Track and manage your service bookings
            </p>
          </div>
          <button
            onClick={fetchBookings}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              backgroundColor: 'var(--accent-color)',
              border: 'none',
              borderRadius: '0.75rem',
              color: 'white',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem'
        }}>
          <Search size={20} style={{ opacity: 0.5 }} />
          <input
            type="text"
            placeholder="Search by provider name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              color: 'var(--text-color)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '1rem',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '0.5rem',
          padding: '1.25rem',
          paddingBottom: '0'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setPage(1);
              }}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: activeTab === tab.value ? 'var(--accent-color)' : 'var(--card-bg)',
                color: activeTab === tab.value ? 'white' : 'var(--text-color)',
                border: `1px solid ${activeTab === tab.value ? 'var(--accent-color)' : 'var(--border-color)'}`,
                borderRadius: '0.75rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '1.25rem' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 size={48} style={{ color: 'var(--accent-color)' }} className="animate-spin" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                No bookings found
              </h3>
              <p style={{ opacity: 0.7 }}>
                {searchQuery ? 'Try adjusting your search' : 'No bookings in this category yet'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredBookings.map((booking) => {
                const statusStyle = getStatusColor(booking.status);
                const provider = booking.providerId;

                return (
                  <div key={booking._id} style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.75rem',
                    padding: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                          {provider?.businessName || provider?.name || 'Provider'}
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: 0.7 }}>
                            <Calendar size={14} />
                            {formatDate(booking.bookingDate)}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: 0.7 }}>
                            <Clock size={14} />
                            {formatTime(booking.bookingTime)}
                          </span>
                        </div>
                      </div>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        backgroundColor: `${statusStyle.bg}20`,
                        color: statusStyle.bg
                      }}>
                        {statusStyle.text}
                      </span>
                    </div>

                    {booking.serviceAddress && (
                      <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', marginBottom: '1rem', opacity: 0.8 }}>
                        <MapPin size={16} style={{ marginTop: '0.125rem' }} />
                        <span style={{ fontSize: '0.875rem' }}>
                          {booking.serviceAddress.street}, {booking.serviceAddress.city}
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--accent-color)' }}>
                        ₹{booking.totalPrice}
                      </span>
                      {(booking.status === 'pending' || booking.status === 'accepted') && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={actionLoading === booking._id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'transparent',
                            border: '1px solid #ef4444',
                            borderRadius: '0.5rem',
                            color: '#ef4444',
                            cursor: 'pointer'
                          }}
                        >
                          {actionLoading === booking._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <XCircle size={16} />
                          )}
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  opacity: page === 1 ? 0.5 : 1
                }}
              >
                Previous
              </button>
              <span style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--accent-color)',
                color: 'white',
                borderRadius: '0.5rem'
              }}>
                {page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages || loading}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  opacity: page === pagination.totalPages ? 0.5 : 1
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBookings;
