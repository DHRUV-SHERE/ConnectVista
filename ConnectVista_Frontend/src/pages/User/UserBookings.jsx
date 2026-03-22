import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Phone, Mail, XCircle, Loader2, RefreshCw, Search, Star, MessageSquare, CheckCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { serviceAPI } from '../../services/serviceAPI';
import { useSocket } from '../../contexts/SocketContext';
import { useModal } from '../../contexts/ModalContext';
import ReviewModal from '../../components/User/ReviewModal';

const UserBookings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const { subscribe } = useSocket();
  const { prompt } = useModal();
  const navigate = useNavigate();

  // Review State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [bookingReviews, setBookingReviews] = useState({}); // { bookingId: reviewData }

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getSeekerBookings({
        status: activeTab === 'all' ? undefined : activeTab,
        page,
        limit: 10
      });

      if (response.success) {
        const fetchedBookings = response.data.bookings || [];
        setBookings(fetchedBookings);
        setPagination(response.data.pagination);

        // Fetch reviews for completed bookings that don't have review data yet
        fetchedBookings.forEach(booking => {
          if (booking.isReviewed && !bookingReviews[booking._id]) {
            fetchReviewForBooking(booking._id);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]); // Removed bookingReviews from dependencies to prevent loop

  const fetchReviewForBooking = async (bookingId) => {
    // Double check before fetching to avoid race conditions
    if (bookingReviews[bookingId]) return;
    
    try {
      const response = await serviceAPI.getReviewByBooking(bookingId);
      if (response.success) {
        setBookingReviews(prev => ({
          ...prev,
          [bookingId]: response.data
        }));
      }
    } catch (error) {
      console.warn(`Could not fetch review for booking ${bookingId}`);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Handle auto-popup for review
  useEffect(() => {
    if (!loading && bookings.length > 0) {
      const pendingReview = bookings.find(b => 
        b.status === 'completed' && 
        !b.isReviewed && 
        (!b.reviewReminderDate || new Date(b.reviewReminderDate) < new Date())
      );
      
      if (pendingReview && !isReviewModalOpen) {
        setSelectedBookingForReview(pendingReview);
        setIsReviewModalOpen(true);
      }
    }
  }, [bookings, loading]);

  useEffect(() => {
    const unsubscribeAccepted = subscribe('booking:accepted', () => {
      toast.success('Your booking has been accepted!');
      fetchBookings();
    });

    const unsubscribeRejected = subscribe('booking:rejected', () => {
      toast.error('Your booking was rejected');
      fetchBookings();
    });

    const unsubscribeCompleted = subscribe('booking:completed', () => {
      toast.success('A service was marked as completed! Please rate the provider.');
      fetchBookings();
    });

    return () => {
      unsubscribeAccepted();
      unsubscribeRejected();
      unsubscribeCompleted();
    };
  }, [subscribe, fetchBookings]);

  const handleCancel = useCallback(async (id) => {
    const reason = await prompt('Cancel Booking', 'Please provide a reason for cancellation:', 'Reason for cancellation...');
    if (!reason) return;

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

  const getStatusInfo = (status) => {
    const styles = {
      pending: { color: '#f59e0b', bg: '#fef3c7', text: 'Pending' },
      accepted: { color: '#3b82f6', bg: '#dbeafe', text: 'Accepted' },
      confirmed: { color: '#8b5cf6', bg: '#ede9fe', text: 'Confirmed' },
      completed: { color: '#10b981', bg: '#d1fae5', text: 'Completed' },
      cancelled: { color: '#ef4444', bg: '#fee2e2', text: 'Cancelled' },
      rejected: { color: '#7f1d1d', bg: '#fef2f2', text: 'Rejected' }
    };
    return styles[status] || { color: '#6b7280', bg: '#f3f4f6', text: status };
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-4 md:py-8">
      <div className="container mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Calendar className="text-blue-600" />
              My Bookings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your service appointments and feedback
            </p>
          </div>
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="font-semibold">Refresh List</span>
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by provider or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
            />
          </div>

          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  setPage(1);
                }}
                className={`px-5 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.value
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                    : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-slate-800 hover:border-blue-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Content */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-gray-500 font-medium">Loading your bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-gray-100 dark:border-slate-800 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={28} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Bookings Found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                {searchQuery ? "We couldn't find any bookings matching your search." : "You haven't made any bookings in this category yet."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredBookings.map((booking) => {
                const status = getStatusInfo(booking.status);
                const provider = booking.providerId;
                const review = bookingReviews[booking._id];

                return (
                  <div 
                    key={booking._id} 
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Left Accent Bar */}
                      <div className="w-full md:w-1.5 h-1.5 md:h-auto" style={{ backgroundColor: status.color }} />
                      
                      <div className="flex-1 p-5 md:p-6 space-y-4">
                        {/* Top Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                          <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg uppercase">
                              {provider?.businessName?.charAt(0) || 'P'}
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {provider?.businessName || provider?.name}
                                {provider?.isVerified && <ShieldCheck size={16} className="text-green-500" />}
                              </h3>
                              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(booking.bookingDate)}</span>
                                <span className="flex items-center gap-1"><Clock size={12} /> {formatTime(booking.bookingTime)}</span>
                              </div>
                            </div>
                          </div>
                          <span 
                            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                            style={{ backgroundColor: status.bg, color: status.color }}
                          >
                            {status.text}
                          </span>
                        </div>

                        {/* Location Info */}
                        {booking.serviceAddress && (
                          <div className="flex items-start gap-2.5 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl text-xs">
                            <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-300">
                              {booking.serviceAddress.street}, {booking.serviceAddress.city}, {booking.serviceAddress.state}
                            </span>
                          </div>
                        )}

                        {/* Rejection Reason */}
                        {booking.status === 'rejected' && (booking.rejectionReason || booking.cancellationReason) && (
                          <div className="flex items-start gap-2.5 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-xs border border-red-100 dark:border-red-800">
                            <XCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-bold text-red-800 dark:text-red-300 mb-1">Rejection Reason:</p>
                              <p className="text-red-700 dark:text-red-200">{booking.rejectionReason || booking.cancellationReason}</p>
                            </div>
                          </div>
                        )}

                        {/* Pricing & Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-800">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Amount</span>
                            <span className="text-xl font-black text-gray-900 dark:text-white">₹{booking.totalPrice}</span>
                          </div>

                          <div className="flex gap-2">
                            {/* Message Button */}
                            {['pending', 'accepted', 'confirmed', 'in-progress'].includes(booking.status) && (
                              <button
                                onClick={() => navigate(`/user/chat/${booking._id}`)}
                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all active:scale-95"
                              >
                                <MessageSquare size={16} />
                                Chat
                              </button>
                            )}

                            {booking.status === 'completed' && !booking.isReviewed && (
                              <button
                                onClick={() => {
                                  setSelectedBookingForReview(booking);
                                  setIsReviewModalOpen(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-95"
                              >
                                <Star size={16} fill="white" />
                                Rate Experience
                              </button>
                            )}

                            {(booking.status === 'pending' || booking.status === 'accepted') && (
                              <button
                                onClick={() => handleCancel(booking._id)}
                                disabled={actionLoading === booking._id}
                                className="flex items-center gap-2 px-4 py-2 border border-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-all disabled:opacity-50"
                              >
                                {actionLoading === booking._id ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Review Section */}
                        {booking.isReviewed && review && (
                          <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-500">
                            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4 relative">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        size={14} 
                                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs font-bold text-gray-900 dark:text-white">My Feedback</span>
                                </div>
                                <span className="text-[10px] text-gray-400">{formatDate(review.createdAt)}</span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 italic text-xs leading-relaxed">
                                "{review.reviewText}"
                              </p>

                              {/* Provider's Reply */}
                              {review.providerReply?.text && (
                                <div className="mt-6 ml-4 md:ml-8 p-5 bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-500 rounded-2xl">
                                  <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare size={16} className="text-blue-600" />
                                    <span className="text-xs font-black uppercase tracking-widest text-blue-600">Reply from {provider?.businessName}</span>
                                  </div>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                    {review.providerReply.text}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 disabled:opacity-30 transition-all"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold transition-all ${
                    page === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-gray-500 border border-gray-100 dark:border-slate-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages || loading}
              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 disabled:opacity-30 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        booking={selectedBookingForReview}
        onSuccess={fetchBookings}
      />

      <style jsx="true">{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default UserBookings;
