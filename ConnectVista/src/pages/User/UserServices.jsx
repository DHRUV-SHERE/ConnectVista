"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid3X3, List, Star, MapPin, Clock, Heart, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const UserServices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [favorites, setFavorites] = useState(new Set());

  const serviceCategories = [
    { id: "all", name: "All Services", icon: "🔧", count: 28 },
    { id: "home", name: "Home Services", icon: "🏠", count: 12 },
    { id: "professional", name: "Professional", icon: "💼", count: 8 },
    { id: "beauty", name: "Beauty & Wellness", icon: "💅", count: 6 },
    { id: "education", name: "Education", icon: "📚", count: 4 },
    { id: "tech", name: "Technology", icon: "💻", count: 5 },
    { id: "events", name: "Events", icon: "🎉", count: 3 },
  ];

  const allServices = [
    {
      id: 1,
      title: 'Plumbing Services',
      description: 'Expert plumbers for leaks, installations, and repairs with 24/7 emergency service',
      image: '/icons/plumbing.png',
      to: '/services/plumbing',
      category: 'home',
      rating: 4.8,
      reviews: 1247,
      price: 'Starts at ₹499',
      featured: true,
      tags: ['Emergency', 'Installation', 'Repair'],
      deliveryTime: 'Within 2 hours',
      location: 'All over city'
    },
    {
      id: 2,
      title: 'Electrical Services',
      description: 'Licensed electricians for wiring, installations, and electrical repairs',
      image: '/icons/electrical.png',
      to: '/services/electrical',
      category: 'home',
      rating: 4.7,
      reviews: 892,
      price: 'Starts at ₹299',
      featured: true,
      tags: ['Wiring', 'Safety', 'Installation'],
      deliveryTime: 'Same day',
      location: 'Urban areas'
    },
    {
      id: 3,
      title: 'Home Cleaning',
      description: 'Professional deep cleaning for homes, offices with eco-friendly products',
      image: '/icons/cleaning.png',
      to: '/services/cleaning',
      category: 'home',
      rating: 4.9,
      reviews: 2156,
      price: 'Starts at ₹799',
      featured: false,
      tags: ['Deep Clean', 'Eco-friendly'],
      deliveryTime: 'Next day',
      location: 'City wide'
    },
    {
      id: 4,
      title: 'Private Tutoring',
      description: 'Qualified tutors for all subjects, competitive exams, and skill development',
      image: '/icons/tutoring.png',
      to: '/services/tutoring',
      category: 'education',
      rating: 4.6,
      reviews: 567,
      price: 'Starts at ₹299/hr',
      featured: true,
      tags: ['Academic', 'Competitive'],
      deliveryTime: 'Flexible',
      location: 'Online & Offline'
    },
    {
      id: 5,
      title: 'Salon & Beauty',
      description: 'Professional hair styling, spa treatments, and beauty services at home',
      image: '/icons/salon.png',
      to: '/services/salon',
      category: 'beauty',
      rating: 4.8,
      reviews: 1789,
      price: 'Starts at ₹399',
      featured: false,
      tags: ['At Home', 'Premium'],
      deliveryTime: '2-4 hours',
      location: 'At your doorstep'
    },
    {
      id: 6,
      title: 'Home Repair & Maintenance',
      description: 'Skilled handyman services for all types of home repairs and maintenance',
      image: '/icons/repair.png',
      to: '/services/repair',
      category: 'home',
      rating: 4.5,
      reviews: 634,
      price: 'Starts at ₹199',
      featured: false,
      tags: ['Maintenance', 'Quick Fix'],
      deliveryTime: 'Same day',
      location: 'All areas'
    },
    {
      id: 7,
      title: 'Web Development',
      description: 'Professional website development and digital solutions for businesses',
      image: '/icons/webdev.png',
      to: '/services/web-development',
      category: 'tech',
      rating: 4.7,
      reviews: 423,
      price: 'Starts at ₹5,999',
      featured: true,
      tags: ['Custom', 'Responsive'],
      deliveryTime: '7-14 days',
      location: 'Remote'
    },
    {
      id: 8,
      title: 'Event Planning',
      description: 'Complete event management services for weddings, corporate events, and parties',
      image: '/icons/events.png',
      to: '/services/event-planning',
      category: 'events',
      rating: 4.9,
      reviews: 298,
      price: 'Custom Quote',
      featured: false,
      tags: ['Weddings', 'Corporate'],
      deliveryTime: 'As required',
      location: 'Pan India'
    },
  ];

  // ServiceCard Component with theme support
  const ServiceCard = ({ 
    id,
    title, 
    description, 
    image, 
    to, 
    rating, 
    reviews, 
    price, 
    featured, 
    tags, 
    deliveryTime, 
    location, 
    viewMode = "grid" 
  }) => {
    const isFavorite = favorites.has(id);

    const toggleFavorite = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const newFavorites = new Set(favorites);
      if (isFavorite) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      setFavorites(newFavorites);
    };

    if (viewMode === "list") {
      return (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
          }}
        >
          <Link to={to} className="block">
            <div className="p-6">
              <div className="flex items-start gap-6">
                {/* Service Image */}
                <div className="flex-shrink-0">
                  <div 
                    className="w-24 h-24 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'var(--btn-bg)',
                      opacity: 0.1
                    }}
                  >
                    <div 
                      className="w-16 h-16 rounded-xl shadow-sm flex items-center justify-center"
                      style={{
                        backgroundColor: 'var(--bg-color)'
                      }}
                    >
                      <span className="text-2xl">🔧</span>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 
                        className="text-xl font-semibold truncate"
                        style={{ color: 'var(--text-color)' }}
                      >
                        {title}
                        {featured && (
                          <span 
                            className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: 'var(--accent-fade)',
                              color: 'var(--accent-dark)'
                            }}
                          >
                            Featured
                          </span>
                        )}
                      </h3>
                      <p 
                        className="mt-1 line-clamp-2"
                        style={{ color: 'var(--text-color)', opacity: 0.7 }}
                      >
                        {description}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
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
                      <button 
                        className="p-2 rounded-full transition-all duration-200"
                        style={{
                          backgroundColor: 'var(--card-bg)',
                          color: 'var(--text-color)'
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Rating and Price */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                          {rating}
                        </span>
                        <span className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                          ({reviews})
                        </span>
                      </div>
                      <div className="flex items-center gap-1" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color: 'var(--text-color)' }}>
                        {price}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--accent-fade)',
                          color: 'var(--accent-dark)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      );
    }

    // Grid View
    return (
      <motion.div
        whileHover={{ y: -5 }}
        className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border group"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
        }}
      >
        <Link to={to} className="block">
          <div className="p-6">
            {/* Header with Image and Actions */}
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'var(--btn-bg)',
                  opacity: 0.1
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl shadow-sm flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--bg-color)'
                  }}
                >
                  <span className="text-xl">🔧</span>
                </div>
              </div>
              <div className="flex gap-1">
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
                <button 
                  className="p-2 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)'
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Service Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 
                  className="text-lg font-semibold truncate flex-1"
                  style={{ color: 'var(--text-color)' }}
                >
                  {title}
                </h3>
                {featured && (
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shrink-0"
                    style={{
                      backgroundColor: 'var(--accent-fade)',
                      color: 'var(--accent-dark)'
                    }}
                  >
                    Featured
                  </span>
                )}
              </div>
              <p 
                className="text-sm line-clamp-2 mb-3"
                style={{ color: 'var(--text-color)', opacity: 0.7 }}
              >
                {description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: 'var(--accent-fade)',
                    color: 'var(--accent-dark)'
                  }}
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span 
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    opacity: 0.7
                  }}
                >
                  +{tags.length - 2}
                </span>
              )}
            </div>

            {/* Footer with Rating and Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                    {rating}
                  </span>
                </div>
                <span className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  ({reviews})
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: 'var(--text-color)' }}>
                  {price}
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  <Clock className="h-3 w-3" />
                  {deliveryTime}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  // Filter and search services (same as before)
  const filteredServices = useMemo(() => {
    let filtered = allServices;
    // ... filtering logic
    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

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
        className="relative py-16 md:py-20"
        style={{
          background: 'var(--btn-bg)',
          color: 'var(--foreground)'
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center text-white space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold">
              Discover Amazing Services
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Find trusted professionals for all your needs. Quality services, just a click away.
            </p>
            
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative max-w-2xl mx-auto pt-4"
            >
              <Search className="absolute left-4 mt-7 text-black transform -translate-y-1/2 h-6 w-6" style={{ opacity: 0.7 }} />
              <input
                type="text"
                placeholder="Search for services, professionals, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 focus:ring-2 focus:outline-none text-lg shadow-xl"
                style={{
                  background: 'var(--overlay-bg)',
                  color: 'var(--overlay-text)'
                }}
              />
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex justify-center gap-8 pt-8 opacity-90"
            >
              <div className="text-center">
                <div className="text-2xl font-bold">5000+</div>
                <div className="text-sm">Services</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm">Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm">Happy Customers</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories & Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/4 space-y-6"
          >
            {/* Categories */}
            <div 
              className="rounded-2xl shadow-lg p-6"
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
                Categories
              </h3>
              <div className="space-y-2">
                {serviceCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      selectedCategory === category.id
                        ? "font-semibold"
                        : "hover:opacity-80"
                    }`}
                    style={{
                      backgroundColor: selectedCategory === category.id ? 'var(--accent-color)' : 'transparent',
                      color: selectedCategory === category.id ? 'white' : 'var(--text-color)'
                    }}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <span 
                      className="text-sm px-2 py-1 rounded-full"
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
              className="rounded-2xl shadow-lg p-6"
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
                  { value: "popular", label: "Most Popular" },
                  { value: "rating", label: "Highest Rated" },
                  { value: "reviews", label: "Most Reviews" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                      sortBy === option.value
                        ? "font-semibold"
                        : "hover:opacity-80"
                    }`}
                    style={{
                      backgroundColor: sortBy === option.value ? 'var(--accent-color)' : 'transparent',
                      color: sortBy === option.value ? 'white' : 'var(--text-color)'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Services Grid */}
          <div className="lg:w-3/4">
            {/* View Controls */}
            <div className="flex justify-between items-center mb-6">
              <div style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                Showing {filteredServices.length} of {allServices.length} services
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" 
                      ? "text-white" 
                      : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: viewMode === "grid" ? 'var(--accent-color)' : 'var(--card-bg)',
                    color: viewMode === "grid" ? 'white' : 'var(--text-color)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" 
                      ? "text-white" 
                      : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: viewMode === "list" ? 'var(--accent-color)' : 'var(--card-bg)',
                    color: viewMode === "list" ? 'white' : 'var(--text-color)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Services Grid/List */}
            <AnimatePresence>
              {filteredServices.length > 0 ? (
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
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredServices.map((service) => (
                    <motion.div
                      key={service.id}
                      variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1 }
                      }}
                      layout
                    >
                      <ServiceCard 
                        {...service} 
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4" style={{ opacity: 0.3 }}>🔍</div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                    No services found
                  </h3>
                  <p style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                    Try adjusting your search or filter criteria
                  </p>
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