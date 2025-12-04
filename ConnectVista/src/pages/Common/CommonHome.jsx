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
  UserCheck,
  Building,
  Target,
  ArrowRight,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Updated carousel slides to match the coral theme
  const carouselSlides = [
    {
      title: "Connecting People with Trusted Services",
      subtitle: "Anytime, Anywhere",
      description:
        "Find verified professionals or grow your business by offering your services — all on one reliable platform",
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80",
      gradient: "from-[var(--accent-color)] to-[var(--accent-dark)]",
    },
    {
      title: "Find Trusted Professionals",
      subtitle: "In Your Neighborhood",
      description:
        "Verified service providers with transparent reviews and ratings",
      image:
        "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=1400&q=80",
      gradient: "from-[var(--accent-dark)] to-[var(--accent-color)]",
    },
    {
      title: "Grow Your Service Business",
      subtitle: "Reach More Customers",
      description:
        "Get discovered by local customers looking for your expertise",
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

  // Problem section data
  const problems = [
    {
      icon: "😔",
      title: "For Service Seekers",
      description:
        "Struggling to find verified professionals you can trust? Endless searching with uncertain quality and no centralized platform.",
      painPoints: [
        "Unverified service providers",
        "No transparent reviews system",
        "Inconsistent pricing and quality",
      ],
    },
    {
      icon: "😟",
      title: "For Service Providers",
      description:
        "Skilled professionals lack visibility and fair opportunities. Marketing challenges and building trust with new clients.",
      painPoints: [
        "Limited local visibility",
        "Difficulty finding consistent work",
        "No centralized platform for growth",
      ],
    },
  ];

  // Solution section data
  const solutions = [
    {
      for: "Service Seekers",
      icon: <Search className="h-6 w-6" />,
      features: [
        "Search & compare verified professionals",
        "Transparent reviews and ratings",
        "Instant booking & real-time availability",
        "Secure payments & 24/7 support",
      ],
      color: "from-[var(--accent-color)] to-[var(--accent-dark)]",
    },
    {
      for: "Service Providers",
      icon: <Building className="h-6 w-6" />,
      features: [
        "Verified profiles & trust badges",
        "Smart lead matching in your area",
        "Flexible work radius settings",
        "Business growth tools & analytics",
      ],
      color: "from-[var(--accent-dark)] to-[var(--accent-color)]",
    },
  ];

  // How it works steps
  const steps = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create your account as a service seeker or provider",
      icon: <UserCheck className="h-8 w-8" />,
    },
    {
      step: "2",
      title: "Verify & Setup",
      description: "Complete your profile and verification process",
      icon: <Shield className="h-8 w-8" />,
    },
    {
      step: "3",
      title: "Search or Offer",
      description: "Find services or list your offerings based on location",
      icon: <MapPin className="h-8 w-8" />,
    },
    {
      step: "4",
      title: "Connect & Manage",
      description: "Get connected instantly and manage your bookings",
      icon: <Zap className="h-8 w-8" />,
    },
  ];

  // Features data
  const features = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Smart Matching Algorithm",
      description:
        "Intelligent matching based on location, skills, and customer preferences",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Real-time Location & Radius",
      description:
        "Find services or customers within your preferred geographical area",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Payments & Verification",
      description:
        "Verified profiles with secure payment processing for peace of mind",
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Transparent Reviews System",
      description:
        "Genuine feedback and ratings from real customers and providers",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Customer Support",
      description: "Round-the-clock assistance for both seekers and providers",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Booking & Notifications",
      description: "Real-time availability and instant booking confirmations",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      rating: 5,
      text: "Found an amazing plumber in minutes! ConnectVista saved me from endless online searching with their verified professionals.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80",
    },
    {
      name: "Mike Rodriguez",
      role: "Electrician",
      rating: 5,
      text: "My business grew by 40% in 3 months thanks to ConnectVista. The platform connects me with serious local customers.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    },
    {
      name: "Emily Chen",
      role: "Cleaning Service Owner",
      rating: 5,
      text: "We expanded from 2 to 8 cleaners thanks to ConnectVista. The review system built incredible trust in our community.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    },
  ];

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      {/* Enhanced Hero Section */}
      <section className="relative text-white w-full max-w-[100vw] overflow-hidden">
        {/* Carousel */}
        <div className="relative h-[85vh] min-h-[700px]">
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

              {/* Animated Connection Nodes Background */}
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
                      opacity: [0.05, 0.1, 0.05],
                    }}
                    transition={{
                      duration: Math.random() * 4 + 3,
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
                      className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.h2
                      className="text-2xl md:text-3xl lg:text-4xl font-semibold opacity-95"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      {slide.subtitle}
                    </motion.h2>
                    <motion.p
                      className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      {slide.description}
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
      </section>

      {/* Problem Section */}
      <section className="py-20 w-full max-w-[100vw] overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Finding Reliable Services Shouldn't Be Hard
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ opacity: 0.8 }}
            >
              Most people struggle to find verified professionals they can
              trust. On the other hand, skilled service providers lack
              visibility and fair opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                className="p-8 rounded-2xl border backdrop-blur-sm"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{problem.icon}</div>
                <h3
                  className="text-2xl font-bold mb-4"
                >
                  {problem.title}
                </h3>
                <p
                  className="mb-6 leading-relaxed"
                  style={{ opacity: 0.8 }}
                >
                  {problem.description}
                </p>
                <div className="space-y-2">
                  {problem.painPoints.map((point, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--accent-color)" }}></div>
                      <span
                        style={{ opacity: 0.8 }}
                      >
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p
              className="text-2xl font-semibold"
              style={{ color: "var(--accent-color)" }}
            >
              ConnectVista bridges this gap with smart matching and transparent
              verification
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section
        className="py-20 w-full max-w-[100vw] overflow-hidden"
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              One Platform. Two Worlds Connected.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.for}
                className="relative overflow-hidden rounded-2xl p-8 text-white"
                initial={{ x: index === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-95`}
                ></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      {solution.icon}
                    </div>
                    <h3 className="text-2xl font-bold">{solution.for}</h3>
                  </div>

                  <ul className="space-y-4">
                    {solution.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-300" />
                        <span className="text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    className="mt-8 px-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center space-x-2 hover:bg-white/30 transition-all duration-300"
                    style={{ color: "white" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      navigate(
                        solution.for === "Service Seekers"
                          ? "/user/signup"
                          : "/service-provider/signup"
                      )
                    }
                  >
                    <span>Get Started</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 w-full max-w-[100vw] overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              How It Works
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ opacity: 0.8 }}
            >
              Get connected with professionals in four simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                className="text-center relative"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Connection line between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 z-0" style={{ backgroundColor: "var(--accent-fade)" }}></div>
                )}

                <motion.div
                  className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-white mx-auto mb-6"
                  style={{ backgroundColor: "var(--accent-color)" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {step.icon}
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                    style={{ backgroundColor: "var(--bg-color)", color: "var(--accent-color)" }}
                  >
                    {step.step}
                  </div>
                </motion.div>

                <h3
                  className="text-xl font-semibold mb-3"
                >
                  {step.title}
                </h3>
                <p style={{ opacity: 0.8 }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 w-full max-w-[100vw] overflow-hidden"
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Why Choose ConnectVista?
            </h2>
            <p
              className="text-xl"
              style={{ opacity: 0.8 }}
            >
              Powerful features designed for trust and convenience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 rounded-2xl backdrop-blur-sm border group cursor-pointer"
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "var(--border-color)",
                }}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  borderColor: "var(--accent-color)",
                  boxShadow: "var(--btn-hover)",
                }}
              >
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  {feature.icon}
                </motion.div>
                <h3
                  className="text-xl font-semibold mb-3"
                >
                  {feature.title}
                </h3>
                <p style={{ opacity: 0.8 }}>
                  {feature.description}
                </p>
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
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Trusted by Our Community
            </h2>
            <p
              className="text-xl"
              style={{ opacity: 0.8 }}
            >
              Real stories from both service providers and seekers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="p-8 rounded-2xl border space-y-6 backdrop-blur-sm"
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
                <p
                  className="text-lg leading-relaxed italic"
                  style={{ opacity: 0.8 }}
                >
                  "{testimonial.text}"
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p
                      className="font-semibold"
                    >
                      {testimonial.name}
                    </p>
                    <p
                      className="text-sm"
                      style={{ opacity: 0.8 }}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 w-full max-w-[100vw] overflow-hidden text-white text-center relative">
        <div
          className="absolute inset-0"
          style={{
            background: "var(--btn-bg)",
          }}
        />

        {/* Abstract map with connection lines */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {[...Array(8)].map((_, i) => (
              <motion.circle
                key={i}
                cx={Math.random() * 80 + 10}
                cy={Math.random() * 80 + 10}
                r="2"
                fill="white"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
              />
            ))}
            {/* Connection lines */}
            {[...Array(12)].map((_, i) => (
              <motion.line
                key={i}
                x1={Math.random() * 100}
                y1={Math.random() * 100}
                x2={Math.random() * 100}
                y2={Math.random() * 100}
                stroke="white"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </svg>
        </div>

        <div className="relative container mx-auto px-4 space-y-8">
          <motion.h2
            className="text-4xl md:text-6xl font-bold"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Start Your Journey with ConnectVista Today
          </motion.h2>
          <motion.p
            className="text-xl opacity-90 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of service seekers and providers who trust
            ConnectVista for their local service needs
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
              onClick={() => navigate("/services")}
            >
              <Search className="h-5 w-5" />
              <span>Explore Services</span>
            </motion.button>
            <motion.button
              className="px-8 py-4 font-semibold rounded-xl border-2 border-white text-white flex items-center space-x-2"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/service-provider/signup")}
            >
              <Building className="h-5 w-5" />
              <span>Become a Provider</span>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;