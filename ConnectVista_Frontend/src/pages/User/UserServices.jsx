"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid3X3, List, Star, MapPin, Clock, Heart, Share2, ChevronRight, Droplets, Zap, Sparkles, BookOpen, Scissors, Hammer, Code, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const UserServices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  const serviceCategories = [
    { id: "all", name: "All Services", icon: "🔧", count: 28, lucideIcon: <Sparkles className="h-5 w-5" /> },
    { id: "plumbing", name: "Plumbing", icon: "🚿", count: 12, lucideIcon: <Droplets className="h-5 w-5" /> },
    { id: "electrical", name: "Electrical", icon: "⚡", count: 8, lucideIcon: <Zap className="h-5 w-5" /> },
    { id: "cleaning", name: "Cleaning", icon: "🧹", count: 6, lucideIcon: <Sparkles className="h-5 w-5" /> },
    { id: "tutoring", name: "Tutoring", icon: "📚", count: 4, lucideIcon: <BookOpen className="h-5 w-5" /> },
    { id: "beauty", name: "Beauty & Salon", icon: "💅", count: 5, lucideIcon: <Scissors className="h-5 w-5" /> },
    { id: "repair", name: "Home Repair", icon: "🔨", count: 3, lucideIcon: <Hammer className="h-5 w-5" /> },
    { id: "web", name: "Web Development", icon: "💻", count: 4, lucideIcon: <Code className="h-5 w-5" /> },
    { id: "events", name: "Events", icon: "🎉", count: 3, lucideIcon: <Calendar className="h-5 w-5" /> },
  ];

  // Get category icon with fallback
  const getCategoryIcon = (categoryId) => {
    const category = serviceCategories.find(c => c.id === categoryId);
    return category?.lucideIcon || <Sparkles className="h-5 w-5" />;
  };

  const allServices = [
    {
      id: 1,
      title: 'Plumbing Services',
      description: 'Expert plumbers for leaks, installations, and repairs with 24/7 emergency service',
      image: '/icons/plumbing.png',
      category: 'plumbing',
      rating: 4.8,
      reviews: 1247,
      price: 'Starts at ₹499',
      featured: true,
      tags: ['Emergency', 'Installation', 'Repair'],
      deliveryTime: 'Within 2 hours',
      location: 'All over city',
      providerCount: 156,
      popularServices: ['Leak Repair', 'Pipe Installation', 'Drain Cleaning']
    },
    {
      id: 2,
      title: 'Electrical Services',
      description: 'Licensed electricians for wiring, installations, and electrical repairs',
      image: '/icons/electrical.png',
      category: 'electrical',
      rating: 4.7,
      reviews: 892,
      price: 'Starts at ₹299',
      featured: true,
      tags: ['Wiring', 'Safety', 'Installation'],
      deliveryTime: 'Same day',
      location: 'Urban areas',
      providerCount: 89,
      popularServices: ['Wiring', 'Panel Upgrades', 'Lighting']
    },
    {
      id: 3,
      title: 'Home Cleaning',
      description: 'Professional deep cleaning for homes, offices with eco-friendly products',
      image: '/icons/cleaning.png',
      category: 'cleaning',
      rating: 4.9,
      reviews: 2156,
      price: 'Starts at ₹799',
      featured: false,
      tags: ['Deep Clean', 'Eco-friendly'],
      deliveryTime: 'Next day',
      location: 'City wide',
      providerCount: 203,
      popularServices: ['Deep Cleaning', 'Office Cleaning', 'Carpet Cleaning']
    },
    {
      id: 4,
      title: 'Private Tutoring',
      description: 'Qualified tutors for all subjects, competitive exams, and skill development',
      image: '/icons/tutoring.png',
      category: 'tutoring',
      rating: 4.6,
      reviews: 567,
      price: 'Starts at ₹299/hr',
      featured: true,
      tags: ['Academic', 'Competitive'],
      deliveryTime: 'Flexible',
      location: 'Online & Offline',
      providerCount: 67,
      popularServices: ['Math', 'Science', 'Test Prep']
    },
    {
      id: 5,
      title: 'Salon & Beauty',
      description: 'Professional hair styling, spa treatments, and beauty services at home',
      image: '/icons/salon.png',
      category: 'beauty',
      rating: 4.8,
      reviews: 1789,
      price: 'Starts at ₹399',
      featured: false,
      tags: ['At Home', 'Premium'],
      deliveryTime: '2-4 hours',
      location: 'At your doorstep',
      providerCount: 234,
      popularServices: ['Hair Styling', 'Spa', 'Makeup']
    },
    {
      id: 6,
      title: 'Home Repair & Maintenance',
      description: 'Skilled handyman services for all types of home repairs and maintenance',
      image: '/icons/repair.png',
      category: 'repair',
      rating: 4.5,
      reviews: 634,
      price: 'Starts at ₹199',
      featured: false,
      tags: ['Maintenance', 'Quick Fix'],
      deliveryTime: 'Same day',
      location: 'All areas',
      providerCount: 178,
      popularServices: ['Furniture Assembly', 'Painting', 'Minor Repairs']
    },
    {
      id: 7,
      title: 'Web Development',
      description: 'Professional website development and digital solutions for businesses',
      image: '/icons/webdev.png',
      category: 'web',
      rating: 4.7,
      reviews: 423,
      price: 'Starts at ₹5,999',
      featured: true,
      tags: ['Custom', 'Responsive'],
      deliveryTime: '7-14 days',
      location: 'Remote',
      providerCount: 45,
      popularServices: ['Website Development', 'E-commerce', 'Custom Solutions']
    },
    {
      id: 8,
      title: 'Event Planning',
      description: 'Complete event management services for weddings, corporate events, and parties',
      image: '/icons/events.png',
      category: 'events',
      rating: 4.9,
      reviews: 298,
      price: 'Custom Quote',
      featured: false,
      tags: ['Weddings', 'Corporate'],
      deliveryTime: 'As required',
      location: 'Pan India',
      providerCount: 32,
      popularServices: ['Wedding Planning', 'Corporate Events', 'Party Planning']
    },
  ];

  // Filter services
  const filteredServices = useMemo(() => {
    let filtered = allServices;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => 
        service.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Sort services
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/\D/g, ''));
          const priceB = parseInt(b.price.replace(/\D/g, ''));
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/\D/g, ''));
          const priceB = parseInt(b.price.replace(/\D/g, ''));
          return priceB - priceA;
        });
        break;
      default: // popular
        filtered.sort((a, b) => b.reviews - a.reviews);
    }
    
    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  // Navigate to explore page with category filter
  const handleServiceClick = (service) => {
    navigate(`/explore?category=${service.category}&service=${encodeURIComponent(service.title)}`);
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
                        {service.title}
                      </h3>
                      {service.featured && (
                        <span 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
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

                {/* Rating and Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                        {service.rating}
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                        ({service.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{service.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{service.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: 'var(--text-color)' }}>
                      {service.price}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                      {service.providerCount} providers
                    </div>
                  </div>
                </div>

                {/* Tags and Popular Services */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {service.tags.map((tag, index) => (
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
                <div className="mt-2">
                  <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.6 }}>
                    Popular: {service.popularServices.join(', ')}
                  </p>
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

    // Grid View
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

          {/* Service Info */}
          <div className="mb-4 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 
                className="text-lg font-semibold truncate flex-1"
                style={{ color: 'var(--text-color)' }}
              >
                {service.title}
              </h3>
              {service.featured && (
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
              className="text-sm line-clamp-3 mb-3"
              style={{ color: 'var(--text-color)', opacity: 0.7 }}
            >
              {service.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {service.tags.slice(0, 2).map((tag, index) => (
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
            {service.tags.length > 2 && (
              <span 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  color: 'var(--text-color)',
                  opacity: 0.7
                }}
              >
                +{service.tags.length - 2}
              </span>
            )}
          </div>

          {/* Footer with Rating and Price */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                    {service.rating}
                  </span>
                </div>
                <span className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  ({service.reviews})
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: 'var(--text-color)' }}>
                  {service.price}
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  <Clock className="h-3 w-3" />
                  {service.deliveryTime}
                </div>
              </div>
            </div>
            
            {/* Provider Count */}
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <p className="text-sm text-center" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                {service.providerCount} professional providers available
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
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
                  Showing {filteredServices.length} services • {filteredServices.reduce((sum, s) => sum + s.providerCount, 0)} providers available
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
                      ? "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                      : "space-y-4 sm:space-y-6"
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