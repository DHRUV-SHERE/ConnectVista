import { useState, useEffect, useCallback, memo } from "react";
import { Upload, Plus, X, Clock, Save, Loader2, Wrench, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import profileService from "../../services/profileService";
import { serviceAPI } from "../../services/serviceAPI";
import toast from "react-hot-toast";
import resources from "../../resources";
import SubscriptionBadge from "../../components/SubscriptionBadge";
import GoogleAddressSearch from "../../components/Common/GoogleAddressSearch";

// Memoized components for better performance
const ServiceTag = memo(({ service, onRemove }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.75rem 1.25rem",
      background: "var(--btn-bg)",
      borderRadius: "9999px",
      fontSize: "1rem",
      color: "white",
      boxShadow: "var(--btn-hover)",
    }}
  >
    {service}
    <button
      onClick={onRemove}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "white",
        opacity: 0.7,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.2s",
      }}
      aria-label={`Remove ${service}`}
    >
      <X size={14} />
    </button>
  </div>
));

ServiceTag.displayName = "ServiceTag";

const ImageUpload = memo(({ image, index, onDelete, onView }) => (
  <div
    style={{
      aspectRatio: "1",
      backgroundColor: "var(--border-color)",
      borderRadius: "0.75rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      backgroundImage: image.url ? `url(${image.url})` : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
    className="image-upload hover-glow"
    onClick={() => onView(image.url)}
  >
    {!image.url && <Upload size={40} style={{ opacity: 0.5 }} />}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete(index);
      }}
      style={{
        position: "absolute",
        top: "0.75rem",
        right: "0.75rem",
        padding: "0.375rem",
        background: "linear-gradient(90deg, #EC4899, #DB2777)",
        color: "white",
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        opacity: 0,
        transition: "opacity 0.2s, transform 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 10px rgba(236, 72, 153, 0.3)",
      }}
      className="delete-btn"
      aria-label="Delete image"
    >
      <X size={18} />
    </button>
  </div>
));

ImageUpload.displayName = "ImageUpload";

const WorkingHoursRow = memo(({ day, schedule, onChange }) => {
  const dayKey = day.toLowerCase();
  const daySchedule = schedule[dayKey] || {
    isAvailable: true,
    startTime: "09:00",
    endTime: "18:00",
  };

  return (
    <div
      key={day}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
        flexWrap: "wrap",
        padding: "1rem",
        backgroundColor: "var(--background)",
        borderRadius: "0.5rem",
        transition: "background-color 0.2s",
      }}
      className="working-hours-row"
    >
      <div style={{ width: "9rem", minWidth: "9rem" }}>
        <p
          style={{
            fontSize: "1rem",
            fontWeight: "500",
            margin: 0,
          }}
        >
          {day}
        </p>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          minWidth: "min(300px, 100%)",
        }}
      >
        <input
          type="time"
          value={daySchedule.startTime}
          onChange={(e) => onChange(dayKey, "startTime", e.target.value)}
          disabled={!daySchedule.isAvailable}
          style={{
            width: "10rem",
            padding: "0.75rem 1rem",
            border: "1px solid var(--border-color)",
            borderRadius: "0.5rem",
            backgroundColor: "var(--card-bg)",
            color: "var(--text-color)",
            fontSize: "1rem",
            opacity: daySchedule.isAvailable ? 1 : 0.5,
          }}
        />
        <span
          style={{
            opacity: daySchedule.isAvailable ? 0.7 : 0.3,
            fontSize: "1rem",
          }}
        >
          to
        </span>
        <input
          type="time"
          value={daySchedule.endTime}
          onChange={(e) => onChange(dayKey, "endTime", e.target.value)}
          disabled={!daySchedule.isAvailable}
          style={{
            width: "10rem",
            padding: "0.75rem 1rem",
            border: "1px solid var(--border-color)",
            borderRadius: "0.5rem",
            backgroundColor: "var(--card-bg)",
            color: "var(--text-color)",
            fontSize: "1rem",
            opacity: daySchedule.isAvailable ? 1 : 0.5,
          }}
        />
      </div>
      <button
        type="button"
        onClick={() =>
          onChange(dayKey, "isAvailable", !daySchedule.isAvailable)
        }
        className={`btn-primary schedule-button ${
          daySchedule.isAvailable ? "open" : "closed"
        }`}
        style={{
          padding: "0.75rem 1.5rem",
          background: daySchedule.isAvailable
            ? "var(--btn-bg)"
            : "linear-gradient(90deg, #EC4899, #DB2777)",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
          fontSize: "1rem",
          minWidth: "8rem",
          transition: "all 0.3s ease",
          boxShadow: daySchedule.isAvailable
            ? "var(--btn-hover)"
            : "0 0 15px rgba(236, 72, 153, 0.3)",
        }}
      >
        {daySchedule.isAvailable ? "Mark Closed" : "Mark Open"}
      </button>
    </div>
  );
});

