import {
  Search,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Play,
  Users,
  Shield,
  Zap,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel slides
  const carouselSlides = [
    {
      title: "Discover Local Services",
      subtitle: "Find trusted professionals in your neighborhood",
      image:
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1400&q=80",
      gradient: "from-[var(--accent-color)] to-[var(--accent-dark)]",
    },
    {
      title: "Map-Based Discovery",
      subtitle: "See services around you with our interactive map",
      image:
        "https://images.unsplash.com/photo-1542744095-291d1f67b221?auto=format&fit=crop&w=1400&q=80",
      gradient: "from-[var(--accent-dark)] to-[var(--accent-color)]",
    },
    {
      title: "Verified Professionals",
      subtitle: "All providers are background-checked and rated",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
      gradient: "from-[var(--accent-color)] to-[var(--accent-fade)]",
    },
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
    );
  };

  const services = [
    {
      title: "Plumbing",
      description: "Expert plumbers for all your pipe and water needs",
      image:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=200&q=80",
      to: "/services",
      icon: "💧",
    },
    {
      title: "Electrical",
      description: "Licensed electricians for safe installations",
      image:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=200&q=80",
      to: "/services",
      icon: "⚡",
    },
    {
      title: "Cleaning",
      description: "Professional cleaning services for homes and offices",
      image:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=200&q=80",
      to: "/services",
      icon: "✨",
    },
    {
      title: "Tutoring",
      description: "Expert tutors for academic excellence",
      image:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=200&q=80",
      to: "/services",
      icon: "📚",
    },
    {
      title: "Salon & Spa",
      description: "Beauty and wellness services near you",
      image:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=200&q=80",
      to: "/services",
      icon: "💇",
    },
    {
      title: "Home Repair",
      description: "Skilled professionals for all repairs",
      image:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=200&q=80",
      to: "/services",
      icon: "🔧",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Found an amazing plumber in minutes! The service was quick and professional.",
      location: "New York, NY",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80",
    },
    {
      name: "Michael Chen",
      rating: 5,
      text: "Best platform for finding local services. Saved me so much time and hassle.",
      location: "San Francisco, CA",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    },
    {
      name: "Emily Rodriguez",
      rating: 5,
      text: "Excellent tutors available! My son's grades improved significantly.",
      location: "Austin, TX",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    },
  ];

  const features = [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Map-Based Interface",
      description: "Interactive maps showing services around your location",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Verified Providers",
      description: "All professionals are background-checked and verified",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Booking",
      description: "Book services instantly with real-time availability",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Driven",
      description: "Powered by real reviews and ratings from your community",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden w-full max-w-[100vw]" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      {/* Enhanced Hero Section with Carousel */}
      <section className="relative text-white w-full max-w-[100vw] overflow-hidden">
        {/* Carousel */}
        <div className="relative h-[80vh] min-h-[600px]">
          {carouselSlides.map((slide, index) => (
            <motion.div
              key={index}
              className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 1 }}
            >
              <div className="absolute inset-0 opacity-20">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: Math.random() * 100 + 50,
                      height: Math.random() * 100 + 50,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      backgroundColor: 'var(--accent-fade)',
                      opacity: 0.15
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              {index === currentSlide && (
                <motion.div
                  className="relative container mx-auto px-4 h-full flex items-center"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className="text-center w-full space-y-8">
                    <motion.h1
                      className="text-5xl md:text-7xl font-bold leading-tight"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.p
                      className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      {slide.subtitle}
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}

          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Search Section */}
        <motion.div
          className="relative -mt-20 container mx-auto px-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div
            className="rounded-2xl p-8 border shadow-2xl backdrop-blur-lg"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="text-center mb-6">
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: "var(--text-color)" }}
              >
                Find Services Near You
              </h2>
              <p style={{ color: "var(--text-color)", opacity: 0.8 }}>
                ConnectVista bridges service providers and users through
                interactive, map-based discovery
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto">
              {/* Service Input */}
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  style={{ color: "var(--text-color)", opacity: 0.6 }}
                />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="pl-12 h-14 w-full rounded-xl border transition-all duration-300 focus:ring-2"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)",
                  }}
                />
              </div>

              {/* Location Input */}
              <div className="relative flex-1">
                <MapPin
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  style={{ color: "var(--text-color)", opacity: 0.6 }}
                />
                <input
                  type="text"
                  placeholder="Your location or use current location"
                  className="pl-12 h-14 w-full rounded-xl border transition-all duration-300 focus:ring-2"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)",
                  }}
                />
              </div>

              {/* Search Button */}
              <motion.button
                className="h-14 px-8 font-semibold rounded-xl text-white flex items-center justify-center space-x-2 transition-all duration-300"
                style={{
                  background: "var(--btn-bg)",
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "var(--btn-hover)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </motion.button>
            </div>

            {/* Quick Search Tags */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {[
                "Plumbing",
                "Electrical",
                "Cleaning",
                "Tutoring",
                "Beauty",
                "Repair",
              ].map((tag) => (
                <motion.button
                  key={tag}
                  className="px-4 py-2 rounded-full text-sm transition-all duration-300 border"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "var(--accent-color)",
                    color: "white",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 w-full max-w-[100vw] overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: "var(--text-color)" }}>
              Revolutionizing Local Service Discovery
            </h2>
            <p className="text-xl leading-relaxed" style={{ color: "var(--text-color)", opacity: 0.8 }}>
              ConnectVista is a unified digital platform that bridges service
              providers and users through an interactive, map-based interface.
              It enables seamless discovery, connection, and collaboration—
              empowering communities to access trusted services quickly and
              efficiently.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 rounded-2xl backdrop-blur-sm border"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white"
                  style={{ backgroundColor: "var(--accent-color)" }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-color)" }}>{feature.title}</h3>
                <p style={{ color: "var(--text-color)", opacity: 0.8 }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        className="py-20 w-full max-w-[100vw] overflow-hidden"
        style={{ backgroundColor: "var(--bg-color)" }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-color)" }}>
              Popular Services
            </h2>
            <p className="text-xl" style={{ color: "var(--text-color)", opacity: 0.8 }}>
              Browse our most requested service categories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="group p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-sm border"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold mb-3" style={{ color: "var(--text-color)" }}>{service.title}</h3>
                <p className="mb-6" style={{ color: "var(--text-color)", opacity: 0.8 }}>
                  {service.description}
                </p>
                <motion.a
                  href={service.to}
                  className="inline-flex items-center space-x-2 font-medium transition-colors duration-300"
                  style={{ color: "var(--accent-color)" }}
                  whileHover={{ x: 5 }}
                >
                  <span>Explore Services</span>
                  <ChevronRight className="h-4 w-4" />
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className="py-20 w-full max-w-[100vw] overflow-hidden"
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-color)" }}>
              How It Works
            </h2>
            <p className="text-xl mb-16" style={{ color: "var(--text-color)", opacity: 0.8 }}>
              Get connected with professionals in three easy steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Search & Discover",
                description:
                  "Use our interactive map to find services in your area",
                icon: <Search className="h-8 w-8" />,
              },
              {
                step: "2",
                title: "Compare & Choose",
                description:
                  "Review verified profiles, ratings, and real-time availability",
                icon: <Users className="h-8 w-8" />,
              },
              {
                step: "3",
                title: "Book & Connect",
                description:
                  "Schedule instantly and manage everything in one place",
                icon: <Clock className="h-8 w-8" />,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="text-center space-y-6"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white mx-auto relative"
                  style={{ backgroundColor: "var(--accent-color)" }}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {item.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: "var(--bg-color)", color: "var(--accent-color)" }}>
                    {item.step}
                  </div>
                </motion.div>
                <h3 className="text-2xl font-semibold" style={{ color: "var(--text-color)" }}>{item.title}</h3>
                <p className="text-lg" style={{ color: "var(--text-color)", opacity: 0.8 }}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 w-full max-w-[100vw] overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-color)" }}>
              Trusted by Thousands
            </h2>
            <p className="text-xl" style={{ color: "var(--text-color)", opacity: 0.8 }}>
              Real stories from our satisfied community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="p-8 rounded-2xl border space-y-6 shadow-lg hover:shadow-xl transition-all duration-500"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5"
                      style={{ fill: "var(--accent-color)", color: "var(--accent-color)" }}
                    />
                  ))}
                </div>
                <p className="text-lg leading-relaxed" style={{ color: "var(--text-color)", opacity: 0.8 }}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-lg" style={{ color: "var(--text-color)" }}>{testimonial.name}</p>
                    <p className="text-sm" style={{ color: "var(--text-color)", opacity: 0.6 }}>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 w-full max-w-[100vw] overflow-hidden text-white text-center relative">
        <div
          className="absolute inset-0"
          style={{
            background: "var(--btn-bg)",
          }}
        />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 80 + 20,
                height: Math.random() * 80 + 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: 'var(--accent-fade)',
                opacity: 0.15
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative container mx-auto px-4 space-y-8">
          <motion.h2
            className="text-4xl md:text-6xl font-bold"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Ready to Experience ConnectVista?
          </motion.h2>
          <motion.p
            className="text-xl opacity-90 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of satisfied customers who found their ideal local
            services through our platform
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              className="px-8 py-4 font-semibold rounded-xl bg-white flex items-center space-x-2"
              style={{ color: "var(--accent-color)" }}
              whileHover={{
                scale: 1.05,
                boxShadow: "var(--btn-hover)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="h-5 w-5" />
              <span>Get Started Now</span>
            </motion.button>
            <motion.button
              className="px-8 py-4 font-semibold rounded-xl border-2 border-white text-white"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;