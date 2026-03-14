import { Star, ThumbsUp, MessageSquare, TrendingUp, TrendingDown, Download, Calendar, AlertCircle, CheckCircle, Clock, Search, RefreshCw, Loader2 } from 'lucide-react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { serviceAPI } from '../../services/serviceAPI';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Reviews = () => {
  const { profile } = useAuth();
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  // Fetch reviews from API
  const fetchReviews = useCallback(async () => {
    if (!profile?._id) return;
    
    try {
      setLoading(true);
      const response = await serviceAPI.getProviderReviews(profile._id, {
        page,
        limit: 10
      });

      if (response.success) {
        setReviews(response.data.reviews || []);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [profile?._id, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Derived stats from profile data
  const stats = useMemo(() => {
    const ratingData = profile?.rating || { average: 0, count: 0, breakdown: {} };
    const breakdown = [5, 4, 3, 2, 1].map(stars => {
      const count = ratingData.breakdown?.[stars] || 0;
      const percentage = ratingData.count > 0 ? Math.round((count / ratingData.count) * 100) : 0;
      return {
        stars,
        count,
        percentage,
        color: stars >= 4 ? '#10b981' : stars === 3 ? '#f59e0b' : '#ef4444'
      };
    });

    return {
      averageRating: ratingData.average || 0,
      totalReviews: ratingData.count || 0,
      breakdown,
      responseRate: '94%', // Placeholder
      avgResponseTime: '4.2 hours', // Placeholder
    };
  }, [profile?.rating]);

  // Filter options
  const filters = [
    { value: 'all', label: 'All Reviews', count: stats.totalReviews },
    { value: '5-stars', label: '5 Stars', count: stats.breakdown.find(b => b.stars === 5)?.count || 0 },
    { value: 'critical', label: 'Critical', count: stats.breakdown.filter(b => b.stars <= 2).reduce((acc, curr) => acc + curr.count, 0) },
  ];

  // Filter and search reviews locally for smoother UX
  const filteredReviews = useMemo(() => {
    let result = reviews;
    
    if (activeFilter === '5-stars') {
      result = result.filter(r => r.rating === 5);
    } else if (activeFilter === 'critical') {
      result = result.filter(r => r.rating <= 2);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.seekerId?.name?.toLowerCase().includes(query) ||
        r.reviewText?.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [reviews, activeFilter, searchQuery]);

  const handleReply = useCallback(async (reviewId) => {
    if (!replyText.trim()) {
      toast.error('Please write a reply before posting.');
      return;
    }
    
    try {
      const response = await serviceAPI.replyToReview(reviewId, replyText);
      if (response.success) {
        toast.success('Reply posted successfully!');
        setReplyingTo(null);
        setReplyText('');
        fetchReviews(); // Refresh list to show replied status
      }
    } catch (error) {
      console.error('Error replying to review:', error);
      toast.error('Failed to post reply');
    }
  }, [replyText, fetchReviews]);

  const handleMarkAsRead = useCallback((reviewId) => {
    toast.success('Review marked as read.');
  }, []);

  const handleReportReview = useCallback((reviewId) => {
    const reason = prompt('Please specify the reason for reporting this review:');
    if (reason) {
      toast.success('Review reported. Our team will review it shortly.');
    }
  }, []);

  // Customer initial avatar
  const getCustomerInitial = (name) => {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
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
          <button
            onClick={fetchReviews}
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
                placeholder="Search reviews by customer or content..."
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
          </div>
        </div>

        {/* Response Metrics Card */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '1rem',
          padding: '1.25rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{
            fontSize: 'clamp(0.875rem, 3vw, 1rem)',
            fontWeight: '600',
            margin: '0 0 1rem 0',
            color: 'var(--text-color)'
          }}>Performance Metrics</h3>
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
                color: '#3b82f6'
              }}>{stats.avgResponseTime}</span>
            </div>
          </div>
        </div>

        {/* Rating Distribution Card */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '1rem',
          padding: '1.25rem',
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
            <h2 style={{
              fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
              fontWeight: '600',
              margin: 0
            }}>Customer Reviews</h2>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '0.5rem',
              paddingBottom: '1rem',
              width: '100%',
              scrollbarWidth: 'none'
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
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 size={40} className="animate-spin" style={{ color: 'var(--accent-color)' }} />
            </div>
          ) : filteredReviews.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              width: '100%'
            }}>
              <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>No reviews found</h3>
              <p style={{ opacity: 0.7 }}>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div 
                key={review._id} 
                style={{ 
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    width: '100%'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                        fontSize: '1rem'
                      }}>
                        {getCustomerInitial(review.seekerId?.name)}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <p style={{ fontWeight: '600', fontSize: '1.125rem', margin: 0 }}>
                          {review.seekerId?.name || 'Anonymous Seeker'}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.125rem' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                style={{
                                  height: '0.875rem',
                                  width: '0.875rem',
                                  fill: i < review.rating ? 'var(--accent-color)' : 'transparent',
                                  color: i < review.rating ? 'var(--accent-color)' : 'var(--text-color)',
                                  opacity: i < review.rating ? 1 : 0.3
                                }}
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p style={{ 
                    opacity: 0.8, 
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    margin: 0
                  }}>{review.reviewText}</p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    {!review.providerReply?.text ? (
                      <button
                        onClick={() => setReplyingTo(review._id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          backgroundColor: 'var(--accent-color)',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: 'white',
                          fontWeight: '600'
                        }}
                      >
                        <MessageSquare size={16} />
                        Reply
                      </button>
                    ) : (
                      <span style={{
                        fontSize: '0.875rem',
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

                  {replyingTo === review._id && (
                    <div style={{ 
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '0.75rem'
                    }}>
                      <textarea
                        placeholder="Write your professional response..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '0.5rem',
                          backgroundColor: 'var(--background)',
                          color: 'var(--text-color)',
                          marginBottom: '0.75rem'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleReply(review._id)}
                          style={{
                            padding: '0.5rem 1.25rem',
                            backgroundColor: 'var(--accent-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                          }}
                        >
                          Post Reply
                        </button>
                        <button
                          onClick={() => setReplyingTo(null)}
                          style={{
                            padding: '0.5rem 1.25rem',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
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

          {pagination && pagination.totalPages > page && (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <button 
                onClick={() => setPage(p => p + 1)}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  color: 'var(--text-color)',
                  fontWeight: '600'
                }}>
                Load More Reviews
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
