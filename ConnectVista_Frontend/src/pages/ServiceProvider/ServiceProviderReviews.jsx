import { Star, ThumbsUp, MessageSquare, TrendingUp, TrendingDown, Download, Calendar, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';

const Reviews = () => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced reviews data without avatars
  const reviews = [
    {
      id: 1,
      author: 'John Smith',
      rating: 5,
      date: '2024-01-15',
      timeAgo: '2 weeks ago',
      text: 'Excellent service! They fixed our leaking pipe quickly and professionally. Very satisfied with the work and would definitely recommend to anyone needing plumbing services.',
      service: 'Emergency Pipe Repair',
      bookingId: 'BK-2024-001',
      helpful: 12,
      verified: true,
      sentiment: 'positive',
      replied: false,
      customerType: 'returning',
      read: true,
    },
    {
      id: 2,
      author: 'Mary Johnson',
      rating: 5,
      date: '2024-01-05',
      timeAgo: '1 month ago',
      text: 'Very responsive and professional. They came out the same day for our emergency and fixed everything perfectly. Great communication throughout the entire process.',
      service: 'Bathroom Renovation',
      bookingId: 'BK-2024-002',
      helpful: 8,
      verified: true,
      sentiment: 'positive',
      replied: true,
      reply: {
        text: 'Thank you so much for your kind words! We\'re always here for emergencies and value customers like you. Looking forward to serving you again in the future.',
        date: '2024-01-06',
        timeAgo: '1 month ago'
      },
      customerType: 'new',
      read: true,
    },
    {
      id: 3,
      author: 'David Lee',
      rating: 4,
      date: '2023-12-20',
      timeAgo: '2 months ago',
      text: 'Good work overall. The plumber was knowledgeable and fixed the issue. Price was fair compared to other quotes. Would use again for future plumbing needs.',
      service: 'Drain Cleaning',
      bookingId: 'BK-2024-003',
      helpful: 5,
      verified: true,
      sentiment: 'neutral',
      replied: false,
      customerType: 'returning',
      read: false,
    },
  ];

  // Comprehensive stats data
  const stats = useMemo(() => ({
    averageRating: 4.8,
    totalReviews: 156,
    thisMonth: 12,
    lastMonth: 10,
    ratingChange: '+20%',
    responseRate: '94%',
    avgResponseTime: '4.2 hours',
    breakdown: [
      { stars: 5, count: 120, percentage: 77, color: '#10b981' },
      { stars: 4, count: 25, percentage: 16, color: '#3b82f6' },
      { stars: 3, count: 8, percentage: 5, color: '#f59e0b' },
      { stars: 2, count: 2, percentage: 1, color: '#f97316' },
      { stars: 1, count: 1, percentage: 1, color: '#ef4444' },
    ],
    sentiment: {
      positive: 82,
      neutral: 15,
      negative: 3,
    }
  }), []);

  // Filter options
  const filters = [
    { value: 'all', label: 'All Reviews', count: reviews.length },
    { value: 'unread', label: 'Unread', count: reviews.filter(r => !r.read).length },
    { value: 'unreplied', label: 'Unreplied', count: reviews.filter(r => !r.replied).length },
    { value: '5-stars', label: '5 Stars', count: reviews.filter(r => r.rating === 5).length },
    { value: '1-2-stars', label: 'Needs Attention', count: reviews.filter(r => r.rating <= 2).length },
  ];

  // Filter and search reviews
  const filteredReviews = useMemo(() => {
    let result = reviews;
    
    if (activeFilter === 'unread') {
      result = result.filter(r => !r.read);
    } else if (activeFilter === 'unreplied') {
      result = result.filter(r => !r.replied);
    } else if (activeFilter === '5-stars') {
      result = result.filter(r => r.rating === 5);
    } else if (activeFilter === '1-2-stars') {
      result = result.filter(r => r.rating <= 2);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.author.toLowerCase().includes(query) ||
        r.text.toLowerCase().includes(query) ||
        r.service.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [activeFilter, searchQuery]);

  const handleReply = useCallback((reviewId) => {
    if (!replyText.trim()) {
      alert('Please write a reply before posting.');
      return;
    }
    
    alert('Reply posted! Your response has been published.');
    setReplyingTo(null);
    setReplyText('');
  }, [replyText]);

  const handleMarkAsRead = useCallback((reviewId) => {
    alert('Review marked as read.');
  }, []);

  const handleReportReview = useCallback((reviewId) => {
    const reason = prompt('Please specify the reason for reporting this review:');
    if (reason) {
      alert('Review reported. Our team will review it shortly.');
    }
  }, []);

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp size={16} color="#10b981" />;
      case 'negative': return <TrendingDown size={16} color="#ef4444" />;
      default: return <TrendingUp size={16} color="#f59e0b" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  // Customer initial avatar
  const getCustomerInitial = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div  
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.5rem',
        backgroundColor: 'var(--background)',
        color: 'var(--text-color)',
        padding: '1rem',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        <div style={{ width: '100%' }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: 'bold',
            margin: '0 0 0.5rem 0'
          }}>Reviews & Ratings</h1>
          <p style={{
            color: 'var(--text-color)',
            opacity: 0.8,
            fontSize: 'clamp(0.875rem, 3vw, 1.125rem)',
            margin: 0
          }}>Manage customer feedback, respond to reviews, and track your reputation</p>
        </div>

        {/* Search and Filters */}
        <div style={{ width: '100%' }}>
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
                placeholder="Search reviews by customer, service, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-color)',
                  fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                  outline: 'none',
                  minWidth: '0',
                  width: '100%'
                }}
              />
            </div>
            
            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              width: '100%'
            }}>
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
                fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flex: '1 1 auto',
                minWidth: '120px',
                width: '100%'
              }}>
                <Download size={18} />
                Export Reviews
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '1rem',
        width: '100%'
      }}>
        {/* Overall Rating Card */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '1rem',
          padding: '1.25rem',
          textAlign: 'center',
          transition: 'transform 0.2s',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{
            fontSize: 'clamp(2rem, 8vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: 'var(--accent-color)',
            lineHeight: '1'
          }}>{stats.averageRating}</div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.25rem',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                style={{
                  height: 'clamp(1.25rem, 4vw, 1.5rem)',
                  width: 'clamp(1.25rem, 4vw, 1.5rem)',
                  fill: i < Math.floor(stats.averageRating) ? 'var(--accent-color)' : 'transparent',
                  color: i < Math.floor(stats.averageRating) ? 'var(--accent-color)' : 'var(--text-color)',
                  opacity: i < Math.floor(stats.averageRating) ? 1 : 0.3
                }}
              />
            ))}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                fontWeight: 'bold',
                color: 'var(--text-color)'
              }}>{stats.totalReviews}</div>
              <div style={{
                fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                opacity: 0.7
              }}>Total Reviews</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                fontWeight: 'bold',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem'
              }}>
                <TrendingUp size={16} />
                {stats.ratingChange}
              </div>
              <div style={{
                fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                opacity: 0.7
              }}>This Month</div>
            </div>
          </div>
        </div>

        {/* Response Metrics Card */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '1rem',
          padding: '1.25rem',
          transition: 'transform 0.2s',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{
            fontSize: 'clamp(0.875rem, 3vw, 1rem)',
            fontWeight: '600',
            margin: '0 0 1rem 0',
            color: 'var(--text-color)'
          }}>Response Performance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={16} style={{ opacity: 0.7 }} />
                <span style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}>Response Rate</span>
              </div>
              <span style={{
                fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                fontWeight: 'bold',
                color: '#10b981'
              }}>{stats.responseRate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} style={{ opacity: 0.7 }} />
                <span style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}>Avg. Response Time</span>
              </div>
              <span style={{
                fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                fontWeight: 'bold',
                color: stats.avgResponseTime.includes('hours') ? '#3b82f6' : '#10b981'
              }}>{stats.avgResponseTime}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} style={{ opacity: 0.7 }} />
                <span style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}>This Month's Reviews</span>
              </div>
              <span style={{
                fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                fontWeight: 'bold',
                color: 'var(--accent-color)'
              }}>{stats.thisMonth}</span>
            </div>
          </div>
        </div>

        {/* Rating Distribution Card */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '1rem',
          padding: '1.25rem',
          transition: 'transform 0.2s',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{
            fontSize: 'clamp(0.875rem, 3vw, 1rem)',
            fontWeight: '600',
            margin: '0 0 1rem 0',
            color: 'var(--text-color)'
          }}>Rating Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {stats.breakdown.map((item) => (
              <div key={item.stars} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  width: '2.5rem',
                  flexShrink: 0
                }}>
                  <span style={{
                    fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                    fontWeight: '500'
                  }}>{item.stars}</span>
                  <Star style={{
                    height: 'clamp(0.875rem, 3vw, 1rem)',
                    width: 'clamp(0.875rem, 3vw, 1rem)',
                    fill: item.color,
                    color: item.color
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    height: '0.5rem',
                    backgroundColor: 'var(--border-color)',
                    borderRadius: '9999px',
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: item.color,
                        transition: 'all 0.3s ease',
                        width: `${item.percentage}%`
                      }}
                    />
                  </div>
                </div>
                <div style={{ width: '3rem', textAlign: 'right', flexShrink: 0 }}>
                  <span style={{
                    fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                    fontWeight: '600',
                    color: item.color
                  }}>
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '1rem',
        overflow: 'hidden',
        width: '100%'
      }}>
        {/* Header with Filters */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.25rem 1.25rem 0 1.25rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
              width: '100%'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                fontWeight: '600',
                margin: 0
              }}>Customer Reviews</h2>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '0.5rem',
              paddingBottom: '1rem',
              width: '100%',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1.25rem',
                    backgroundColor: activeFilter === filter.value ? 'var(--accent-color)' : 'var(--card-bg)',
                    color: activeFilter === filter.value ? 'white' : 'var(--text-color)',
                    border: `1px solid ${activeFilter === filter.value ? 'var(--accent-color)' : 'var(--border-color)'}`,
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                >
                  {filter.label}
                  <span style={{
                    backgroundColor: activeFilter === filter.value ? 'rgba(255,255,255,0.2)' : 'var(--border-color)',
                    color: activeFilter === filter.value ? 'white' : 'var(--text-color)',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)'
                  }}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div style={{ 
          padding: '1.25rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {filteredReviews.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              width: '100%'
            }}>
              <MessageSquare size={48} style={{ 
                margin: '0 auto 1rem', 
                opacity: 0.5 
              }} />
              <h3 style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>No reviews found</h3>
              <p style={{ 
                opacity: 0.7,
                fontSize: 'clamp(0.875rem, 3vw, 1rem)'
              }}>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div 
                key={review.id} 
                style={{ 
                  backgroundColor: review.read ? 'var(--background)' : 'rgba(var(--accent-rgb), 0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  transition: 'all 0.2s',
                  position: 'relative',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                {/* Unread Indicator */}
                {!review.read && (
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '1rem',
                    backgroundColor: 'var(--accent-color)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                    fontWeight: '600'
                  }}>
                    NEW
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                  {/* Review Header - Clean layout without avatar */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '0.75rem',
                    width: '100%'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      width: '100%'
                    }}>
                      {/* Customer Info with Initial Circle */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}>
                        {/* Customer Initial Circle */}
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          flexShrink: 0
                        }}>
                          {getCustomerInitial(review.author)}
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: '0.5rem',
                            flexWrap: 'wrap'
                          }}>
                            <p style={{ 
                              fontWeight: '600', 
                              fontSize: 'clamp(1rem, 4vw, 1.125rem)',
                              margin: 0
                            }}>{review.author}</p>
                            {review.verified && (
                              <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.125rem 0.5rem',
                                backgroundColor: '#10b98120',
                                color: '#10b981',
                                borderRadius: '9999px',
                                fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                                fontWeight: '600',
                                whiteSpace: 'nowrap'
                              }}>
                                <CheckCircle size={12} />
                                Verified
                              </span>
                            )}
                          </div>
                          
                          {/* Rating and Date */}
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            flexWrap: 'wrap'
                          }}>
                            <div style={{ display: 'flex', gap: '0.125rem' }}>
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  style={{
                                    height: 'clamp(0.875rem, 3vw, 1rem)',
                                    width: 'clamp(0.875rem, 3vw, 1rem)',
                                    fill: i < review.rating ? 'var(--accent-color)' : 'transparent',
                                    color: i < review.rating ? 'var(--accent-color)' : 'var(--text-color)',
                                    opacity: i < review.rating ? 1 : 0.3
                                  }}
                                />
                              ))}
                            </div>
                            <span style={{ 
                              fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)', 
                              opacity: 0.7
                            }}>{review.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.5rem', 
                        flexWrap: 'wrap'
                      }}>
                        {!review.read && (
                          <button
                            onClick={() => handleMarkAsRead(review.id)}
                            style={{
                              padding: '0.5rem 0.875rem',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--border-color)',
                              borderRadius: '0.5rem',
                              color: 'var(--text-color)',
                              fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Mark as Read
                          </button>
                        )}
                        <button
                          onClick={() => handleReportReview(review.id)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.5rem',
                            color: '#ef4444',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          title="Report review"
                        >
                          <AlertCircle size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Service Info and Sentiment */}
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <span style={{ 
                        fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)', 
                        opacity: 0.7,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        Service: {review.service}
                      </span>
                      <span style={{ 
                        fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)', 
                        opacity: 0.7,
                        fontFamily: 'monospace'
                      }}>
                        {review.bookingId}
                      </span>
                      <span style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.125rem 0.5rem',
                        backgroundColor: `${getSentimentColor(review.sentiment)}20`,
                        color: getSentimentColor(review.sentiment),
                        borderRadius: '9999px',
                        fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        {getSentimentIcon(review.sentiment)}
                        {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p style={{ 
                    opacity: 0.8, 
                    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                    lineHeight: '1.6',
                    margin: 0
                  }}>{review.text}</p>

                  {/* Actions */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    width: '100%'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                        opacity: 0.7,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-color)',
                        padding: '0.5rem 0.875rem',
                        backgroundColor: 'var(--background)',
                        borderRadius: '0.5rem',
                        transition: 'all 0.2s'
                      }}>
                        <ThumbsUp style={{ 
                          height: 'clamp(0.875rem, 3vw, 1rem)', 
                          width: 'clamp(0.875rem, 3vw, 1rem)' 
                        }} />
                        <span>Helpful ({review.helpful})</span>
                      </button>

                      {!review.replied ? (
                        <button
                          onClick={() => setReplyingTo(review.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--accent-color)',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                            color: 'white',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                          }}
                        >
                          <MessageSquare style={{ 
                            height: 'clamp(0.875rem, 3vw, 1rem)', 
                            width: 'clamp(0.875rem, 3vw, 1rem)' 
                          }} />
                          Reply
                        </button>
                      ) : (
                        <span style={{
                          fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                          color: '#10b981',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.5rem 0.875rem',
                          backgroundColor: '#10b98120',
                          borderRadius: '0.5rem'
                        }}>
                          <CheckCircle size={16} />
                          Replied
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Existing Reply */}
                  {review.replied && review.reply && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '0.75rem',
                      borderLeft: '3px solid var(--accent-color)',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '0.75rem'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.875rem'
                        }}>
                          QF
                        </div>
                        <div>
                          <p style={{
                            fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                            fontWeight: '600',
                            margin: 0
                          }}>QuickFix Plumbing</p>
                          <span style={{
                            fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                            opacity: 0.7
                          }}>Business Owner • {review.reply.timeAgo}</span>
                        </div>
                      </div>
                      <p style={{
                        fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                        opacity: 0.8,
                        margin: 0,
                        lineHeight: '1.5'
                      }}>{review.reply.text}</p>
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyingTo === review.id && (
                    <div style={{ 
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '0.75rem',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <h4 style={{
                        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                        fontWeight: '600',
                        margin: '0 0 0.75rem 0'
                      }}>Write a Reply</h4>
                      <textarea
                        placeholder="Write your professional response to this review..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '0.5rem',
                          backgroundColor: 'var(--card-bg)',
                          color: 'var(--text-color)',
                          resize: 'vertical',
                          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                          marginBottom: '0.75rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.75rem', 
                        justifyContent: 'flex-end',
                        flexWrap: 'wrap',
                        width: '100%'
                      }}>
                        <button 
                          onClick={() => handleReply(review.id)}
                          style={{
                            padding: '0.75rem 1.25rem',
                            backgroundColor: 'var(--accent-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                            transition: 'all 0.2s',
                            flex: '1 1 auto',
                            minWidth: '120px'
                          }}
                        >
                          Post Reply
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          style={{
                            padding: '0.75rem 1.25rem',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            color: 'var(--text-color)',
                            fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                            transition: 'all 0.2s',
                            flex: '1 1 auto',
                            minWidth: '120px'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Load More Button */}
          {filteredReviews.length > 0 && (
            <div style={{ textAlign: 'center', padding: '1rem', width: '100%' }}>
              <button style={{
                padding: '0.75rem 2rem',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                color: 'var(--text-color)',
                fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                fontWeight: '600',
                transition: 'all 0.2s',
                width: '100%',
                maxWidth: '300px'
              }}>
                Load More Reviews
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Responsive CSS */}
      <style jsx="true">{`
        @media (max-width: 768px) {
          div[style*="padding: 1rem"] {
            padding: 0.75rem !important;
          }
          
          div[style*="padding: 1.25rem"] {
            padding: 1rem !important;
          }
          
          div[style*="gap: 1.5rem"] {
            gap: 1rem !important;
          }
          
          div[style*="borderRadius: 1rem"] {
            border-radius: 0.75rem !important;
          }
          
          /* Stack customer info and actions on mobile */
          div[style*="justifyContent: space-between"] {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }
        }
        
        @media (max-width: 480px) {
          div[style*="padding: 1rem"] {
            padding: 0.5rem !important;
          }
          
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
          
          button[style*="minWidth: 120px"] {
            min-width: 100% !important;
          }
          
          /* Make action buttons full width on very small screens */
          div[style*="justifyContent: space-between"] > div:last-child {
            width: 100%;
          }
          
          div[style*="justifyContent: space-between"] > div:last-child button {
            flex: 1;
          }
        }
        
        /* Hide scrollbar for tabs */
        div[style*="overflowX: auto"]::-webkit-scrollbar {
          display: none;
        }
        
        /* Better touch targets */
        button {
          min-height: 44px;
        }
        
        /* Prevent zoom on iOS */
        input, textarea {
          font-size: 16px;
        }
        
        /* Prevent horizontal overflow */
        * {
          max-width: 100%;
          overflow-wrap: break-word;
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default Reviews;