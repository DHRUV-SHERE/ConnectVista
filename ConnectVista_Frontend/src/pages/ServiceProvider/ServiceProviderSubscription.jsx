import { Check, Crown, Zap, TrendingUp, Star } from 'lucide-react';
import { useState } from 'react';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'basic',
      name: 'Starter',
      price: 'Free',
      description: 'Essential features to get started',
      monthlyPrice: 'Free',
      yearlyPrice: 'Free',
      features: [
        'Basic profile listing',
        'Up to 5 service categories',
        'Standard support',
        'Basic analytics',
        'Mobile-optimized profile',
        'Up to 5 photos',
        'Email support (48h)',
      ],
      current: true,
      icon: null,
      bestFor: 'Individual professionals',
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$29',
      period: '/month',
      monthlyPrice: '$29',
      yearlyPrice: '$24',
      description: 'For growing businesses',
      features: [
        'Featured profile listing',
        'Unlimited service categories',
        'Priority support',
        'Advanced analytics',
        'Custom business hours',
        'Photo gallery (up to 20)',
        'Verified badge',
        'Social media integration',
        'Lead generation tools',
      ],
      current: false,
      icon: Zap,
      popular: true,
      bestFor: 'Small to medium businesses',
      savings: 'Save 17%',
    },
    {
      id: 'premium',
      name: 'Enterprise',
      price: '$79',
      period: '/month',
      monthlyPrice: '$79',
      yearlyPrice: '$66',
      description: 'Maximum visibility & features',
      features: [
        'Top placement in search',
        'Unlimited everything',
        '24/7 premium support',
        'Full analytics suite',
        'Custom branding',
        'Unlimited photos & videos',
        'Featured badge',
        'Booking system integration',
        'API access',
        'Team collaboration',
      ],
      current: false,
      icon: Crown,
      bestFor: 'Agencies & enterprises',
      savings: 'Save 20%',
    },
  ];

  const currentUsage = {
    profileViews: { used: 2847, limit: 5000 },
    serviceCategories: { used: 3, limit: 5 },
    photos: { used: 5, limit: 10 },
  };

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Marketing Agency',
      text: 'The Professional plan increased our client leads by 300% in 2 months.',
      rating: 5,
    },
    {
      name: 'Michael R.',
      role: 'Freelance Developer',
      text: 'Perfect for solo professionals. The Starter plan has everything I need.',
      rating: 4,
    },
    {
      name: 'TechCorp Inc.',
      role: 'Enterprise Client',
      text: 'The Enterprise plan transformed our service management completely.',
      rating: 5,
    },
  ];

  const handlePlanSelect = async (planId, planName) => {
    if (isProcessing) return;
    
    if (planId === 'basic' && selectedPlan === 'basic') {
      alert('You are already on the Starter plan!');
      return;
    }

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSelectedPlan(planId);
      
      const planMessages = {
        basic: 'Switched to Starter plan!',
        professional: 'Professional plan selected! Advanced features activated.',
        premium: 'Enterprise plan activated! Maximum visibility achieved.',
      };
      
      alert(planMessages[planId] || `Successfully switched to ${planName} plan!`);
      
    } catch (error) {
      alert('Error processing your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpgradeClick = (planId, planName, isCurrent, e) => {
    e.stopPropagation();
    
    if (isCurrent) {
      alert(`You are currently on the ${planName} plan.`);
      return;
    }
    
    const plan = plans.find(p => p.id === planId);
    const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    const period = billingCycle === 'yearly' ? '/year' : '/month';
    
    const confirmMessage = planId === 'basic' 
      ? 'Are you sure you want to switch to the Starter plan?'
      : `Upgrade to ${planName} for ${price}${period}?`;
    
    if (confirm(confirmMessage)) {
      handlePlanSelect(planId, planName);
    }
  };

  const getPlanButtonText = (planId, isCurrent, isProcessingThisPlan) => {
    if (isProcessingThisPlan) {
      return 'Processing...';
    }
    if (isCurrent) {
      return 'Current Plan';
    }
    if (planId === 'basic') {
      return selectedPlan === 'basic' ? 'Current Plan' : 'Switch to Starter';
    }
    return `Get ${planId === 'professional' ? 'Professional' : 'Enterprise'}`;
  };

  const isPlanSelected = (planId) => selectedPlan === planId;

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '2rem',
        backgroundColor: 'var(--background)',
        color: 'var(--text-color)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        margin: 0,
        padding: 0
      }}
    >
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '1rem',
        width: '100%',
        padding: '0 0.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <Crown size={24} style={{ color: 'var(--accent-color)' }} />
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            fontWeight: 'bold',
            marginBottom: '0',
            background: 'linear-gradient(135deg, var(--accent-color), var(--accent-dark))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.2'
          }}>Choose Your Plan</h1>
        </div>
        <p style={{
          color: 'var(--text-color)',
          opacity: 0.8,
          fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
          maxWidth: '600px',
          margin: '0 auto 1.5rem',
          lineHeight: '1.5'
        }}>Scale your business with flexible pricing</p>
        
        {/* Billing Toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          width: '100%'
        }}>
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '0.75rem',
            padding: '0.25rem',
            maxWidth: '100%'
          }}>
            {['monthly', 'yearly'].map((cycle) => (
              <button
                key={cycle}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.5rem',
                  background: billingCycle === cycle ? 'linear-gradient(135deg, var(--accent-color), var(--accent-dark))' : 'transparent',
                  color: billingCycle === cycle ? 'white' : 'var(--text-color)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                  minWidth: '120px'
                }}
                onClick={() => setBillingCycle(cycle)}
              >
                {cycle === 'monthly' ? 'Monthly' : 'Yearly'}
                {cycle === 'yearly' && (
                  <span style={{
                    marginLeft: '0.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    fontWeight: '600'
                  }}>
                    Save 20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Plan */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        width: '100%'
      }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'linear-gradient(135deg, var(--accent-color)15, transparent)',
          flexWrap: 'wrap'
        }}>
          <TrendingUp size={20} style={{ color: 'var(--accent-color)' }} />
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>Current Usage</h2>
        </div>
        <div style={{ 
          padding: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          {Object.entries(currentUsage).map(([key, usage]) => (
            <div key={key} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.75rem',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'var(--accent-color)'
                }}>
                  {usage.used.toLocaleString()} / {usage.limit.toLocaleString()}
                </span>
              </div>
              <div style={{
                height: '8px',
                backgroundColor: 'var(--border-color)',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--accent-color), var(--accent-dark))',
                    transition: 'all 0.3s ease',
                    width: `${(usage.used / usage.limit) * 100}%`,
                    borderRadius: '9999px'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        width: '100%'
      }}>
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = plan.current;
          const isSelected = isPlanSelected(plan.id);
          const isProcessingThisPlan = isProcessing && isSelected;
          const displayPrice = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
          const displayPeriod = billingCycle === 'yearly' ? '/year' : '/month';

          return (
            <div
              key={plan.id}
              style={{
                backgroundColor: 'var(--card-bg)',
                border: plan.popular ? '2px solid var(--accent-color)' : 
                         isSelected ? '2px solid #10b981' : '1px solid var(--border-color)',
                borderRadius: '1rem',
                overflow: 'visible',
                position: 'relative',
                boxShadow: plan.popular ? '0 8px 25px rgba(59, 130, 246, 0.15)' : 
                           isSelected ? '0 8px 25px rgba(16, 185, 129, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, var(--accent-color), var(--accent-dark))',
                  color: 'white',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '9999px',
                  fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
                  fontWeight: '600',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  maxWidth: '90%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  🏆 Most Popular
                </div>
              )}
              
              {/* Savings Badge */}
              {plan.savings && billingCycle === 'yearly' && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  zIndex: 10
                }}>
                  {plan.savings}
                </div>
              )}

              <div style={{ 
                padding: '1.5rem 1.5rem 1rem 1.5rem',
                flex: 1
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        marginBottom: '0.5rem'
                      }}>{plan.name}</h3>
                      <p style={{
                        fontSize: '0.9rem',
                        opacity: 0.8,
                        lineHeight: '1.4'
                      }}>{plan.description}</p>
                    </div>
                    
                    {Icon && (
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-color), var(--accent-dark))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={24} style={{ color: 'white' }} />
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{
                        fontSize: '2rem',
                        fontWeight: '800'
                      }}>{displayPrice}</span>
                      {plan.id !== 'basic' && (
                        <span style={{
                          opacity: 0.7,
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}>{displayPeriod}</span>
                      )}
                    </div>
                    {plan.bestFor && (
                      <div style={{
                        fontSize: '0.85rem',
                        opacity: 0.8,
                        padding: '0.5rem 0',
                        borderTop: '1px solid var(--border-color)',
                        marginTop: '0.5rem'
                      }}>
                        <span style={{ fontWeight: '600' }}>Perfect for:</span> {plan.bestFor}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div style={{ 
                padding: '0 1.5rem 1.5rem 1.5rem',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.25rem'
              }}>
                <ul style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.75rem',
                }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem'
                    }}>
                      <Check size={18} style={{ 
                        color: '#10b981',
                        flexShrink: 0,
                        marginTop: '0.125rem'
                      }} />
                      <span style={{ 
                        fontSize: '0.85rem',
                        lineHeight: '1.4'
                      }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  style={{
                    width: '100%',
                    padding: '0.875rem 1.5rem',
                    background: isCurrentPlan ? 'var(--border-color)' : 
                               plan.popular ? 'linear-gradient(135deg, var(--accent-color), var(--accent-dark))' : 
                               isSelected ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                    color: isCurrentPlan ? 'var(--text-color)' : 
                          (plan.popular || isSelected) ? 'white' : 'var(--text-color)',
                    border: isCurrentPlan || plan.popular || isSelected ? 'none' : '2px solid var(--border-color)',
                    borderRadius: '0.75rem',
                    cursor: isCurrentPlan || isProcessing ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    opacity: (isCurrentPlan || isProcessingThisPlan) ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: (plan.popular || isSelected) ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'
                  }}
                  disabled={isCurrentPlan || isProcessing}
                  onClick={(e) => handleUpgradeClick(plan.id, plan.name, isCurrentPlan, e)}
                >
                  {getPlanButtonText(plan.id, isCurrentPlan, isProcessingThisPlan)}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Testimonials */}
      <div style={{
        width: '100%'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          width: '100%'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.25rem, 3.5vw, 1.5rem)',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>Trusted by Professionals</h2>
          <p style={{
            opacity: 0.8,
            fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>What our customers say about their experience</p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          width: '100%'
        }}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                height: '100%'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-color), var(--accent-dark))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  flexShrink: 0
                }}>
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    {testimonial.name}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    opacity: 0.7
                  }}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '0.25rem',
                color: '#f59e0b',
                flexWrap: 'wrap'
              }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < testimonial.rating ? '#f59e0b' : 'none'}
                    style={{ 
                      color: i < testimonial.rating ? '#f59e0b' : 'var(--border-color)',
                      flexShrink: 0 
                    }}
                  />
                ))}
              </div>
              
              <p style={{
                fontSize: '0.85rem',
                lineHeight: '1.5',
                opacity: 0.9,
                flex: 1,
                overflowWrap: 'break-word'
              }}>
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Comparison */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        marginTop: '1rem',
        width: '100%'
      }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          background: 'linear-gradient(135deg, var(--accent-color)15, transparent)'
        }}>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>Feature Comparison</h2>
        </div>
        <div style={{ padding: '1rem' }}>
          <div style={{ 
            overflowX: 'auto', 
            width: '100%',
            WebkitOverflowScrolling: 'touch'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              minWidth: '650px'
            }}>
              <thead>
                <tr style={{ 
                  borderBottom: '2px solid var(--border-color)',
                  background: 'linear-gradient(135deg, var(--accent-color)10, transparent)'
                }}>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '1rem',
                    fontWeight: '600',
                    fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'var(--card-bg)',
                    zIndex: 1,
                    minWidth: '180px'
                  }}>Feature</th>
                  <th style={{ 
                    textAlign: 'center', 
                    padding: '1rem',
                    fontWeight: '600',
                    fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                    minWidth: '120px'
                  }}>Starter</th>
                  <th style={{ 
                    textAlign: 'center', 
                    padding: '1rem',
                    fontWeight: '600',
                    fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                    minWidth: '120px'
                  }}>Professional</th>
                  <th style={{ 
                    textAlign: 'center', 
                    padding: '1rem',
                    fontWeight: '600',
                    fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                    minWidth: '120px'
                  }}>Enterprise</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.85rem)' }}>
                {[
                  ['Profile Views/Month', '5,000', '25,000', 'Unlimited'],
                  ['Service Categories', '5', 'Unlimited', 'Unlimited'],
                  ['Photo Gallery', '10', '20', 'Unlimited'],
                  ['Search Ranking', 'Standard', 'Featured', 'Top'],
                  ['Support', 'Email', 'Priority', '24/7'],
                  ['Custom Branding', '❌', '❌', '✓'],
                  ['API Access', '❌', '❌', '✓'],
                  ['Verified Badge', '❌', '✓', '✓'],
                  ['Booking Integration', '❌', '❌', '✓'],
                  ['Team Members', '1', '3', 'Unlimited'],
                  ['Video Uploads', '❌', '✓', 'Unlimited'],
                ].map(([feature, ...values], index) => (
                  <tr 
                    key={feature} 
                    style={{ 
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: index % 2 === 0 ? 'var(--card-bg)' : 'var(--background)',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <td style={{ 
                      padding: '1rem',
                      fontWeight: '500',
                      position: 'sticky',
                      left: 0,
                      backgroundColor: index % 2 === 0 ? 'var(--card-bg)' : 'var(--background)',
                      zIndex: 1,
                      whiteSpace: 'nowrap',
                      minWidth: '180px'
                    }}>{feature}</td>
                    {values.map((value, i) => (
                      <td 
                        key={i}
                        style={{ 
                          textAlign: 'center', 
                          padding: '1rem',
                          fontWeight: value === '✓' ? '600' : value === '❌' ? '600' : '500',
                          color: value === '✓' ? '#10b981' : value === '❌' ? '#ef4444' : 'inherit',
                          fontSize: value === '✓' || value === '❌' ? '1rem' : 'inherit',
                          minWidth: '120px'
                        }}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{
        width: '100%',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.25rem, 3.5vw, 1.5rem)',
          fontWeight: '700',
          marginBottom: '1.5rem'
        }}>Frequently Asked Questions</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          width: '100%'
        }}>
          {[
            {
              q: 'Can I switch plans anytime?',
              a: 'Yes, upgrade or downgrade anytime. Changes are immediate.'
            },
            {
              q: 'Do you offer annual discounts?',
              a: 'Yes! Save up to 20% with annual billing.'
            },
            {
              q: 'Is there a contract?',
              a: 'No contracts. Cancel anytime.'
            },
            {
              q: 'What payment methods?',
              a: 'All major cards, PayPal, and bank transfers.'
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes, cancel anytime with no fees.'
            },
            {
              q: 'Is there a free trial?',
              a: 'Start with our free plan, no credit card required.'
            }
          ].map((faq, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                height: '100%'
              }}
            >
              <div style={{
                fontWeight: '600',
                marginBottom: '0.5rem',
                fontSize: '0.95rem'
              }}>
                {faq.q}
              </div>
              <div style={{
                fontSize: '0.85rem',
                opacity: 0.8,
                lineHeight: '1.5',
                overflowWrap: 'break-word'
              }}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div style={{
        textAlign: 'center',
        padding: '2rem 0 1rem',
        borderTop: '1px solid var(--border-color)',
        marginTop: '1rem',
        width: '100%'
      }}>
        <p style={{
          fontSize: '0.85rem',
          opacity: 0.7,
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.5'
        }}>
          Need help choosing a plan? <a href="#" style={{
            color: 'var(--accent-color)',
            textDecoration: 'none',
            fontWeight: '600'
          }}>Contact our sales team</a> for personalized recommendations.
        </p>
      </div>

      {/* Responsive Styles */}
      <style>
        {`
          /* Mobile (default) */
          @media (max-width: 639px) {
            .plans-grid {
              grid-template-columns: 1fr !important;
            }
            
            .current-usage-grid {
              grid-template-columns: 1fr !important;
            }
            
            table {
              min-width: 500px !important;
            }
          }
          
          /* Tablet */
          @media (min-width: 640px) and (max-width: 1023px) {
            .plans-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            
            .current-usage-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
            
            .testimonials-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            
            .faq-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          
          /* Desktop */
          @media (min-width: 1024px) {
            .plans-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
            
            .testimonials-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
            
            .faq-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          
          /* Hover effects for desktop */
          @media (hover: hover) {
            .plan-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
            }
            
            .testimonial-card:hover {
              border-color: var(--accent-color);
              transform: translateY(-2px);
            }
            
            .faq-item:hover {
              border-color: var(--accent-color);
              background-color: var(--background);
            }
            
            button:hover:not(:disabled) {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Subscription;