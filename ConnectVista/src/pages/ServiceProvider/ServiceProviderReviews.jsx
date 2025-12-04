import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const Reviews = () => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const reviews = [
    {
      id: 1,
      author: 'John Smith',
      rating: 5,
      date: '2 weeks ago',
      text: 'Excellent service! They fixed our leaking pipe quickly and professionally. Very satisfied with the work and would definitely recommend.',
      helpful: 12,
      replied: false,
    },
    {
      id: 2,
      author: 'Mary Johnson',
      rating: 5,
      date: '1 month ago',
      text: 'Very responsive and professional. They came out the same day for our emergency and fixed everything perfectly. Great communication throughout.',
      helpful: 8,
      replied: true,
      reply: 'Thank you so much for your kind words! We\'re always here for emergencies.',
    },
    {
      id: 3,
      author: 'David Lee',
      rating: 4,
      date: '2 months ago',
      text: 'Good work overall. The plumber was knowledgeable and fixed the issue. Price was fair. Would use again.',
      helpful: 5,
      replied: false,
    },
    {
      id: 4,
      author: 'Sarah Wilson',
      rating: 5,
      date: '2 months ago',
      text: 'Outstanding service from start to finish. Professional, courteous, and the work was completed ahead of schedule. Highly recommend!',
      helpful: 15,
      replied: true,
      reply: 'We appreciate your wonderful feedback! It was a pleasure working with you.',
    },
  ];

  const stats = {
    averageRating: 4.8,
    totalReviews: 156,
    breakdown: [
      { stars: 5, count: 120, percentage: 77 },
      { stars: 4, count: 25, percentage: 16 },
      { stars: 3, count: 8, percentage: 5 },
      { stars: 2, count: 2, percentage: 1 },
      { stars: 1, count: 1, percentage: 1 },
    ],
  };

  const handleReply = (reviewId) => {
    alert('Reply posted! Your response has been published.');
    setReplyingTo(null);
    setReplyText('');
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
      <div>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          marginBottom: '0.25rem'
        }}>Reviews & Ratings</h1>
        <p style={{
          color: 'var(--text-color)',
          opacity: 0.7
        }}>Manage customer feedback and respond to reviews</p>
      </div>

      {/* Rating Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Average Rating */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>{stats.averageRating}</div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.25rem',
            marginBottom: '0.5rem'
          }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                style={{
                  height: '1.25rem',
                  width: '1.25rem',
                  fill: i < Math.floor(stats.averageRating) ? 'var(--accent-color)' : 'transparent',
                  color: i < Math.floor(stats.averageRating) ? 'var(--accent-color)' : 'var(--text-color)',
                  opacity: i < Math.floor(stats.averageRating) ? 1 : 0.3
                }}
              />
            ))}
          </div>
          <p style={{
            fontSize: '0.875rem',
            opacity: 0.7
          }}>
            Based on {stats.totalReviews} reviews
          </p>
        </div>

        {/* Rating Breakdown */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          gridColumn: 'span 2'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.breakdown.map((item) => (
              <div key={item.stars} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  width: '5rem'
                }}>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>{item.stars}</span>
                  <Star style={{
                    height: '1rem',
                    width: '1rem',
                    fill: 'var(--accent-color)',
                    color: 'var(--accent-color)'
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    height: '0.5rem',
                    backgroundColor: 'var(--border-color)',
                    borderRadius: '9999px',
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: 'var(--accent-color)',
                        transition: 'all 0.3s ease',
                        width: `${item.percentage}%`
                      }}
                    />
                  </div>
                </div>
                <div style={{ width: '4rem', textAlign: 'right' }}>
                  <span style={{
                    fontSize: '0.875rem',
                    opacity: 0.7
                  }}>
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
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
          }}>Customer Reviews</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {reviews.map((review, index) => (
            <div key={review.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <p style={{ fontWeight: '600' }}>{review.author}</p>
                    <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>•</span>
                    <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>{review.date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        style={{
                          height: '1rem',
                          width: '1rem',
                          fill: i < review.rating ? 'var(--accent-color)' : 'transparent',
                          color: i < review.rating ? 'var(--accent-color)' : 'var(--text-color)',
                          opacity: i < review.rating ? 1 : 0.3
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p style={{ opacity: 0.7 }}>{review.text}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.875rem',
                  opacity: 0.7,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-color)'
                }}>
                  <ThumbsUp style={{ height: '1rem', width: '1rem' }} />
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
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-color)',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: 'var(--text-color)'
                    }}
                  >
                    <MessageSquare style={{ height: '1rem', width: '1rem' }} />
                    Reply
                  </button>
                ) : (
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#10b981'
                  }}>✓ Replied</span>
                )}
              </div>

              {/* Existing Reply */}
              {review.replied && review.reply && (
                <div style={{
                  marginLeft: '1.5rem',
                  paddingLeft: '1rem',
                  borderLeft: '2px solid var(--accent-color)',
                  opacity: 0.2
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>QuickFix Plumbing</p>
                    <span style={{
                      fontSize: '0.75rem',
                      opacity: 0.7
                    }}>Business Owner</span>
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    opacity: 0.7
                  }}>{review.reply}</p>
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === review.id && (
                <div style={{ marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <textarea
                    placeholder="Write your response..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    style={{
                      padding: '0.5rem 0.75rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: '0.375rem',
                      backgroundColor: 'var(--background)',
                      color: 'var(--text-color)',
                      resize: 'vertical'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleReply(review.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--accent-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontWeight: '500'
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
                        padding: '0.5rem 1rem',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        color: 'var(--text-color)'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {index !== reviews.length - 1 && (
                <div style={{ borderBottom: '1px solid var(--border-color)' }} />
              )}
            </div>
          ))}

          <button style={{
            width: '100%',
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            color: 'var(--text-color)'
          }}>
            Load More Reviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reviews;