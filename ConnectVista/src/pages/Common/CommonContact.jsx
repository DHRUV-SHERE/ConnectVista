"use client";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our team",
      details: "+1 (555) 123-4567",
      action: "Call Now",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      details: "support@connectvista.com",
      action: "Send Email",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Instant messaging support",
      details: "Available 24/7",
      action: "Start Chat",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Users,
      title: "Community",
      description: "Join our community forum",
      details: "5000+ members",
      action: "Join Forum",
      color: "from-orange-500 to-red-600",
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

  const cardHoverVariants = {
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, var(--accent-color), var(--accent-dark))`,
          }}
        />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
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
                y: [0, -30, 0],
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
            Let's Connect
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8"
            variants={itemVariants}
          >
            Ready to transform your local service experience? We're here to help
            you every step of the way.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-[var(--accent-color)] rounded-full font-semibold cursor-pointer"
            >
              Get Started Today
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold cursor-pointer"
            >
              Learn More
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Contact Methods Grid */}
      <section style={{ backgroundColor: "var(--bg-color)" }} className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              style={{ color: "var(--text-color)" }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Multiple Ways to Connect
            </h2>
            <p
              style={{ color: "var(--text-color)" }}
              className="text-xl opacity-80 max-w-2xl mx-auto"
            >
              Choose your preferred method to get in touch with our team
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                className="group p-6 rounded-2xl border cursor-pointer"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
                variants={cardHoverVariants}
                whileHover="hover"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-white bg-gradient-to-br ${method.color}`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <method.icon className="h-7 w-7" />
                </motion.div>
                <h3
                  style={{ color: "var(--text-color)" }}
                  className="text-xl font-semibold mb-3"
                >
                  {method.title}
                </h3>
                <p
                  style={{ color: "var(--text-color)" }}
                  className="opacity-80 mb-2"
                >
                  {method.description}
                </p>
                <div
                  style={{ color: "var(--text-color)" }}
                  className="text-sm font-medium mb-4"
                >
                  {method.details}
                </div>
                <motion.button
                  className="w-full py-2 rounded-lg border-2 font-semibold"
                  style={{
                    borderColor: "var(--accent-color)",
                    color: "var(--accent-color)",
                    backgroundColor: "transparent",
                  }}
                  whileHover={{
                    backgroundColor: "var(--accent-color)",
                    color: "white",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {method.action}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Form Section */}
      <section style={{ backgroundColor: "var(--bg-color)" }} className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              className="p-8 rounded-2xl border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  <Send className="h-6 w-6" />
                </div>
                <div>
                  <h2
                    style={{ color: "var(--text-color)" }}
                    className="text-3xl font-bold"
                  >
                    Send us a Message
                  </h2>
                  <p
                    style={{ color: "var(--text-color)" }}
                    className="opacity-80"
                  >
                    We typically respond within 2 hours
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      style={{ color: "var(--text-color)" }}
                      className="block text-sm font-medium mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-xl border px-4 py-3"
                      style={{
                        backgroundColor: "var(--card-bg)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label
                      style={{ color: "var(--text-color)" }}
                      className="block text-sm font-medium mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full rounded-xl border px-4 py-3"
                      style={{
                        backgroundColor: "var(--card-bg)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{ color: "var(--text-color)" }}
                    className="block text-sm font-medium mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border px-4 py-3"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    style={{ color: "var(--text-color)" }}
                    className="block text-sm font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    rows={6}
                    required
                    className="w-full rounded-xl border px-4 py-3 resize-none"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--accent-color)" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="space-y-6"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div
                className="p-8 rounded-2xl border"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              >
                <h3
                  style={{ color: "var(--text-color)" }}
                  className="text-2xl font-bold mb-6"
                >
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div
                    className="flex items-start gap-4 p-4 rounded-lg transition-colors"
                    style={{ backgroundColor: "var(--bg-color)" }}
                  >
                    <MapPin
                      className="h-6 w-6 mt-1"
                      style={{ color: "var(--accent-color)" }}
                    />
                    <div>
                      <h4
                        style={{ color: "var(--text-color)" }}
                        className="font-semibold"
                      >
                        Our Office
                      </h4>
                      <p
                        style={{ color: "var(--text-color)" }}
                        className="opacity-80"
                      >
                        123 Service Street, Community City, CC 12345
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-4 p-4 rounded-lg transition-colors"
                    style={{ backgroundColor: "var(--bg-color)" }}
                  >
                    <Phone
                      className="h-6 w-6"
                      style={{ color: "var(--accent-color)" }}
                    />
                    <div>
                      <h4
                        style={{ color: "var(--text-color)" }}
                        className="font-semibold"
                      >
                        Phone
                      </h4>
                      <p
                        style={{ color: "var(--text-color)" }}
                        className="opacity-80"
                      >
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-4 p-4 rounded-lg transition-colors"
                    style={{ backgroundColor: "var(--bg-color)" }}
                  >
                    <Mail
                      className="h-6 w-6"
                      style={{ color: "var(--accent-color)" }}
                    />
                    <div>
                      <h4
                        style={{ color: "var(--text-color)" }}
                        className="font-semibold"
                      >
                        Email
                      </h4>
                      <p
                        style={{ color: "var(--text-color)" }}
                        className="opacity-80"
                      >
                        support@connectvista.com
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-4 p-4 rounded-lg transition-colors"
                    style={{ backgroundColor: "var(--bg-color)" }}
                  >
                    <Clock
                      className="h-6 w-6"
                      style={{ color: "var(--accent-color)" }}
                    />
                    <div>
                      <h4
                        style={{ color: "var(--text-color)" }}
                        className="font-semibold"
                      >
                        Business Hours
                      </h4>
                      <p
                        style={{ color: "var(--text-color)" }}
                        className="opacity-80"
                      >
                        Mon - Fri: 9:00 AM - 6:00 PM
                      </p>
                      <p
                        style={{ color: "var(--text-color)" }}
                        className="opacity-80"
                      >
                        Sat: 10:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact Card */}
              <motion.div
                className="p-8 rounded-2xl border text-white text-center relative overflow-hidden"
                style={{ backgroundColor: "var(--accent-color)" }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                <Zap className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Need Immediate Help?</h3>
                <p className="opacity-90 mb-4">
                  For urgent inquiries, call our 24/7 support line
                </p>
                <motion.button
                  className="px-6 py-3 bg-white rounded-full font-semibold"
                  style={{ color: "var(--accent-color)" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Call Now: +1 (555) 123-4567
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section style={{ backgroundColor: "var(--bg-color)" }} className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              style={{ color: "var(--text-color)" }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Visit Us
            </h2>
            <p
              style={{ color: "var(--text-color)" }}
              className="text-xl opacity-80 max-w-2xl mx-auto"
            >
              Come see us in person at our headquarters in Community City
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl border overflow-hidden flex items-center justify-center min-h-[400px]"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center p-8">
              <MapPin
                size={48}
                style={{ color: "var(--accent-color)" }}
                className="mx-auto mb-4"
              />
              <h3
                style={{ color: "var(--text-color)" }}
                className="text-2xl font-bold mb-2"
              >
                Our Location
              </h3>
              <p
                style={{ color: "var(--text-color)" }}
                className="opacity-80 mb-4"
              >
                Naroda, Ahmedabad, Gujarat - 382330
              </p>
              <div className="w-7xl h-96 bg-gray-200 flex items-center justify-center text-gray-500">
                <iframe
                  title="Our Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14683.057508209224!2d72.64323279689985!3d23.069098406749877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e86d301d564e9%3A0x4a614a618d618d60!2sNaroda%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1760263733341!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
