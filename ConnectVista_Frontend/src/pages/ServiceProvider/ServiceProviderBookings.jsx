import { useState, useMemo, useCallback } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, CheckCircle, XCircle, CalendarClock, MessageCircle, DollarSign, Search, Filter, Download, Eye, MoreVertical } from 'lucide-react';

const ServiceProviderBookings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    }
  }, []);

  const handleReject = useCallback((id) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason) {
      alert(`Booking rejected. Reason: ${reason}`);
    }
  }, []);

  const handleReschedule = useCallback((id) => {
    const newDate = window.prompt('Enter new date (YYYY-MM-DD):');
    const newTime = window.prompt('Enter new time (HH:MM AM/PM):');
    if (newDate && newTime) {
      alert(`Reschedule request sent for ${newDate} at ${newTime}`);
    }
  }, []);

  const handleMarkAsCompleted = useCallback((id) => {
    if (window.confirm('Mark this booking as completed?')) {
      alert('Booking marked as completed!');
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
    
    if (activeTab !== 'all') {
      result = result.filter((booking) => booking.status === activeTab);
    }
    
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

        {/* Search and Filters */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%'
          }}>
            {/* Search Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <Search size={20} style={{ opacity: 0.5, flexShrink: 0 }} />
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
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  outline: 'none',
                  minWidth: '0'
                }}
              />
            </div>
            
            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                color: 'var(--text-color)',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flex: '1 1 auto',
                minWidth: '120px'
              }}>
                <Filter size={18} />
                Filter
              </button>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: 'var(--accent-color)',
                border: 'none',
                borderRadius: '0.75rem',
                color: 'white',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flex: '1 1 auto',
                minWidth: '120px'
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
        gap: '1rem'
      }}>
        {stats.map((stat) => {
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
        {/* Header with Tabs */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.25rem 1.25rem 0 1.25rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: '600',
                margin: 0
              }}>All Service Requests</h2>
              <span style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                color: 'var(--text-color)',
                opacity: 0.8,
                whiteSpace: 'nowrap'
              }}>
                {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
              </span>
            </div>

            {/* Tabs - Mobile friendly */}
            <div style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '0.5rem',
              paddingBottom: '1rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}>
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
                    <span style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--border-color)',
                      color: isActive ? 'white' : 'var(--text-color)',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div style={{ padding: '1.25rem' }}>
          {filteredBookings.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem'
            }}>
              <Calendar size={48} style={{ 
                margin: '0 auto 1rem', 
                opacity: 0.5 
              }} />
              <h3 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>No bookings found</h3>
              <p style={{ 
                opacity: 0.7,
                fontSize: 'clamp(0.875rem, 2vw, 1.125rem)'
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
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}>
                    {/* Booking Header - Mobile Optimized */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      padding: '1.25rem',
                      borderBottom: '1px solid var(--border-color)'
                    }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
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
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            gap: '0.5rem'
                          }}>
                            <div style={{ 
                              display: 'flex', 
                              flexWrap: 'wrap', 
                              alignItems: 'center',
                              gap: '0.5rem',
                              rowGap: '0.25rem'
                            }}>
                              <h3 style={{
                                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                                fontWeight: '600',
                                margin: 0,
                                wordBreak: 'break-word'
                              }}>{booking.customer.name}</h3>
                              <div style={{ 
                                display: 'flex', 
                                flexWrap: 'wrap',
                                gap: '0.375rem'
                              }}>
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
                              </div>
                            </div>
                            <p style={{
                              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                              color: 'var(--text-color)',
                              opacity: 0.8,
                              margin: 0,
                              wordBreak: 'break-word'
                            }}>{booking.service.name}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Booking Details - Mobile Stacked */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.75rem',
                          rowGap: '0.5rem'
                        }}>
                          <span style={{
                            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                            color: 'var(--text-color)',
                            opacity: 0.7,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            flexShrink: 0
                          }}>
                            <Calendar size={14} />
                            {booking.date} • {booking.time}
                          </span>
                          <span style={{
                            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                            color: 'var(--text-color)',
                            opacity: 0.7,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            flexShrink: 0
                          }}>
                            <Clock size={14} />
                            {booking.service.duration} hour{booking.service.duration > 1 ? 's' : ''}
                          </span>
                          <span style={{
                            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                            color: 'var(--text-color)',
                            opacity: 0.7,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            flexShrink: 0
                          }}>
                            <DollarSign size={14} />
                            ${booking.price}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Buttons - Mobile Optimized */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.375rem',
                            padding: '0.5rem 0.875rem',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.5rem',
                            color: 'var(--text-color)',
                            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            flex: '1 1 auto'
                          }}
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.5rem',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.5rem',
                            color: 'var(--text-color)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            flexShrink: 0
                          }}
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details - Hidden by default, shown on click */}
                    <div style={{
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}>
                      {/* Customer Info */}
                      <div>
                        <h4 style={{
                          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                          fontWeight: '600',
                          margin: '0 0 0.75rem 0',
                          color: 'var(--text-color)'
                        }}>Customer Details</h4>
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '0.5rem' 
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            flexWrap: 'wrap'
                          }}>
                            <Phone size={16} style={{ opacity: 0.7, flexShrink: 0 }} />
                            <a 
                              href={`tel:${booking.customer.phone}`}
                              style={{
                                color: 'var(--text-color)',
                                textDecoration: 'none',
                                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                                wordBreak: 'break-all'
                              }}
                            >
                              {booking.customer.phone}
                            </a>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            flexWrap: 'wrap'
                          }}>
                            <Mail size={16} style={{ opacity: 0.7, flexShrink: 0 }} />
                            <a 
                              href={`mailto:${booking.customer.email}`}
                              style={{
                                color: 'var(--text-color)',
                                textDecoration: 'none',
                                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                                wordBreak: 'break-all'
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
                          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                          fontWeight: '600',
                          margin: '0 0 0.75rem 0',
                          color: 'var(--text-color)'
                        }}>Service Details</h4>
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '0.5rem' 
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            gap: '0.5rem', 
                            flexWrap: 'wrap' 
                          }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: 'var(--border-color)',
                              borderRadius: '9999px',
                              fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                              whiteSpace: 'nowrap'
                            }}>
                              {booking.service.category}
                            </span>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: booking.service.priority === 'urgent' ? '#fee2e2' : '#dbeafe',
                              color: booking.service.priority === 'urgent' ? '#dc2626' : '#1d4ed8',
                              borderRadius: '9999px',
                              fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                              fontWeight: '500',
                              whiteSpace: 'nowrap'
                            }}>
                              {booking.service.priority === 'urgent' ? 'Urgent' : 'Standard'}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: '0.5rem' 
                          }}>
                            <MapPin size={16} style={{ opacity: 0.7, flexShrink: 0, marginTop: '0.125rem' }} />
                            <span style={{ 
                              fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', 
                              opacity: 0.8,
                              wordBreak: 'break-word'
                            }}>
                              {booking.address}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Notes */}
                      {booking.notes && (
                        <div>
                          <div style={{
                            backgroundColor: 'var(--border-color)',
                            opacity: 0.5,
                            padding: '0.875rem',
                            borderRadius: '0.75rem'
                          }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem', 
                              marginBottom: '0.5rem' 
                            }}>
                              <MessageCircle size={16} />
                              <h5 style={{
                                fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                                fontWeight: '600',
                                margin: 0,
                                color: 'var(--text-color)'
                              }}>Customer Notes</h5>
                            </div>
                            <p style={{
                              fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                              opacity: 0.8,
                              margin: 0,
                              lineHeight: '1.5',
                              wordBreak: 'break-word'
                            }}>{booking.notes}</p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons - Mobile Optimized */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        paddingTop: '0.5rem'
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
                                padding: '0.75rem',
                                backgroundColor: 'var(--accent-color)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.75rem',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                transition: 'all 0.2s',
                                width: '100%'
                              }}
                            >
                              <CheckCircle size={18} />
                              Accept Booking
                            </button>
                            <div style={{
                              display: 'flex',
                              gap: '0.75rem',
                              flexWrap: 'wrap'
                            }}>
                              <button
                                onClick={() => handleReschedule(booking.id)}
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
                                  transition: 'all 0.2s',
                                  flex: '1 1 auto',
                                  minWidth: '140px'
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
                                  padding: '0.75rem',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.75rem',
                                  cursor: 'pointer',
                                  fontWeight: '600',
                                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                  transition: 'all 0.2s',
                                  flex: '1 1 auto',
                                  minWidth: '140px'
                                }}
                              >
                                <XCircle size={18} />
                                Reject
                              </button>
                            </div>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                          }}>
                            <button
                              onClick={() => handleContactCustomer(booking.customer.phone, booking.customer.email)}
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
                            <button
                              onClick={() => handleMarkAsCompleted(booking.id)}
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
                              <CheckCircle size={18} />
                              Mark as Completed
                            </button>
                          </div>
                        )}
                        
                        {(booking.status === 'completed' || booking.status === 'cancelled') && (
                          <button
                            onClick={() => handleContactCustomer(booking.customer.phone, booking.customer.email)}
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
        </div>
      </div>

      {/* Mobile Responsive CSS */}
      <style jsx="true">{`
        @media (max-width: 768px) {
          div[style*="padding: 1rem"] {
            padding: 0.75rem;
          }
          
          div[style*="padding: 1.25rem"] {
            padding: 1rem;
          }
          
          div[style*="gap: 1.5rem"] {
            gap: 1rem;
          }
          
          div[style*="padding: 1.5rem"] {
            padding: 1rem;
          }
          
          div[style*="borderRadius: 1rem"] {
            border-radius: 0.75rem;
          }
        }
        
        @media (max-width: 480px) {
          div[style*="padding: 1rem"] {
            padding: 0.5rem;
          }
          
          div[style*="gap: 2rem"] {
            gap: 1rem;
          }
          
          button[style*="minWidth: 140px"] {
            min-width: 100% !important;
          }
          
          div[style*="flexDirection: row"] {
            flex-direction: column;
          }
          
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr;
          }
        }
        
        /* Hide scrollbar for tabs on mobile */
        div[style*="overflowX: auto"]::-webkit-scrollbar {
          display: none;
        }
        
        /* Better touch targets for mobile */
        button {
          min-height: 44px;
        }
        
        input, textarea {
          font-size: 16px; /* Prevent zoom on iOS */
        }
        
        /* Prevent text overflow */
        * {
          max-width: 100%;
        }
        
        /* Better link handling on mobile */
        a {
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
};

export default ServiceProviderBookings;