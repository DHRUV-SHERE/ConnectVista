import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Calendar, Shield, Users, AlertCircle } from "lucide-react";

export default function TermsOfService() {
  const lastUpdated = "March 19, 2026";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using ConnectVista, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.`
    },
    {
      title: "2. Platform Description",
      content: `ConnectVista is a service marketplace platform that connects service seekers with service providers. We facilitate bookings, payments, and communications between users but do not directly provide the services listed on our platform.`
    },
    {
      title: "3. User Accounts",
      content: `You must create an account to use certain features. You are responsible for:
      • Maintaining the confidentiality of your account credentials
      • All activities that occur under your account
      • Notifying us immediately of any unauthorized access
      • Providing accurate and complete information during registration`
    },
    {
      title: "4. User Roles and Responsibilities",
      content: `Service Seekers:
      • Must provide accurate service requirements
      • Are responsible for payment of booked services
      • Must treat service providers with respect
      
      Service Providers:
      • Must provide accurate business information
      • Are responsible for delivering promised services
      • Must maintain required licenses and certifications
      • Must treat customers professionally`
    },
    {
      title: "5. Bookings and Payments",
      content: `• All bookings are subject to service provider acceptance
      • Payment must be made through the platform's wallet system
      • Platform commission (10-15%) applies to all transactions
      • Refunds are subject to our Refund Policy
      • Booking cancellation policies apply as per provider settings`
    },
    {
      title: "6. Platform Commission",
      content: `ConnectVista charges a service fee of 10-15% on all completed bookings. This fee covers:
      • Platform maintenance and development
      • Payment processing
      • Customer support
      • Dispute resolution
      • Security and fraud protection`
    },
    {
      title: "7. Provider Verification",
      content: `We verify service providers to ensure quality, but:
      • Verification does not guarantee service quality
      • Users should exercise their own judgment
      • We are not liable for provider actions
      • Report any concerns to our support team`
    },
    {
      title: "8. Reviews and Ratings",
      content: `• Only users who have completed a booking can leave reviews
      • Reviews must be honest and respectful
      • We reserve the right to remove inappropriate reviews
      • False or misleading reviews are prohibited
      • Providers can respond to reviews`
    },
    {
      title: "9. Prohibited Activities",
      content: `Users must not:
      • Use the platform for illegal activities
      • Impersonate other users or entities
      • Harass, abuse, or threaten other users
      • Share misleading or false information
      • Attempt to bypass payment systems
      • Use automated systems to access the platform
      • Violate intellectual property rights`
    },
    {
      title: "10. Subscription Plans",
      content: `Service providers can subscribe to premium plans:
      • Plans auto-renew unless cancelled
      • No refunds for partial subscription periods
      • Access is disabled upon expiration
      • Notifications sent before expiry
      • Cancel anytime through settings`
    },
    {
      title: "11. Intellectual Property",
      content: `All content on ConnectVista, including logos, designs, and text, is owned by ConnectVista or its licensors. Users may not:
      • Copy or reproduce platform content
      • Use our branding without permission
      • Reverse engineer our software`
    },
    {
      title: "12. Disclaimer of Warranties",
      content: `ConnectVista is provided "as is" without warranties of any kind. We do not guarantee:
      • Uninterrupted or error-free service
      • Specific results from using the platform
      • Quality of services provided by third parties
      • Accuracy of user-provided information`
    },
    {
      title: "13. Limitation of Liability",
      content: `ConnectVista and its affiliates are not liable for:
      • Indirect, incidental, or consequential damages
      • Loss of profits or business
      • Service provider actions or omissions
      • Disputes between users
      • Maximum liability is limited to amounts paid in the last 12 months`
    },
    {
      title: "14. Dispute Resolution",
      content: `In case of disputes:
      • Contact our support team first
      • We will attempt mediation
      • Legal disputes are subject to Ahmedabad, Gujarat jurisdiction
      • Arbitration may be required for certain disputes`
    },
    {
      title: "15. Privacy and Data",
      content: `Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your data. By using ConnectVista, you consent to our data practices as described in the Privacy Policy.`
    },
    {
      title: "16. Termination",
      content: `We reserve the right to:
      • Suspend or terminate accounts for violations
      • Refuse service to anyone
      • Modify or discontinue services
      • Remove content at our discretion
      
      You may close your account at any time by contacting support.`
    },
    {
      title: "17. Changes to Terms",
      content: `We may update these Terms of Service periodically. Continued use of the platform after changes constitutes acceptance. We will notify users of significant changes via email or platform notifications.`
    },
    {
      title: "18. Contact Information",
      content: `For questions about these Terms of Service:
      • Email: support.connectvista@gmail.com
      • Phone: +91 93168 46548
      • Address: Naroda, Ahmedabad, Gujarat - 382330`
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
                <FileText className="text-sky-600" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Terms of Service
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-2">
                  <Calendar size={16} />
                  Last Updated: {lastUpdated}
                </p>
              </div>
            </div>

            <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-r-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-sky-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-gray-700">
                  Please read these terms carefully before using ConnectVista. By using our platform, you agree to be bound by these terms.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield size={20} className="text-sky-600" />
            Table of Contents
          </h2>
          <div className="grid md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <a
                key={index}
                href={`#section-${index}`}
                className="text-sm text-sky-600 hover:text-sky-700 hover:underline"
              >
                {section.title}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              id={`section-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {section.title}
              </h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white text-center"
        >
          <Users size={48} className="mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Questions about our Terms?</h3>
          <p className="mb-6 opacity-90">
            Our support team is here to help you understand our policies
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-sky-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Support
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
