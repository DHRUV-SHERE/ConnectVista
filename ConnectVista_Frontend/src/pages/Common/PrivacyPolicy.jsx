import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Calendar, Lock, Eye, Database, AlertCircle, Users, Mail, Globe } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "March 19, 2026";

  const sections = [
    {
      title: "1. Information We Collect",
      icon: Database,
      content: `Personal Information:
      • Name, email address, phone number
      • Profile photos and business information
      • Location data (when you use geolocation features)
      • Payment information (processed securely)
      
      Usage Information:
      • Pages visited and features used
      • Search queries and booking history
      • Device information and IP address
      • Cookies and similar technologies`
    },
    {
      title: "2. How We Use Your Information",
      icon: Eye,
      content: `We use your information to:
      • Provide and improve our services
      • Process bookings and payments
      • Send notifications about your bookings
      • Communicate important updates
      • Personalize your experience
      • Prevent fraud and ensure security
      • Comply with legal obligations
      • Generate analytics and insights`
    },
    {
      title: "3. Information Sharing",
      icon: Users,
      content: `We share your information with:
      
      Service Providers: Name, contact details, and booking information
      Payment Processors: Payment information for transactions
      Analytics Services: Anonymized usage data
      Legal Authorities: When required by law
      
      We do NOT:
      • Sell your personal information
      • Share data without your consent
      • Use your data for spam`
    },
    {
      title: "4. Data Security",
      icon: Lock,
      content: `We protect your data through:
      • Encrypted data transmission (HTTPS/SSL)
      • Secure password hashing (bcrypt)
      • Regular security audits
      • Access controls and authentication
      • Secure cloud infrastructure
      
      However, no system is 100% secure. Please use strong passwords and report suspicious activity.`
    },
    {
      title: "5. Your Rights",
      icon: Shield,
      content: `You have the right to:
      • Access your personal data
      • Correct inaccurate information
      • Delete your account and data
      • Export your data
      • Opt-out of marketing communications
      • Restrict data processing
      • Object to automated decisions
      
      Contact us to exercise these rights.`
    },
    {
      title: "6. Cookies and Tracking",
      icon: Eye,
      content: `We use cookies for:
      • Authentication and session management
      • User preferences
      • Analytics and performance monitoring
      • Security and fraud prevention
      
      You can control cookies through your browser settings. Disabling cookies may affect functionality.`
    },
    {
      title: "7. Third-Party Services",
      icon: Database,
      content: `We integrate with:
      • Payment gateways (Razorpay/Stripe)
      • Email services (EmailJS)
      • Cloud storage (Cloudinary)
      • Analytics platforms
      
      These services have their own privacy policies. We are not responsible for their practices.`
    },
    {
      title: "8. Children's Privacy",
      icon: Shield,
      content: `ConnectVista is not intended for users under 18 years of age. We do not knowingly collect data from children. If you believe a child has provided us with personal information, please contact us immediately.`
    },
    {
      title: "9. Data Retention",
      icon: Database,
      content: `We retain your data:
      • Active accounts: Indefinitely
      • Closed accounts: Up to 90 days
      • Transaction records: 7 years (legal requirement)
      • Analytics data: Anonymized and retained
      
      You can request data deletion at any time.`
    },
    {
      title: "10. International Data Transfers",
      icon: Globe,
      content: `Your data may be transferred to and processed in different countries. We ensure adequate protection through:
      • Standard contractual clauses
      • Data protection agreements
      • Compliance with GDPR and local laws`
    },
    {
      title: "11. Changes to Privacy Policy",
      icon: AlertCircle,
      content: `We may update this Privacy Policy periodically. We will notify you of significant changes via:
      • Email notification
      • Platform announcements
      • Updated "Last Updated" date
      
      Continued use after changes constitutes acceptance.`
    },
    {
      title: "12. Contact Us",
      icon: Mail,
      content: `For privacy-related questions or to exercise your rights:
      
      Email: support.connectvista@gmail.com
      Phone: +91 93168 46548
      Address: Naroda, Ahmedabad, Gujarat - 382330
      
      Response time: Within 7 business days`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Home
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-sky-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-sky-100 rounded-xl">
                <Shield className="text-sky-600" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Privacy Policy
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-2">
                  <Calendar size={16} />
                  Last Updated: {lastUpdated}
                </p>
              </div>
            </div>

            <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-r-xl">
              <div className="flex items-start gap-3">
                <Lock className="text-sky-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-gray-700">
                  Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Key Highlights</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <Shield className="text-green-600 mb-2" size={24} />
              <h3 className="font-semibold text-gray-900 mb-1">We Don't Sell Data</h3>
              <p className="text-sm text-gray-600">Your information is never sold to third parties</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <Lock className="text-blue-600 mb-2" size={24} />
              <h3 className="font-semibold text-gray-900 mb-1">Encrypted & Secure</h3>
              <p className="text-sm text-gray-600">All data is encrypted and securely stored</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <Eye className="text-purple-600 mb-2" size={24} />
              <h3 className="font-semibold text-gray-900 mb-1">Full Control</h3>
              <p className="text-sm text-gray-600">Access, download, or delete your data anytime</p>
            </div>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon || AlertCircle;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-sky-100 rounded-lg">
                    <Icon className="text-sky-600" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white text-center"
        >
          <Shield size={48} className="mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Your Privacy Matters</h3>
          <p className="mb-6 opacity-90">
            Have questions about how we handle your data? We're here to help.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-sky-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </Link>
        </motion.div>

        {/* Print Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.print()}
            className="text-gray-600 hover:text-gray-900 text-sm underline"
          >
            Print this document
          </button>
        </div>
      </div>
    </div>
  );
}