WorkingHoursRow.displayName = "WorkingHoursRow";

const ServiceProviderProfile = () => {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    businessAddress: {
      street: "",
      city: "",
      state: "",
      pinCode: "",
    },
    latitude: null,
    longitude: null,
    experienceYears: 0,
    languages: [],
    startingPrice: 0,
    emergencyCharge: 0,
    extraChargeNote: "",
    services: [],
    schedule: {
      responseTime: "within-2-hours",
      serviceAreaRadius: 10,
      weeklySchedule: {
        monday: { isAvailable: true, startTime: "09:00", endTime: "18:00" },
        tuesday: { isAvailable: true, startTime: "09:00", endTime: "18:00" },
        wednesday: { isAvailable: true, startTime: "09:00", endTime: "18:00" },
        thursday: { isAvailable: true, startTime: "09:00", endTime: "18:00" },
        friday: { isAvailable: true, startTime: "09:00", endTime: "18:00" },
        saturday: { isAvailable: false, startTime: "10:00", endTime: "16:00" },
        sunday: { isAvailable: false, startTime: "10:00", endTime: "14:00" },
      },
      isAvailable: true,
    },
  });

  const [services, setServices] = useState(null);
  const [newService, setNewService] = useState("");
  const [businessImages, setBusinessImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const [profileResponse, serviceResponse] = await Promise.all([
          profileService.getProviderProfile(),
          serviceAPI.getProviderService()
        ]);

        if (profileResponse.success && profileResponse.data) {
          const {
            provider,
            schedule,
          } = profileResponse.data;

          // Set form data
          setFormData({
            businessName: provider.businessName || "",
            description: provider.description || "",
            businessAddress: provider.businessAddress || {
              street: "",
              city: "",
              state: "",
              pinCode: "",
            },
            experienceYears: provider.experienceYears || 0,
            languages: provider.languages || [],
            startingPrice: provider.startingPrice || 0,
            emergencyCharge: provider.emergencyCharge || 0,
            extraChargeNote: provider.extraChargeNote || "",
            services: [],
            schedule: schedule || {
              responseTime: "within-2-hours",
              serviceAreaRadius: 10,
              weeklySchedule: {
                monday: {
                  isAvailable: true,
                  startTime: "09:00",
                  endTime: "18:00",
                },
                tuesday: {
                  isAvailable: true,
                  startTime: "09:00",
                  endTime: "18:00",
                },
                wednesday: {
                  isAvailable: true,
                  startTime: "09:00",
                  endTime: "18:00",
                },
                thursday: {
                  isAvailable: true,
                  startTime: "09:00",
                  endTime: "18:00",
                },
                friday: {
                  isAvailable: true,
                  startTime: "09:00",
                  endTime: "18:00",
                },
                saturday: {
                  isAvailable: false,
                  startTime: "10:00",
                  endTime: "16:00",
                },
                sunday: {
                  isAvailable: false,
                  startTime: "10:00",
                  endTime: "14:00",
                },
              },
              isAvailable: true,
            },
          });

          // Set business images
          if (provider.businessImages) {
            setBusinessImages(provider.businessImages);
          }
        }

        // Set services from ProviderService
        if (serviceResponse.success && serviceResponse.data) {
          setServices(serviceResponse.data);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleAddressChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      businessAddress: {
        ...prev.businessAddress,
        [field]: value,
      },
    }));
  }, []);

  const handleAddressSelect = useCallback((addressData) => {
    setFormData((prev) => ({
      ...prev,
      businessAddress: {
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        pinCode: addressData.pinCode,
      },
      latitude: addressData.latitude,
      longitude: addressData.longitude,
    }));
  }, []);

  const handleScheduleChange = useCallback((day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        weeklySchedule: {
          ...prev.schedule.weeklySchedule,
          [day]: {
            ...prev.schedule.weeklySchedule[day],
            [field]: value,
          },
        },
      },
    }));
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Prepare update data without services (services are managed separately)
      const updateData = {
        ...formData,
        services: [] // Remove services from profile update
      };

      // Update profile
      const response = await profileService.updateProviderProfile(updateData);

      if (response.success) {
        // Upload new images if any
        if (newImages.length > 0) {
          await profileService.uploadBusinessImages(newImages);
          setNewImages([]);
        }

        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error(error.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const addService = useCallback(() => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices((prev) => [...prev, newService.trim()]);
      setNewService("");
    }
  }, [newService, services]);

  const removeService = useCallback((index) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addService();
      }
    },
    [addService]
  );

  const handleImageUpload = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      if (businessImages.length + files.length > 10) {
        toast.error("Maximum 10 images allowed");
        return;
      }

      const newImageFiles = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

      setNewImages((prev) => [...prev, ...files]);
      setBusinessImages((prev) => [...prev, ...newImageFiles]);
    },
    [businessImages.length]
  );

  const handleImageDelete = async (index) => {
    try {
      // If it's a newly uploaded image (not saved yet)
      if (index >= businessImages.length - newImages.length) {
        setBusinessImages((prev) => prev.filter((_, i) => i !== index));
        setNewImages((prev) => {
          const newImagesCopy = [...prev];
          newImagesCopy.splice(
            index - (businessImages.length - newImages.length),
            1
          );
          return newImagesCopy;
        });
      } else {
        // If it's a saved image
        await profileService.deleteBusinessImage(index);
        setBusinessImages((prev) => prev.filter((_, i) => i !== index));
        toast.success("Image deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleImageClick = (url) => {
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--background)",
          gap: "1.5rem",
          padding: "2rem",
        }}
      >
        <img
          src={resources.CustomLoader.src}
          alt={resources.CustomLoader.alt}
          style={{
            width: "80px",
            height: "80px",
            animation: "spin 2s linear infinite",
          }}
        />
        <p
          style={{
            color: "var(--text-color)",
            fontSize: "1.125rem",
            opacity: 0.8,
            margin: 0,
          }}
        >
          Loading profile...
        </p>
        <style jsx="true">{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        backgroundColor: "var(--background)",
        color: "var(--text-color)",
        padding: "1rem",
        margin: "0 auto",
        width: "100%",
        maxWidth: "1200px",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
        className="responsive-header"
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              margin: "0 0 0.5rem 0",
              lineHeight: "1.2",
            }}
          >
            Business Profile
          </h1>
          <p
            style={{
              color: "var(--text-color)",
              opacity: 0.8,
              fontSize: "1.125rem",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            Manage your business information and services
          </p>
        </div>
        <SubscriptionBadge />
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary save-button"
          style={{
            padding: "0.875rem 1.75rem",
            background: "var(--btn-bg)",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: saving ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: "1rem",
            transition: "all 0.3s ease",
            minWidth: "10rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            opacity: saving ? 0.7 : 1,
            boxShadow: "var(--btn-hover)",
          }}
        >
          {saving ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Basic Information */}
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            padding: "1.75rem",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Basic Information
          </h2>
        </div>
        <div
          style={{
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Business Name */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <label
              style={{
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              Business Name *
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) =>
                handleInputChange("businessName", e.target.value)
              }
              required
              style={{
                padding: "0.875rem 1rem",
                border: "1px solid var(--border-color)",
                borderRadius: "0.5rem",
                backgroundColor: "var(--background)",
                color: "var(--text-color)",
                fontSize: "1rem",
                width: "100%",
                maxWidth: "500px",
              }}
            />
          </div>

          {/* Email (read-only) */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <label
              style={{
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              style={{
                padding: "0.875rem 1rem",
                border: "1px solid var(--border-color)",
                borderRadius: "0.5rem",
                backgroundColor: "var(--background)",
                color: "var(--text-color)",
                fontSize: "1rem",
                width: "100%",
                maxWidth: "500px",
                opacity: 0.7,
              }}
            />
          </div>

          {/* Description */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <label
              style={{
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your business and services..."
              style={{
                padding: "0.875rem 1rem",
                border: "1px solid var(--border-color)",
                borderRadius: "0.5rem",
                backgroundColor: "var(--background)",
                color: "var(--text-color)",
                resize: "vertical",
                fontSize: "1rem",
                width: "100%",
              }}
            />
          </div>

          {/* Experience */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <label
              style={{
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              Years of Experience
            </label>
            <input
              type="number"
              value={formData.experienceYears}
              onChange={(e) =>
                handleInputChange(
                  "experienceYears",
                  parseInt(e.target.value) || 0
                )
              }
              min="0"
              max="100"
              style={{
                padding: "0.875rem 1rem",
                border: "1px solid var(--border-color)",
                borderRadius: "0.5rem",
                backgroundColor: "var(--background)",
                color: "var(--text-color)",
                fontSize: "1rem",
                width: "100%",
                maxWidth: "500px",
              }}
            />
          </div>

          {/* Contact Info Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <label
                style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              >
                Phone
              </label>
              <input
                type="tel"
                value={user?.phone || ""}
                readOnly
                style={{
                  padding: "0.875rem 1rem",
                  border: "1px solid var(--border-color)",
                  borderRadius: "0.5rem",
                  backgroundColor: "var(--background)",
                  color: "var(--text-color)",
                  fontSize: "1rem",
                  width: "100%",
                  opacity: 0.7,
                }}
              />
            </div>

            {/* Languages */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <label
                style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              >
                Languages (comma separated)
              </label>
              <input
                type="text"
                value={formData.languages.join(", ")}
                onChange={(e) =>
                  handleInputChange(
                    "languages",
                    e.target.value
                      .split(",")
                      .map((lang) => lang.trim())
                      .filter((lang) => lang)
                  )
                }
                placeholder="English, Spanish, French..."
                style={{
                  padding: "0.875rem 1rem",
                  border: "1px solid var(--border-color)",
                  borderRadius: "0.5rem",
                  backgroundColor: "var(--background)",
                  color: "var(--text-color)",
                  fontSize: "1rem",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* Address Section */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", margin: 0 }}>
              Business Address
            </h3>

            {/* Google Address Search */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <label
                style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              >
                Search & Update Location *
              </label>
              <div style={{ maxWidth: "800px" }}>
                <GoogleAddressSearch 
                  onAddressSelect={handleAddressSelect}
                  defaultValue={formData.businessAddress.street ? `${formData.businessAddress.street}, ${formData.businessAddress.city}, ${formData.businessAddress.state}` : ""}
                />
              </div>
            </div>

            {/* City, State, Pincode Grid (Read-only after selection) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
                gap: "1.5rem",
                padding: "1.5rem",
                backgroundColor: "var(--background)",
                borderRadius: "0.75rem",
                border: "1px solid var(--border-color)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label style={{ fontSize: "0.875rem", opacity: 0.6 }}>City</label>
                <p style={{ fontSize: "1rem", fontWeight: "600", margin: 0 }}>{formData.businessAddress.city || "Not Selected"}</p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label style={{ fontSize: "0.875rem", opacity: 0.6 }}>State</label>
                <p style={{ fontSize: "1rem", fontWeight: "600", margin: 0 }}>{formData.businessAddress.state || "Not Selected"}</p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label style={{ fontSize: "0.875rem", opacity: 0.6 }}>PIN Code</label>
                <p style={{ fontSize: "1rem", fontWeight: "600", margin: 0 }}>{formData.businessAddress.pinCode || "Not Selected"}</p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label style={{ fontSize: "0.875rem", opacity: 0.6 }}>Coordinates</label>
                <p style={{ fontSize: "0.875rem", fontMono: "true", color: "var(--accent-color)", margin: 0 }}>
                  {formData.latitude?.toFixed(4)}, {formData.longitude?.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Offered */}
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            padding: "1.75rem",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Services Offered
          </h2>
          <Link
            to="/service-provider/services"
            className="btn-primary"
            style={{
              padding: "0.75rem 1.5rem",
              background: "var(--btn-bg)",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.875rem",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "var(--btn-hover)",
            }}
          >
            <Wrench size={16} />
            Manage Services
          </Link>
        </div>
        <div
          style={{
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {services ? (
            <div className="space-y-4">
              {/* Main Service */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Primary Service</h3>
                </div>
                <p className="text-blue-800 font-medium">{services.mainService?.name}</p>
              </div>
              
              {/* Sub Services */}
              {services.subServices && services.subServices.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Specializations</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {services.subServices.map((subService, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {subService.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Custom Service */}
              {services.mainService?.name === 'other' && services.customService && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <h3 className="font-semibold text-amber-900">Custom Service</h3>
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                      {services.customService.status === 'pending' ? 'Pending Approval' : services.customService.status}
                    </span>
                  </div>
                  <p className="text-amber-800">{services.customService.name}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No services configured yet</p>
              <p className="text-sm text-gray-500">Click "Manage Services" to add your services</p>
            </div>
          )}
        </div>
      </div>

      {/* Business Images */}
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            padding: "1.75rem",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Business Images ({businessImages.length}/10)
          </h2>
        </div>
        <div
          style={{
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(180px, 100%), 1fr))",
              gap: "1.5rem",
            }}
          >
            {businessImages.map((image, index) => (
              <ImageUpload
                key={index}
                image={image}
                index={index}
                onDelete={handleImageDelete}
                onView={handleImageClick}
              />
            ))}

            {businessImages.length < 10 && (
              <label
                style={{
                  aspectRatio: "1",
                  border: "2px dashed var(--border-color)",
                  borderRadius: "0.75rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: "1rem",
                }}
                className="add-image-btn hover-glow"
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <Plus
                  size={40}
                  style={{ opacity: 0.5, marginBottom: "0.75rem" }}
                />
                <span style={{ fontSize: "1rem", opacity: 0.8 }}>
                  Add Image
                </span>
              </label>
            )}
          </div>
          <p
            style={{
              fontSize: "0.9375rem",
              opacity: 0.8,
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            Upload up to 10 images of your business, equipment, or previous
            work. Recommended size: 800x800px. Max 5MB per image.
          </p>
        </div>
      </div>

      {/* Working Hours */}
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            padding: "1.75rem",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <Clock size={24} />
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Working Hours
          </h2>
        </div>
        <div
          style={{
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {daysOfWeek.map((day) => (
            <WorkingHoursRow
              key={day}
              day={day}
              schedule={formData.schedule.weeklySchedule}
              onChange={handleScheduleChange}
            />
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            padding: "1.75rem",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Pricing Information
          </h2>
        </div>
        <div
          style={{
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
              gap: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <label
                style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              >
                Starting Price *
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ opacity: 0.8, fontSize: "1.125rem" }}>₹</span>
                <input
                  type="number"
                  value={formData.startingPrice}
                  onChange={(e) =>
                    handleInputChange(
                      "startingPrice",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  min="0"
                  step="0.01"
                  required
                  style={{
                    width: "10rem",
                    padding: "0.875rem 1rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "0.5rem",
                    backgroundColor: "var(--background)",
                    color: "var(--text-color)",
                    fontSize: "1rem",
                  }}
                />
                <span style={{ fontSize: "1rem", opacity: 0.8 }}>
                  per service
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <label
                style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              >
                Emergency Service Fee
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ opacity: 0.8, fontSize: "1.125rem" }}>₹</span>
                <input
                  type="number"
                  value={formData.emergencyCharge}
                  onChange={(e) =>
                    handleInputChange(
                      "emergencyCharge",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  min="0"
                  step="0.01"
                  style={{
                    width: "10rem",
                    padding: "0.875rem 1rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "0.5rem",
                    backgroundColor: "var(--background)",
                    color: "var(--text-color)",
                    fontSize: "1rem",
                  }}
                />
                <span style={{ fontSize: "1rem", opacity: 0.8 }}>
                  additional
                </span>
              </div>
            </div>
          </div>

          {/* Extra Charge Note */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <label
              style={{
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              Extra Charge Notes
            </label>
            <textarea
              rows={2}
              value={formData.extraChargeNote}
              onChange={(e) =>
                handleInputChange("extraChargeNote", e.target.value)
              }
              placeholder="Additional charges for materials, travel, or special circumstances..."
              style={{
                padding: "0.875rem 1rem",
                border: "1px solid var(--border-color)",
                borderRadius: "0.5rem",
                backgroundColor: "var(--background)",
                color: "var(--text-color)",
                resize: "vertical",
                fontSize: "1rem",
                width: "100%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Save Button at Bottom */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "1.5rem 0",
        }}
      >
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary bottom-save-button"
          style={{
            padding: "1rem 2rem",
            background: "var(--btn-bg)",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: saving ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: "1.125rem",
            transition: "all 0.3s ease",
            minWidth: "12rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            opacity: saving ? 0.7 : 1,
            boxShadow: "var(--btn-hover)",
          }}
        >
          {saving ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save size={20} />
              Save All Changes
            </>
          )}
        </button>
      </div>

      {/* Responsive CSS */}
      <style jsx="true">{`
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

        /* Image upload styles */
        .image-upload:hover .delete-btn {
          opacity: 1 !important;
          transform: scale(1.1);
        }

        .image-upload:hover {
          box-shadow: 0 0 30px var(--glow-color);
        }

        .add-image-btn:hover {
          transform: scale(1.02);
          border-color: var(--accent-color) !important;
          background-color: var(--accent-fade) !important;
        }

        /* Working hours row hover */
        .working-hours-row:hover {
          background-color: var(--card-bg) !important;
        }

        /* General focus styles */
        input:focus,
        textarea:focus,
        button:focus {
          outline: 2px solid var(--accent-color);
          outline-offset: 2px;
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        /* Animate-spin class for loader */
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceProviderProfile;
