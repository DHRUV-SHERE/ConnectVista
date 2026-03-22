"use client";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Users,
  Zap,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { contactService } from "../../services/contactService";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await contactService.submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      if (response.success) {
        toast.success(response.message);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our team",
      details: "+91 93168 46548",
      action: "Call Now",
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      details: "sheredhruv@gmail.com",
      action: "Send Email",
    },
    {
      icon: Users,
      title: "Community",
      description: "Join our community forum",
      details: "5000+ members",
      action: "Join Forum",
    },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-color)" }}>
      {/* Hero Section */}
      <section className="relative pt-20 pb-16">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, var(--accent-color), var(--accent-dark))`,
          }}
        />
        
        <div className="relative w-[85vw] mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8" style={{ fontFamily: "var(--font-secondary)" }}>
              Get in Touch With Us
            </h1>
            <p className="text-xl md:text-2xl opacity-95 max-w-2xl mx-auto mb-10">
              Have questions or need assistance? We're here to help you every step of the way.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <button
                className="px-8 py-3 bg-white text-[var(--accent-color)] rounded-xl font-semibold text-lg hover:opacity-95 transition-opacity"
                style={{ fontFamily: "var(--font-primary)" }}
              >
                Start Conversation
              </button>
              <button
                className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
                style={{ fontFamily: "var(--font-primary)" }}
              >
                Quick Help
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="py-16">
        <div className="w-[85vw] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ 
              color: "var(--text-color)",
              fontFamily: "var(--font-secondary)" 
            }}>
              Connect With Us
            </h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "var(--text-color)" }}>
              Choose your preferred way to reach out. We're always ready to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method) => (
              <div
                key={method.title}
                className="p-8 rounded-xl border hover:border-[var(--accent-color)] hover:shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex flex-col items-center text-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white mb-4"
                    style={{ backgroundColor: "var(--accent-color)" }}
                  >
                    <method.icon className="h-8 w-8" />
                  </div>
                  <h3
                    className="text-2xl font-semibold mb-2"
                    style={{ 
                      color: "var(--text-color)",
                      fontFamily: "var(--font-secondary)" 
                    }}
                  >
                    {method.title}
                  </h3>
                  <p
                    className="text-lg mb-4"
                    style={{ color: "var(--text-color)" }}
                  >
                    {method.description}
                  </p>
                </div>
                <div
                  className="text-xl font-medium mb-6 text-center"
                  style={{ 
                    color: "var(--accent-color)",
                  }}
                >
                  {method.details}
                </div>
                <button
                  className="w-full py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
                  style={{ 
                    backgroundColor: "var(--accent-color)",
                    color: "white",
                  }}
                >
                  {method.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Form Section */}
      <section className="py-16">
        <div className="w-[85vw] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div className="p-8 rounded-xl border" style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}>
                <h3 className="text-2xl font-bold mb-8" style={{ 
                  color: "var(--text-color)",
                  fontFamily: "var(--font-secondary)" 
                }}>
                  Contact Details
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: "var(--bg-color)" }}>
                    <MapPin className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: "var(--accent-color)" }} />
                    <div>
                      <h4 className="font-semibold text-lg mb-1" style={{ color: "var(--text-color)" }}>Our Address</h4>
                      <p className="text-base" style={{ color: "var(--text-color)" }}>
                        Naroda, Ahmedabad<br />Gujarat - 382330, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: "var(--bg-color)" }}>
                    <Phone className="h-6 w-6 flex-shrink-0" style={{ color: "var(--accent-color)" }} />
                    <div>
                      <h4 className="font-semibold text-lg mb-1" style={{ color: "var(--text-color)" }}>Phone Number</h4>
                      <p className="text-base" style={{ color: "var(--text-color)" }}>+91 93168 46548</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: "var(--bg-color)" }}>
                    <Mail className="h-6 w-6 flex-shrink-0" style={{ color: "var(--accent-color)" }} />
                    <div>
                      <h4 className="font-semibold text-lg mb-1" style={{ color: "var(--text-color)" }}>Email Address</h4>
                      <p className="text-base" style={{ color: "var(--text-color)" }}>sheredhruv@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: "var(--bg-color)" }}>
                    <Clock className="h-6 w-6 flex-shrink-0" style={{ color: "var(--accent-color)" }} />
                    <div>
                      <h4 className="font-semibold text-lg mb-1" style={{ color: "var(--text-color)" }}>Business Hours</h4>
                      <p className="text-base" style={{ color: "var(--text-color)" }}>Monday - Saturday: 9AM - 6PM</p>
                      <p className="text-base" style={{ color: "var(--text-color)" }}>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Support Card */}
              <div className="p-8 rounded-xl text-white" style={{ 
                background: "linear-gradient(135deg, var(--accent-color), var(--accent-dark))"
              }}>
                <div className="flex items-center gap-4 mb-6">
                  <Zap className="h-8 w-8" />
                  <h3 className="text-2xl font-bold">Quick Response</h3>
                </div>
                <p className="text-lg mb-6 opacity-90">
                  Need immediate assistance? We typically respond within 1 hour during business hours.
                </p>
                <button className="w-full py-3 bg-white rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity" 
                  style={{ color: "var(--accent-color)" }}>
                  Get Quick Help
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="p-8 rounded-xl border h-full" style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}>
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white" 
                    style={{ backgroundColor: "var(--accent-color)" }}>
                    <MessageSquare className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold" style={{ 
                      color: "var(--text-color)",
                      fontFamily: "var(--font-secondary)" 
                    }}>
                      Send Us a Message
                    </h2>
                    <p className="text-lg opacity-90" style={{ color: "var(--text-color)" }}>
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-medium mb-3" style={{ color: "var(--text-color)" }}>
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-xl border px-5 py-4 text-lg"
                        style={{ backgroundColor: "var(--bg-color)", borderColor: "var(--border-color)", color: "var(--text-color)" }}
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium mb-3" style={{ color: "var(--text-color)" }}>
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full rounded-xl border px-5 py-4 text-lg"
                        style={{ backgroundColor: "var(--bg-color)", borderColor: "var(--border-color)", color: "var(--text-color)" }}
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                      <label className="block text-lg font-medium mb-3" style={{ color: "var(--text-color)" }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full rounded-xl border px-5 py-4 text-lg"
                        style={{ backgroundColor: "var(--bg-color)", borderColor: "var(--border-color)", color: "var(--text-color)" }}
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                  <div>
                    <label className="block text-lg font-medium mb-3" style={{ color: "var(--text-color)" }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-xl border px-5 py-4 text-lg"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium mb-3" style={{ color: "var(--text-color)" }}>
                      Your Message
                    </label>
                    <textarea
                      rows={6}
                      required
                      className="w-full rounded-xl border px-5 py-4 text-lg resize-none"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                      placeholder="Please describe your inquiry in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-semibold text-white text-xl flex items-center justify-center gap-3 hover:opacity-95 transition-opacity"
                    style={{ backgroundColor: "var(--accent-color)" }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending Your Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-6 w-6" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="w-[85vw] mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ 
              color: "var(--text-color)",
              fontFamily: "var(--font-secondary)" 
            }}>
              Find Our Location
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "var(--text-color)" }}>
              Based in the heart of Ahmedabad, serving communities across Gujarat and beyond.
            </p>
          </div>

          <div className="rounded-xl border overflow-hidden shadow-lg" style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border-color)",
          }}>
            <div className="p-6 flex items-center gap-4 border-b" style={{ borderColor: "var(--border-color)" }}>
              <MapPin className="h-8 w-8" style={{ color: "var(--accent-color)" }} />
              <div>
                <h3 className="text-xl font-semibold" style={{ color: "var(--text-color)" }}>Naroda, Ahmedabad</h3>
                <p className="text-lg" style={{ color: "var(--text-color)" }}>Gujarat - 382330, India</p>
              </div>
            </div>
            <div className="h-[500px]">
              <iframe
                title="ConnectVista Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14683.057508209224!2d72.64323279689985!3d23.069098406749877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e86d301d564e9%3A0x4a614a618d618d60!2sNaroda%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1760263733341!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16" style={{ backgroundColor: "var(--card-bg)" }}>
        <div className="w-[85vw] mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-xl" 
              style={{ backgroundColor: "var(--accent-fade)" }}>
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-4" style={{ 
                  color: "var(--text-color)",
                  fontFamily: "var(--font-secondary)" 
                }}>
                  Still Have Questions?
                </h3>
                <p className="text-lg" style={{ color: "var(--text-color)" }}>
                  Check our FAQ section or contact our support team for immediate assistance.
                </p>
              </div>
              <div className="flex gap-4">
                <button className="px-8 py-3 rounded-xl font-semibold text-lg border hover:opacity-90 transition-opacity"
                  style={{ 
                    borderColor: "var(--accent-color)",
                    color: "var(--accent-color)",
                    backgroundColor: "transparent"
                  }}>
                  View FAQ
                </button>
                <button className="px-8 py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
                  style={{ 
                    backgroundColor: "var(--accent-color)",
                    color: "white"
                  }}>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}