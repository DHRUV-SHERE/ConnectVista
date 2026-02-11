import { useState, useMemo, useEffect } from "react";
import BookingModal from "./UserBookingModel";
import SimpleMapExplore from "../../components/User/SimpleMapExplore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  DollarSign,
  Map,
  List,
  Clock,
  Shield,
  Award,
  Phone,
  Mail,
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  Image,
  MessageSquare,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { serviceAPI, getCurrentLocation } from '../../services/serviceAPI';

const UserExplore = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId') || searchParams.get('serviceId'); // Support both for backward compatibility
  const serviceName = searchParams.get('serviceName');
  const [locationError, setLocationError] = useState(null);
  const [searchRadius, setSearchRadius] = useState(15);

  // Get user location on component mount
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);
        setLocationError(null);
      } catch (error) {
        console.log('Could not get user location:', error);
        setLocationError('Location access denied. Using default location.');
        // Set default location (India center)
        setUserLocation({ lat: 23.0225, lng: 72.5714 });
      }
    };

    // Add delay to prevent simultaneous calls
    const timeoutId = setTimeout(getUserLocation, 50);
    return () => clearTimeout(timeoutId);
  }, []);

  // Fetch nearby providers for the selected category with geolocation
  useEffect(() => {
    const fetchNearbyProviders = async () => {
      if (!categoryId) return;

      // Wait for location to be available
      if (!userLocation) {
        setLoading(true);
        return;
      }

      try {
        setLoading(true);

        const options = {
          lat: userLocation.lat,
          lng: userLocation.lng,
          radius: searchRadius,
          sortBy: sortBy,
          limit: 50
        };

        const response = await serviceAPI.getNearbyProviders(categoryId, options);

        if (response.success) {
          setProviders(response.data?.providers || []);
        } else {
          console.error('API returned error:', response.message);
          setProviders([]);
        }
      } catch (error) {
        console.error('Error fetching nearby providers:', error);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    // Add delay to prevent rate limiting
    const timeoutId = setTimeout(fetchNearbyProviders, 150);
    return () => clearTimeout(timeoutId);
  }, [categoryId, sortBy, userLocation, searchRadius]);

  const filteredProviders = useMemo(() => {
    let filtered = providers;

    if (searchQuery) {
      filtered = filtered.filter(
        (provider) =>
          provider.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [providers, searchQuery]);

  const toggleFavorite = (providerId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(providerId)) {
      newFavorites.delete(providerId);
    } else {
      newFavorites.add(providerId);
    }
    setFavorites(newFavorites);
  };

  const handleBookService = (provider) => {
    setSelectedProviderForBooking(provider);
    setShowBookingModal(true);
    setSelectedProvider(null);
  };

  const handleBookingSuccess = (bookingData) => {
    console.log("Booking created:", bookingData);
    setShowBookingModal(false);
    setSelectedProviderForBooking(null);
    // Toast is already shown in the BookingModal component
  };

  const ProviderProfile = ({ provider, onClose }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');
    const isFavorite = favorites.has(provider._id);

    useEffect(() => {
      const fetchProviderProfile = async () => {
        try {
          // Use the new full details API
          const response = await serviceAPI.getProviderFullDetails(provider._id);
          if (response.success) {
            setProfileData(response.data);
          } else {
            // Fallback to basic provider data
            setProfileData({ provider: provider });
          }
        } catch (error) {
          console.error('Error fetching provider profile:', error);
          setProfileData({ provider: provider });
        } finally {
          setLoading(false);
        }
      };
      fetchProviderProfile();
    }, [provider._id]);

    if (loading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <div className="bg-white rounded-xl p-8 flex items-center justify-center" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--accent-color)' }}></div>
          </div>
        </motion.div>
      );
    }

    const profile = profileData?.provider || provider;
    const services = profileData?.services;
    const portfolio = profileData?.portfolio || [];
    const schedule = profileData?.schedule;
    const reviews = profileData?.reviews || { items: [], totalCount: 0 };

    // Format day name helper
    const formatDayName = (day) => day.charAt(0).toUpperCase() + day.slice(1);

    // Render tab content
    const renderTabContent = () => {
      switch (activeTab) {
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
                    <span className="font-medium">Pricing:</span> Rs.{services.minPrice} - Rs.{services.maxPrice} ({services.pricingType})
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
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)", border: "1px solid var(--border-color)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-4 sm:p-6 border-b" style={{ borderColor: "var(--border-color)" }}>
            <button onClick={onClose} className="absolute left-4 sm:left-6 top-4 sm:top-6 p-2 rounded-full transition-colors" style={{ backgroundColor: "var(--card-bg)", color: "var(--text-color)" }}>
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
                  <span>{profile.location?.city || profile.businessAddress?.city}</span>
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
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-b-2' : ''}`}
                style={{
                  borderColor: activeTab === tab.id ? 'var(--accent-color)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--accent-color)' : 'var(--text-color)',
                  opacity: activeTab === tab.id ? 1 : 0.7
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

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 border-t" style={{ borderColor: "var(--border-color)" }}>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 py-3 rounded-xl font-semibold transition-colors text-sm sm:text-base"
                style={{ background: "var(--btn-bg)", color: "white" }}
                onClick={() => handleBookService(profile)}
              >
                Book Service
              </button>
              <div className="flex gap-3 justify-center sm:justify-start">
                <button
                  onClick={() => toggleFavorite(profile._id || profile.id)}
                  className="p-3 rounded-xl transition-colors"
                  style={{
                    backgroundColor: isFavorite ? "var(--accent-fade)" : "var(--card-bg)",
                    color: isFavorite ? "var(--accent-dark)" : "var(--text-color)",
                    border: "1px solid var(--border-color)"
                  }}
                >
                  <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite ? "fill-current" : ""}`} />
                </button>
                <button className="p-3 rounded-xl transition-colors" style={{ backgroundColor: "var(--card-bg)", color: "var(--text-color)", border: "1px solid var(--border-color)" }}>
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--background)",
        color: "var(--text-color)",
      }}
    >
      <AnimatePresence>
        {showBookingModal && selectedProviderForBooking && (
          <BookingModal
            provider={selectedProviderForBooking}
            onClose={() => {
              setShowBookingModal(false);
              setSelectedProviderForBooking(null);
            }}
            onSuccess={handleBookingSuccess}
          />
        )}
      </AnimatePresence>

      <section
        className="border-b sticky top-0 z-40 backdrop-blur-sm shadow-sm"
        style={{
          backgroundColor: "var(--overlay-bg)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-start lg:items-center">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1 w-full">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5"
                  style={{ opacity: 0.7 }}
                />
                <input
                  type="text"
                  placeholder="Search for services or providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 rounded-xl focus:ring-2 focus:outline-none text-sm sm:text-base"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    color: "var(--text-color)",
                    border: "1px solid var(--border-color)",
                  }}
                />
              </div>
              {/* Search Radius Selector */}
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5"
                  style={{ opacity: 0.7, color: 'var(--accent-color)' }}
                />
                <select
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 rounded-xl focus:ring-2 focus:outline-none text-sm sm:text-base"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    color: "var(--text-color)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <option value={5}>Within 5 km</option>
                  <option value={10}>Within 10 km</option>
                  <option value={15}>Within 15 km</option>
                  <option value={25}>Within 25 km</option>
                  <option value={50}>Within 50 km</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl focus:ring-2 focus:outline-none text-sm sm:text-base flex-1 sm:flex-none min-w-[140px]"
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--text-color)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <option value="distance">Nearest First</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="experience">Most Experienced</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <div
                className="flex rounded-xl overflow-hidden"
                style={{
                  border: "1px solid var(--border-color)",
                }}
              >
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 sm:p-3 transition-colors ${
                    viewMode === "list" ? "text-white" : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor:
                      viewMode === "list"
                        ? "var(--accent-color)"
                        : "var(--card-bg)",
                    color: viewMode === "list" ? "white" : "var(--text-color)",
                  }}
                >
                  <List className="h-4 w-4 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2 sm:p-3 transition-colors ${
                    viewMode === "map" ? "text-white" : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor:
                      viewMode === "map"
                        ? "var(--accent-color)"
                        : "var(--card-bg)",
                    color: viewMode === "map" ? "white" : "var(--text-color)",
                  }}
                >
                  <Map className="h-4 w-4 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-8 container mx-auto px-3 sm:px-4">
        {/* Location Error Alert */}
        {locationError && (
          <div className="mb-4 p-3 rounded-xl flex items-center gap-2 text-sm" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', color: '#92400e' }}>
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-color)" }}>
            {serviceName || 'Service Providers'}
          </h1>
          <p className="text-sm sm:text-base" style={{ color: "var(--text-color)", opacity: 0.7 }}>
            {loading ? 'Searching nearby providers...' : (
              <>Found{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--accent-color)" }}
              >
                {filteredProviders.length}
              </span>{" "}
              service providers within {searchRadius}km
              {userLocation && (
                <span className="ml-2 text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--accent-fade)', color: 'var(--accent-dark)' }}>
                  <MapPin className="h-3 w-3 inline mr-1" />
                  Using your location
                </span>
              )}</>
            )}
          </p>
        </div>

        <AnimatePresence>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : viewMode === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
            >
              {filteredProviders.map((provider) => {
                const isFavorite = favorites.has(provider._id);
                return (
                  <motion.div
                    key={provider._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3
                              className="text-lg sm:text-xl font-semibold"
                              style={{ color: "var(--text-color)" }}
                            >
                              {provider.businessName || provider.name}
                            </h3>
                            {provider.isVerified && (
                              <span
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: "var(--accent-fade)",
                                  color: "var(--accent-dark)",
                                }}
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                Verified
                              </span>
                            )}
                          </div>
                          <p
                            className="text-xs sm:text-sm"
                            style={{ color: "var(--text-color)", opacity: 0.7 }}
                          >
                            {provider.experienceYears} years experience
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className="flex items-center gap-1 text-xs sm:text-sm font-semibold"
                            style={{ color: "var(--text-color)" }}
                          >
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                            {provider.rating?.average || 0}
                            <span style={{ opacity: 0.7 }}>
                              ({provider.rating?.count || 0})
                            </span>
                          </div>
                          <div
                            className="flex items-center gap-1 text-xs sm:text-sm mt-1"
                            style={{ color: "var(--text-color)", opacity: 0.7 }}
                          >
                            <MapPin className="h-3 w-3" />
                            {provider.businessAddress?.city}
                            {provider.distance && (
                              <span className="ml-2 px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                                {provider.distance < 1 ? `${Math.round(provider.distance * 1000)}m` : `${provider.distance.toFixed(1)}km`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p
                        className="mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base"
                        style={{ color: "var(--text-color)", opacity: 0.8 }}
                      >
                        {provider.description}
                      </p>

                      <div
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-3 sm:pt-4 border-t"
                        style={{ borderColor: "var(--border-color)" }}
                      >
                        <div
                          className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm"
                          style={{ color: "var(--text-color)", opacity: 0.7 }}
                        >
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>₹{provider.serviceDetails?.minPrice || provider.startingPrice}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{provider.experienceYears} years exp</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{provider.totalJobsCompleted} jobs</span>
                          </div>
                        </div>
                        <div className="flex gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => toggleFavorite(provider._id)}
                            className="p-2 rounded-xl transition-colors"
                            style={{
                              backgroundColor: isFavorite
                                ? "var(--accent-fade)"
                                : "var(--card-bg)",
                              color: isFavorite
                                ? "var(--accent-dark)"
                                : "var(--text-color)",
                              border: "1px solid var(--border-color)",
                            }}
                          >
                            <Heart
                              className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                isFavorite ? "fill-current" : ""
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => setSelectedProvider(provider)}
                            className="px-3 sm:px-4 py-2 rounded-xl font-medium transition-colors text-xs sm:text-sm"
                            style={{
                              backgroundColor: 'var(--card-bg)',
                              color: 'var(--text-color)',
                              border: '1px solid var(--border-color)'
                            }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleBookService(provider)}
                            className="px-3 sm:px-6 py-2 rounded-xl font-medium transition-colors text-xs sm:text-sm"
                            style={{
                              background: "var(--btn-bg)",
                              color: "white",
                            }}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <SimpleMapExplore 
              providers={filteredProviders}
              userLocation={userLocation}
              onProviderClick={setSelectedProvider}
            />
          )}
        </AnimatePresence>

        {filteredProviders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 sm:py-12"
          >
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4" style={{ opacity: 0.3 }}>
              🔍
            </div>
            <h3
              className="text-lg sm:text-xl font-semibold mb-2"
              style={{ color: "var(--text-color)" }}
            >
              No providers found
            </h3>
            <p className="text-sm sm:text-base" style={{ color: "var(--text-color)", opacity: 0.7 }}>
              Try adjusting your search criteria or location
            </p>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {selectedProvider && (
          <ProviderProfile
            provider={selectedProvider}
            onClose={() => setSelectedProvider(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserExplore;