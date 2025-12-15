import {
  Search,
  Star,
  MapPin,
  Shield,
  Zap,
  Clock,
  UserCheck,
  Building,
  Target,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

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
      icon: <Search className="h-8 w-8" />,
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
      icon: <Building className="h-8 w-8" />,
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
      icon: <UserCheck className="h-10 w-10" />,
    },
    {
      step: "2",
      title: "Verify & Setup",
      description: "Complete your profile and verification process",
      icon: <Shield className="h-10 w-10" />,
    },
    {
      step: "3",
      title: "Search or Offer",
      description: "Find services or list your offerings based on location",
      icon: <MapPin className="h-10 w-10" />,
    },
    {
      step: "4",
      title: "Connect & Manage",
      description: "Get connected instantly and manage your bookings",
      icon: <Zap className="h-10 w-10" />,
    },
  ];

  // Features data
  const features = [
    {
      icon: <Target className="h-10 w-10" />,
      title: "Smart Matching Algorithm",
      description:
        "Intelligent matching based on location, skills, and customer preferences",
    },
    {
      icon: <MapPin className="h-10 w-10" />,
      title: "Real-time Location & Radius",
      description:
        "Find services or customers within your preferred geographical area",
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Secure Payments & Verification",
      description:
        "Verified profiles with secure payment processing for peace of mind",
    },
    {
      icon: <Star className="h-10 w-10" />,
      title: "Transparent Reviews System",
      description:
        "Genuine feedback and ratings from real customers and providers",
    },
    {
      icon: <Clock className="h-10 w-10" />,
      title: "24/7 Customer Support",
      description: "Round-the-clock assistance for both seekers and providers",
    },
    {
      icon: <Zap className="h-10 w-10" />,
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
    },
    {
      name: "Mike Rodriguez",
      role: "Electrician",
      rating: 5,
      text: "My business grew by 40% in 3 months thanks to ConnectVista. The platform connects me with serious local customers.",
    },
    {
      name: "Emily Chen",
      role: "Cleaning Service Owner",
      rating: 5,
      text: "We expanded from 2 to 8 cleaners thanks to ConnectVista. The review system built incredible trust in our community.",
    },
  ];

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      {/* Hero Section - Clean & Professional */}
      <section className="relative text-white overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-dark)]" />
        
        <div className="w-[90vw] mx-auto px-6 py-12 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 border border-white/20 mb-8">
              <Shield className="h-5 w-5 mr-3" />
              <span className="text-lg font-semibold">Trusted Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Connecting People with
              <span className="block" style={{ color: 'var(--accent-light)' }}>Trusted Services</span>
            </h1>

            <h2 className="text-2xl md:text-3xl font-semibold opacity-95 mb-8">
              Find verified professionals or grow your business — 
              <span className="block text-white/90 text-xl">all on one reliable platform</span>
            </h2>

            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
              ConnectVista bridges the gap between service seekers and providers 
              with smart matching, transparent verification, and secure payments.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <button
                className="px-10 py-4 font-semibold rounded-xl bg-white flex items-center justify-center space-x-4 transition-colors hover:opacity-95"
                style={{ color: "var(--accent-color)" }}
                onClick={() => navigate("/login")}
              >
                <Search className="h-6 w-6" />
                <span className="text-lg">Find Services</span>
              </button>
              <button
                className="px-10 py-4 font-semibold rounded-xl border-2 border-white text-white flex items-center justify-center space-x-4 hover:bg-white/10 transition-colors"
                onClick={() => navigate("/service-provider/signup")}
              >
                <Building className="h-6 w-6" />
                <span className="text-lg">Become a Provider</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-base opacity-90">Verified Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-base opacity-90">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-base opacity-90">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Finding Reliable Services Shouldn't Be Hard
            </h2>
            <p className="text-xl max-w-3xl mx-auto opacity-80">
              Most people struggle to find verified professionals they can trust. 
              On the other hand, skilled service providers lack visibility and fair opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {problems.map((problem) => (
              <div
                key={problem.title}
                className="p-8 rounded-2xl border"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="text-5xl mb-4">{problem.icon}</div>
                <h3 className="text-2xl font-bold mb-4">
                  {problem.title}
                </h3>
                <p className="mb-6 text-lg leading-relaxed opacity-80">
                  {problem.description}
                </p>
                <div className="space-y-3">
                  {problem.painPoints.map((point) => (
                    <div key={point} className="flex items-center space-x-4">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--accent-color)" }} />
                      <span className="text-lg opacity-80">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-2xl font-semibold" style={{ color: "var(--accent-color)" }}>
              ConnectVista bridges this gap with smart matching and transparent verification
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16" style={{ backgroundColor: "var(--card-bg)" }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              One Platform. Two Worlds Connected.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {solutions.map((solution) => (
              <div
                key={solution.for}
                className="relative overflow-hidden rounded-2xl p-8 text-white"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-95`}
                />
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                      {solution.icon}
                    </div>
                    <h3 className="text-2xl font-bold">{solution.for}</h3>
                  </div>

                  <ul className="space-y-4">
                    {solution.features.map((feature) => (
                      <li key={feature} className="flex items-start space-x-4">
                        <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
                        <span className="text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className="mt-8 px-6 py-3 rounded-xl bg-white/20 border border-white/30 flex items-center space-x-3 hover:bg-white/30 transition-colors"
                    onClick={() =>
                      navigate(
                        solution.for === "Service Seekers"
                          ? "/user/signup"
                          : "/service-provider/signup"
                      )
                    }
                  >
                    <span className="text-lg">Get Started</span>
                    <ArrowUpRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl max-w-2xl mx-auto opacity-80">
              Get connected with professionals in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div
                  className="relative w-24 h-24 rounded-full flex items-center justify-center text-white mx-auto mb-6"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  {step.icon}
                  <div
                    className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: "var(--bg-color)", color: "var(--accent-color)" }}
                  >
                    {step.step}
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="text-lg opacity-80">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16" style={{ backgroundColor: "var(--card-bg)" }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose ConnectVista?
            </h2>
            <p className="text-xl opacity-80">
              Powerful features designed for trust and convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl border"
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg opacity-80">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by Our Community
            </h2>
            <p className="text-xl opacity-80">
              Real stories from both service providers and seekers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-8 rounded-2xl border"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex space-x-2 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-6 w-6"
                      style={{ fill: "var(--accent-color)", color: "var(--accent-color)" }}
                    />
                  ))}
                </div>
                <p className="text-lg leading-relaxed italic opacity-80 mb-6">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-xl">
                    {testimonial.name}
                  </p>
                  <p className="text-lg opacity-80">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 text-white text-center" style={{ background: "var(--btn-bg)" }}>
        <div className="container mx-auto px-6 space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold">
            Start Your Journey with ConnectVista Today
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of service seekers and providers who trust
            ConnectVista for their local service needs
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              className="px-10 py-5 font-semibold rounded-xl bg-white flex items-center space-x-4 hover:opacity-95 transition-opacity"
              style={{ color: "var(--accent-color)" }}
              onClick={() => navigate("/services")}
            >
              <Search className="h-6 w-6" />
              <span className="text-lg">Explore Services</span>
            </button>
            <button
              className="px-10 py-5 font-semibold rounded-xl border-2 border-white text-white flex items-center space-x-4 hover:bg-white/10 transition-colors"
              onClick={() => navigate("/service-provider/signup")}
            >
              <Building className="h-6 w-6" />
              <span className="text-lg">Become a Provider</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;