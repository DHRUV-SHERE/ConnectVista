import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SimpleMapServices from "../../components/User/SimpleMapServices";
import { 
  Search, Filter, Grid3X3, List, Star, MapPin, Clock, 
  Heart, Share2, ChevronRight, Droplets, Zap, Sparkles, 
  BookOpen, Scissors, Hammer, Code, Calendar, Map as MapIcon, Users, Navigation
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { serviceAPI, getCurrentLocation } from '../../services/serviceAPI';

const UserServices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [favorites, setFavorites] = useState(new Set());
  const [userLocation, setUserLocation] = useState({ lat: 20.5937, lng: 78.9629 });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch services from API with location (with throttling)
  useEffect(() => {
    const fetchServicesWithLocation = async () => {
      try {
        setLoading(true);
        
        // Get user location first
        let location = userLocation;
        try {
          location = await getCurrentLocation();
          setUserLocation(location);
        } catch (locationError) {
          console.log('Could not get user location, using default:', locationError);
        }
        
        // Fetch basic services first
        const response = await serviceAPI.getServices();
        setServices(response.data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Add delay to prevent rate limiting
    const timeoutId = setTimeout(fetchServicesWithLocation, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Get user's location on component mount and when map view is selected
  useEffect(() => {
    const updateLocation = async () => {
      if (navigator.geolocation && viewMode === "map" && !userLocation) {
        try {
          const location = await getCurrentLocation();
          setUserLocation(location);
        } catch (error) {
          console.log("Geolocation error:", error);
        }
      }
    };
    
    // Add delay to prevent multiple simultaneous calls
    const timeoutId = setTimeout(updateLocation, 200);
    return () => clearTimeout(timeoutId);
  }, [viewMode, userLocation]);

  const serviceCategories = useMemo(() => {
    if (!services.length) return [];
    
    // Get unique categories from services
    const categoryMap = new Map();
    categoryMap.set('all', { id: 'all', name: 'All Services', count: services.length, lucideIcon: <Sparkles className="h-5 w-5" /> });
    
    services.forEach(service => {
      const category = service.category?.toLowerCase() || 'other';
      if (categoryMap.has(category)) {
        categoryMap.get(category).count++;
      } else {
        const categoryConfig = {
          plumbing: { name: 'Plumbing', lucideIcon: <Droplets className="h-5 w-5" /> },
          electrical: { name: 'Electrical', lucideIcon: <Zap className="h-5 w-5" /> },
          cleaning: { name: 'Cleaning', lucideIcon: <Sparkles className="h-5 w-5" /> },
          tutoring: { name: 'Tutoring', lucideIcon: <BookOpen className="h-5 w-5" /> },
          beauty: { name: 'Beauty & Salon', lucideIcon: <Scissors className="h-5 w-5" /> },
          repair: { name: 'Home Repair', lucideIcon: <Hammer className="h-5 w-5" /> },
          web: { name: 'Web Development', lucideIcon: <Code className="h-5 w-5" /> },
          events: { name: 'Events', lucideIcon: <Calendar className="h-5 w-5" /> },
        };
        
        categoryMap.set(category, {
          id: category,
          name: categoryConfig[category]?.name || category.charAt(0).toUpperCase() + category.slice(1),
          count: 1,
          lucideIcon: categoryConfig[category]?.lucideIcon || <Sparkles className="h-5 w-5" />
        });
      }
    });
    
    return Array.from(categoryMap.values());
  }, [services]);

  // Get category icon with fallback
  const getCategoryIcon = (categoryId) => {
    const category = serviceCategories.find(c => c.id === categoryId);
    return category?.lucideIcon || <Sparkles className="h-5 w-5" />;
  };

  // Filter services
  const filteredServices = useMemo(() => {
    let filtered = services;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => 
        service.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort services
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.maxPrice || 0) - (a.maxPrice || 0));
        break;
      default: // popular
        filtered.sort((a, b) => (b.providerCount || 0) - (a.providerCount || 0));
    }
    
    return filtered;
  }, [services, searchQuery, selectedCategory, sortBy]);

  // Navigate to explore page with service ID
  const handleServiceClick = (service) => {
    navigate(`/user/explore?serviceId=${service._id}&serviceName=${encodeURIComponent(service.name)}`);
  };

  // ServiceCard Component
  const ServiceCard = ({ service, viewMode = "grid" }) => {
    const isFavorite = favorites.has(service.id);

    const toggleFavorite = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const newFavorites = new Set(favorites);
      if (isFavorite) {
        newFavorites.delete(service.id);
      } else {
        newFavorites.add(service.id);
      }
      setFavorites(newFavorites);
    };

    const categoryIcon = getCategoryIcon(service.category);

    if (viewMode === "list") {
      return (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border cursor-pointer"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
          }}
          onClick={() => handleServiceClick(service)}
        >
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Service Image */}
              <div className="flex-shrink-0 w-full sm:w-24">
                <div 
                  className="w-full h-48 sm:h-24 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'var(--accent-color)',
                    opacity: 0.1
                  }}
                >
                  <div 
                    className="w-20 h-20 rounded-xl shadow-sm flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--bg-color)'
                    }}
                  >
                    <div style={{ color: 'var(--accent-color)' }}>
                      {categoryIcon}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 
                        className="text-xl font-semibold truncate"
                        style={{ color: 'var(--text-color)' }}
                      >
                        {service.name}
                      </h3>
                    </div>
                    <p 
                      className="mt-2 line-clamp-2"
                      style={{ color: 'var(--text-color)', opacity: 0.7 }}
                    >
                      {service.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={toggleFavorite}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        isFavorite 
                          ? "text-red-500" 
                          : "text-gray-400 hover:text-red-500"
                      }`}
                      style={{
                        backgroundColor: isFavorite ? 'var(--accent-fade)' : 'var(--card-bg)'
                      }}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Footer with Provider Count and Price */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: 'var(--text-color)' }}>
                      ₹{service.minPrice || 0} - ₹{service.maxPrice || 0}
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                      <Users className="h-3 w-3" />
                      {service.providerCount || 0} providers
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Explore Button */}
            <div className="flex justify-end mt-4">
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors"
                style={{
                  background: 'var(--accent-color)',
                  color: 'white'
                }}
                onClick={() => handleServiceClick(service)}
              >
                Explore Providers
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      );
    }

    if (viewMode === "grid") {
      return (
        <motion.div
          whileHover={{ y: -5 }}
          className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border cursor-pointer group h-full"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
          }}
          onClick={() => handleServiceClick(service)}
        >
          <div className="p-6 h-full flex flex-col">
            {/* Header with Image and Actions */}
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'var(--accent-color)',
                  opacity: 0.1
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl shadow-sm flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--bg-color)'
                  }}
                >
                  <div style={{ color: 'var(--accent-color)' }}>
                    {categoryIcon}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(e);
                  }}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isFavorite 
                      ? "text-red-500" 
                      : "text-gray-400 hover:text-red-500"
                  }`}
                  style={{
                    backgroundColor: isFavorite ? 'var(--accent-fade)' : 'var(--card-bg)'
                  }}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>

            {/* Service Info */}
            <div className="mb-4 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 
                  className="text-lg font-semibold truncate flex-1"
                  style={{ color: 'var(--text-color)' }}
                >
                  {service.name}
                </h3>
              </div>
              <p 
                className="text-sm line-clamp-3 mb-3"
                style={{ color: 'var(--text-color)', opacity: 0.7 }}
              >
                {service.description}
              </p>
            </div>

            {/* Footer with Provider Count and Price */}
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: 'var(--text-color)' }}>
                    ₹{service.minPrice || 0} - ₹{service.maxPrice || 0}
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                    <Users className="h-3 w-3" />
                    {service.providerCount || 0} providers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'var(--background)',
        color: 'var(--text-color)'
      }}
    >
      {/* Hero Section */}
      <section 
        className="relative py-12 md:py-16 lg:py-20 px-4"
        style={{
          background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--accent-dark) 100%)',
          color: 'var(--foreground)'
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Find Professional Services
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 max-w-2xl mx-auto px-4">
              Browse categories, compare providers, and book trusted professionals for all your needs
            </p>
            
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative max-w-2xl mx-auto pt-4 px-4"
            >
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
              <input
                type="text"
                placeholder="Search for services, professionals, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 sm:pl-14 pr-4 py-3 sm:py-4 rounded-2xl border-0 focus:ring-2 focus:outline-none text-base sm:text-lg shadow-xl bg-white text-gray-900"
              />
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 pt-6 sm:pt-8 opacity-90 px-4"
            >
              {[
                { value: "5000+", label: "Services" },
                { value: "10K+", label: "Professionals" },
                { value: "50K+", label: "Happy Customers" },
                { value: "4.8", label: "Avg Rating" }
              ].map((stat, index) => (
                <div key={index} className="text-center px-2">
                  <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar - Categories & Filters */}
          <div className="lg:w-1/4">
            {/* Sticky Container */}
            <div className="sticky top-6 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Categories */}
                <div 
                  className="rounded-2xl shadow-lg p-4 sm:p-6 mb-6"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <h3 
                    className="text-lg font-semibold mb-4 flex items-center"
                    style={{ color: 'var(--text-color)' }}
                  >
                    <Filter className="h-5 w-5 mr-2" style={{ color: 'var(--accent-color)' }} />
                    Service Categories
                  </h3>
                  <div className="space-y-2">
                    {serviceCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                          selectedCategory === category.id
                            ? "font-semibold shadow-sm"
                            : "hover:opacity-90 hover:shadow"
                        }`}
                        style={{
                          backgroundColor: selectedCategory === category.id ? 'var(--accent-color)' : 'transparent',
                          color: selectedCategory === category.id ? 'white' : 'var(--text-color)'
                        }}
                      >
                        <div className="flex items-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3">
                            {category.lucideIcon}
                          </div>
                          <span className="text-sm sm:text-base">{category.name}</span>
                        </div>
                        <span 
                          className="text-xs sm:text-sm px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: selectedCategory === category.id ? 'rgba(255,255,255,0.2)' : 'var(--border-color)',
                            color: selectedCategory === category.id ? 'white' : 'var(--text-color)'
                          }}
                        >
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div 
                  className="rounded-2xl shadow-lg p-4 sm:p-6"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{ color: 'var(--text-color)' }}
                  >
                    Sort By
                  </h3>
                  <div className="space-y-2">
                    {[
                      { value: "popular", label: "Most Popular", icon: "🔥" },
                      { value: "rating", label: "Highest Rated", icon: "⭐" },
                      { value: "reviews", label: "Most Reviews", icon: "💬" },
                      { value: "price-low", label: "Price: Low to High", icon: "💰" },
                      { value: "price-high", label: "Price: High to Low", icon: "💎" }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`w-full text-left p-2 sm:p-3 rounded-xl transition-all duration-200 flex items-center gap-2 sm:gap-3 ${
                          sortBy === option.value
                            ? "font-semibold shadow-sm"
                            : "hover:opacity-90"
                        }`}
                        style={{
                          backgroundColor: sortBy === option.value ? 'var(--accent-color)' : 'transparent',
                          color: sortBy === option.value ? 'white' : 'var(--text-color)'
                        }}
                      >
                        <span className="text-base sm:text-lg">{option.icon}</span>
                        <span className="text-sm sm:text-base">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:w-3/4">
            {/* View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="w-full sm:w-auto">
                <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                  {selectedCategory === 'all' ? 'All Services' : 
                   serviceCategories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p style={{ color: 'var(--text-color)', opacity: 0.7 }} className="mt-1 text-sm sm:text-base">
                  Showing {filteredServices.length} services • {filteredServices.reduce((sum, s) => sum + (s.providerCount || 0), 0)} providers available
                </p>
              </div>
              <div className="flex gap-2 self-end sm:self-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" 
                      ? "text-white shadow-sm" 
                      : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: viewMode === "grid" ? 'var(--accent-color)' : 'var(--card-bg)',
                    color: viewMode === "grid" ? 'white' : 'var(--text-color)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" 
                      ? "text-white shadow-sm" 
                      : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: viewMode === "list" ? 'var(--accent-color)' : 'var(--card-bg)',
                    color: viewMode === "list" ? 'white' : 'var(--text-color)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <List className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "map" 
                      ? "text-white shadow-sm" 
                      : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: viewMode === "map" ? 'var(--accent-color)' : 'var(--card-bg)',
                    color: viewMode === "map" ? 'white' : 'var(--text-color)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <MapIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>

            {/* Services Grid/List/Map */}
            <AnimatePresence>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : viewMode === "map" ? (
                <SimpleMapServices 
                  services={filteredServices}
                  userLocation={userLocation}
                  onServiceClick={handleServiceClick}
                  setViewMode={setViewMode}
                />
              ) : filteredServices.length > 0 ? (
                <motion.div
                  key={viewMode}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                  className={
                    viewMode === "grid" 
                      ? "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                      : "space-y-4 sm:space-y-6"
                  }
                >
                  {filteredServices.map((service) => (
                    <motion.div
                      key={service._id}
                      variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1 }
                      }}
                      layout
                    >
                      <ServiceCard 
                        service={service}
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 sm:py-16"
                >
                  <div className="text-5xl sm:text-6xl mb-4" style={{ opacity: 0.3 }}>🔍</div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                    No services found
                  </h3>
                  <p style={{ color: 'var(--text-color)', opacity: 0.7 }} className="px-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-4 px-6 py-2 rounded-xl font-medium transition-colors"
                    style={{
                      background: 'var(--accent-color)',
                      color: 'white'
                    }}
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserServices;