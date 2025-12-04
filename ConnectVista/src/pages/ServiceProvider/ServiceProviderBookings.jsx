import { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, CheckCircle, XCircle, CalendarClock } from 'lucide-react';

const Bookings = () => {
  const [activeTab, setActiveTab] = useState('all');

  const bookings = [
    {
      id: 1,
      customer: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      service: 'Leak Repair',
      date: '2024-01-20',
      time: '10:00 AM',
      location: '123 Main St, City',
      status: 'pending',
      message: 'Kitchen sink is leaking badly. Need urgent help.',
    },
    {
      id: 2,
      customer: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678',
      service: 'Pipe Installation',
      date: '2024-01-21',
      time: '2:00 PM',
      location: '456 Oak Ave, City',
      status: 'confirmed',
      message: 'Need new pipes installed in bathroom.',
    },
    {
      id: 3,
      customer: 'Mike Brown',
      email: 'mike@example.com',
      phone: '+1 (555) 345-6789',
      service: 'Emergency Service',
      date: '2024-01-18',
      time: '9:00 AM',
      location: '789 Pine Rd, City',
      status: 'completed',
      message: 'Burst pipe emergency.',
    },
    {
      id: 4,
      customer: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1 (555) 456-7890',
      service: 'Drain Cleaning',
      date: '2024-01-22',
      time: '11:00 AM',
      location: '321 Elm St, City',
      status: 'pending',
      message: 'Bathroom drain is clogged.',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { background: 'var(--accent-color)', opacity: '0.1', color: 'var(--accent-color)' };
      case 'confirmed':
        return { background: '#3b82f6', opacity: '0.1', color: '#3b82f6' };
      case 'completed':
        return { background: '#10b981', opacity: '0.1', color: '#10b981' };
      case 'cancelled':
        return { background: '#ef4444', opacity: '0.1', color: '#ef4444' };
      default:
        return { background: 'var(--border-color)', opacity: '0.5', color: 'var(--text-color)' };
    }
  };

  const handleAccept = (id) => {
    alert('Booking accepted! The customer has been notified.');
  };

  const handleReject = (id) => {
    alert('Booking rejected. The customer has been notified.');
  };

  const handleReschedule = (id) => {
    alert('Reschedule request sent. Customer will receive your reschedule options.');
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  const stats = [
    { label: 'Total Bookings', value: bookings.length, color: 'var(--accent-color)' },
    { label: 'Pending', value: bookings.filter((b) => b.status === 'pending').length, color: 'var(--accent-color)' },
    { label: 'Confirmed', value: bookings.filter((b) => b.status === 'confirmed').length, color: '#3b82f6' },
    { label: 'Completed', value: bookings.filter((b) => b.status === 'completed').length, color: '#10b981' },
  ];

  const tabs = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div
    style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.5rem',
      backgroundColor: 'var(--background)',
      color: 'var(--text-color)'
    }}>
      {/* Header */}
      <div>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          marginBottom: '0.25rem'
        }}>Bookings & Leads</h1>
        <p style={{
          color: 'var(--text-color)',
          opacity: 0.7
        }}>Manage your service requests and appointments</p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.5rem',
              padding: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-color)',
                  opacity: 0.7
                }}>{stat.label}</p>
                {Icon && <Icon size={16} style={{ opacity: 0.7 }} />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: stat.color
                }}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bookings List */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>All Bookings</h2>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {/* Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            width: '100%',
            marginBottom: '1.5rem',
            backgroundColor: 'var(--border-color)',
            borderRadius: '0.375rem',
            padding: '0.25rem'
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: activeTab === tab.value ? 'var(--accent-color)' : 'transparent',
                  color: activeTab === tab.value ? 'white' : 'var(--text-color)',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bookings Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredBookings.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem'
              }}>
                <Calendar size={48} style={{ 
                  margin: '0 auto 1rem', 
                  opacity: 0.5 
                }} />
                <p style={{ opacity: 0.7 }}>No bookings found</p>
              </div>
            ) : (
              filteredBookings.map((booking) => {
                const statusStyle = getStatusColor(booking.status);
                
                return (
                  <div key={booking.id} style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Header */}
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem'
                        }} className="sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              marginBottom: '0.5rem',
                              flexWrap: 'wrap'
                            }}>
                              <h3 style={{
                                fontSize: '1.125rem',
                                fontWeight: '600'
                              }}>{booking.customer}</h3>
                              <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                backgroundColor: statusStyle.background,
                                color: statusStyle.color,
                                opacity: statusStyle.opacity
                              }}>
                                {booking.status}
                              </span>
                            </div>
                            <p style={{
                              fontSize: '0.875rem',
                              color: 'var(--text-color)',
                              opacity: 0.7
                            }}>{booking.service}</p>
                          </div>
                          <div style={{
                            display: 'none',
                            textAlign: 'right'
                          }} className="sm:block">
                            <p style={{
                              fontSize: '0.875rem',
                              fontWeight: '500'
                            }}>Booking #{booking.id}</p>
                          </div>
                        </div>

                        {/* Details */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                          gap: '1rem',
                          padding: '1rem 0',
                          borderTop: '1px solid var(--border-color)',
                          borderBottom: '1px solid var(--border-color)'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                              <Calendar size={16} style={{ opacity: 0.7 }} />
                              <span>{booking.date}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                              <Clock size={16} style={{ opacity: 0.7 }} />
                              <span>{booking.time}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                              <MapPin size={16} style={{ opacity: 0.7 }} />
                              <span>{booking.location}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                              <Phone size={16} style={{ opacity: 0.7 }} />
                              <span>{booking.phone}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                              <Mail size={16} style={{ opacity: 0.7 }} />
                              <span>{booking.email}</span>
                            </div>
                          </div>
                        </div>

                        {/* Message */}
                        {booking.message && (
                          <div style={{
                            backgroundColor: 'var(--border-color)',
                            opacity: 0.5,
                            padding: '1rem',
                            borderRadius: '0.5rem'
                          }}>
                            <p style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              marginBottom: '0.25rem'
                            }}>Customer Message:</p>
                            <p style={{
                              fontSize: '0.875rem',
                              opacity: 0.7
                            }}>{booking.message}</p>
                          </div>
                        )}

                        {/* Actions */}
                        {booking.status === 'pending' && (
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            <button 
                              onClick={() => handleAccept(booking.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: 'var(--accent-color)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontWeight: '500',
                                flex: '1 1 auto',
                                minWidth: '120px'
                              }}
                            >
                              <CheckCircle size={16} />
                              Accept
                            </button>
                            <button
                              onClick={() => handleReschedule(booking.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--border-color)',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                color: 'var(--text-color)',
                                flex: '1 1 auto',
                                minWidth: '120px'
                              }}
                            >
                              <CalendarClock size={16} />
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleReject(booking.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontWeight: '500',
                                flex: '1 1 auto',
                                minWidth: '120px'
                              }}
                            >
                              <XCircle size={16} />
                              Reject
                            </button>
                          </div>
                        )}
                        {booking.status === 'confirmed' && (
                          <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            flexWrap: 'wrap'
                          }}>
                            <button style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--border-color)',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              color: 'var(--text-color)'
                            }}>
                              Contact Customer
                            </button>
                            <button style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--border-color)',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              color: 'var(--text-color)'
                            }}>
                              Mark as Completed
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .sm\\:flex-row {
            flex-direction: column !important;
          }
          .sm\\:items-center {
            align-items: flex-start !important;
          }
          .sm\\:justify-between {
            justify-content: flex-start !important;
          }
          .sm\\:block {
            display: block !important;
            text-align: left !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Bookings;