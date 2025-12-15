import {
  Eye,
  Target,
  HeartHandshake,
  Award,
  MapPin,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Quote,
  Users,
  Globe,
} from "lucide-react";

export default function AboutPage() {
  const testimonials = [
    {
      text: "ConnectVista transformed how I find local services. It's like having trusted neighbors recommend the best professionals.",
      author: "Sarah Chen",
      role: "Homeowner",
      location: "Austin, TX",
    },
    {
      text: "As a small business owner, ConnectVista helped me reach customers in my neighborhood. My client base grew by 60% in 6 months.",
      author: "Mike Rodriguez",
      role: "Electrician",
      location: "Miami, FL",
    },
    {
      text: "The platform's verification system gives me peace of mind knowing I'm hiring trusted, background-checked professionals.",
      author: "Emily Johnson",
      role: "Community Manager",
      location: "Portland, OR",
    },
  ];

  const stats = [
    { number: "x", label: "Active Users" },
    { number: "x", label: "Service Providers" },
    { number: "200+", label: "Cities Served" },
    { number: "4.9/5", label: "Average Rating" },
  ];

  const values = [
    {
      title: "Community First",
      icon: HeartHandshake,
      description: "We build strong communities by connecting neighbors with trusted providers.",
    },
    {
      title: "Empowerment",
      icon: Zap,
      description: "We enable local businesses to grow and reach more customers in their area.",
    },
    {
      title: "Quality Service",
      icon: Award,
      description: "We ensure quality through verified providers and genuine customer reviews.",
    },
    {
      title: "Transparency",
      icon: Shield,
      description: "Clear pricing, honest reviews, and open communication for everyone.",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden w-full" style={{ backgroundColor: "var(--bg-color)" }}>
      {/* Hero Section */}
      <section className="relative pt-24 pb-20">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, var(--accent-color), var(--accent-dark))`,
          }}
        />
        
        <div className="relative container mx-auto px-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ fontFamily: "var(--font-secondary)" }}>
                About ConnectVista
              </h1>
              <p className="text-2xl opacity-95">
                Building bridges between local service providers and the communities they serve
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-4xl md:text-5xl font-bold mb-3"
                  style={{ 
                    color: "var(--accent-color)",
                    fontFamily: "var(--font-secondary)" 
                  }}
                >
                  {stat.number}
                </div>
                <div 
                  className="text-lg"
                  style={{ color: "var(--text-color)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-secondary)" }}>
                Our Story
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xl leading-relaxed mb-6" style={{ color: "var(--text-color)" }}>
                  ConnectVista was born from a simple yet powerful observation: finding reliable local services 
                  was unnecessarily difficult, while talented professionals struggled to reach customers in their 
                  own communities.
                </p>
                <p className="text-xl leading-relaxed" style={{ color: "var(--text-color)" }}>
                  Today, we've grown into a platform that connects thousands of users with verified service 
                  providers, fostering local economic growth and building stronger community relationships.
                </p>
              </div>
              
              <div className="p-8 rounded-2xl" style={{ 
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)"
              }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: "var(--accent-color)" }}>
                    <Globe className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-secondary)" }}>
                      Community Impact
                    </h3>
                    <p style={{ color: "var(--text-color)" }}>Strengthening local economies</p>
                  </div>
                </div>
                <p className="text-lg" style={{ color: "var(--text-color)" }}>
                  We believe that strong communities are built on trust and connection. By bridging the gap 
                  between service seekers and providers, we're helping local businesses thrive while providing 
                  reliable solutions to community needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20" style={{ backgroundColor: "var(--card-bg)" }}>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-secondary)" }}>
                Our Purpose
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: "var(--text-color)" }}>
                Guiding principles that shape our platform and community
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-10 rounded-2xl" style={{ 
                backgroundColor: "var(--bg-color)",
                border: "1px solid var(--border-color)"
              }}>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: "var(--accent-color)" }}>
                    <Target className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl font-bold" style={{ fontFamily: "var(--font-secondary)" }}>
                    Our Mission
                  </h3>
                </div>
                <p className="text-xl leading-relaxed" style={{ color: "var(--text-color)" }}>
                  To empower communities by creating seamless, trusted connections between service providers 
                  and users, fostering local economic growth and building stronger neighborhoods through 
                  transparent, reliable service matching.
                </p>
              </div>

              <div className="p-10 rounded-2xl" style={{ 
                backgroundColor: "var(--bg-color)",
                border: "1px solid var(--border-color)"
              }}>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: "var(--accent-color)" }}>
                    <Eye className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl font-bold" style={{ fontFamily: "var(--font-secondary)" }}>
                    Our Vision
                  </h3>
                </div>
                <p className="text-xl leading-relaxed" style={{ color: "var(--text-color)" }}>
                  To become the world's most trusted platform where every community has instant access to 
                  high-quality local services, and every local business has the opportunity to thrive and 
                  grow within their own neighborhoods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-secondary)" }}>
                Our Core Values
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: "var(--text-color)" }}>
                The principles that guide every decision and connection on our platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="p-8 rounded-2xl"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white"
                    style={{ backgroundColor: "var(--accent-color)" }}
                  >
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3
                    className="text-2xl font-semibold mb-4"
                    style={{ 
                      color: "var(--text-color)",
                      fontFamily: "var(--font-secondary)" 
                    }}
                  >
                    {value.title}
                  </h3>
                  <p
                    className="text-lg leading-relaxed"
                    style={{ color: "var(--text-color)" }}
                  >
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20" style={{ backgroundColor: "var(--card-bg)" }}>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-secondary)" }}>
                Community Voices
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: "var(--text-color)" }}>
                Real stories from the people who use and trust ConnectVista
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.author}
                  className="p-10 rounded-2xl"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: "var(--accent-fade)" }}>
                      <Quote className="h-6 w-6" style={{ color: "var(--accent-color)" }} />
                    </div>
                    <div>
                      <div
                        className="font-semibold text-xl"
                        style={{ 
                          color: "var(--text-color)",
                          fontFamily: "var(--font-secondary)" 
                        }}
                      >
                        {testimonial.author}
                      </div>
                      <div className="text-lg" style={{ color: "var(--text-color)" }}>
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p
                    className="text-lg leading-relaxed mb-6"
                    style={{ color: "var(--text-color)" }}
                  >
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center" style={{ color: "var(--text-color)" }}>
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{testimonial.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-secondary)" }}>
                Built with Purpose
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: "var(--text-color)" }}>
                Combining technical expertise with community focus
              </p>
            </div>

            <div className="p-12 rounded-2xl" style={{ 
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)"
            }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-secondary)" }}>
                    Developer Journey
                  </h3>
                  <p className="text-xl leading-relaxed mb-6" style={{ color: "var(--text-color)" }}>
                    ConnectVista represents a comprehensive full-stack development journey using the MERN 
                    stack. Created to solve real-world community challenges, this platform demonstrates 
                    practical application of modern web technologies in addressing everyday needs.
                  </p>
                  <p className="text-xl leading-relaxed" style={{ color: "var(--text-color)" }}>
                    As a B.Tech IT student at Ganpat University, I've combined academic knowledge with 
                    hands-on development experience to build a solution that serves genuine community 
                    requirements while showcasing professional-grade application development.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mb-6">
                    <h4 className="text-4xl font-bold mb-2" style={{ 
                      color: "var(--accent-color)",
                      fontFamily: "var(--font-secondary)" 
                    }}>
                      DHRUV SHERE
                    </h4>
                    <p className="text-xl" style={{ color: "var(--text-color)" }}>
                      Full-Stack Developer
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: "var(--accent-color)" }}>MERN</div>
                        <div className="text-lg" style={{ color: "var(--text-color)" }}>Stack</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: "var(--accent-color)" }}>B.Tech</div>
                        <div className="text-lg" style={{ color: "var(--text-color)" }}>IT '26</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: "var(--accent-color)" }}>India</div>
                        <div className="text-lg" style={{ color: "var(--text-color)" }}>Based</div>
                      </div>
                    </div>
                    
                    <p className="text-lg italic mt-6" style={{ color: "var(--text-color)" }}>
                      "Building solutions that connect communities through technology"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-white text-center relative">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, var(--accent-color), var(--accent-dark))`,
          }}
        />

        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: "var(--font-secondary)" }}>
              Join Our Community
            </h2>
            <p className="text-2xl opacity-95 mb-12 max-w-3xl mx-auto">
              Whether you're looking for trusted services or ready to share your expertise, 
              become part of a community that values quality, trust, and local connection.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                className="px-10 py-4 font-semibold rounded-xl bg-white text-[var(--accent-color)] flex items-center justify-center space-x-3 hover:opacity-95 transition-opacity text-lg"
                style={{ fontFamily: "var(--font-primary)" }}
              >
                <span>Get Started Today</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                className="px-10 py-4 font-semibold rounded-xl border-2 border-white text-white hover:bg-white/10 transition-colors text-lg"
                style={{ fontFamily: "var(--font-primary)" }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}