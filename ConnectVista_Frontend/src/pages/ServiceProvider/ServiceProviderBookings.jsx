import { useState, useMemo, useCallback, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, CheckCircle, XCircle, CalendarClock, MessageCircle, DollarSign, Search, Filter, Download, Eye, MoreVertical, Loader2, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { serviceAPI } from '../../services/serviceAPI';
import { walletAPI } from '../../services/walletAPI';
import { useSocket } from '../../contexts/SocketContext';
import InvoiceBuilder from '../../components/ServiceProvider/InvoiceBuilder';
import { AnimatePresence } from 'framer-motion';

const ServiceProviderBookings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const { subscribe } = useSocket();

  // Invoice Builder State
  const [showInvoiceBuilder, setShowInvoiceBuilder] = useState(false);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);

  // Fetch wallet balance
  const fetchWallet = async () => {
    try {
      const response = await walletAPI.getWalletDetails();
      if (response.success) {
        setWalletBalance(response.data.walletBalance);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getProviderBookings({
        status: activeTab === 'all' ? undefined : activeTab,
        page,
        limit: 10
      });

      if (response.success) {
        setBookings(response.data.bookings || []);
        setStats(response.data.stats || stats);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  // Initial fetch
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Subscribe to real-time booking events
  useEffect(() => {
    const unsubscribeNew = subscribe('booking:new', (data) => {
      toast.success(`New booking request from ${data.booking?.seekerName || 'a customer'}!`, {
        duration: 5000,
        icon: '📅'
      });
      fetchBookings();
    });

    const unsubscribeCancelled = subscribe('booking:cancelled', (data) => {
      toast('A booking has been cancelled', { icon: 'ℹ️' });
      fetchBookings();
    });

    return () => {
      unsubscribeNew();
      unsubscribeCancelled();
    };
  }, [subscribe, fetchBookings]);

  // Calculate display stats
  const displayStats = useMemo(() => [
    {
      label: 'Total Bookings',
      value: stats.total,
      color: 'var(--accent-color)',
      icon: Calendar
    },
    {
      label: 'Pending Review',
      value: stats.pending,
      color: 'var(--accent-color)',
      icon: Clock
    },
    {
      label: 'Accepted',
      value: stats.accepted + (stats.confirmed || 0),
      color: '#3b82f6',
      icon: CheckCircle
    },
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue || 0}`,
      color: '#10b981',
      icon: DollarSign
    },
  ], [stats]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return {
          background: 'var(--accent-color)',
          color: 'var(--accent-color)',
          text: 'Pending Review'
        };
      case 'accepted':
        return {
          background: '#3b82f6',
          color: '#3b82f6',
          text: 'Accepted'
        };
      case 'confirmed':
        return {
          background: '#3b82f6',
          color: '#3b82f6',
          text: 'Confirmed'
        };
      case 'in-progress':
        return {
          background: '#8b5cf6',
          color: '#8b5cf6',
          text: 'In Progress'
        };
      case 'completed':
        return {
          background: '#10b981',
          color: '#10b981',
          text: 'Completed'
        };
      case 'cancelled':
        return {
          background: '#ef4444',
          color: '#ef4444',
          text: 'Cancelled'
        };
      case 'rejected':
        return {
          background: '#ef4444',
          color: '#ef4444',
          text: 'Rejected'
        };
      default:
        return {
          background: 'var(--border-color)',
          color: 'var(--text-color)',
          text: 'Unknown'
        };
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return { color: '#10b981', text: 'Paid' };
      case 'pending':
        return { color: '#f59e0b', text: 'Pending' };
      case 'refunded':
        return { color: '#ef4444', text: 'Refunded' };
      default:
        return { color: 'var(--text-color)', text: 'Unknown' };
    }
  };

  const handleAccept = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to accept this booking?')) return;

    try {
      setActionLoading(id);
      const response = await serviceAPI.acceptBooking(id);

      if (response.success) {
        toast.success('Booking accepted! Customer has been notified.');
        fetchBookings();
      } else {
        toast.error(response.message || 'Failed to accept booking');
      }
    } catch (error) {
      console.error('Accept booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to accept booking');
    } finally {
      setActionLoading(null);
    }
  }, [fetchBookings]);

  const handleReject = useCallback(async (id) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason === null) return;

    try {
      setActionLoading(id);
      const response = await serviceAPI.rejectBooking(id, reason);

      if (response.success) {
        toast.success('Booking rejected. Customer has been notified.');
        fetchBookings();
      } else {
        toast.error(response.message || 'Failed to reject booking');
      }
    } catch (error) {
      console.error('Reject booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to reject booking');
    } finally {
      setActionLoading(null);
    }
  }, [fetchBookings]);

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

  const handleComplete = useCallback(async (booking) => {
    setSelectedBookingForInvoice(booking);
    setShowInvoiceBuilder(true);
  }, []);

  const handleInvoiceSuccess = () => {
    setShowInvoiceBuilder(false);
    setSelectedBookingForInvoice(null);
    fetchBookings();
    fetchWallet();
  };

  const handleContactCustomer = useCallback((phone, email) => {
    const choice = window.confirm('Contact customer:\n\nOK for Call\nCancel for Email');
    if (choice) {
      window.open(`tel:${phone}`);
    } else {
      window.open(`mailto:${email}`);
    }
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Filter bookings based on search
  const filteredBookings = useMemo(() => {
    if (!searchQuery) return bookings;

    const query = searchQuery.toLowerCase();
    return bookings.filter((booking) =>
      booking.seekerId?.name?.toLowerCase().includes(query) ||
      booking.seekerId?.user?.email?.toLowerCase().includes(query) ||
      booking._id?.toLowerCase().includes(query)
    );
  }, [bookings, searchQuery]);

  const tabs = [
    { value: 'all', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <>
      <AnimatePresence>
        {showInvoiceBuilder && selectedBookingForInvoice && (
          <InvoiceBuilder
            booking={selectedBookingForInvoice}
            walletBalance={walletBalance}
            onClose={() => setShowInvoiceBuilder(false)}
            onSuccess={handleInvoiceSuccess}
          />
        )}
      </AnimatePresence>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        backgroundColor: 'var(--background)',
        color: 'var(--text-color)',
        padding: '1rem',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
      {/* Header */}
      <div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: 'bold',
                margin: 0
              }}>Bookings Management</h1>
              <p style={{
                color: 'var(--text-color)',
                opacity: 0.8,
                fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                margin: 0
              }}>Manage your service requests and appointments</p>
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
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                cursor: 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          padding: '0.75rem 1rem',
          width: '100%',
          boxSizing: 'border-box',
          marginBottom: '1.5rem'
        }}>
          <Search size={20} style={{ opacity: 0.5, flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              color: 'var(--text-color)',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              outline: 'none',
              minWidth: '0'
            }}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
        gap: '1rem'
      }}>
        {displayStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '1rem',
              padding: '1.25rem',
              transition: 'transform 0.2s',
              minWidth: '0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem'
              }}>
                <Icon size={24} style={{ color: stat.color, opacity: 0.8 }} />
                <span style={{
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  color: 'var(--text-color)',
                  opacity: 0.8,
                  fontWeight: '500',
                  textAlign: 'right'
                }}>{stat.label}</span>
              </div>
              <p style={{
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: 'bold',
                color: stat.color,
                margin: 0,
                lineHeight: '1.2'
              }}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '1rem',
        overflow: 'hidden'
      }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '0.5rem',
          padding: '1.25rem',
          paddingBottom: '0',
          scrollbarWidth: 'none'
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  setPage(1);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  backgroundColor: isActive ? 'var(--accent-color)' : 'var(--card-bg)',
                  color: isActive ? 'white' : 'var(--text-color)',
                  border: `1px solid ${isActive ? 'var(--accent-color)' : 'var(--border-color)'}`,
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Bookings List */}
        <div style={{ padding: '1.25rem' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 size={48} style={{ color: 'var(--accent-color)' }} className="animate-spin" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>No bookings found</h3>
              <p style={{ opacity: 0.7, fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}>
                {searchQuery ? 'Try adjusting your search' : 'No bookings in this category yet'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredBookings.map((booking) => {
                const statusStyle = getStatusColor(booking.status);
                const paymentStyle = getPaymentStatusColor(booking.paymentStatus);
                const isActionLoading = actionLoading === booking._id;
                const seeker = booking.seekerId;

                return (
                  <div key={booking._id} style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}>
                    {/* Booking Header */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      padding: '1.25rem',
                      borderBottom: '1px solid var(--border-color)'
                    }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          flexShrink: 0,
                          backgroundColor: 'var(--accent-fade)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {seeker?.profileImage ? (
                            <img
                              src={seeker.profileImage}
                              alt={seeker?.name || 'Customer'}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                              {seeker?.name?.charAt(0) || 'C'}
                            </span>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                            <h3 style={{
                              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                              fontWeight: '600',
                              margin: 0,
                              wordBreak: 'break-word'
                            }}>{seeker?.name || 'Customer'}</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                              <span style={{
                                padding: '0.25rem 0.625rem',
                                borderRadius: '9999px',
                                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                                fontWeight: '600',
                                backgroundColor: `${statusStyle.background}20`,
                                color: statusStyle.color,
                                whiteSpace: 'nowrap'
                              }}>
                                {statusStyle.text}
                              </span>
                              <span style={{
                                padding: '0.25rem 0.625rem',
                                borderRadius: '9999px',
                                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                                fontWeight: '600',
                                backgroundColor: `${paymentStyle.color}20`,
                                color: paymentStyle.color,
                                whiteSpace: 'nowrap'
                              }}>
                                {paymentStyle.text}
                              </span>
                              {booking.priority === 'urgent' && (
                                <span style={{
                                  padding: '0.25rem 0.625rem',
                                  borderRadius: '9999px',
                                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                                  fontWeight: '600',
                                  backgroundColor: '#fee2e2',
                                  color: '#dc2626',
                                  whiteSpace: 'nowrap'
                                }}>
                                  Urgent
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <span style={{
                          fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                          color: 'var(--text-color)',
                          opacity: 0.7,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <Calendar size={14} />
                          {formatDate(booking.bookingDate)} • {formatTime(booking.bookingTime)}
                        </span>
                        <span style={{
                          fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                          color: 'var(--accent-color)',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <DollarSign size={14} />
                          ₹{booking.totalPrice}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {/* Customer Contact */}
                      <div>
                        <h4 style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', fontWeight: '600', margin: '0 0 0.75rem 0' }}>
                          Customer Details
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {seeker?.user?.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Phone size={16} style={{ opacity: 0.7 }} />
                              <a href={`tel:${seeker.user.phone}`} style={{ color: 'var(--text-color)', textDecoration: 'none', fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>
                                {seeker.user.phone}
                              </a>
                            </div>
                          )}
                          {seeker?.user?.email && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Mail size={16} style={{ opacity: 0.7 }} />
                              <a href={`mailto:${seeker.user.email}`} style={{ color: 'var(--text-color)', textDecoration: 'none', fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>
                                {seeker.user.email}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Service Address */}
                      {booking.serviceAddress && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <MapPin size={16} style={{ opacity: 0.7, flexShrink: 0, marginTop: '0.125rem' }} />
                          <span style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', opacity: 0.8, wordBreak: 'break-word' }}>
                            {booking.serviceAddress.street}
                            {booking.serviceAddress.city && `, ${booking.serviceAddress.city}`}
                            {booking.serviceAddress.state && `, ${booking.serviceAddress.state}`}
                          </span>
                        </div>
                      )}

                      {/* Customer Notes */}
                      {booking.additionalNote && (
                        <div style={{
                          backgroundColor: 'var(--border-color)',
                          opacity: 0.7,
                          padding: '0.875rem',
                          borderRadius: '0.75rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <MessageCircle size={16} />
                            <h5 style={{ fontSize: 'clamp(0.875rem, 2vw, 0.875rem)', fontWeight: '600', margin: 0 }}>
                              Customer Notes
                            </h5>
                          </div>
                          <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', opacity: 0.8, margin: 0, lineHeight: '1.5' }}>
                            {booking.additionalNote}
                          </p>
                        </div>
                      )}

                      {/* Cancellation Reason */}
                      {booking.cancellationReason && (
                        <div style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          padding: '0.875rem',
                          borderRadius: '0.75rem',
                          borderLeft: '3px solid #ef4444'
                        }}>
                          <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', fontWeight: '600', color: '#ef4444', margin: '0 0 0.25rem 0' }}>
                            Cancellation Reason:
                          </p>
                          <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', opacity: 0.8, margin: 0 }}>
                            {booking.cancellationReason}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAccept(booking._id)}
                              disabled={isActionLoading}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem',
                                backgroundColor: 'var(--accent-color)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.75rem',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                width: '100%',
                                opacity: isActionLoading ? 0.7 : 1
                              }}
                            >
                              {isActionLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <CheckCircle size={18} />
                              )}
                              Accept Booking
                            </button>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => handleReject(booking._id)}
                                disabled={isActionLoading}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.5rem',
                                  padding: '0.75rem',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.75rem',
                                  cursor: 'pointer',
                                  fontWeight: '600',
                                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                  flex: '1 1 auto',
                                  minWidth: '140px',
                                  opacity: isActionLoading ? 0.7 : 1
                                }}
                              >
                                <XCircle size={18} />
                                Reject
                              </button>
                            </div>
                          </>
                        )}

                        {(booking.status === 'accepted' || booking.status === 'confirmed') && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button
                              onClick={() => handleComplete(booking)}
                              disabled={isActionLoading}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.75rem',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                width: '100%',
                                opacity: isActionLoading ? 0.7 : 1
                              }}
                            >
                              {isActionLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <CheckCircle size={18} />
                              )}
                              Complete Service
                            </button>
                            {seeker?.user?.phone && (
                              <button
                                onClick={() => handleContactCustomer(seeker.user.phone, seeker.user.email)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.5rem',
                                  padding: '0.75rem',
                                  backgroundColor: 'var(--accent-color)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.75rem',
                                  cursor: 'pointer',
                                  fontWeight: '600',
                                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                  width: '100%'
                                }}
                              >
                                <Phone size={18} />
                                Contact Customer
                              </button>
                            )}
                            <button
                              onClick={() => handleCancel(booking._id)}
                              disabled={isActionLoading}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--border-color)',
                                borderRadius: '0.75rem',
                                cursor: 'pointer',
                                color: 'var(--text-color)',
                                fontWeight: '600',
                                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                width: '100%',
                                opacity: isActionLoading ? 0.7 : 1
                              }}
                            >
                              <XCircle size={18} />
                              Cancel Booking
                            </button>
                          </div>
                        )}

                        {(booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'rejected') && seeker?.user?.phone && (
                          <button
                            onClick={() => handleContactCustomer(seeker.user.phone, seeker.user.email)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              padding: '0.75rem',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--border-color)',
                              borderRadius: '0.75rem',
                              cursor: 'pointer',
                              color: 'var(--text-color)',
                              fontWeight: '600',
                              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                              width: '100%'
                            }}
                          >
                            <Phone size={18} />
                            Contact Customer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
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
                  color: 'var(--text-color)',
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
                  color: 'var(--text-color)',
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
    </>
  );
};

export default ServiceProviderBookings;
