"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { serviceAPI } from "../../services/serviceAPI";
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
  ChevronRight,
  Heart,
  Trash2,
  ExternalLink,
  ArrowLeft,
  IndianRupee,
  Briefcase,
  Image,
  MessageSquare
} from "lucide-react";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [favoriteProviders, setFavoriteProviders] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loadingProviderDetails, setLoadingProviderDetails] = useState(false);
  const [providerTab, setProviderTab] = useState('about');
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  
  const userData = {
    name: user?.name || profile?.name || "User",
    email: user?.email || "N/A",
    phone: user?.phone || profile?.user?.phone || "N/A",
    address: profile?.address ? 
      `${profile.address.street}, ${profile.address.city}, ${profile.address.state} ${profile.address.pinCode}` : 
      "No address provided",
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A",
    accountType: "Service Seeker",
    rating: 4.8,
    totalBookings: 24,
    completedServices: 18,
    upcomingBookings: 2,
    favoriteCategories: ["Plumbing", "Electrical", "Home Cleaning"],
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  // Fetch favorite providers when favorites tab is active
  useEffect(() => {
    if (activeTab === "favorites") {
      fetchFavoriteProviders();
    }
  }, [activeTab]);

  const fetchFavoriteProviders = async () => {
    try {
      setLoadingFavorites(true);
      const response = await serviceAPI.getFavoriteProviders();
      if (response.success) {
        setFavoriteProviders(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorite providers');
    } finally {
      setLoadingFavorites(false);
    }
  };

  const handleRemoveFavorite = async (providerId) => {
    try {
      const response = await serviceAPI.removeFavoriteProvider(providerId);
      if (response.success) {
        toast.success('Removed from favorites');
        // Remove from local state
        setFavoriteProviders(prev => prev.filter(fav => fav.provider.id !== providerId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const handleViewProvider = async (providerId) => {
    try {
      console.log('Fetching provider details for ID:', providerId);
      setLoadingProviderDetails(true);
      const response = await serviceAPI.getProviderFullDetails(providerId);
      console.log('Provider details response:', response);
      if (response.success) {
        setSelectedProvider(response.data);
        console.log('Provider data set:', response.data);
      } else {
        toast.error(response.message || 'Failed to load provider details');
      }
    } catch (error) {
      console.error('Error fetching provider details:', error);
      toast.error('Failed to load provider details');
    } finally {
      setLoadingProviderDetails(false);
    }
  };

  const handleCloseProviderDetails = () => {
    setSelectedProvider(null);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <User className="h-4 w-4" /> },
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
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left hover:bg-red-50 mt-6"
                  style={{
                    color: '#dc2626',
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

            {activeTab === "favorites" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
                  Favorite Providers
                </h2>
                
                {loadingFavorites ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" 
                         style={{ borderColor: 'var(--accent-color)' }}></div>
                    <p className="mt-4" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                      Loading favorites...
                    </p>
                  </div>
                ) : favoriteProviders.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--text-color)', opacity: 0.3 }} />
                    <p style={{ color: 'var(--text-color)', opacity: 0.7 }}>No favorite providers yet</p>
                    <button
                      onClick={() => navigate('/user/explore')}
                      className="mt-4 px-6 py-2 rounded-xl font-medium"
                      style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
                    >
                      Browse Providers
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favoriteProviders.map((favorite) => {
                      const provider = favorite.provider;
                      return (
                        <div
                          key={favorite.favoriteId}
                          className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                          style={{
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          {/* Provider Header */}
                          <div className="flex items-start gap-4 mb-4">
                            <div 
                              className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: 'var(--accent-fade)',
                                color: 'var(--accent-dark)'
                              }}
                            >
                              <span className="text-2xl font-bold">
                                {provider.businessName?.charAt(0) || 'P'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
                                {provider.businessName}
                              </h3>
                              <p className="text-sm mt-1" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                                {provider.serviceCategory}
                              </p>
                              {provider.rating > 0 && (
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-current" style={{ color: '#fbbf24' }} />
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                                      {provider.rating.toFixed(1)}
                                    </span>
                                  </div>
                                  <span className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                                    ({provider.totalReviews} reviews)
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Provider Description */}
                          {provider.businessDescription && (
                            <p className="text-sm mb-4 line-clamp-2" 
                               style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                              {provider.businessDescription}
                            </p>
                          )}

                          {/* Location */}
                          {provider.location?.city && (
                            <div className="flex items-center gap-2 mb-4">
                              <MapPin className="h-4 w-4" style={{ color: 'var(--accent-color)' }} />
                              <span className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                                {provider.location.city}, {provider.location.state}
                              </span>
                            </div>
                          )}

                          {/* Sub-services */}
                          {provider.subServices && provider.subServices.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {provider.subServices.slice(0, 3).map((service, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 rounded-lg text-xs"
                                  style={{
                                    backgroundColor: 'var(--accent-fade)',
                                    color: 'var(--accent-dark)'
                                  }}
                                >
                                  {service.name}
                                </span>
                              ))}
                              {provider.subServices.length > 3 && (
                                <span
                                  className="px-2 py-1 rounded-lg text-xs"
                                  style={{
                                    backgroundColor: 'var(--accent-fade)',
                                    color: 'var(--accent-dark)'
                                  }}
                                >
                                  +{provider.subServices.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                            <button
                              onClick={() => handleViewProvider(provider.id)}
                              className="flex-1 px-4 py-2 rounded-xl font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
                              style={{
                                backgroundColor: 'var(--accent-color)',
                                color: 'white'
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                              View Profile
                            </button>
                            <button
                              onClick={() => handleRemoveFavorite(provider.id)}
                              className="px-4 py-2 rounded-xl font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
                              style={{
                                backgroundColor: 'var(--card-bg)',
                                color: '#dc2626',
                                border: '1px solid var(--border-color)'
                              }}
                              title="Remove from favorites"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
                
                {/* Account Settings */}
                <div 
                  className="rounded-2xl shadow-lg p-6"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                    <Settings className="inline h-5 w-5 mr-2" />
                    Preferences
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
                      Edit Profile
                    </button>
                    <button 
                      className="w-full p-3 rounded-xl text-left transition-all hover:opacity-90"
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      Notification Settings
                    </button>
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
                    borderColor: '#dc2626',
                    borderStyle: 'dashed'
                  }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#dc2626' }}>
                    Danger Zone
                  </h3>
                  <button 
                    className="w-full p-3 rounded-xl text-left transition-all hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      color: '#dc2626',
                      border: '1px solid #dc2626'
                    }}
                  >
                    Delete Account
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Provider Details Modal */}
      <AnimatePresence>
        {selectedProvider && (() => {
          const profile = selectedProvider?.provider || selectedProvider;
          const services = selectedProvider?.services;
          const portfolio = selectedProvider?.portfolio || [];
          const schedule = selectedProvider?.schedule;
          const reviews = selectedProvider?.reviews || { items: [], totalCount: 0 };

          // Format day name helper
          const formatDayName = (day) => day.charAt(0).toUpperCase() + day.slice(1);

          // Render tab content
          const renderTabContent = () => {
            switch (providerTab) {
              case 'about':
                return (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-color)" }}>
                        About
                      </h3>
                      <p className="text-sm sm:text-base" style={{ color: "var(--text-color)", opacity: 0.8 }}>
                        {profile.description || 'Professional service provider with years of experience.'}
                      </p>
                    </div>

                    {services && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-color)" }}>
                          Services Offered
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: "var(--accent-color)", color: "white" }}>
                            {services.mainService}
                          </span>
                          {(services.subServices || []).map((subService, index) => (
                            <span key={index} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: "var(--accent-fade)", color: "var(--accent-dark)" }}>
                              {subService}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 text-sm" style={{ color: "var(--text-color)", opacity: 0.7 }}>
                          <span className="font-medium">Pricing:</span> ₹{services.minPrice} - ₹{services.maxPrice} ({services.pricingType})
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-color)" }}>Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {(profile.languages || ['English']).map((lang, index) => (
                            <span key={index} className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: "var(--card-bg)", color: "var(--text-color)", border: "1px solid var(--border-color)" }}>
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-color)" }}>Stats</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between" style={{ color: "var(--text-color)" }}>
                            <span>Experience:</span>
                            <span className="font-medium">{profile.experienceYears || 0} years</span>
                          </div>
                          <div className="flex justify-between" style={{ color: "var(--text-color)" }}>
                            <span>Jobs Completed:</span>
                            <span className="font-medium">{profile.totalJobsCompleted || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );

              case 'portfolio':
                return (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-color)" }}>
                      <Image className="h-5 w-5" /> Portfolio ({(portfolio.length > 0 ? portfolio.length : (profile.businessImages || profile.images || []).length)})
                    </h3>
                    {portfolio.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {portfolio.map((item, index) => (
                          <div key={index} className="relative group rounded-xl overflow-hidden aspect-square" style={{ backgroundColor: "var(--card-bg)" }}>
                            <img src={item.imageUrl} alt={item.caption || 'Portfolio image'} className="w-full h-full object-cover" />
                            {item.caption && (
                              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.caption}
                              </div>
                            )}
                            <span className="absolute top-2 right-2 px-2 py-1 text-xs rounded-full bg-black/50 text-white capitalize">
                              {item.category}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (profile.businessImages || profile.images || []).length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {(profile.businessImages || profile.images || []).map((item, index) => (
                          <div key={index} className="relative group rounded-xl overflow-hidden aspect-square" style={{ backgroundColor: "var(--card-bg)" }}>
                            <img src={item.url} alt={item.originalName || 'Business image'} className="w-full h-full object-cover" />
                            <span className="absolute top-2 right-2 px-2 py-1 text-xs rounded-full bg-black/50 text-white">
                              Business
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8" style={{ color: "var(--text-color)", opacity: 0.6 }}>
                        <Image className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p>No portfolio items yet</p>
                      </div>
                    )}
                  </div>
                );

              case 'schedule':
                return (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-color)" }}>
                      <Calendar className="h-5 w-5" /> Availability
                    </h3>
                    {schedule ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="px-4 py-2 rounded-xl" style={{ backgroundColor: "var(--accent-fade)", color: "var(--accent-dark)" }}>
                            <Clock className="h-4 w-4 inline mr-2" />
                            Response: {schedule.responseTime}
                          </div>
                          <div className="px-4 py-2 rounded-xl" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
                            <MapPin className="h-4 w-4 inline mr-2" />
                            Service Area: {schedule.serviceAreaRadius}km radius
                          </div>
                          <div className={`px-4 py-2 rounded-xl ${schedule.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {schedule.isAvailable ? 'Currently Available' : 'Currently Busy'}
                          </div>
                        </div>
                        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
                          {schedule.weeklySchedule && Object.entries(schedule.weeklySchedule).map(([day, info]) => (
                            <div key={day} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0" style={{ borderColor: "var(--border-color)", backgroundColor: info.isAvailable ? 'transparent' : 'var(--card-bg)' }}>
                              <span className="font-medium" style={{ color: "var(--text-color)" }}>{formatDayName(day)}</span>
                              {info.isAvailable ? (
                                <span className="text-sm" style={{ color: "var(--accent-color)" }}>
                                  {info.startTime} - {info.endTime}
                                </span>
                              ) : (
                                <span className="text-sm" style={{ color: "var(--text-color)", opacity: 0.5 }}>Closed</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8" style={{ color: "var(--text-color)", opacity: 0.6 }}>
                        <Calendar className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p>Schedule not available</p>
                      </div>
                    )}
                  </div>
                );

              case 'reviews':
                return (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-color)" }}>
                      <MessageSquare className="h-5 w-5" /> Reviews ({reviews.totalCount})
                    </h3>
                    {reviews.items.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.items.map((review, index) => (
                          <div key={index} className="p-4 rounded-xl" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="font-medium" style={{ color: "var(--text-color)" }}>{review.seekerName}</span>
                                <div className="flex items-center gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs" style={{ color: "var(--text-color)", opacity: 0.6 }}>
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {review.reviewText && (
                              <p className="text-sm mt-2" style={{ color: "var(--text-color)", opacity: 0.8 }}>{review.reviewText}</p>
                            )}
                            {review.providerReply && (
                              <div className="mt-3 pl-4 border-l-2" style={{ borderColor: "var(--accent-color)" }}>
                                <span className="text-xs font-medium" style={{ color: "var(--accent-color)" }}>Provider Reply:</span>
                                <p className="text-sm mt-1" style={{ color: "var(--text-color)", opacity: 0.8 }}>{review.providerReply.text}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8" style={{ color: "var(--text-color)", opacity: 0.6 }}>
                        <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p>No reviews yet</p>
                      </div>
                    )}
                  </div>
                );

              default:
                return null;
            }
          };

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
              onClick={handleCloseProviderDetails}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)", border: "1px solid var(--border-color)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {loadingProviderDetails ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: "var(--accent-color)" }}></div>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="relative p-4 sm:p-6 border-b" style={{ borderColor: "var(--border-color)" }}>
                      <button onClick={handleCloseProviderDetails} className="absolute left-4 sm:left-6 top-4 sm:top-6 p-2 rounded-full transition-colors" style={{ backgroundColor: "var(--card-bg)", color: "var(--text-color)" }}>
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <div className="text-center px-12">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-color)" }}>
                            {profile.businessName || profile.name}
                          </h2>
                          {profile.isVerified && (
                            <Shield className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex items-center justify-center gap-3 text-sm" style={{ color: "var(--text-color)", opacity: 0.7 }}>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{profile.rating?.average?.toFixed(1) || '0.0'}</span>
                            <span>({profile.rating?.count || 0} reviews)</span>
                          </div>
                          <span>|</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{profile.location?.city || profile.businessAddress?.city || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b overflow-x-auto" style={{ borderColor: "var(--border-color)" }}>
                      {[
                        { id: 'about', label: 'About', icon: <Award className="h-4 w-4" /> },
                        { id: 'portfolio', label: 'Portfolio', icon: <Image className="h-4 w-4" /> },
                        { id: 'schedule', label: 'Availability', icon: <Calendar className="h-4 w-4" /> },
                        { id: 'reviews', label: 'Reviews', icon: <MessageSquare className="h-4 w-4" /> }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setProviderTab(tab.id)}
                          className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${providerTab === tab.id ? 'border-b-2' : ''}`}
                          style={{
                            borderColor: providerTab === tab.id ? 'var(--accent-color)' : 'transparent',
                            color: providerTab === tab.id ? 'var(--accent-color)' : 'var(--text-color)',
                            opacity: providerTab === tab.id ? 1 : 0.7
                          }}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-4 sm:p-6">
                      {renderTabContent()}
                    </div>

                    {/* Footer - Close button only */}
                    <div className="p-4 sm:p-6 border-t" style={{ borderColor: "var(--border-color)" }}>
                      <button
                        onClick={handleCloseProviderDetails}
                        className="w-full py-3 rounded-xl font-semibold transition-colors text-sm sm:text-base"
                        style={{ 
                          backgroundColor: "var(--card-bg)", 
                          color: "var(--text-color)",
                          border: "1px solid var(--border-color)"
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;