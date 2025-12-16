"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, DollarSign, User, Phone, MessageCircle, X } from "lucide-react";

const BookingModal = ({ provider, onClose, onConfirm }) => {
  const [bookingData, setBookingData] = useState({
    serviceType: '',
    date: '',
    time: '',
    address: '',
    description: '',
    phone: '',
    email: '',
    duration: '1',
    priority: 'standard'
  });

  const services = provider.services || [];
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', 
                    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      ...bookingData,
      providerId: provider.id,
      providerName: provider.businessName,
      totalCost: calculateCost()
    });
  };

  const calculateCost = () => {
    const priceMap = { '$': 500, '$$': 1000, '$$$': 2000, '$$$$': 5000 };
    const basePrice = priceMap[provider.price] || 1000;
    const durationMultiplier = parseInt(bookingData.duration);
    const priorityMultiplier = bookingData.priority === 'urgent' ? 1.5 : 1;
    return basePrice * durationMultiplier * priorityMultiplier;
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
                {provider.businessName}
              </p>
            </div>
            <button
              onClick={onClose}
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
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                Select Service
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {services.map((service, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setBookingData({...bookingData, serviceType: service})}
                    className={`p-3 rounded-xl text-sm transition-all ${
                      bookingData.serviceType === service 
                        ? 'font-semibold shadow-sm' 
                        : 'hover:opacity-90'
                    }`}
                    style={{
                      backgroundColor: bookingData.serviceType === service 
                        ? 'var(--accent-color)' 
                        : 'var(--card-bg)',
                      color: bookingData.serviceType === service 
                        ? 'white' 
                        : 'var(--text-color)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
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
                  Time Slot
                </label>
                <select
                  required
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  className="w-full p-3 rounded-xl focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <option value="">Select time</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
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
                  className="w-full p-3 rounded-xl focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <option value="standard">Standard (Normal pricing)</option>
                  <option value="urgent">Urgent (+50% charge)</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                <MapPin className="inline h-4 w-4 mr-1" />
                Service Address
              </label>
              <textarea
                required
                placeholder="Enter complete address for service"
                value={bookingData.address}
                onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                  placeholder="+91 1234567890"
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
                  <User className="inline h-4 w-4 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={bookingData.email}
                  onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                  placeholder="your@email.com"
                  className="w-full p-3 rounded-xl focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)'
                  }}
                />
              </div>
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
                Cost Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-color)', opacity: 0.7 }}>Base Rate:</span>
                  <span style={{ color: 'var(--text-color)' }}>₹{calculateCost() / parseInt(bookingData.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-color)', opacity: 0.7 }}>Duration:</span>
                  <span style={{ color: 'var(--text-color)' }}>{bookingData.duration} hour{parseInt(bookingData.duration) > 1 ? 's' : ''}</span>
                </div>
                {bookingData.priority === 'urgent' && (
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-color)', opacity: 0.7 }}>Urgent Service Charge:</span>
                    <span style={{ color: 'var(--text-color)' }}>+50%</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex justify-between font-bold">
                    <span style={{ color: 'var(--text-color)' }}>Total Cost:</span>
                    <span style={{ color: 'var(--accent-color)' }}>₹{calculateCost()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-semibold transition-colors"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl font-semibold transition-colors"
                style={{
                  background: 'var(--accent-color)',
                  color: 'white'
                }}
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingModal;