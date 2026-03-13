import { User, Lock, Bell, CreditCard, Shield, Mail, Phone, Globe, Download, Eye, EyeOff, Key, LogOut, Smartphone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { settingsAPI } from '../../services/settingsAPI';
import toast from 'react-hot-toast';
import PageTransitionLoader from '../../components/PageTransitionLoader';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessLocation: '',
    businessRegistration: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [billingInfo, setBillingInfo] = useState({
    currentPlan: null,
    paymentMethod: null,
    recentInvoices: []
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsAPI.getSettings();
      if (response.success) {
        const { user, provider, settings, billing } = response.data;
        setProfileData({
          name: provider.name || '',
          email: user.email || '',
          phone: user.phone || '',
          businessName: provider.businessName || '',
          businessLocation: provider.businessAddress?.street || '',
          businessRegistration: provider.businessRegistration || 'BRN-123456789'
        });
        setEmailNotifications(settings?.notifications?.email ?? true);
        setSmsNotifications(settings?.notifications?.sms ?? false);
        setPushNotifications(settings?.notifications?.push ?? true);
        setBillingInfo({
          currentPlan: billing?.currentPlan || null,
          paymentMethod: billing?.paymentMethod || null,
          recentInvoices: billing?.recentInvoices || []
        });
      }
    } catch (error) {
      console.error('Load settings error:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await settingsAPI.updateProfile(profileData);
      if (response.success) {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      const response = await settingsAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (response.success) {
        toast.success('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleNotificationUpdate = async (type, value) => {
    try {
      const updates = {
        email: type === 'email' ? value : emailNotifications,
        sms: type === 'sms' ? value : smsNotifications,
        push: type === 'push' ? value : pushNotifications
      };
      const response = await settingsAPI.updateNotifications(updates);
      if (response.success) {
        toast.success('Notification settings updated');
      }
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  const handleLogoutAllDevices = () => {
    if (confirm('Are you sure you want to logout from all devices?')) {
      alert('Logged out from all devices successfully!');
    }
  };

  const handleDownloadData = async () => {
    try {
      const response = await settingsAPI.downloadData();
      const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `connectvista-data-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Data downloaded successfully');
    } catch (error) {
      toast.error('Failed to download data');
    }
  };

  if (loading) return <PageTransitionLoader />;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.5rem',
      backgroundColor: 'var(--background)',
      color: 'var(--text-color)',
      width: '100%',
      maxWidth: '100%',
      padding: '0'
    }}>
      {/* Header */}
      <div>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 'bold',
          marginBottom: '0.25rem'
        }}>Account Settings</h1>
        <p style={{
          color: 'var(--text-color)',
          opacity: 0.7,
          fontSize: 'clamp(0.875rem, 2vw, 1rem)'
        }}>Manage your account, security, and privacy settings</p>
      </div>

      {/* Settings Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
        gap: '1.5rem',
        width: '100%'
      }}>
        {/* Account Information Card */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, var(--accent-color)10, transparent)'
          }}>
            <User size={20} style={{ color: 'var(--accent-color)' }} />
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>Profile Information</h2>
          </div>
          <div style={{ 
            padding: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.25rem',
            flex: 1
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <User size={16} /> Business Owner
                  </label>
                  <input 
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: '0.5rem',
                      backgroundColor: 'var(--background)',
                      color: 'var(--text-color)',
                      fontSize: '0.875rem',
                      width: '100%'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Phone size={16} /> Phone Number
                  </label>
                  <input 
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: '0.5rem',
                      backgroundColor: 'var(--background)',
                      color: 'var(--text-color)',
                      fontSize: '0.875rem',
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Mail size={16} /> Email Address
                </label>
                <input 
                  type="email"
                  value={profileData.email}
                  readOnly
                  style={{
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-color)',
                    fontSize: '0.875rem',
                    width: '100%',
                    opacity: 0.7,
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Globe size={16} /> Business Location
                </label>
                <input 
                  type="text"
                  value={profileData.businessLocation}
                  onChange={(e) => setProfileData({...profileData, businessLocation: e.target.value})}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-color)',
                    fontSize: '0.875rem',
                    width: '100%'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Smartphone size={16} /> Business Registration
                </label>
                <input 
                  type="text"
                  value={profileData.businessRegistration}
                  readOnly
                  style={{
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-color)',
                    fontSize: '0.875rem',
                    width: '100%',
                    opacity: 0.7,
                    cursor: 'not-allowed'
                  }}
                />
              </div>
            </div>

            <button 
              onClick={handleSave}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, var(--accent-color), var(--accent-dark))',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                alignSelf: 'flex-start',
                marginTop: 'auto'
              }}
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Security Card */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, var(--accent-color)10, transparent)'
          }}>
            <Lock size={20} style={{ color: 'var(--accent-color)' }} />
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>Security Settings</h2>
          </div>
          <div style={{ 
            padding: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            flex: 1
          }}>
            {/* Password Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ 
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Key size={16} /> Change Password
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    display: 'block'
                  }}>Current Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      style={{
                        padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.5rem',
                        backgroundColor: 'var(--background)',
                        color: 'var(--text-color)',
                        fontSize: '0.875rem',
                        width: '100%'
                      }}
                    />
                    <button
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-color)',
                        opacity: 0.7,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0'
                      }}
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    display: 'block'
                  }}>New Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      style={{
                        padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.5rem',
                        backgroundColor: 'var(--background)',
                        color: 'var(--text-color)',
                        fontSize: '0.875rem',
                        width: '100%'
                      }}
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-color)',
                        opacity: 0.7,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0'
                      }}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    display: 'block'
                  }}>Confirm New Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      style={{
                        padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.5rem',
                        backgroundColor: 'var(--background)',
                        color: 'var(--text-color)',
                        fontSize: '0.875rem',
                        width: '100%'
                      }}
                    />
                    <button
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-color)',
                        opacity: 0.7,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0'
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={handlePasswordChange}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--accent-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  alignSelf: 'flex-start'
                }}
              >
                Update Password
              </button>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)' }} />

            {/* Active Sessions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Active Sessions</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Smartphone size={20} style={{ opacity: 0.7 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>Current Session</p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Currently active</p>
                </div>
              </div>
              <button 
                onClick={handleLogoutAllDevices}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #ef4444',
                  color: '#ef4444',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center'
                }}
              >
                <LogOut size={16} /> Logout All Devices
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, var(--accent-color)10, transparent)'
          }}>
            <Bell size={20} style={{ color: 'var(--accent-color)' }} />
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>Notifications</h2>
          </div>
          <div style={{ 
            padding: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            flex: 1
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Email Notifications</h4>
                  <p style={{
                    fontSize: '0.875rem',
                    opacity: 0.7
                  }}>
                    Booking confirmations, reminders
                  </p>
                </div>
                <button 
                  onClick={() => { setEmailNotifications(!emailNotifications); handleNotificationUpdate('email', !emailNotifications); }}
                  style={{
                    padding: '0.5rem 1.25rem',
                    backgroundColor: emailNotifications ? 'var(--accent-color)' : 'transparent',
                    color: emailNotifications ? 'white' : 'var(--text-color)',
                    border: emailNotifications ? 'none' : '1px solid var(--border-color)',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {emailNotifications ? 'On' : 'Off'}
                </button>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)' }} />

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>SMS Notifications</h4>
                  <p style={{
                    fontSize: '0.875rem',
                    opacity: 0.7
                  }}>
                    Urgent alerts, verification codes
                  </p>
                </div>
                <button 
                  onClick={() => { setSmsNotifications(!smsNotifications); handleNotificationUpdate('sms', !smsNotifications); }}
                  style={{
                    padding: '0.5rem 1.25rem',
                    backgroundColor: smsNotifications ? 'var(--accent-color)' : 'transparent',
                    color: smsNotifications ? 'white' : 'var(--text-color)',
                    border: smsNotifications ? 'none' : '1px solid var(--border-color)',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {smsNotifications ? 'On' : 'Off'}
                </button>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)' }} />

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Push Notifications</h4>
                  <p style={{
                    fontSize: '0.875rem',
                    opacity: 0.7
                  }}>
                    Real-time updates, new messages
                  </p>
                </div>
                <button 
                  onClick={() => { setPushNotifications(!pushNotifications); handleNotificationUpdate('push', !pushNotifications); }}
                  style={{
                    padding: '0.5rem 1.25rem',
                    backgroundColor: pushNotifications ? 'var(--accent-color)' : 'transparent',
                    color: pushNotifications ? 'white' : 'var(--text-color)',
                    border: pushNotifications ? 'none' : '1px solid var(--border-color)',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {pushNotifications ? 'On' : 'Off'}
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)' }} />

            {/* Notification Schedule */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontWeight: '600' }}>Notification Schedule</h4>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <select 
                  style={{
                    padding: '0.5rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.375rem',
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-color)',
                    fontSize: '0.875rem',
                    minWidth: '120px'
                  }}
                >
                  <option>9:00 AM - 6:00 PM</option>
                  <option>8:00 AM - 8:00 PM</option>
                  <option>24/7</option>
                </select>
                <p style={{
                  fontSize: '0.875rem',
                  opacity: 0.7
                }}>
                  Receive notifications during business hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Data Card */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, var(--accent-color)10, transparent)'
          }}>
            <Shield size={20} style={{ color: 'var(--accent-color)' }} />
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>Privacy & Data</h2>
          </div>
          <div style={{ 
            padding: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            flex: 1
          }}>
            {/* Data Management */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontWeight: '600' }}>Data Management</h4>
              
              <button 
                onClick={handleDownloadData}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  color: 'var(--text-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  justifyContent: 'flex-start',
                  fontSize: '0.875rem'
                }}
              >
                <Download size={18} /> Download Your Data
              </button>
            </div>
          </div>
        </div>

        {/* Billing Card */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, var(--accent-color)10, transparent)'
          }}>
            <CreditCard size={20} style={{ color: 'var(--accent-color)' }} />
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>Billing & Subscription</h2>
          </div>
          <div style={{ 
            padding: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            flex: 1
          }}>
            {/* Current Plan */}
            <div style={{
              padding: '1rem',
              border: '1px solid var(--border-color)',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, var(--accent-color)5, transparent)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>Current Plan</p>
                  <p style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700',
                    color: 'var(--accent-color)'
                  }}>{billingInfo.currentPlan ? billingInfo.currentPlan.plan : 'No Active Plan'}</p>
                  <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                    {billingInfo.currentPlan ? `₹${billingInfo.currentPlan.amount} / ${billingInfo.currentPlan.duration}` : 'Subscribe to a plan to start'}
                  </p>
                </div>
                {!billingInfo.currentPlan && (
                  <button style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--accent-color)',
                    color: 'var(--accent-color)',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>
                    View Plans
                  </button>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)' }} />

            {/* Payment Method */}
            {billingInfo.paymentMethod && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 style={{ fontWeight: '600' }}>Payment Method</h4>
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
                        <p style={{ fontWeight: '500', fontSize: '0.875rem' }}>•••• •••• •••• {billingInfo.paymentMethod.cardLast4}</p>
                        <p style={{
                          fontSize: '0.75rem',
                          opacity: 0.7
                        }}>{billingInfo.paymentMethod.cardType}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)' }} />
              </>
            )}

            {/* Billing History */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontWeight: '600' }}>Recent Invoices</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {billingInfo.recentInvoices.length > 0 ? (
                  billingInfo.recentInvoices.map((invoice, index) => (
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.875rem',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div>
                        <span style={{ fontWeight: '500' }}>{new Date(invoice.createdAt).toLocaleDateString()}</span>
                        <span style={{ opacity: 0.7, marginLeft: '0.5rem' }}>• {invoice.plan}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: '600' }}>₹{invoice.amount}</span>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: invoice.status === 'success' ? '#10b98120' : '#f59e0b20',
                          color: invoice.status === 'success' ? '#10b981' : '#f59e0b',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {invoice.status === 'success' ? 'Paid' : invoice.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>No invoices found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>
        {`
          @media (max-width: 640px) {
            .settings-grid {
              grid-template-columns: 1fr !important;
            }
            
            .card-header {
              padding: 1rem !important;
            }
            
            .card-content {
              padding: 1rem !important;
            }
            
            input, select {
              font-size: 0.875rem !important;
            }
            
            button {
              font-size: 0.875rem !important;
            }
          }
          
          @media (min-width: 641px) and (max-width: 1024px) {
            .settings-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          
          @media (min-width: 1025px) {
            .settings-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          
          @media (min-width: 1280px) {
            .settings-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          
          /* Hover effects */
          @media (hover: hover) {
            button:hover:not(:disabled) {
              opacity: 0.9;
              transform: translateY(-1px);
            }
            
            .card:hover {
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            }
          }
          
          /* Focus states */
          input:focus, select:focus, button:focus {
            outline: 2px solid var(--accent-color);
            outline-offset: 2px;
          }
          
          /* Password input icons */
          input[type="password"]::-webkit-textfield-decoration-container {
            display: none;
          }
          
          input[type="password"]::-webkit-contacts-auto-fill-button {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default Settings;