import { Check, Crown, Zap, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        'Basic profile listing',
        'Up to 5 service categories',
        'Standard support',
        'Basic analytics',
      ],
      current: true,
      icon: null,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'For growing businesses',
      features: [
        'Featured profile listing',
        'Unlimited service categories',
        'Priority support',
        'Advanced analytics',
        'Custom business hours',
        'Photo gallery (up to 20)',
        'Verified badge',
      ],
      current: false,
      icon: Zap,
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$79',
      period: '/month',
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
      ],
      current: false,
      icon: Crown,
    },
  ];

  const currentUsage = {
    profileViews: { used: 2847, limit: 5000 },
    serviceCategories: { used: 3, limit: 5 },
    photos: { used: 5, limit: 10 },
  };

  const handlePlanSelect = async (planId, planName) => {
    if (isProcessing) return;
    
    if (planId === 'basic' && selectedPlan === 'basic') {
      alert('You are already on the Basic plan!');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSelectedPlan(planId);
      
      // Show success message based on the plan
      const planMessages = {
        basic: 'Switched to Basic plan!',
        professional: 'Professional plan selected! You now have access to advanced features.',
        premium: 'Premium plan activated! Welcome to maximum visibility and features.'
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
    
    const confirmMessage = planId === 'basic' 
      ? 'Are you sure you want to downgrade to Basic plan?'
      : `Are you sure you want to upgrade to ${planName} plan for ${plans.find(p => p.id === planId)?.price}?`;
    
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
      return selectedPlan === 'basic' ? 'Current Plan' : 'Downgrade';
    }
    return 'Upgrade Now';
  };

  const isPlanSelected = (planId) => selectedPlan === planId;
  const isCurrentPlan = (planId) => planId === 'basic';

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '2rem',
        backgroundColor: 'var(--background)',
        color: 'var(--text-color)',
        padding: '1.5rem 1rem',
        margin: '0',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '1rem',
        width: '100%',
        padding: '0 0.5rem'
      }}>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
          fontWeight: 'bold',
          marginBottom: '0.75rem',
          background: 'linear-gradient(135deg, var(--accent-color), var(--accent-dark))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: '1.2'
        }}>Subscription & Plans</h1>
        <p style={{
          color: 'var(--text-color)',
          opacity: 0.8,
          fontSize: 'clamp(0.9rem, 3vw, 1.125rem)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.5'
        }}>Upgrade your plan for more visibility and features</p>
      </div>

      {/* Current Plan */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        width: '100%',
        margin: '0 auto'
      }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'linear-gradient(135deg, var(--accent-color)15, transparent)'
        }}>
          <TrendingUp size={20} style={{ color: 'var(--accent-color)' }} />
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>Current Usage</h2>
        </div>
        <div style={{ 
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
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
                justifyContent: 'space-between'
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

      {/* Plans */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '100%',
        margin: '0 auto'
      }}>
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = plan.current;
          const isSelected = isPlanSelected(plan.id);
          const isProcessingThisPlan = isProcessing && isSelected;

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
                width: '100%'
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
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  whiteSpace: 'nowrap'
                }}>
                  🏆 Most Popular
                </div>
              )}
              
              {/* Selected Badge */}
              {isSelected && !isCurrentPlan && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '1rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}>
                  ✓ Selected
                </div>
              )}

              <div style={{ 
                padding: '1.5rem 1.5rem 1rem 1.5rem',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Icon && (
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent-color), var(--accent-dark))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <Icon size={24} style={{ color: 'white' }} />
                    </div>
                  )}
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
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
                    
                    {isCurrentPlan && (
                      <span style={{
                        padding: '0.4rem 0.8rem',
                        backgroundColor: 'var(--accent-color)',
                        color: 'white',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        alignSelf: 'flex-start'
                      }}>
                        Current Plan
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{
                        fontSize: '2rem',
                        fontWeight: '800'
                      }}>{plan.price}</span>
                      {plan.period && (
                        <span style={{
                          opacity: 0.7,
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}>{plan.period}</span>
                      )}
                    </div>
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
        <div style={{ padding: '1.5rem' }}>
          <div style={{ 
            overflowX: 'auto', 
            width: '100%',
            WebkitOverflowScrolling: 'touch'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              minWidth: '600px'
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
                    fontSize: '0.9rem'
                  }}>Feature</th>
                  <th style={{ 
                    textAlign: 'center', 
                    padding: '1rem',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>Basic</th>
                  <th style={{ 
                    textAlign: 'center', 
                    padding: '1rem',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>Professional</th>
                  <th style={{ 
                    textAlign: 'center', 
                    padding: '1rem',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>Premium</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.85rem' }}>
                {[
                  ['Profile Views/Month', '5,000', '25,000', 'Unlimited'],
                  ['Service Categories', '5', 'Unlimited', 'Unlimited'],
                  ['Photo Gallery', '10', '20', 'Unlimited'],
                  ['Search Ranking', 'Standard', 'Featured', 'Top'],
                  ['Support', 'Email', 'Priority', '24/7'],
                  ['Custom Branding', '❌', '❌', '✓'],
                  ['API Access', '❌', '❌', '✓'],
                  ['Verified Badge', '❌', '✓', '✓'],
                  ['Booking Integration', '❌', '❌', '✓']
                ].map(([feature, ...values], index) => (
                  <tr 
                    key={feature} 
                    style={{ 
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: index % 2 === 0 ? 'var(--card-bg)' : 'var(--background)'
                    }}
                  >
                    <td style={{ 
                      padding: '1rem',
                      fontWeight: '500'
                    }}>{feature}</td>
                    {values.map((value, i) => (
                      <td 
                        key={i}
                        style={{ 
                          textAlign: 'center', 
                          padding: '1rem',
                          fontWeight: value === '✓' ? '600' : '500',
                          color: value === '✓' ? '#10b981' : value === '❌' ? '#ef4444' : 'inherit',
                          fontSize: value === '✓' || value === '❌' ? '1rem' : '0.85rem'
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

      {/* Media Queries for Larger Screens */}
      <style>
        {`
          @media (min-width: 768px) {
            .subscription-container {
              padding: 2rem 1.5rem !important;
              gap: 2.5rem !important;
            }
            
            .plans-container {
              display: grid !important;
              grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)) !important;
              gap: 2rem !important;
            }
            
            .current-usage-container {
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
              gap: 2rem !important;
              padding: 2rem !important;
            }
            
            .header-title {
              font-size: 2.5rem !important;
            }
            
            .header-subtitle {
              font-size: 1.125rem !important;
            }
          }
          
          @media (min-width: 1024px) {
            .subscription-container {
              padding: 3rem 2rem !important;
              gap: 3rem !important;
            }
            
            .plans-container {
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 2.5rem !important;
            }
            
            .current-usage-container {
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 3rem !important;
              padding: 3rem !important;
            }
          }
        `}
      </style>

      {/* Apply media query classes */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.querySelector('.subscription-container').classList.add('subscription-container');
          document.querySelector('.plans-container').classList.add('plans-container');
          document.querySelector('.current-usage-container').classList.add('current-usage-container');
          document.querySelector('.header-title').classList.add('header-title');
          document.querySelector('.header-subtitle').classList.add('header-subtitle');
        `
      }} />
    </div>
  );
};

export default Subscription;