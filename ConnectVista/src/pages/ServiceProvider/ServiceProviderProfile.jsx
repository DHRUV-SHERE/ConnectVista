import { useState } from 'react';
import { Upload, Plus, X, Clock } from 'lucide-react';

const Profile = () => {
  const [services, setServices] = useState([
    'Leak Repairs',
    'Pipe Installation',
    'Drain Cleaning',
  ]);
  const [newService, setNewService] = useState('');

  const handleSave = () => {
    // Show success message
    alert('Profile updated! Your business profile has been saved successfully.');
  };

  const addService = () => {
    if (newService.trim()) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
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
      }} className="md:flex-row md:items-center md:justify-between">
        <div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            marginBottom: '0.25rem'
          }}>Business Profile</h1>
          <p style={{
            color: 'var(--text-color)',
            opacity: 0.7
          }}>Manage your business information and services</p>
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
            fontWeight: '500'
          }}
        >
          Save Changes
        </button>
      </div>

      {/* Basic Information */}
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
          }}>Basic Information</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Business Name</label>
            <input 
              type="text"
              defaultValue="QuickFix Plumbing"
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
            }}>Category</label>
            <input 
              type="text"
              defaultValue="Plumbing Services"
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
            }}>Description</label>
            <textarea 
              rows={4}
              defaultValue="Professional plumbing services with over 15 years of experience. We specialize in residential and commercial plumbing."
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                backgroundColor: 'var(--background)',
                color: 'var(--text-color)',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>Phone</label>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>Email</label>
              <input 
                type="email"
                defaultValue="contact@quickfixplumbing.com"
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
            }}>Address</label>
            <input 
              type="text"
              defaultValue="123 Service Street, Business City, ST 12345"
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
      </div>

      {/* Services Offered */}
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
          }}>Services Offered</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {services.map((service, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--accent-color)',
                  opacity: 0.1,
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  color: 'var(--accent-color)'
                }}
              >
                {service}
                <button
                  onClick={() => removeService(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'inherit',
                    opacity: 0.7
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Add a service..."
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addService()}
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                backgroundColor: 'var(--background)',
                color: 'var(--text-color)'
              }}
            />
            <button 
              onClick={addService}
              style={{
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
              }}
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Business Images */}
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
          }}>Business Images</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                aspectRatio: '1',
                backgroundColor: 'var(--border-color)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }} className="image-upload">
                <Upload size={32} style={{ opacity: 0.5 }} />
                <button style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  padding: '0.25rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  opacity: 0,
                  transition: 'opacity 0.2s'
                }} className="delete-btn">
                  <X size={16} />
                </button>
              </div>
            ))}
            <button style={{
              aspectRatio: '1',
              border: '2px dashed var(--border-color)',
              borderRadius: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }} className="add-image-btn">
              <Plus size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>Add Image</span>
            </button>
          </div>
          <p style={{
            fontSize: '0.75rem',
            opacity: 0.7
          }}>
            Upload up to 10 images. Recommended size: 800x800px
          </p>
        </div>
      </div>

      {/* Working Hours */}
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
          <Clock size={20} />
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>Working Hours</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ].map((day) => (
            <div key={day} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ width: '8rem' }}>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>{day}</p>
              </div>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '200px'
              }}>
                <input 
                  type="time" 
                  defaultValue="08:00" 
                  style={{
                    width: '8rem',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.375rem',
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-color)'
                  }}
                />
                <span style={{ opacity: 0.7 }}>to</span>
                <input 
                  type="time" 
                  defaultValue="18:00" 
                  style={{
                    width: '8rem',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.375rem',
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-color)'
                  }}
                />
              </div>
              <button style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}>
                Closed
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
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
          }}>Pricing Information</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Starting Price</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ opacity: 0.7 }}>$</span>
              <input 
                type="number" 
                defaultValue="50" 
                style={{
                  width: '8rem',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.375rem',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-color)'
                }}
              />
              <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>per service</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Emergency Service Fee</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ opacity: 0.7 }}>$</span>
              <input 
                type="number" 
                defaultValue="100" 
                style={{
                  width: '8rem',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.375rem',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-color)'
                }}
              />
              <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>additional</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .image-upload:hover .delete-btn {
          opacity: 1 !important;
        }
        
        .add-image-btn:hover {
          background-color: var(--border-color) !important;
        }
        
        @media (max-width: 768px) {
          .md\\:flex-row {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;