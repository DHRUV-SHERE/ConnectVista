"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, DollarSign, User, Phone, MessageCircle, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { serviceAPI } from "../../services/serviceAPI";
import { sendNewBookingEmail } from "../../services/emailService";

const BookingModal = ({ provider, onClose, onSuccess }) => {
  const [bookingData, setBookingData] = useState({
    serviceType: '',
    date: '',
    time: '',
    address: '',
    description: '',
    phone: '',
    duration: '1',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get services from provider
  const services = provider.services || provider.serviceDetails?.subServices || [];
  const mainService = provider.serviceDetails?.mainService || provider.mainService || '';

  // Time slots in 24-hour format for the API
  const timeSlots = [
    { label: '09:00 AM', value: '09:00' },
    { label: '10:00 AM', value: '10:00' },
    { label: '11:00 AM', value: '11:00' },
    { label: '12:00 PM', value: '12:00' },
    { label: '01:00 PM', value: '13:00' },
    { label: '02:00 PM', value: '14:00' },
    { label: '03:00 PM', value: '15:00' },
    { label: '04:00 PM', value: '16:00' },
    { label: '05:00 PM', value: '17:00' },
    { label: '06:00 PM', value: '18:00' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!bookingData.date) {
      toast.error('Please select a date');
      return;
    }
    if (!bookingData.time) {
      toast.error('Please select a time slot');
      return;
    }
    if (!bookingData.address) {
      toast.error('Please enter a service address');
      return;
    }
    if (!bookingData.phone) {
      toast.error('Please enter a phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare booking data for API
      const apiBookingData = {
        providerId: provider._id || provider.id,
        serviceId: provider.serviceDetails?.mainService?.serviceId || null,
        bookingDate: bookingData.date,
        bookingTime: bookingData.time,
        priority: bookingData.priority,
        serviceAddress: {
          sameAsSeeker: false,
          street: bookingData.address,
          city: provider.businessAddress?.city || '',
          state: provider.businessAddress?.state || '',
          pinCode: ''
        },
        additionalNote: bookingData.description || '',
        contactPhone: bookingData.phone
      };

      const response = await serviceAPI.createBooking(apiBookingData);

      if (response.success) {
        toast.success('Booking request sent successfully!');
        
        // Send email notification to provider
        try {
          const booking = response.data;
          const providerEmail = booking.providerId?.userId?.email;
          const seekerName = booking.seekerId?.name;
          
          if (providerEmail) {
            await sendNewBookingEmail({
              provider_name: provider.businessName || provider.name,
              provider_email: providerEmail,
              seeker_name: seekerName,
              service_type: mainService,
              booking_date: new Date(booking.bookingDate).toLocaleDateString(),
              booking_time: booking.bookingTime,
              view_booking_link: `${window.location.origin}/service-provider/bookings`
            });
          }
        } catch (emailError) {
          console.error('Failed to send booking email:', emailError);
          // Don't show error toast for email failure, as booking was successful
        }

        if (onSuccess) {
          onSuccess(response.data);
        }
        onClose();
      } else {
        toast.error(response.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create booking. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateCost = () => {
    // Use provider's actual pricing
    const basePrice = provider.serviceDetails?.minPrice || provider.startingPrice || 500;
    const durationMultiplier = parseInt(bookingData.duration);
    const priorityMultiplier = bookingData.priority === 'urgent' ? 1.5 : 1;
    return Math.round(basePrice * durationMultiplier * priorityMultiplier);
  };

  const getBasePrice = () => {
    return provider.serviceDetails?.minPrice || provider.startingPrice || 500;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)',
          border: '1px solid var(--border-color)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                Book Service
              </h2>
              <p style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                {provider.businessName || provider.name}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-full transition-colors"
              style={{
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-color)'
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Selection */}
            {(services.length > 0 || mainService) && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  Service Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {mainService && (
                    <span
                      className="px-3 py-2 rounded-xl text-sm font-medium"
                      style={{
                        backgroundColor: 'var(--accent-color)',
                        color: 'white'
                      }}
                    >
                      {mainService}
                    </span>
                  )}
                  {services.map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 rounded-xl text-sm"
                      style={{
                        backgroundColor: 'var(--accent-fade)',
                        color: 'var(--accent-dark)'
                      }}
                    >
                      {typeof service === 'string' ? service : service.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  disabled={isSubmitting}
                  className="w-full p-3 rounded-xl focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  <Clock className="inline h-4 w-4 mr-1" />
                  Time Slot *
                </label>
                <select
                  required
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  disabled={isSubmitting}
                  className="w-full p-3 rounded-xl focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <option value="">Select time</option>
                  {timeSlots.map(slot => (
                    <option key={slot.value} value={slot.value}>{slot.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  Duration (hours)
                </label>
                <select
                  value={bookingData.duration}
                  onChange={(e) => setBookingData({...bookingData, duration: e.target.value})}
                  disabled={isSubmitting}
                  className="w-full p-3 rounded-xl focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(hours => (
                    <option key={hours} value={hours}>{hours} hour{hours > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  Priority
                </label>
                <select
                  value={bookingData.priority}
                  onChange={(e) => setBookingData({...bookingData, priority: e.target.value})}
                  disabled={isSubmitting}
                  className="w-full p-3 rounded-xl focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <option value="normal">Standard (Normal pricing)</option>
                  <option value="urgent">Urgent (+50% charge)</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                <MapPin className="inline h-4 w-4 mr-1" />
                Service Address *
              </label>
              <textarea
                required
                placeholder="Enter complete address for service"
                value={bookingData.address}
                onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
                disabled={isSubmitting}
                rows="2"
                className="w-full p-3 rounded-xl focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)'
                }}
              />
            </div>

            {/* Contact Details */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                <Phone className="inline h-4 w-4 mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={bookingData.phone}
                onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                disabled={isSubmitting}
                placeholder="+91 1234567890"
                className="w-full p-3 rounded-xl focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)'
                }}
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                <MessageCircle className="inline h-4 w-4 mr-1" />
                Additional Notes (Optional)
              </label>
              <textarea
                placeholder="Any specific requirements or details for the service provider"
                value={bookingData.description}
                onChange={(e) => setBookingData({...bookingData, description: e.target.value})}
                disabled={isSubmitting}
                rows="3"
                className="w-full p-3 rounded-xl focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)'
                }}
              />
            </div>

            {/* Cost Summary */}
            <div
              className="p-4 rounded-xl"
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)'
              }}
            >
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                Estimated Cost
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-color)', opacity: 0.7 }}>Base Rate:</span>
                  <span style={{ color: 'var(--text-color)' }}>₹{getBasePrice()}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-color)', opacity: 0.7 }}>Duration:</span>
                  <span style={{ color: 'var(--text-color)' }}>{bookingData.duration} hour{parseInt(bookingData.duration) > 1 ? 's' : ''}</span>
                </div>
                {bookingData.priority === 'urgent' && (
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-color)', opacity: 0.7 }}>Urgent Service Charge:</span>
                    <span style={{ color: '#ef4444' }}>+50%</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex justify-between font-bold">
                    <span style={{ color: 'var(--text-color)' }}>Estimated Total:</span>
                    <span style={{ color: 'var(--accent-color)' }}>₹{calculateCost()}</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-color)', opacity: 0.5 }}>
                    * Final price may vary. Platform fee (5%) will be added.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl font-semibold transition-colors"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)',
                  opacity: isSubmitting ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                style={{
                  background: 'var(--accent-color)',
                  color: 'white',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingModal;
