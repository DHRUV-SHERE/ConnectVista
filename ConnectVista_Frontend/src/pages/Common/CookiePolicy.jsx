import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Cookie, Calendar, Settings, Eye, Shield } from "lucide-react";

export default function CookiePolicy() {
  const lastUpdated = "March 19, 2026";

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
                <Cookie className="text-sky-600" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Cookie Policy
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-2">
                  <Calendar size={16} />
                  Last Updated: {lastUpdated}
                </p>
              </div>
            </div>

            <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-r-xl">
              <p className="text-sm text-gray-700">
                This policy explains how ConnectVista uses cookies and similar technologies to enhance your experience.
              </p>
            </div>
          </div>
        </motion.div>

        {/* What are Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Cookie className="text-sky-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">What are Cookies?</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Cookies are small text files stored on your device when you visit a website. They help us remember your preferences, 
            keep you logged in, and understand how you use our platform. Cookies enhance your browsing experience and help us 
            improve our services.
          </p>
        </motion.div>

        {/* Types of Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="text-green-600" size={20} />
                <h3 className="font-semibold text-gray-900">Essential Cookies (Required)</h3>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                These cookies are necessary for the platform to function properly:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li><strong>Authentication:</strong> Keep you logged in (JWT tokens)</li>
                <li><strong>Security:</strong> Prevent cross-site attacks and fraud</li>
                <li><strong>Session Management:</strong> Maintain your active session</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                ⚠️ Cannot be disabled as they are essential for core functionality
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="text-blue-600" size={20} />
                <h3 className="font-semibold text-gray-900">Functional Cookies (Optional)</h3>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                These cookies remember your preferences and choices:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li><strong>Language:</strong> Remember your preferred language</li>
                <li><strong>Location:</strong> Store your location preferences</li>
                <li><strong>Filters:</strong> Remember your search filters</li>
                <li><strong>Theme:</strong> Store display preferences</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="text-purple-600" size={20} />
                <h3 className="font-semibold text-gray-900">Analytics Cookies (Optional)</h3>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                These cookies help us understand how you use the platform:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li><strong>Usage Statistics:</strong> Pages visited, time spent</li>
                <li><strong>Performance:</strong> Load times, errors encountered</li>
                <li><strong>User Behavior:</strong> Click patterns, navigation flow</li>
                <li><strong>Device Information:</strong> Browser type, screen size</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                📊 Data is anonymized and used only for improvement
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cookie Duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cookie Duration</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Session Cookies</h3>
              <p className="text-sm text-gray-600">
                Temporary cookies that expire when you close your browser. Used for session management and security.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Persistent Cookies</h3>
              <p className="text-sm text-gray-600">
                Remain on your device for a set period (up to 30 days). Used for remembering preferences and login status.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Third-Party Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-3">Third-Party Cookies</h2>
          <p className="text-gray-700 mb-4">
            We use some third-party services that may set their own cookies:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">•</span>
              <span><strong>Payment Gateways:</strong> Razorpay/Stripe for secure payment processing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">•</span>
              <span><strong>Email Services:</strong> EmailJS for transactional emails</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">•</span>
              <span><strong>Cloud Storage:</strong> Cloudinary for image hosting</span>
            </li>
          </ul>
          <p className="text-sm text-gray-600 mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            ⚠️ These third-party services have their own cookie policies. We recommend reviewing their policies.
          </p>
        </motion.div>

        {/* Managing Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">How to Manage Cookies</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Browser Settings</h3>
              <p className="text-sm text-gray-700 mb-2">
                You can control and delete cookies through your browser settings:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-900 mb-2">⚠️ Important Note</h3>
              <p className="text-sm text-red-700">
                Disabling essential cookies will prevent you from logging in and using core features of ConnectVista. 
                Optional cookies can be disabled without affecting functionality, but may reduce personalization.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Do Not Track */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-3">Do Not Track (DNT)</h2>
          <p className="text-gray-700">
            We respect the "Do Not Track" browser setting. When DNT is enabled, we will not use analytics or marketing 
            cookies. However, essential cookies for authentication and security will still be used.
          </p>
        </motion.div>

        {/* Updates to Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-3">Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated 
            "Last Updated" date. We encourage you to review this policy periodically.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-3">Questions About Cookies?</h2>
          <p className="text-gray-700 mb-4">
            If you have questions about our use of cookies, please contact us:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>Email: support.connectvista@gmail.com</li>
            <li>Phone: +91 93168 46548</li>
            <li>Address: Naroda, Ahmedabad, Gujarat - 382330</li>
          </ul>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white text-center"
        >
          <Cookie size={48} className="mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">We Value Your Privacy</h3>
          <p className="mb-6 opacity-90">
            Cookies help us provide a better experience while respecting your choices
          </p>
          <Link
            to="/privacy"
            className="inline-block bg-white text-sky-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Read Privacy Policy
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
