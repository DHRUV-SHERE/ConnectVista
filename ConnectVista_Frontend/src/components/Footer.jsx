import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Heart,
  ArrowRight,
  Shield,
  Users,
  Star,
} from "lucide-react";

// Animated Link Component - Fixed underline visibility
const AnimatedLink = ({ to, children, className = "" }) => {
  return (
    <motion.div
      whileHover="hover"
      className={`inline-block relative ${className}`}
    >
      <Link to={to} className="relative inline-block">
        {children}
        <motion.span
          variants={{
            hover: { width: "100%" }
          }}
          initial={{ width: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute left-0 -bottom-1 h-[2px]"
          style={{ backgroundColor: "var(--accent-color)" }}
        />
      </Link>
    </motion.div>
  );
};

// Animated Social Icon Component
const AnimatedSocialIcon = ({ href, icon: Icon, label }) => {
  return (
    <motion.a
      href={href}
      aria-label={label}
      whileHover={{ 
        scale: 1.1,
        y: -2
      }}
      whileTap={{ scale: 0.95 }}
      className="p-2 rounded-full transition-colors duration-300 relative group"
      style={{
        backgroundColor: "var(--card-bg)",
        color: "var(--text-color)",
      }}
    >
      <Icon size={18} />
      <motion.div
        className="absolute bottom-1 left-1 right-1 h-[2px]"
        style={{ backgroundColor: "var(--accent-color)" }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </motion.a>
  );
};

// Service Item with underline animation
const ServiceItem = ({ service }) => {
  return (
    <motion.div
      whileHover="hover"
      className="cursor-pointer flex items-center space-x-2 text-muted-foreground hover:text-[var(--accent-color)] transition-colors duration-300 w-fit"
    >
      <ArrowRight size={12} />
      <span className="relative inline-block">
        {service}
        <motion.span
          variants={{
            hover: { width: "100%" }
          }}
          initial={{ width: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute left-0 -bottom-1 h-[2px]"
          style={{ backgroundColor: "var(--accent-color)" }}
        />
      </span>
    </motion.div>
  );
};

// Contact Item with underline animation
const ContactItem = ({ icon: Icon, children }) => {
  return (
    <div className="group relative cursor-pointer">
      <div className="flex items-start gap-3 text-muted-foreground group-hover:text-[var(--accent-color)] transition-colors duration-300">
        <Icon size={16} className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent-color)" }} />
        <span className="relative">
          {children}
          <motion.div
            className="absolute bottom-0 left-0 w-0 h-[2px]"
            style={{ backgroundColor: "var(--accent-color)" }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </span>
      </div>
    </div>
  );
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.footer
      className="w-full border-t mt-12 overflow-hidden"
      style={{
        background: "var(--overlay-bg)",
        borderColor: "var(--border-color)",
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={footerVariants}
    >
      <div className="w-full max-w-[100vw] py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Info */}
          <motion.div 
            className="space-y-4 md:col-span-2 lg:col-span-2"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-2">
              <div className="font-bold text-2xl" style={{ color: "var(--text-color)" }}>
                Connect
                <span style={{ color: "var(--accent-color)" }}>Vista</span>
              </div>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
              </motion.div>
            </div>
            <p className="text-sm max-w-md" style={{ color: "var(--text-color)" }}>
              Empowering communities by linking service providers and users nearby. 
              Your trusted platform for quality local services with verified professionals.
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center space-x-1">
                <Shield size={14} className="text-green-500" />
                <span>Verified Providers</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={14} className="text-yellow-500" />
                <span>5-Star Ratings</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users size={14} className="text-blue-500" />
                <span>Community First</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <AnimatedSocialIcon 
                href="#" 
                icon={Facebook} 
                label="Facebook" 
              />
              <AnimatedSocialIcon 
                href="#" 
                icon={Twitter} 
                label="Twitter" 
              />
              <AnimatedSocialIcon 
                href="#" 
                icon={Instagram} 
                label="Instagram" 
              />
              <AnimatedSocialIcon 
                href="#" 
                icon={Youtube} 
                label="YouTube" 
              />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <div className="font-semibold mb-4 text-lg" style={{ color: "var(--text-color)" }}>
              Quick Links
            </div>
            <ul className="space-y-3 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/services", label: "Services" },
                { to: "/contact", label: "Contact" },
                { to: "/blog", label: "Blog" },
              ].map((link) => (
                <li key={link.to}>
                  <AnimatedLink 
                    to={link.to}
                    className="text-muted-foreground hover:text-[var(--accent-color)] transition-colors duration-300"
                  >
                    {link.label}
                  </AnimatedLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <div className="font-semibold mb-4 text-lg" style={{ color: "var(--text-color)" }}>
              Top Services
            </div>
            <ul className="space-y-3 text-sm">
              {[
                "Plumbing & Repair",
                "Electrical Services",
                "Home Cleaning",
                "Salon & Beauty",
                "Tutoring",
                "AC Repair",
                "Painting",
                "Moving & Packing"
              ].map((service) => (
                <li key={service}>
                  <ServiceItem service={service} />
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="space-y-4"
            variants={itemVariants}
          >
            <div className="font-semibold mb-4 text-lg" style={{ color: "var(--text-color)" }}>
              Contact Us
            </div>
            <div className="space-y-3 text-sm">
              <ContactItem icon={MapPin}>
                Naroda, Ahmedabad, Gujarat - 382330
              </ContactItem>
              <ContactItem icon={Phone}>
                +91 93168 46548
              </ContactItem>
              <ContactItem icon={Mail}>
                support.connectvista@gmail.com
              </ContactItem>
            </div>

            {/* Newsletter Signup */}
            <motion.div 
              className="mt-4 p-3 rounded-lg"
              style={{ backgroundColor: "var(--card-bg)" }}
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-xs font-medium mb-2">Stay Updated</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-2 py-1 text-xs rounded border"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)"
                  }}
                />
                <motion.button
                  className="px-3 py-1 text-xs rounded text-white relative overflow-hidden"
                  style={{ backgroundColor: "var(--accent-color)" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Join</span>
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-white"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div 
          className="text-center pt-8 mt-8 border-t"
          style={{ borderColor: "var(--border-color)" }}
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-xs text-muted-foreground">
              © {currentYear} ConnectVista. All rights reserved.
            </div>
            <div className="flex space-x-4 text-xs">
              <AnimatedLink to="/terms" className="text-muted-foreground hover:text-[var(--accent-color)]">
                Terms of Service
              </AnimatedLink>
              <AnimatedLink to="/privacy" className="text-muted-foreground hover:text-[var(--accent-color)]">
                Privacy Policy
              </AnimatedLink>
              <AnimatedLink to="/cookies" className="text-muted-foreground hover:text-[var(--accent-color)]">
                Cookie Policy
              </AnimatedLink>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}