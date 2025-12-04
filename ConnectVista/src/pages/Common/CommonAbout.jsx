import { motion } from "framer-motion";
import {
  Eye,
  Target,
  HeartHandshake,
  Award,
  Users,
  MapPin,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Quote,
} from "lucide-react";
import { useState, useEffect } from "react";
import resources from "../../resources";

export default function AboutPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "15K+", label: "Service Providers" },
    { number: "200+", label: "Cities Served" },
    { number: "4.9/5", label: "Average Rating" },
  ];

  const values = [
    {
      title: "Community First",
      icon: HeartHandshake,
      description:
        "We build strong communities by connecting neighbors with trusted providers.",
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Empowerment",
      icon: Zap,
      description:
        "We enable local businesses to grow and reach more customers in their area.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Quality Service",
      icon: Award,
      description:
        "We ensure quality through verified providers and genuine customer reviews.",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Transparency",
      icon: Shield,
      description:
        "Clear pricing, honest reviews, and open communication for everyone.",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen overflow-x-hidden w-full max-w-[100vw]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, var(--accent-color), var(--accent-dark))`,
          }}
        />

        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-10"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
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

        <motion.div
          className="relative container mx-auto px-4 text-center text-white"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            variants={itemVariants}
          >
            About ConnectVista
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Building bridges between local service providers and the communities
            they serve
          </motion.p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16" style={{ backgroundColor: "var(--bg-color)" }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ color: "var(--accent-color)" }}
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.number}
                </motion.div>
                <div style={{ color: "var(--text-color)" }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="w-full flex items-center justify-center p-6"
        style={{ backgroundColor: "var(--bg-color)" }}
      >
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              style={{ color: "var(--text-color)" }}
            >
              Our Story
            </h2>
            <div
              className="p-8 rounded-2xl backdrop-blur-sm border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <p
                className="text-lg leading-relaxed text-center"
                style={{ color: "var(--text-color)" }}
              >
                We started ConnectVista with a simple observation: finding
                reliable local services was harder than it should be, and
                talented professionals struggled to reach customers in their own
                neighborhoods.
                <br />
                <br />
                Today, thousands of users and service providers use ConnectVista
                to connect, collaborate, and power local economies. We're proud
                to be building a platform that not only solves practical
                problems but also strengthens community bonds and supports local
                businesses.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20" style={{ backgroundColor: "var(--bg-color)" }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              className="p-8 rounded-2xl border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  <Target className="h-6 w-6" />
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-color)" }}
                >
                  Our Mission
                </h3>
              </div>
              <p
                className="leading-relaxed"
                style={{ color: "var(--text-color)" }}
              >
                To empower communities by creating seamless, trusted connections
                between service providers and users, fostering local economic
                growth and building stronger neighborhoods.
              </p>
            </motion.div>

            <motion.div
              className="p-8 rounded-2xl border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  <Eye className="h-6 w-6" />
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-color)" }}
                >
                  Our Vision
                </h3>
              </div>
              <p
                className="leading-relaxed"
                style={{ color: "var(--text-color)" }}
              >
                To become the world's most trusted platform where every
                community has instant access to high-quality local services, and
                every local business can thrive.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20" style={{ backgroundColor: "var(--bg-color)" }}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "var(--text-color)" }}
            >
              Our Core Values
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: "var(--text-color)" }}
            >
              These principles guide everything we do at ConnectVista
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="group p-6 rounded-2xl border backdrop-blur-sm cursor-pointer"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                }}
              >
                <motion.div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-white bg-gradient-to-br ${value.color}`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <value.icon className="h-7 w-7" />
                </motion.div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: "var(--text-color)" }}
                >
                  {value.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: "var(--text-color)" }}
                >
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20" style={{ backgroundColor: "var(--bg-color)" }}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "var(--text-color)" }}
            >
              What Our Community Says
            </h2>
            <p style={{ color: "var(--text-color)" }} className="text-xl">
              Hear from service providers and users
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              className="p-8 rounded-2xl border text-center"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Quote
                className="h-12 w-12 mx-auto mb-6 opacity-20"
                style={{ color: "var(--accent-color)" }}
              />
              <p
                className="text-xl md:text-2xl leading-relaxed mb-6"
                style={{ color: "var(--text-color)" }}
              >
                "{testimonials[currentTestimonial].text}"
              </p>
              <div>
                <div
                  className="font-semibold text-lg"
                  style={{ color: "var(--text-color)" }}
                >
                  {testimonials[currentTestimonial].author}
                </div>
                <div style={{ color: "var(--text-color)" }}>
                  {testimonials[currentTestimonial].role}
                </div>
                <div
                  className="text-sm flex items-center justify-center gap-1 mt-1"
                  style={{ color: "var(--text-color)" }}
                >
                  <MapPin className="h-4 w-4" />
                  {testimonials[currentTestimonial].location}
                </div>
              </div>
            </motion.div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-[var(--accent-color)] scale-125"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Quote
      <section className="py-20" style={{ backgroundColor: "var(--bg-color)" }}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="p-12 rounded-2xl border backdrop-blur-sm"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <motion.blockquote
                className="text-2xl md:text-3xl font-light leading-relaxed mb-6"
                style={{ color: "var(--text-color)" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                "Building bridges in communities, one connection at a time."
              </motion.blockquote>
              <motion.div
                className="text-lg"
                style={{ color: "var(--text-color)" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                — The ConnectVista Team
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* Developer Note Section */}
      <section className="py-20" style={{ backgroundColor: "var(--bg-color)" }}>
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="p-8 rounded-2xl border backdrop-blur-sm"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              {/* Profile Image */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative">
                  <img
                    src={resources.FounderImage.src} // Replace with your image path
                    alt="Developer"
                    className="w-40 h-40 rounded-full object-cover border-4"
                    style={{ borderColor: "var(--accent-color)" }}
                  />
                  <motion.div
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                    style={{ backgroundColor: "var(--accent-color)" }}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    💻
                  </motion.div>
                </div>
              </motion.div>

              <h3
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ color: "var(--text-color)" }}
              >
                Built with Passion and Purpose
              </h3>
              <p
                className="leading-relaxed mb-4"
                style={{ color: "var(--text-color)", fontSize: "1.2rem" }}
              >
                ConnectVista represents my journey as a full-stack developer, built with the MERN stack 
              to demonstrate real-world problem-solving. As a B.Tech IT student at Ganpat University, 
              I've combined academic knowledge with practical application to create a platform that 
              serves genuine community needs.
              </p>
              <p
                className="text-md  mb-6"
                style={{ color: "var(--text-color)" }}
              >
                This project represents my commitment to building meaningful
                solutions through technology.
              </p>

              <div
                className="border-t pt-6"
                style={{ borderColor: "var(--border-color)" }}
              >
                <p
                  className="font-semibold text-2xl"
                  style={{ color: "var(--text-color)", fontFamily: "ConnectVistaSecondary" }} 
                >
                  DHRUV SHERE
                </p>
                <p
                  className="text-md"
                  style={{ color: "var(--text-color)" }}
                >
                  Full-Stack Developer & Creator of ConnectVista
                </p>
              <div className="flex flex-wrap justify-center gap-2 text-md opacity-70">
                <span style={{ color: "var(--text-color)" }}>Gujarat, India</span>
                <span style={{ color: "var(--text-color)" }}>•</span>
                <span style={{ color: "var(--text-color)" }}>B.Tech IT '26</span>
                <span style={{ color: "var(--text-color)" }}>•</span>
                <span style={{ color: "var(--text-color)" }}>MERN Stack</span>
              </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white text-center relative">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, var(--accent-color), var(--accent-dark))`,
          }}
        />

        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-10"
              style={{
                width: Math.random() * 80 + 20,
                height: Math.random() * 80 + 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
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
            className="text-4xl md:text-5xl font-bold"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Join Our Growing Community
          </motion.h2>
          <motion.p
            className="text-xl opacity-90 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Whether you're looking for services or providing them, be part of
            something bigger
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              className="px-8 py-4 font-semibold rounded-xl bg-white text-[var(--accent-color)] flex items-center space-x-2"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(255,255,255,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
            <motion.button
              className="px-8 py-4 font-semibold rounded-xl border-2 border-white text-white"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
