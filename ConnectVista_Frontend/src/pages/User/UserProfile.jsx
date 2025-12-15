"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  Edit2, 
  Settings, 
  Shield,
  BookOpen,
  Clock,
  Award,
  LogOut,
  ChevronRight
} from "lucide-react";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock user data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
    memberSince: "January 2023",
    accountType: "Service Seeker",
    rating: 4.8,
    totalBookings: 24,
    completedServices: 18,
    upcomingBookings: 2,
    favoriteCategories: ["Plumbing", "Electrical", "Home Cleaning"],
    recentActivity: [
      { id: 1, type: "booking", service: "Plumbing Repair", date: "2024-01-15", status: "completed" },
      { id: 2, type: "booking", service: "Electrical Wiring", date: "2024-01-10", status: "upcoming" },
      { id: 3, type: "review", service: "Home Cleaning", date: "2024-01-05", rating: 5 },
    ],
    accountSettings: {
      notifications: true,
      emailUpdates: true,
      smsAlerts: false,
      privacyMode: false
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <User className="h-4 w-4" /> },
    { id: "bookings", label: "My Bookings", icon: <BookOpen className="h-4 w-4" /> },
    { id: "favorites", label: "Favorites", icon: <Star className="h-4 w-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'var(--background)',
        color: 'var(--text-color)'
      }}
    >
      {/* Header */}
      <div 
        className="py-8 sm:py-12 px-4 sm:px-6"
        style={{
          background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--accent-dark) 100%)',
          color: 'white'
        }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Initial Avatar */}
              <div 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <span className="text-2xl sm:text-3xl font-bold">
                  {userData.name.charAt(0)}
                </span>
              </div>
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{userData.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20">
                    {userData.accountType}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-300 fill-current" />
                    <span className="text-sm">{userData.rating}</span>
                  </div>
                </div>
                <p className="text-white/80 mt-2 flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3" />
                  Member since {userData.memberSince}
                </p>
              </div>
            </div>
            
            <button 
              className="px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Tabs */}
          <div className="lg:w-1/4">
            <div 
              className="rounded-2xl shadow-lg p-4 sm:p-6 sticky top-6"
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)'
              }}
            >
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                      activeTab === tab.id
                        ? "font-semibold shadow-sm"
                        : "hover:opacity-90"
                    }`}
                    style={{
                      backgroundColor: activeTab === tab.id ? 'var(--accent-color)' : 'transparent',
                      color: activeTab === tab.id ? 'white' : 'var(--text-color)'
                    }}
                  >
                    {tab.icon}
                    <span className="text-sm sm:text-base">{tab.label}</span>
                  </button>
                ))}
                
                {/* Logout Button */}
                <button
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left hover:opacity-90 mt-6"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm sm:text-base">Log Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Tab Content */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Personal Info Card */}
                <div 
                  className="rounded-2xl shadow-lg p-6"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4" style={{ color: 'var(--accent-color)' }} />
                      <div>
                        <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Email</p>
                        <p style={{ color: 'var(--text-color)' }}>{userData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4" style={{ color: 'var(--accent-color)' }} />
                      <div>
                        <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Phone</p>
                        <p style={{ color: 'var(--text-color)' }}>{userData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4" style={{ color: 'var(--accent-color)' }} />
                      <div>
                        <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Address</p>
                        <p style={{ color: 'var(--text-color)' }}>{userData.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div 
                    className="rounded-2xl p-6 text-center"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div className="text-3xl font-bold mb-2" style={{ color: 'var(--accent-color)' }}>
                      {userData.totalBookings}
                    </div>
                    <p style={{ color: 'var(--text-color)' }}>Total Bookings</p>
                  </div>
                  <div 
                    className="rounded-2xl p-6 text-center"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div className="text-3xl font-bold mb-2" style={{ color: 'var(--accent-color)' }}>
                      {userData.completedServices}
                    </div>
                    <p style={{ color: 'var(--text-color)' }}>Completed Services</p>
                  </div>
                  <div 
                    className="rounded-2xl p-6 text-center"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div className="text-3xl font-bold mb-2" style={{ color: 'var(--accent-color)' }}>
                      {userData.upcomingBookings}
                    </div>
                    <p style={{ color: 'var(--text-color)' }}>Upcoming Bookings</p>
                  </div>
                </div>

                {/* Favorite Categories */}
                <div 
                  className="rounded-2xl shadow-lg p-6"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                    Favorite Categories
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {userData.favoriteCategories.map((category, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: 'var(--accent-fade)',
                          color: 'var(--accent-dark)'
                        }}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "bookings" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
                  My Bookings
                </h2>
                
                {[1, 2, 3].map((booking) => (
                  <div 
                    key={booking}
                    className="rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
                          Plumbing Service - Leak Repair
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">Jan 15, 2024</span>
                          </div>
                          <div className="flex items-center gap-1" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">10:00 AM</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: booking === 2 ? 'var(--accent-fade)' : 'var(--card-bg)',
                            color: booking === 2 ? 'var(--accent-dark)' : 'var(--text-color)',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          {booking === 2 ? 'Upcoming' : 'Completed'}
                        </span>
                        <button 
                          className="flex items-center gap-1 text-sm font-medium"
                          style={{ color: 'var(--accent-color)' }}
                        >
                          Details
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "favorites" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
                  Favorite Providers
                </h2>
                
                {[1, 2, 3].map((fav) => (
                  <div 
                    key={fav}
                    className="rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: 'var(--accent-color)',
                            opacity: 0.1
                          }}
                        >
                          <div style={{ color: 'var(--accent-color)' }}>
                            <User className="h-6 w-6" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
                            QuickFix Plumbing Solutions
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span style={{ color: 'var(--text-color)', opacity: 0.7 }}>4.8 (156 reviews)</span>
                            <span className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                              • Plumbing
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        className="px-4 py-2 rounded-xl font-medium transition-colors"
                        style={{
                          backgroundColor: 'var(--card-bg)',
                          color: 'var(--text-color)',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
                  Account Settings
                </h2>
                
                {/* Notification Settings */}
                <div 
                  className="rounded-2xl shadow-lg p-6"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                    <Settings className="inline h-5 w-5 mr-2" />
                    Notification Preferences
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Push Notifications", value: userData.accountSettings.notifications },
                      { label: "Email Updates", value: userData.accountSettings.emailUpdates },
                      { label: "SMS Alerts", value: userData.accountSettings.smsAlerts },
                      { label: "Privacy Mode", value: userData.accountSettings.privacyMode },
                    ].map((setting, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span style={{ color: 'var(--text-color)' }}>{setting.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            defaultChecked={setting.value}
                          />
                          <div 
                            className="w-11 h-6 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                            style={{
                              background: setting.value ? 'var(--accent-color)' : 'var(--border-color)'
                            }}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account Security */}
                <div 
                  className="rounded-2xl shadow-lg p-6"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                    <Shield className="inline h-5 w-5 mr-2" />
                    Account Security
                  </h3>
                  <div className="space-y-3">
                    <button 
                      className="w-full p-3 rounded-xl text-left transition-all hover:opacity-90"
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      Change Password
                    </button>
                    <button 
                      className="w-full p-3 rounded-xl text-left transition-all hover:opacity-90"
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      Two-Factor Authentication
                    </button>
                    <button 
                      className="w-full p-3 rounded-xl text-left transition-all hover:opacity-90"
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      Connected Devices
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div 
                  className="rounded-2xl shadow-lg p-6 border-2"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--accent-color)',
                    borderStyle: 'dashed'
                  }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--accent-color)' }}>
                    Danger Zone
                  </h3>
                  <div className="space-y-3">
                    <button 
                      className="w-full p-3 rounded-xl text-left transition-all hover:opacity-90"
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        color: '#dc2626',
                        border: '1px solid #dc2626'
                      }}
                    >
                      Deactivate Account
                    </button>
                    <button 
                      className="w-full p-3 rounded-xl text-left transition-all hover:opacity-90"
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        color: '#dc2626',
                        border: '1px solid #dc2626'
                      }}
                    >
                      Delete Account Permanently
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;