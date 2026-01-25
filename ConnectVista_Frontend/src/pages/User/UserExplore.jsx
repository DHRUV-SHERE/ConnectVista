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
  const serviceId = searchParams.get('serviceId');
  const serviceName = searchParams.get('serviceName');

  // Get user location on component mount
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);
      } catch (error) {
        console.log('Could not get user location:', error);
      }
    };
    
    // Add delay to prevent simultaneous calls
    const timeoutId = setTimeout(getUserLocation, 50);
    return () => clearTimeout(timeoutId);
  }, []);

  // Fetch providers for the selected service with location support
  useEffect(() => {
    const fetchProviders = async () => {
      if (!serviceId) return;
      
      try {
        setLoading(true);
        
        // Get user location for distance-based sorting
        let location = userLocation;
        if (!location) {
          try {
            location = await getCurrentLocation();
            setUserLocation(location);
          } catch (locationError) {
            console.log('Could not get user location:', locationError);
          }
        }
        
        const options = {
          city: locationQuery,
          sortBy: sortBy
        };
        
        // Add location for distance sorting
        if (location && sortBy === 'distance') {
          options.lat = location.lat;
          options.lng = location.lng;
        }
        
        const response = await serviceAPI.getProvidersByService(serviceId, options);
        setProviders(response.data || []);
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Add delay to prevent rate limiting
    const timeoutId = setTimeout(fetchProviders, 150);
    return () => clearTimeout(timeoutId);
  }, [serviceId, locationQuery, sortBy, userLocation]);

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

  const handleBookingConfirm = (bookingDetails) => {
    console.log("Booking confirmed:", bookingDetails);
    alert(
      `Booking confirmed! Provider will contact you shortly.\nTotal: ₹${bookingDetails.totalCost}`
    );
    setShowBookingModal(false);
  };

  const ProviderProfile = ({ provider, onClose }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const isFavorite = favorites.has(provider._id);

    useEffect(() => {
      const fetchProviderProfile = async () => {
        try {
          const response = await serviceAPI.getProviderProfile(provider._id);
          setProfileData(response.data);
        } catch (error) {
          console.error('Error fetching provider profile:', error);
          setProfileData(provider); // Fallback to basic provider data
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
          <div className="bg-white rounded-xl p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </motion.div>
      );
    }

    const profile = profileData || provider;

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
          style={{
            backgroundColor: "var(--bg-color)",
            color: "var(--text-color)",
            border: "1px solid var(--border-color)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative p-4 sm:p-6 border-b"
            style={{ borderColor: "var(--border-color)" }}>
            <button
              onClick={onClose}
              className="absolute left-4 sm:left-6 top-4 sm:top-6 p-2 rounded-full transition-colors"
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text-color)",
              }}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <div className="text-center px-8">
              <h2
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "var(--text-color)" }}
              >
                {profile.businessName || profile.name}
              </h2>
              <p className="text-sm sm:text-base" style={{ color: "var(--text-color)", opacity: 0.7 }}>
                {profile.category || 'Service Provider'}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--text-color)" }}
                  >
                    About
                  </h3>
                  <p className="text-sm sm:text-base" style={{ color: "var(--text-color)", opacity: 0.8 }}>
                    {profile.description || 'Professional service provider with years of experience.'}
                  </p>
                </div>

                <div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--text-color)" }}
                  >
                    Services Offered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(profile.services || []).map((service, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                        style={{
                          backgroundColor: "var(--accent-fade)",
                          color: "var(--accent-dark)",
                        }}
                      >
                        {service.service?.name || service}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--text-color)" }}
                  >
                    Specialization
                  </h3>
                  <p className="text-sm sm:text-base" style={{ color: "var(--text-color)", opacity: 0.8 }}>
                    {profile.specialization || 'Specialized in providing quality services.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <h4
                    className="font-semibold mb-3 text-sm sm:text-base"
                    style={{ color: "var(--text-color)" }}
                  >
                    Contact Info
                  </h4>
                  <div className="space-y-2">
                    <div
                      className="flex items-center gap-2 text-xs sm:text-sm"
                      style={{ color: "var(--text-color)", opacity: 0.8 }}
                    >
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{profile.userId?.phone || profile.phone || 'Contact via platform'}</span>
                    </div>
                    <div
                      className="flex items-center gap-2 text-xs sm:text-sm"
                      style={{ color: "var(--text-color)", opacity: 0.8 }}
                    >
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{profile.userId?.email || profile.email || 'Contact via platform'}</span>
                    </div>
                    <div
                      className="flex items-center gap-2 text-xs sm:text-sm"
                      style={{ color: "var(--text-color)", opacity: 0.8 }}
                    >
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="break-words">
                        {profile.businessAddress?.street}, {profile.businessAddress?.city}, {profile.businessAddress?.state}{" "}
                        {profile.businessAddress?.pinCode}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <h4
                    className="font-semibold mb-3 text-sm sm:text-base"
                    style={{ color: "var(--text-color)" }}
                  >
                    Service Details
                  </h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div
                      className="flex justify-between"
                      style={{ color: "var(--text-color)" }}
                    >
                      <span>Experience:</span>
                      <span className="font-medium">{profile.experienceYears || 0} years</span>
                    </div>
                    <div
                      className="flex justify-between"
                      style={{ color: "var(--text-color)" }}
                    >
                      <span>Response Time:</span>
                      <span className="font-medium">
                        {profile.responseTime || 'Within 24 hours'}
                      </span>
                    </div>
                    <div
                      className="flex justify-between"
                      style={{ color: "var(--text-color)" }}
                    >
                      <span>Service Area:</span>
                      <span className="font-medium">
                        {profile.businessAddress?.city || 'Local area'}
                      </span>
                    </div>
                    <div
                      className="flex justify-between"
                      style={{ color: "var(--text-color)" }}
                    >
                      <span>Availability:</span>
                      <span className="font-medium">
                        {profile.isAvailable ? 'Available' : 'Busy'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-color)" }}
                >
                  Certifications
                </h3>
                <div className="space-y-2">
                  {(profile.certifications || ['Professional Certification']).map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award
                        className="h-4 w-4"
                        style={{ color: "var(--accent-color)" }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-color)", opacity: 0.8 }}
                      >
                        {cert}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-color)" }}
                >
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(profile.languages || ['English']).map((lang, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                      style={{
                        backgroundColor: "var(--card-bg)",
                        color: "var(--text-color)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >
              <button
                className="flex-1 py-3 rounded-xl font-semibold transition-colors text-sm sm:text-base"
                style={{
                  background: "var(--btn-bg)",
                  color: "white",
                }}
                onClick={() => handleBookService(profile)}
              >
                Book Service
              </button>
              <div className="flex gap-3 justify-center sm:justify-start">
                <button
                  onClick={() => toggleFavorite(profile._id)}
                  className="p-3 rounded-xl transition-colors"
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
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite ? "fill-current" : ""}`}
                  />
                </button>
                <button
                  className="p-3 rounded-xl transition-colors"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    color: "var(--text-color)",
                    border: "1px solid var(--border-color)",
                  }}
                >
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
            onConfirm={handleBookingConfirm}
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
              <div className="relative flex-1">
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5"
                  style={{ opacity: 0.7 }}
                />
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 rounded-xl focus:ring-2 focus:outline-none text-sm sm:text-base"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    color: "var(--text-color)",
                    border: "1px solid var(--border-color)",
                  }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl focus:ring-2 focus:outline-none text-sm sm:text-base flex-1 sm:flex-none min-w-[140px]"
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--text-color)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <option value="all">All Categories</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="cleaning">Cleaning</option>
                <option value="tutoring">Tutoring</option>
                <option value="salon">Salon & Beauty</option>
                <option value="home repair">Home Repair</option>
              </select>

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
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-color)" }}>
            {serviceName || 'Service Providers'}
          </h1>
          <p className="text-sm sm:text-base" style={{ color: "var(--text-color)", opacity: 0.7 }}>
            {loading ? 'Loading...' : (
              <>Found{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--text-color)" }}
              >
                {filteredProviders.length}
              </span>{" "}
              service providers
              {locationQuery && ` in ${locationQuery}`}</>
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