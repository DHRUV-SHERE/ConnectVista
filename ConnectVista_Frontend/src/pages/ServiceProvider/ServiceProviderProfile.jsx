import { useState, useCallback, memo } from 'react';
import { Upload, Plus, X, Clock } from 'lucide-react';

// Memoized components for better performance
const ServiceTag = memo(({ service, onRemove }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.25rem',
      backgroundColor: 'var(--accent-color)',
      opacity: 0.1,
      borderRadius: '9999px',
      fontSize: '1rem',
      color: 'var(--accent-color)'
    }}
  >
    {service}
    <button
      onClick={onRemove}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'inherit',
        opacity: 0.7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      aria-label={`Remove ${service}`}
    >
      <X size={14} />
    </button>
  </div>
));

ServiceTag.displayName = 'ServiceTag';

const ImageUpload = memo(({ index, onDelete }) => (
  <div
    key={index}
    style={{
      aspectRatio: '1',
      backgroundColor: 'var(--border-color)',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      transition: 'transform 0.2s'
    }}
    className="image-upload"
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    <Upload size={40} style={{ opacity: 0.5 }} />
    <button
      onClick={onDelete}
      style={{
        position: 'absolute',
        top: '0.75rem',
        right: '0.75rem',
        padding: '0.375rem',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        opacity: 0,
        transition: 'opacity 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      className="delete-btn"
      aria-label="Delete image"
    >
      <X size={18} />
    </button>
  </div>
));

ImageUpload.displayName = 'ImageUpload';

const WorkingHoursRow = memo(({ day }) => (
  <div
    key={day}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      flexWrap: 'wrap',
      padding: '1rem',
      backgroundColor: 'var(--background)',
      borderRadius: '0.5rem',
      transition: 'background-color 0.2s'
    }}
    className="working-hours-row"
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
  >
    <div style={{ width: '9rem', minWidth: '9rem' }}>
      <p style={{
        fontSize: '1rem',
        fontWeight: '500',
        margin: 0
      }}>{day}</p>
    </div>
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'wrap',
      minWidth: 'min(300px, 100%)'
    }}>
      <input 
        type="time" 
        defaultValue="08:00" 
        style={{
          width: '10rem',
          padding: '0.75rem 1rem',
          border: '1px solid var(--border-color)',
          borderRadius: '0.5rem',
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-color)',
          fontSize: '1rem'
        }}
      />
      <span style={{ opacity: 0.7, fontSize: '1rem' }}>to</span>
      <input 
        type="time" 
        defaultValue="18:00" 
        style={{
          width: '10rem',
          padding: '0.75rem 1rem',
          border: '1px solid var(--border-color)',
          borderRadius: '0.5rem',
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-color)',
          fontSize: '1rem'
        }}
      />
    </div>
    <button
      style={{
        padding: '0.75rem 1.5rem',
        backgroundColor: 'transparent',
        border: '1px solid var(--border-color)',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '1rem',
        minWidth: '8rem',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--accent-color)';
        e.currentTarget.style.color = 'white';
        e.currentTarget.style.borderColor = 'var(--accent-color)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = 'var(--text-color)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      Closed
    </button>
  </div>
));

WorkingHoursRow.displayName = 'WorkingHoursRow';

