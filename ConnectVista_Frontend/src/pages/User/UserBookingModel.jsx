import { useState, useMemo, useCallback } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, CheckCircle, XCircle, CalendarClock, MessageCircle, DollarSign, Search, Filter, MoreVertical, Download, Eye, Edit, Trash2 } from 'lucide-react';

const Bookings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // More realistic bookings data
  const bookings = [
    {
      id: 1001,
      bookingId: 'BK-2024-001',
      customer: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      },
      service: {
        name: 'Emergency Pipe Repair',
        category: 'Plumbing',
        duration: 2,
        priority: 'urgent'
      },
      date: '2024-01-20',
      time: '10:00 AM',
      address: '123 Main Street, Apartment 4B, New York, NY 10001',
      coordinates: '40.7128° N, 74.0060° W',
      status: 'pending',
      price: 250,
      paymentStatus: 'pending',
      notes: 'Kitchen sink pipe burst, water leaking everywhere. Need immediate attention.',
      createdAt: '2024-01-18 14:30:00',
      updatedAt: '2024-01-18 14:30:00'
    },
    {
      id: 1002,
      bookingId: 'BK-2024-002',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 234-5678',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
      },
      service: {
        name: 'Complete Bathroom Plumbing',
        category: 'Installation',
        duration: 4,
        priority: 'standard'
      },
      date: '2024-01-21',
      time: '2:00 PM',
      address: '456 Oak Avenue, Los Angeles, CA 90001',
      coordinates: '34.0522° N, 118.2437° W',
      status: 'confirmed',
      price: 850,
      paymentStatus: 'paid',
      notes: 'Installing new pipes, sink, and shower in master bathroom renovation.',
      createdAt: '2024-01-19 09:15:00',
      updatedAt: '2024-01-19 16:45:00'
    },
    {
      id: 1003,
      bookingId: 'BK-2024-003',
      customer: {
        name: 'Michael Rodriguez',
        email: 'mike.r@example.com',
        phone: '+1 (555) 345-6789',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
      },
      service: {
        name: 'Drain Cleaning Service',
        category: 'Maintenance',
        duration: 1,
        priority: 'standard'
      },
      date: '2024-01-18',
      time: '9:00 AM',
      address: '789 Pine Road, Chicago, IL 60601',
      coordinates: '41.8781° N, 87.6298° W',
      status: 'completed',
      price: 120,
      paymentStatus: 'paid',
      notes: 'Main bathroom drain completely clogged, water not draining.',
      createdAt: '2024-01-17 11:20:00',
      updatedAt: '2024-01-18 17:30:00'
    },
    {
      id: 1004,
      bookingId: 'BK-2024-004',
      customer: {
        name: 'Emily Chen',
        email: 'emily.chen@example.com',
        phone: '+1 (555) 456-7890',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
      },
      service: {
        name: 'Water Heater Installation',
        category: 'Installation',
        duration: 3,
        priority: 'standard'
      },
      date: '2024-01-22',
      time: '11:00 AM',
      address: '321 Elm Street, Miami, FL 33101',
      coordinates: '25.7617° N, 80.1918° W',
      status: 'pending',
      price: 650,
      paymentStatus: 'pending',
      notes: 'Replacing old water heater with new energy-efficient model.',
      createdAt: '2024-01-19 16:45:00',
      updatedAt: '2024-01-19 16:45:00'
    },
    {
      id: 1005,
      bookingId: 'BK-2024-005',
      customer: {
        name: 'David Wilson',
        email: 'david.w@example.com',
        phone: '+1 (555) 567-8901',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
      },
      service: {
        name: 'Leak Detection & Repair',
        category: 'Repair',
        duration: 2,
        priority: 'urgent'
      },
      date: '2024-01-19',
      time: '3:30 PM',
      address: '654 Maple Drive, Seattle, WA 98101',
      coordinates: '47.6062° N, 122.3321° W',
      status: 'cancelled',
      price: 180,
      paymentStatus: 'refunded',
      notes: 'Customer cancelled due to emergency trip.',
      createdAt: '2024-01-18 10:10:00',
      updatedAt: '2024-01-19 08:30:00'
    }
  ];

  // Calculate statistics
  const stats = useMemo(() => [
    { 
      label: 'Total Bookings', 
      value: bookings.length, 
      color: 'var(--accent-color)',
      icon: Calendar 
    },
    { 
      label: 'Pending Review', 
      value: bookings.filter((b) => b.status === 'pending').length, 
      color: 'var(--accent-color)',
      icon: Clock 
    },
    { 
      label: 'Confirmed Today', 
      value: bookings.filter((b) => b.status === 'confirmed').length, 
      color: '#3b82f6',
      icon: CheckCircle 
    },
    { 
      label: 'Revenue This Month', 
      value: `$${bookings
        .filter((b) => b.status === 'completed' || b.status === 'confirmed')
        .reduce((sum, b) => sum + b.price, 0)}`, 
      color: '#10b981',
      icon: DollarSign 
    },
  ], []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { 
          background: 'var(--accent-color)', 
          color: 'var(--accent-color)',
          text: 'Pending Review'
        };
      case 'confirmed':
        return { 
          background: '#3b82f6', 
          color: '#3b82f6',
          text: 'Confirmed'
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

  const handleAccept = useCallback((id) => {
    if (window.confirm('Are you sure you want to accept this booking?')) {
      alert('Booking accepted! The customer has been notified.');
      // In real app, update booking status via API
    }
  }, []);

  const handleReject = useCallback((id) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason) {
      alert(`Booking rejected. Reason: ${reason}`);
      // In real app, update booking status via API
    }
  }, []);

  const handleReschedule = useCallback((id) => {
    const newDate = window.prompt('Enter new date (YYYY-MM-DD):');
    const newTime = window.prompt('Enter new time (HH:MM AM/PM):');
    if (newDate && newTime) {
      alert(`Reschedule request sent for ${newDate} at ${newTime}`);
      // In real app, send reschedule request via API
    }
  }, []);

  const handleViewDetails = useCallback((booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  }, []);

  const handleMarkAsCompleted = useCallback((id) => {
    if (window.confirm('Mark this booking as completed?')) {
      alert('Booking marked as completed!');
      // In real app, update booking status via API
    }
  }, []);

  const handleContactCustomer = useCallback((phone, email) => {
    const choice = window.confirm('Contact customer:\n\nOK for Call\nCancel for Email');
    if (choice) {
      window.open(`tel:${phone}`);
    } else {
      window.open(`mailto:${email}`);
    }
  }, []);

  // Filter bookings based on active tab and search
  const filteredBookings = useMemo(() => {
    let result = bookings;
    
    // Filter by tab
    if (activeTab !== 'all') {
      result = result.filter((booking) => booking.status === activeTab);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((booking) => 
        booking.customer.name.toLowerCase().includes(query) ||
        booking.service.name.toLowerCase().includes(query) ||
        booking.bookingId.toLowerCase().includes(query) ||
        booking.customer.email.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [activeTab, searchQuery]);

  const tabs = [
    { value: 'all', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '2rem',
        backgroundColor: 'var(--background)',
        color: 'var(--text-color)',
        padding: '1rem',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      {/* Header */}
      <div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: 0
          }}>Bookings Management</h1>
          <p style={{
            color: 'var(--text-color)',
            opacity: 0.8,
            fontSize: '1.125rem',
            margin: 0
          }}>Manage your service requests and appointments</p>
        </div>

        {/* Search and Filters */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1.5rem'
        }} className="responsive-filters">
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              flex: 1,
              minWidth: '300px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem'
            }}>
              <Search size={20} style={{ opacity: 0.5 }} />
              <input
                type="text"
                placeholder="Search by customer name, service, or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-color)',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                color: 'var(--text-color)',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                <Filter size={18} />
                Filter
              </button>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--accent-color)',
                border: 'none',
                borderRadius: '0.75rem',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                <Download size={18} />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '1rem',
              padding: '1.5rem',
              transition: 'transform 0.2s'
            }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <Icon size={24} style={{ color: stat.color, opacity: 0.8 }} />
                <span style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-color)',
                  opacity: 0.8,
                  fontWeight: '500'
                }}>{stat.label}</span>
              </div>
              <p style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: stat.color,
                margin: 0
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
        {/* Header with Tabs */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.5rem 1.5rem 0 1.5rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              margin: 0
            }}>All Service Requests</h2>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <span style={{
                fontSize: '1rem',
                color: 'var(--text-color)',
                opacity: 0.8
              }}>
                {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '0.5rem',
            paddingBottom: '1rem'
          }} className="tabs-container">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;
              const count = bookings.filter(b => tab.value === 'all' ? true : b.status === tab.value).length;
              
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isActive ? 'var(--accent-color)' : 'var(--card-bg)',
                    color: isActive ? 'white' : 'var(--text-color)',
                    border: `1px solid ${isActive ? 'var(--accent-color)' : 'var(--border-color)'}`,
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label}
                  <span style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--border-color)',
                    color: isActive ? 'white' : 'var(--text-color)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bookings List */}
        <div style={{ padding: '1.5rem' }}>
          {filteredBookings.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1rem'
            }}>
              <Calendar size={64} style={{ 
                margin: '0 auto 1.5rem', 
                opacity: 0.5 
              }} />
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>No bookings found</h3>
              <p style={{ 
                opacity: 0.7,
                fontSize: '1.125rem'
              }}>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredBookings.map((booking) => {
                const statusStyle = getStatusColor(booking.status);
                const paymentStyle = getPaymentStatusColor(booking.paymentStatus);
                
                return (
                  <div key={booking.id} style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                     onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                    
                    {/* Booking Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      padding: '1.5rem',
                      borderBottom: '1px solid var(--border-color)',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          <img 
                            src={booking.customer.avatar} 
                            alt={booking.customer.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <h3 style={{
                              fontSize: '1.25rem',
                              fontWeight: '600',
                              margin: '0 0 0.25rem 0'
                            }}>{booking.customer.name}</h3>
                            <span style={{
                              padding: '0.375rem 0.875rem',
                              borderRadius: '9999px',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              backgroundColor: `${statusStyle.background}20`,
                              color: statusStyle.color
                            }}>
                              {statusStyle.text}
                            </span>
                            <span style={{
                              padding: '0.375rem 0.875rem',
                              borderRadius: '9999px',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              backgroundColor: `${paymentStyle.color}20`,
                              color: paymentStyle.color
                            }}>
                              {paymentStyle.text}
                            </span>
                          </div>
                          <p style={{
                            fontSize: '1rem',
                            color: 'var(--text-color)',
                            opacity: 0.8,
                            margin: '0 0 0.5rem 0'
                          }}>{booking.service.name}</p>
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '0.875rem',
                              color: 'var(--text-color)',
                              opacity: 0.7,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              <Calendar size={14} />
                              {booking.date} • {booking.time}
                            </span>
                            <span style={{
                              fontSize: '0.875rem',
                              color: 'var(--text-color)',
                              opacity: 0.7,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              <Clock size={14} />
                              {booking.service.duration} hour{booking.service.duration > 1 ? 's' : ''}
                            </span>
                            <span style={{
                              fontSize: '0.875rem',
                              color: 'var(--text-color)',
                              opacity: 0.7,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              <DollarSign size={14} />
                              ${booking.price}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <button
                          onClick={() => handleViewDetails(booking)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.5rem',
                            color: 'var(--text-color)',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--accent-color)';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.borderColor = 'var(--accent-color)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--text-color)';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                          }}
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.5rem',
                            color: 'var(--text-color)',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '1.5rem',
                      padding: '1.5rem'
                    }}>
                      {/* Customer Info */}
                      <div>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          margin: '0 0 1rem 0',
                          color: 'var(--text-color)'
                        }}>Customer Details</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Phone size={16} style={{ opacity: 0.7, flexShrink: 0 }} />
                            <a 
                              href={`tel:${booking.customer.phone}`}
                              style={{
                                color: 'var(--text-color)',
                                textDecoration: 'none',
                                fontSize: '0.875rem'
                              }}
                            >
                              {booking.customer.phone}
                            </a>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Mail size={16} style={{ opacity: 0.7, flexShrink: 0 }} />
                            <a 
                              href={`mailto:${booking.customer.email}`}
                              style={{
                                color: 'var(--text-color)',
                                textDecoration: 'none',
                                fontSize: '0.875'
                              }}
                            >
                              {booking.customer.email}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Service Details */}
                      <div>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          margin: '0 0 1rem 0',
                          color: 'var(--text-color)'
                        }}>Service Details</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: 'var(--border-color)',
                              borderRadius: '9999px',
                              fontSize: '0.875rem'
                            }}>
                              {booking.service.category}
                            </span>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: booking.service.priority === 'urgent' ? '#fee2e2' : '#dbeafe',
                              color: booking.service.priority === 'urgent' ? '#dc2626' : '#1d4ed8',
                              borderRadius: '9999px',
                              fontSize: '0.875rem',
                              fontWeight: '500'
                            }}>
                              {booking.service.priority === 'urgent' ? 'Urgent' : 'Standard'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={16} style={{ opacity: 0.7, flexShrink: 0 }} />
                            <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                              {booking.address}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Notes */}
                      {booking.notes && (
                        <div style={{
                          gridColumn: '1 / -1'
                        }}>
                          <div style={{
                            backgroundColor: 'var(--border-color)',
                            opacity: 0.5,
                            padding: '1rem',
                            borderRadius: '0.75rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <MessageCircle size={16} />
                              <h5 style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                margin: 0,
                                color: 'var(--text-color)'
                              }}>Customer Notes</h5>
                            </div>
                            <p style={{
                              fontSize: '0.875rem',
                              opacity: 0.8,
                              margin: 0,
                              lineHeight: '1.5'
                            }}>{booking.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      padding: '1rem 1.5rem',
                      borderTop: '1px solid var(--border-color)',
                      display: 'flex',
                      gap: '0.75rem',
                      flexWrap: 'wrap'
                    }}>
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleAccept(booking.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              padding: '0.75rem 1.5rem',
                              backgroundColor: 'var(--accent-color)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.75rem',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '1rem',
                              minWidth: '140px',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                          >
                            <CheckCircle size={18} />
                            Accept Booking
                          </button>
                          <button
                            onClick={() => handleReschedule(booking.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              padding: '0.75rem 1.5rem',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--border-color)',
                              borderRadius: '0.75rem',
                              cursor: 'pointer',
                              color: 'var(--text-color)',
                              fontWeight: '600',
                              fontSize: '1rem',
                              minWidth: '140px',
                              transition: 'all 0.2s'
                            }}
                          >
                            <CalendarClock size={18} />
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleReject(booking.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              padding: '0.75rem 1.5rem',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.75rem',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '1rem',
                              minWidth: '140px',
                              transition: 'all 0.2s'
                            }}
                          >
                            <XCircle size={18} />
                            Reject
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => handleContactCustomer(booking.customer.phone, booking.customer.email)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              padding: '0.75rem 1.5rem',
                              backgroundColor: 'var(--accent-color)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.75rem',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '1rem',
                              minWidth: '140px'
                            }}
                          >
                            <Phone size={18} />
                            Contact Customer
                          </button>
                          <button
                            onClick={() => handleMarkAsCompleted(booking.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              padding: '0.75rem 1.5rem',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--border-color)',
                              borderRadius: '0.75rem',
                              cursor: 'pointer',
                              color: 'var(--text-color)',
                              fontWeight: '600',
                              fontSize: '1rem',
                              minWidth: '140px'
                            }}
                          >
                            <CheckCircle size={18} />
                            Mark as Completed
                          </button>
                        </>
                      )}
                      
                      {(booking.status === 'completed' || booking.status === 'cancelled') && (
                        <button
                          onClick={() => handleContactCustomer(booking.customer.phone, booking.customer.email)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.75rem',
                            cursor: 'pointer',
                            color: 'var(--text-color)',
                            fontWeight: '600',
                            fontSize: '1rem',
                            minWidth: '140px'
                          }}
                        >
                          <Phone size={18} />
                          Contact Customer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Responsive CSS */}
      <style jsx>{`
        @media (max-width: 768px) {
          .responsive-filters > div:first-child {
            flex-direction: column;
          }
          
          .responsive-filters > div:first-child > div:first-child {
            min-width: 100%;
          }
          
          .tabs-container {
            padding-bottom: 0.5rem;
          }
          
          .tabs-container button {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
          }
        }
        
        @media (max-width: 480px) {
          .stats-container {
            grid-template-columns: 1fr;
          }
          
          .tabs-container {
            flex-wrap: wrap;
          }
        }
        
        input:focus, textarea:focus, button:focus {
          outline: 2px solid var(--accent-color);
          outline-offset: 2px;
        }
        
        button:active {
          transform: scale(0.98);
        }
        
        a:hover {
          color: var(--accent-color);
          text-decoration: underline;
        }
        
        .tabs-container::-webkit-scrollbar {
          height: 4px;
        }
        
        .tabs-container::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .tabs-container::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default Bookings;