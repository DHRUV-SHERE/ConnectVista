import { User, Lock, Bell, CreditCard, Shield } from 'lucide-react';

const Settings = () => {
  const handleSave = () => {
    alert('Settings saved! Your account settings have been updated.');
  };

  const handlePasswordChange = () => {
    alert('Password updated! Your password has been changed successfully.');
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
        }}>Settings</h1>
        <p style={{
          color: 'var(--text-color)',
          opacity: 0.7
        }}>Manage your account settings and preferences</p>
      </div>

      {/* Account Information */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <User size={20} />
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>Account Information</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>Business Owner Name</label>
              <input 
                type="text"
                defaultValue="John Smith"
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.375rem',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-color)'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>Phone Number</label>
              <input 
                type="tel"
                defaultValue="+1 (555) 123-4567"
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.375rem',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-color)'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Email Address</label>
            <input 
              type="email"
              defaultValue="john@quickfixplumbing.com"
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                backgroundColor: 'var(--background)',
                color: 'var(--text-color)'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Business Registration Number</label>
            <input 
              type="text"
              defaultValue="BRN-123456789"
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                backgroundColor: 'var(--background)',
                color: 'var(--text-color)'
              }}
            />
          </div>

          <button 
            onClick={handleSave}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: '500',
              alignSelf: 'flex-start'
            }}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Password */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Lock size={20} />
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>Password & Security</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Current Password</label>
            <input 
              type="password"
              placeholder="Enter current password"
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                backgroundColor: 'var(--background)',
                color: 'var(--text-color)'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>New Password</label>
            <input 
              type="password"
              placeholder="Enter new password"
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                backgroundColor: 'var(--background)',
                color: 'var(--text-color)'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Confirm New Password</label>
            <input 
              type="password"
              placeholder="Confirm new password"
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                backgroundColor: 'var(--background)',
                color: 'var(--text-color)'
              }}
            />
          </div>

          <button 
            onClick={handlePasswordChange}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: '500',
              alignSelf: 'flex-start'
            }}
          >
            Change Password
          </button>

          <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontWeight: '500' }}>Two-Factor Authentication</h4>
            <p style={{
              fontSize: '0.875rem',
              opacity: 0.7
            }}>
              Add an extra layer of security to your account
            </p>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              color: 'var(--text-color)',
              alignSelf: 'flex-start'
            }}>
              Enable 2FA
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Bell size={20} />
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>Notification Preferences</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <p style={{ 
                fontWeight: '500',
                fontSize: '0.875rem'
              }}>Email Notifications</p>
              <p style={{ 
                fontSize: '0.75rem',
                opacity: 0.7
              }}>
                Receive notifications via email
              </p>
            </div>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              opacity: 0.9
            }}>
              Enabled
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)' }} />

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <p style={{ 
                fontWeight: '500',
                fontSize: '0.875rem'
              }}>SMS Notifications</p>
              <p style={{ 
                fontSize: '0.75rem',
                opacity: 0.7
              }}>
                Receive notifications via text message
              </p>
            </div>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: 'var(--text-color)'
            }}>
              Disabled
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)' }} />

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <p style={{ 
                fontWeight: '500',
                fontSize: '0.875rem'
              }}>Push Notifications</p>
              <p style={{ 
                fontSize: '0.75rem',
                opacity: 0.7
              }}>
                Receive notifications in your browser
              </p>
            </div>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              opacity: 0.9
            }}>
              Enabled
            </button>
          </div>
        </div>
      </div>

      {/* Billing */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CreditCard size={20} />
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>Billing Information</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            border: '1px solid var(--border-color)',
            borderRadius: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'var(--border-color)',
                borderRadius: '0.5rem'
              }}>
                <CreditCard size={24} />
              </div>
              <div>
                <p style={{ fontWeight: '500' }}>•••• •••• •••• 4242</p>
                <p style={{
                  fontSize: '0.875rem',
                  opacity: 0.7
                }}>Expires 12/25</p>
              </div>
            </div>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: 'var(--text-color)'
            }}>
              Update
            </button>
          </div>

          <button style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            color: 'var(--text-color)',
            alignSelf: 'flex-start'
          }}>
            Add Payment Method
          </button>

          <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ fontWeight: '500' }}>Billing History</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.875rem',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }} className="billing-item">
                <span>Jan 2024 - Professional Plan</span>
                <span style={{ fontWeight: '500' }}>$29.00</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.875rem',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }} className="billing-item">
                <span>Dec 2023 - Professional Plan</span>
                <span style={{ fontWeight: '500' }}>$29.00</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.875rem',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }} className="billing-item">
                <span>Nov 2023 - Professional Plan</span>
                <span style={{ fontWeight: '500' }}>$29.00</span>
              </div>
            </div>
            <button style={{
              width: '100%',
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: 'var(--text-color)'
            }}>
              View All Invoices
            </button>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Shield size={20} />
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>Privacy & Data</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ fontWeight: '500' }}>Profile Visibility</h4>
            <p style={{
              fontSize: '0.875rem',
              opacity: 0.7
            }}>
              Control who can see your business profile
            </p>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              color: 'var(--text-color)',
              alignSelf: 'flex-start'
            }}>
              Manage Visibility
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ fontWeight: '500' }}>Download Your Data</h4>
            <p style={{
              fontSize: '0.875rem',
              opacity: 0.7
            }}>
              Export all your business data and information
            </p>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              color: 'var(--text-color)',
              alignSelf: 'flex-start'
            }}>
              Request Download
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ fontWeight: '500', color: '#ef4444' }}>Delete Account</h4>
            <p style={{
              fontSize: '0.875rem',
              opacity: 0.7
            }}>
              Permanently delete your account and all associated data
            </p>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: '500',
              alignSelf: 'flex-start'
            }}>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .billing-item:hover {
          background-color: var(--border-color) !important;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default Settings;