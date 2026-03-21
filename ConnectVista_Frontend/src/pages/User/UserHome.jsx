import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  MapPin,
  Users,
  Shield,
  Zap,
  Clock,
  Play,
} from "lucide-react";
import toast from "react-hot-toast";
import { serviceAPI } from "../../services/serviceAPI";

const Home = () => {
  const navigate = useNavigate();
  const [serviceQuery, setServiceQuery] = useState("");
  const [location, setLocation] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Use reverse geocoding to get city name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const city = data.address?.city || data.address?.town || "Your Location";
            setLocation(city);
          } catch (error) {
            console.error('Error getting location name:', error);
            setLocation("Current Location");
          } finally {
            setLoadingLocation(false);
          }
        },
        () => {
          setLoadingLocation(false);
          setLocation("Use current location");
        }
      );
    }
  };

  const handleSearch = () => {
    if (!serviceQuery.trim()) {
      toast.error("Please enter a service");
      return;
    }
    if (!location.trim()) {
      toast.error("Please enter a location");
      return;
    }
    navigate(`/user/explore?serviceName=${encodeURIComponent(serviceQuery)}&location=${encodeURIComponent(location)}`);
  };

  const handleQuickSearch = (service) => {
    setServiceQuery(service);
    // Navigate with the quick search service
    navigate(`/user/explore?serviceName=${encodeURIComponent(service)}&location=${encodeURIComponent(location || "Current Location")}`);
  };

  const services = [
    {
      title: "Plumbing",
      description: "Expert plumbers for all your pipe and water needs",
      icon: "💧",
    },
    {
      title: "Electrical",
      description: "Licensed electricians for safe installations",
      icon: "⚡",
    },
    {
      title: "Cleaning",
      description: "Professional cleaning services for homes and offices",
      icon: "✨",
    },
    {
      title: "Tutoring",
      description: "Expert tutors for academic excellence",
      icon: "📚",
    },
    {
      title: "Salon & Spa",
      description: "Beauty and wellness services near you",
      icon: "💇",
    },
    {
      title: "Home Repair",
      description: "Skilled professionals for all repairs",
      icon: "🔧",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Found an amazing plumber in minutes! The service was quick and professional.",
      location: "New York, NY",
    },
    {
      name: "Michael Chen",
      rating: 5,
      text: "Best platform for finding local services. Saved me so much time and hassle.",
      location: "San Francisco, CA",
    },
    {
      name: "Emily Rodriguez",
      rating: 5,
      text: "Excellent tutors available! My son's grades improved significantly.",
      location: "Austin, TX",
    },
  ];

  const features = [
    {
      icon: <MapPin className="h-10 w-10" />,
      title: "Map-Based Interface",
      description: "Interactive maps showing services around your location",
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Verified Providers",
      description: "All professionals are background-checked and verified",
    },
    {
      icon: <Zap className="h-10 w-10" />,
      title: "Instant Booking",
      description: "Book services instantly with real-time availability",
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Community Driven",
      description: "Powered by real reviews and ratings from your community",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Search & Discover",
      description: "Use our interactive map to find services in your area",
      icon: <Search className="h-10 w-10" />,
    },
    {
      step: "2",
      title: "Compare & Choose",
      description: "Review verified profiles, ratings, and real-time availability",
      icon: <Users className="h-10 w-10" />,
    },
    {
      step: "3",
      title: "Book & Connect",
      description: "Schedule instantly and manage everything in one place",
      icon: <Clock className="h-10 w-10" />,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden w-full" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      {/* Enhanced Hero Section without Carousel */}
      <section className="relative text-white w-full">
        {/* Hero Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, var(--accent-color), var(--accent-dark))`,
          }}
        />

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 py-32">
          <div className="text-center w-full space-y-12 max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight" style={{ fontFamily: "var(--font-secondary)" }}>
              Discover Local Services
            </h1>
            <p className="text-2xl md:text-3xl opacity-95 max-w-3xl mx-auto">
              Find trusted professionals in your neighborhood with ConnectVista
            </p>
          </div>
        </div>
        
        {/* Search Section */}
        <div className="relative container mx-auto px-4 -mt-16">
          <div
            className="rounded-2xl p-8 border shadow-2xl"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="text-center mb-8">
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: "var(--text-color)" }}
              >
                Find Services Near You
              </h2>
              <p style={{ color: "var(--text-color)", opacity: 0.8, fontSize: "1.25rem" }}>
                ConnectVista bridges service providers and users through
                interactive, map-based discovery
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              {/* Service Input */}
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  style={{ color: "var(--text-color)", opacity: 0.6 }}
                />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={serviceQuery}
                  onChange={(e) => setServiceQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 h-16 w-full rounded-xl border focus:ring-2 text-lg"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)",
                  }}
                />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="h-16 px-8 font-semibold rounded-xl text-white flex items-center justify-center space-x-3 text-lg hover:opacity-95 transition-opacity"
                style={{
                  background: "var(--btn-bg)",
                }}
              >
                <Search className="h-6 w-6" />
                <span>Search Services</span>
              </button>
            </div>

            {/* Quick Search Tags */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[
                "Plumbing",
                "Electrical",
                "Cleaning",
                "Tutoring",
                "Beauty",
                "Repair",
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleQuickSearch(tag)}
                  className="px-6 py-3 rounded-full border text-lg hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="w-[85vw] mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ 
              color: "var(--text-color)",
              fontFamily: "var(--font-secondary)" 
            }}>
              Revolutionizing Local Service Discovery
            </h2>
            <p className="text-xl leading-relaxed" style={{ color: "var(--text-color)", opacity: 0.8 }}>
              ConnectVista is a unified digital platform that bridges service
              providers and users through an interactive, map-based interface.
              It enables seamless discovery, connection, and collaboration—
              empowering communities to access trusted services quickly and
              efficiently.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-8 rounded-2xl border"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-white"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: "var(--text-color)" }}>{feature.title}</h3>
                <p className="text-lg" style={{ color: "var(--text-color)", opacity: 0.8 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        className="py-20"
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        <div className="w-[85vw] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ 
              color: "var(--text-color)",
              fontFamily: "var(--font-secondary)" 
            }}>
              Popular Services
            </h2>
            <p className="text-xl" style={{ color: "var(--text-color)", opacity: 0.8 }}>
              Browse our most requested service categories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="group p-8 rounded-2xl border hover:border-[var(--accent-color)] transition-all duration-300"
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="text-5xl mb-6">{service.icon}</div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: "var(--text-color)" }}>{service.title}</h3>
                <p className="mb-8 text-lg" style={{ color: "var(--text-color)", opacity: 0.8 }}>
                  {service.description}
                </p>
                <a
                  href="/services"
                  className="inline-flex items-center space-x-3 font-medium text-lg hover:opacity-90 transition-opacity"
                  style={{ color: "var(--accent-color)" }}
                >
                  <span>Explore Services</span>
                  <span className="text-lg">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className="py-20"
      >
        <div className="w-[85vw] mx-auto px-4 text-center">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ 
              color: "var(--text-color)",
              fontFamily: "var(--font-secondary)" 
            }}>
              How It Works
            </h2>
            <p className="text-xl mb-16" style={{ color: "var(--text-color)", opacity: 0.8 }}>
              Get connected with professionals in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="text-center space-y-6"
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white mx-auto relative"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  {item.icon}
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ backgroundColor: "var(--bg-color)", color: "var(--accent-color)" }}>
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold" style={{ color: "var(--text-color)" }}>{item.title}</h3>
                <p className="text-lg" style={{ color: "var(--text-color)", opacity: 0.8 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="w-[85vw] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ 
              color: "var(--text-color)",
              fontFamily: "var(--font-secondary)" 
            }}>
              Trusted by Thousands
            </h2>
            <p className="text-xl" style={{ color: "var(--text-color)", opacity: 0.8 }}>
              Real stories from our satisfied community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-8 rounded-2xl border space-y-6"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-6 w-6"
                      style={{ fill: "var(--accent-color)", color: "var(--accent-color)" }}
                    />
                  ))}
                </div>
                <p className="text-lg leading-relaxed" style={{ color: "var(--text-color)", opacity: 0.8 }}>
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-xl" style={{ color: "var(--text-color)" }}>{testimonial.name}</p>
                  <p className="text-lg" style={{ color: "var(--text-color)", opacity: 0.6 }}>
                    {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white text-center relative">
        <div
          className="absolute inset-0"
          style={{
            background: "var(--btn-bg)",
          }}
        />

        <div className="relative w-[85vw] mx-auto px-4 space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold" style={{ fontFamily: "var(--font-secondary)" }}>
            Ready to Experience ConnectVista?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their ideal local
            services through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              className="px-10 py-5 font-semibold rounded-xl bg-white flex items-center space-x-3 text-lg hover:opacity-95 transition-opacity"
              style={{ color: "var(--accent-color)" }}
            >
              <Play className="h-6 w-6" />
              <span>Get Started Now</span>
            </button>
            <button
              className="px-10 py-5 font-semibold rounded-xl border-2 border-white text-white text-lg hover:bg-white/10 transition-colors"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;