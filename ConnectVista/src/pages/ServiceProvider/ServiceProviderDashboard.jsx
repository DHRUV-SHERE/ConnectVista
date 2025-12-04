import { TrendingUp, Users, Calendar, Star, DollarSign, ArrowUpRight, ArrowDownRight, Wrench, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Services',
      value: '47',
      change: '+5.2%',
      trend: 'up',
      icon: Wrench,
    },
    {
      title: 'Active Bookings',
      value: '12',
      change: '+15.8%',
      trend: 'up',
      icon: Calendar,
    },
    {
      title: 'Customer Rating',
      value: '4.7',
      change: '+0.2',
      trend: 'up',
      icon: Star,
    },
    {
      title: 'Monthly Revenue',
      value: '$8,240',
      change: '+12.3%',
      trend: 'up',
      icon: DollarSign,
    },
  ];

  const performanceData = [
    { name: 'Mon', completed: 8, pending: 2 },
    { name: 'Tue', completed: 12, pending: 1 },
    { name: 'Wed', completed: 6, pending: 3 },
    { name: 'Thu', completed: 14, pending: 0 },
    { name: 'Fri', completed: 10, pending: 2 },
    { name: 'Sat', completed: 7, pending: 1 },
    { name: 'Sun', completed: 4, pending: 0 },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 5200 },
    { name: 'Feb', revenue: 6800 },
    { name: 'Mar', revenue: 4500 },
    { name: 'Apr', revenue: 7200 },
    { name: 'May', revenue: 6100 },
    { name: 'Jun', revenue: 8240 },
  ];

  const recentServices = [
    {
      id: 1,
      customer: 'Robert Johnson',
      service: 'Emergency Pipe Repair',
      date: '2024-06-15',
      time: '10:30 AM',
      status: 'confirmed',
      amount: '$280',
    },
    {
      id: 2,
      customer: 'Maria Garcia',
      service: 'Water Heater Installation',
      date: '2024-06-14',
      time: '2:15 PM',
      status: 'in-progress',
      amount: '$450',
    },
    {
      id: 3,
      customer: 'James Wilson',
      service: 'Leak Detection',
      date: '2024-06-14',
      time: '9:00 AM',
      status: 'completed',
      amount: '$120',
    },
    {
      id: 4,
      customer: 'Lisa Chen',
      service: 'Bathroom Plumbing',
      date: '2024-06-13',
      time: '11:45 AM',
      status: 'pending',
      amount: '$195',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { background: 'var(--accent-color)', opacity: '0.1', color: 'var(--accent-color)' };
      case 'confirmed':
        return { background: '#3b82f6', opacity: '0.1', color: '#3b82f6' };
      case 'in-progress':
        return { background: '#f59e0b', opacity: '0.1', color: '#f59e0b' };
      case 'completed':
        return { background: '#10b981', opacity: '0.1', color: '#10b981' };
      default:
        return { background: 'var(--border-color)', opacity: '0.5', color: 'var(--text-color)' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'in-progress':
        return <AlertCircle size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'flex-start'
      }} className="sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            marginBottom: '0.25rem'
          }}>Service Dashboard</h1>
          <p style={{
            color: 'var(--text-color)',
            opacity: 0.7
          }}>Welcome back! Here's your service performance overview.</p>
        </div>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--accent-color)',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontWeight: '500'
        }}>
          <TrendingUp size={16} />
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} style={{
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
                }}>{stat.title}</p>
                <Icon size={16} style={{ opacity: 0.7 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>{stat.value}</p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight size={16} style={{ color: '#10b981' }} />
                  ) : (
                    <ArrowDownRight size={16} style={{ color: '#ef4444' }} />
                  )}
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: stat.trend === 'up' ? '#10b981' : '#ef4444'
                  }}>
                    {stat.change}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-color)',
                    opacity: 0.7
                  }}>vs last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Performance Chart */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>Weekly Performance</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              color: 'var(--text-color)',
              opacity: 0.7
            }}>
              <TrendingUp size={48} />
              <p>Chart visualization would be implemented here</p>
              <p style={{ fontSize: '0.875rem' }}>Using Recharts or similar library</p>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>Monthly Revenue</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              color: 'var(--text-color)',
              opacity: 0.7
            }}>
              <DollarSign size={48} />
              <p>Revenue chart visualization</p>
              <p style={{ fontSize: '0.875rem' }}>Monthly earnings overview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Services */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>Recent Services</h3>
          <button style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: 'var(--text-color)'
          }}>
            View All
          </button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentServices.map((service) => {
              const statusStyle = getStatusColor(service.status);
              return (
                <div
                  key={service.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem'
                  }} className="sm:flex-row sm:items-center sm:justify-between"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getStatusIcon(service.status)}
                      <span style={{
                        fontWeight: '600'
                      }}>{service.customer}</span>
                    </div>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-color)',
                      opacity: 0.7
                    }}>{service.service}</p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-color)',
                      opacity: 0.7
                    }}>{service.date} at {service.time}</p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: statusStyle.background,
                      color: statusStyle.color,
                      opacity: statusStyle.opacity
                    }}>
                      {service.status.replace('-', ' ')}
                    </span>
                    <span style={{
                      fontWeight: '600',
                      color: 'var(--accent-color)'
                    }}>{service.amount}</span>
                    <button style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-color)',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}>
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.5rem',
        padding: '1.5rem'
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>Quick Actions</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          <button style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            height: 'auto'
          }}>
            <Users size={24} />
            <span>Manage Clients</span>
          </button>
          <button style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            height: 'auto'
          }}>
            <Calendar size={24} />
            <span>Schedule</span>
          </button>
          <button style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            height: 'auto'
          }}>
            <Star size={24} />
            <span>Reviews</span>
          </button>
          <button style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            height: 'auto'
          }}>
            <TrendingUp size={24} />
            <span>Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;