"use client";
import { useState, useMemo } from "react";
import BookingModal from "./UserBookingModel";
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

const UserExplore = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("distance");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  const providers = [
    {
      id: 1,
      name: "QuickFix Plumbing",
      businessName: "QuickFix Plumbing Solutions",
      category: "Plumbing",
      rating: 4.8,
      reviews: 156,
      price: "$$",
      distance: "0.5 mi",
      description:
        "Professional plumbing services with 24/7 emergency support. Specialized in leak detection, pipe repair, and installation services.",
      verified: true,
      email: "contact@quickfixplumbing.com",
      phone: "+1 (555) 123-4567",
      experience: "8 years",
      specialization: "Residential & Commercial Plumbing",
      address: "123 Main Street, Downtown",
      city: "New York",
      state: "NY",
      pinCode: "10001",
      serviceArea: "10 miles radius",
      responseTime: "Within 2 hours",
      languages: ["English", "Spanish"],
      certifications: ["Licensed Plumber", "Insurance Certified"],
      services: [
        "Leak Repair",
        "Pipe Installation",
        "Drain Cleaning",
        "Water Heater",
      ],
      availability: "24/7 Emergency Service",
      images: ["/plumbing1.jpg", "/plumbing2.jpg"],
      joinedDate: "2022-03-15",
    },
    {
      id: 2,
      name: "Bright Spark Electric",
      businessName: "Bright Spark Electrical Services",
      category: "Electrical",
      rating: 4.9,
      reviews: 203,
      price: "$$$",
      distance: "1.2 mi",
      description:
        "Licensed electricians for residential and commercial work. Expert in wiring, panel upgrades, and electrical repairs.",
      verified: true,
      email: "info@brightspark.com",
      phone: "+1 (555) 987-6543",
      experience: "12 years",
      specialization: "Electrical Systems & Safety",
      address: "456 Electric Ave",
      city: "New York",
      state: "NY",
      pinCode: "10002",
      serviceArea: "15 miles radius",
      responseTime: "Same day",
      languages: ["English"],
      certifications: ["Master Electrician", "Safety Certified"],
      services: [
        "Wiring",
        "Panel Upgrades",
        "Lighting Installation",
        "Safety Inspection",
      ],
      availability: "Mon-Sun: 7 AM - 9 PM",
      images: ["/electrical1.jpg", "/electrical2.jpg"],
      joinedDate: "2021-08-22",
    },
    {
      id: 3,
      name: "Clean Sweep Co.",
      businessName: "Clean Sweep Professional Cleaning",
      category: "Cleaning",
      rating: 4.7,
      reviews: 89,
      price: "$",
      distance: "0.8 mi",
      description:
        "Eco-friendly cleaning services for homes and offices. Using sustainable products for a healthier environment.",
      verified: true,
      email: "hello@cleansweep.com",
      phone: "+1 (555) 456-7890",
      experience: "5 years",
      specialization: "Eco-Friendly Cleaning",
      address: "789 Clean Street",
      city: "New York",
      state: "NY",
      pinCode: "10003",
      serviceArea: "20 miles radius",
      responseTime: "Next day",
      languages: ["English", "French"],
      certifications: ["Green Cleaning Certified"],
      services: [
        "Deep Cleaning",
        "Office Cleaning",
        "Move-in/Move-out",
        "Carpet Cleaning",
      ],
      availability: "Mon-Fri: 8 AM - 6 PM",
      images: ["/cleaning1.jpg", "/cleaning2.jpg"],
      joinedDate: "2023-01-10",
    },
    {
      id: 4,
      name: "Math Masters Tutoring",
      businessName: "Math Masters Education Center",
      category: "Tutoring",
      rating: 5.0,
      reviews: 67,
      price: "$$",
      distance: "1.5 mi",
      description:
        "Expert tutors for math, science, and test prep. Personalized learning approach for all age groups.",
      verified: true,
      email: "learn@mathmasters.com",
      phone: "+1 (555) 234-5678",
      experience: "6 years",
      specialization: "STEM Education",
      address: "321 Education Blvd",
      city: "New York",
      state: "NY",
      pinCode: "10004",
      serviceArea: "Online & 25 miles radius",
      responseTime: "Within 24 hours",
      languages: ["English", "Mandarin"],
      certifications: ["Teaching License", "STEM Certified"],
      services: [
        "Math Tutoring",
        "Science Classes",
        "Test Preparation",
        "Homework Help",
      ],
      availability: "Flexible hours",
      images: ["/tutoring1.jpg", "/tutoring2.jpg"],
      joinedDate: "2022-11-05",
    },
    {
      id: 5,
      name: "Style Studio Salon",
      businessName: "Style Studio Beauty Salon",
      category: "Salon",
      rating: 4.6,
      reviews: 234,
      price: "$$",
      distance: "2.1 mi",
      description:
        "Full-service salon with experienced stylists. Modern techniques and premium products for best results.",
      verified: false,
      email: "book@stylestudio.com",
      phone: "+1 (555) 345-6789",
      experience: "4 years",
      specialization: "Hair & Beauty",
      address: "654 Beauty Lane",
      city: "New York",
      state: "NY",
      pinCode: "10005",
      serviceArea: "5 miles radius",
      responseTime: "2-4 hours",
      languages: ["English", "Spanish", "Italian"],
      certifications: ["Beauty License"],
      services: ["Hair Styling", "Spa Treatments", "Makeup", "Nail Care"],
      availability: "Tue-Sun: 9 AM - 8 PM",
      images: ["/salon1.jpg", "/salon2.jpg"],
      joinedDate: "2023-06-18",
    },
    {
      id: 6,
      name: "HandyPro Services",
      businessName: "HandyPro Home Solutions",
      category: "Home Repair",
      rating: 4.8,
      reviews: 178,
      price: "$$",
      distance: "1.8 mi",
      description:
        "General repairs and home maintenance specialists. Quick and reliable service for all home needs.",
      verified: true,
      email: "service@handypro.com",
      phone: "+1 (555) 876-5432",
      experience: "10 years",
      specialization: "Home Maintenance & Repair",
      address: "987 Repair Road",
      city: "New York",
      state: "NY",
      pinCode: "10006",
      serviceArea: "30 miles radius",
      responseTime: "Same day",
      languages: ["English"],
      certifications: ["General Contractor", "Safety Certified"],
      services: [
        "Furniture Assembly",
        "Painting",
        "Minor Repairs",
        "Installation",
      ],
      availability: "Mon-Sat: 7 AM - 7 PM",
      images: ["/repair1.jpg", "/repair2.jpg"],
      joinedDate: "2021-12-03",
    },
  ];

  const filteredProviders = useMemo(() => {
    let filtered = providers;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (provider) =>
          provider.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.businessName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          provider.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          provider.specialization
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (locationQuery) {
      filtered = filtered.filter(
        (provider) =>
          provider.city.toLowerCase().includes(locationQuery.toLowerCase()) ||
          provider.address.toLowerCase().includes(locationQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case "price-low":
        const priceOrder = { $: 1, $$: 2, $$$: 3, $$$$: 4 };
        filtered.sort((a, b) => priceOrder[a.price] - priceOrder[b.price]);
        break;
      case "price-high":
        const priceOrderHigh = { $: 1, $$: 2, $$$: 3, $$$$: 4 };
        filtered.sort(
          (a, b) => priceOrderHigh[b.price] - priceOrderHigh[a.price]
        );
        break;
      case "experience":
        filtered.sort(
          (a, b) => parseInt(b.experience) - parseInt(a.experience)
        );
        break;
      default: // distance
        filtered.sort(
          (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
        );
    }

    return filtered;
  }, [selectedCategory, sortBy, searchQuery, locationQuery]);

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
    const isFavorite = favorites.has(provider.id);

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
                {provider.businessName}
              </h2>
              <p className="text-sm sm:text-base" style={{ color: "var(--text-color)", opacity: 0.7 }}>
                {provider.category} Services
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
                    {provider.description}
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
                    {provider.services.map((service, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                        style={{
                          backgroundColor: "var(--accent-fade)",
                          color: "var(--accent-dark)",
                        }}
                      >
                        {service}
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
                    {provider.specialization}
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
                      <span>{provider.phone}</span>
                    </div>
                    <div
                      className="flex items-center gap-2 text-xs sm:text-sm"
                      style={{ color: "var(--text-color)", opacity: 0.8 }}
                    >
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{provider.email}</span>
                    </div>
                    <div
                      className="flex items-center gap-2 text-xs sm:text-sm"
                      style={{ color: "var(--text-color)", opacity: 0.8 }}
                    >
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="break-words">
                        {provider.address}, {provider.city}, {provider.state}{" "}
                        {provider.pinCode}
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
                      <span className="font-medium">{provider.experience}</span>
                    </div>
                    <div
                      className="flex justify-between"
                      style={{ color: "var(--text-color)" }}
                    >
                      <span>Response Time:</span>
                      <span className="font-medium">
                        {provider.responseTime}
                      </span>
                    </div>
                    <div
                      className="flex justify-between"
                      style={{ color: "var(--text-color)" }}
                    >
                      <span>Service Area:</span>
                      <span className="font-medium">
                        {provider.serviceArea}
                      </span>
                    </div>
                    <div
                      className="flex justify-between"
                      style={{ color: "var(--text-color)" }}
                    >
                      <span>Availability:</span>
                      <span className="font-medium">
                        {provider.availability}
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
                  {provider.certifications.map((cert, index) => (
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
                  {provider.languages.map((lang, index) => (
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
                onClick={() => handleBookService(provider)}
              >
                Book Service
              </button>
              <div className="flex gap-3 justify-center sm:justify-start">
                <button
                  onClick={() => toggleFavorite(provider.id)}
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
                <option value="distance">Distance</option>
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
          <p className="text-sm sm:text-base" style={{ color: "var(--text-color)", opacity: 0.7 }}>
            Found{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--text-color)" }}
            >
              {filteredProviders.length}
            </span>{" "}
            service providers
            {locationQuery && ` in ${locationQuery}`}
          </p>
        </div>

        <AnimatePresence>
          {viewMode === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
            >
              {filteredProviders.map((provider) => {
                const isFavorite = favorites.has(provider.id);
                return (
                  <motion.div
                    key={provider.id}
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
                              {provider.businessName}
                            </h3>
                            {provider.verified && (
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
                            {provider.category} • {provider.specialization}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className="flex items-center gap-1 text-xs sm:text-sm font-semibold"
                            style={{ color: "var(--text-color)" }}
                          >
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                            {provider.rating}
                            <span style={{ opacity: 0.7 }}>
                              ({provider.reviews})
                            </span>
                          </div>
                          <div
                            className="flex items-center gap-1 text-xs sm:text-sm mt-1"
                            style={{ color: "var(--text-color)", opacity: 0.7 }}
                          >
                            <MapPin className="h-3 w-3" />
                            {provider.distance}
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
                            <span>{provider.price}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{provider.experience} exp</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{provider.responseTime}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => toggleFavorite(provider.id)}
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
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl sm:rounded-2xl flex items-center justify-center"
              style={{
                height: "400px sm:600px",
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="text-center space-y-2 sm:space-y-3 p-4">
                <Map className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" style={{ opacity: 0.3 }} />
                <p className="text-base sm:text-lg" style={{ color: "var(--text-color)" }}>
                  Interactive Map View
                </p>
                <p className="text-xs sm:text-sm" style={{ color: "var(--text-color)", opacity: 0.7 }}>
                  See service providers in your area on the map
                </p>
                <button
                  onClick={() => setViewMode("list")}
                  className="px-4 sm:px-6 py-2 rounded-xl font-medium transition-colors text-xs sm:text-sm"
                  style={{
                    background: "var(--btn-bg)",
                    color: "white",
                  }}
                >
                  Switch to List View
                </button>
              </div>
            </motion.div>
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