const ServiceProviderProfile = () => {
  const [services, setServices] = useState([
    'Leak Repairs',
    'Pipe Installation',
    'Drain Cleaning',
  ]);
  const [newService, setNewService] = useState('');

  const handleSave = useCallback(() => {
    alert('Profile updated! Your business profile has been saved successfully.');
  }, []);

  const addService = useCallback(() => {
    if (newService.trim()) {
      setServices(prev => [...prev, newService.trim()]);
      setNewService('');
    }
  }, [newService]);

  const removeService = useCallback((index) => {
    setServices(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addService();
    }
  }, [addService]);

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '2rem',
        backgroundColor: 'var(--background)',
        color: 'var(--text-color)',
        padding: '1rem',
        margin: '0 auto',
        width: '100%'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems: 'flex-start'
      }} className="responsive-header">
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0 0 0.5rem 0',
            lineHeight: '1.2'
          }}>Business Profile</h1>
          <p style={{
            color: 'var(--text-color)',
            opacity: 0.8,
            fontSize: '1.125rem',
            margin: 0,
            lineHeight: '1.5'
          }}>Manage your business information and services</p>
        </div>
        <button 
          onClick={handleSave}
          style={{
            padding: '0.875rem 1.75rem',
            backgroundColor: 'var(--accent-color)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'transform 0.2s, background-color 0.2s',
            minWidth: '10rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.backgroundColor = 'var(--accent-color-dark)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.backgroundColor = 'var(--accent-color)';
          }}
        >
          Save Changes
        </button>
      </div>

      {/* Basic Information */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.75rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.75rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: 0
          }}>Basic Information</h2>
        </div>
        <div style={{ 
          padding: '1.75rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem' 
        }}>
          {/* Business Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{
              fontSize: '1rem',
              fontWeight: '500'
            }}>Business Name</label>
            <input 
              type="text"
              defaultValue="QuickFix Plumbing"
              style={{
                padding: '0.875rem 1rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--background)',
                color: 'var(--text-color)',
                fontSize: '1rem',
                width: '100%',
                maxWidth: '500px'
              }}
            />
          </div>

          {/* Category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{
              fontSize: '1rem',
              fontWeight: '500'
            }}>Category</label>
            <input 
              type="text"
              defaultValue="Plumbing Services"
              style={{
                padding: '0.875rem 1rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--background)',
                color: 'var(--text-color)',
                fontSize: '1rem',
                width: '100%',
                maxWidth: '500px'
              }}
            />
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{
              fontSize: '1rem',
              fontWeight: '500'
            }}>Description</label>
            <textarea 
              rows={4}
              defaultValue="Professional plumbing services with over 15 years of experience. We specialize in residential and commercial plumbing."
              style={{
                padding: '0.875rem 1rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--background)',
                color: 'var(--text-color)',
                resize: 'vertical',
                fontSize: '1rem',
                width: '100%'
              }}
            />
          </div>

          {/* Contact Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{
                fontSize: '1rem',
                fontWeight: '500'
              }}>Phone</label>
              <input 
                type="tel"
                defaultValue="+1 (555) 123-4567"
                style={{
                  padding: '0.875rem 1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-color)',
                  fontSize: '1rem',
                  width: '100%'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{
                fontSize: '1rem',
                fontWeight: '500'
              }}>Email</label>
              <input 
                type="email"
                defaultValue="contact@quickfixplumbing.com"
                style={{
                  padding: '0.875rem 1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-color)',
                  fontSize: '1rem',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Address */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{
              fontSize: '1rem',
              fontWeight: '500'
            }}>Address</label>
            <input 
              type="text"
              defaultValue="123 Service Street, Business City, ST 12345"
              style={{
                padding: '0.875rem 1rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--background)',
                color: 'var(--text-color)',
                fontSize: '1rem',
                width: '100%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Services Offered */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.75rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.75rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: 0
          }}>Services Offered</h2>
        </div>
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            {services.map((service, index) => (
              <ServiceTag
                key={index}
                service={service}
                onRemove={() => removeService(index)}
              />
            ))}
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '0.75rem',
            flexDirection: 'row',
            alignItems: 'center'
          }} className="add-service-container">
            <input
              type="text"
              placeholder="Add a service..."
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                flex: 1,
                padding: '0.875rem 1rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--background)',
                color: 'var(--text-color)',
                fontSize: '1rem',
                minWidth: '200px'
              }}
            />
            <button 
              onClick={addService}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
                backgroundColor: 'var(--accent-color)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                whiteSpace: 'nowrap',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Plus size={20} />
              Add Service
            </button>
          </div>
        </div>
      </div>

      {/* Business Images */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.75rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.75rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: 0
          }}>Business Images</h2>
        </div>
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))',
            gap: '1.5rem'
          }}>
            {[1, 2, 3].map((i) => (
              <ImageUpload
                key={i}
                index={i}
                onDelete={() => console.log(`Delete image ${i}`)}
              />
            ))}
            <button
              style={{
                aspectRatio: '1',
                border: '2px dashed var(--border-color)',
                borderRadius: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: '1rem'
              }}
              className="add-image-btn"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                e.currentTarget.style.borderColor = 'var(--accent-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <Plus size={40} style={{ opacity: 0.5, marginBottom: '0.75rem' }} />
              <span style={{ fontSize: '1rem', opacity: 0.8 }}>Add Image</span>
            </button>
          </div>
          <p style={{
            fontSize: '0.9375rem',
            opacity: 0.8,
            margin: 0,
            lineHeight: '1.5'
          }}>
            Upload up to 10 images. Recommended size: 800x800px
          </p>
        </div>
      </div>

      {/* Working Hours */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.75rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.75rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Clock size={24} />
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: 0
          }}>Working Hours</h2>
        </div>
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {daysOfWeek.map((day) => (
            <WorkingHoursRow key={day} day={day} />
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.75rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.75rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: 0
          }}>Pricing Information</h2>
        </div>
        <div style={{ 
          padding: '1.75rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem' 
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: '2rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{
                fontSize: '1rem',
                fontWeight: '500'
              }}>Starting Price</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ opacity: 0.8, fontSize: '1.125rem' }}>$</span>
                <input 
                  type="number" 
                  defaultValue="50" 
                  style={{
                    width: '10rem',
                    padding: '0.875rem 1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-color)',
                    fontSize: '1rem'
                  }}
                />
                <span style={{ fontSize: '1rem', opacity: 0.8 }}>per service</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{
                fontSize: '1rem',
                fontWeight: '500'
              }}>Emergency Service Fee</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ opacity: 0.8, fontSize: '1.125rem' }}>$</span>
                <input 
                  type="number" 
                  defaultValue="100" 
                  style={{
                    width: '10rem',
                    padding: '0.875rem 1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-color)',
                    fontSize: '1rem'
                  }}
                />
                <span style={{ fontSize: '1rem', opacity: 0.8 }}>additional</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive CSS */}
      <style jsx = "true">{`
        @media (max-width: 768px) {
          .responsive-header {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          
          .responsive-header button {
            width: 100%;
            margin-top: 1rem;
          }
          
          .add-service-container {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          
          .working-hours-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .working-hours-row > div:first-child {
            width: 100%;
          }
          
          .working-hours-row button {
            width: 100%;
          }
        }
        
        @media (max-width: 480px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
          
          .working-hours-row > div:nth-child(2) {
            flex-direction: column;
            align-items: stretch;
          }
          
          .working-hours-row input[type="time"] {
            width: 100% !important;
          }
        }
        
        .image-upload:hover .delete-btn {
          opacity: 1 !important;
        }
        
        .add-image-btn:hover {
          transform: scale(1.02);
        }
        
        input, textarea, button {
          font-family: inherit;
        }
        
        input:focus, textarea:focus, button:focus {
          outline: 2px solid var(--accent-color);
          outline-offset: 2px;
        }
        
        button:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default ServiceProviderProfile;