import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Calendar, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";

export default function RefundPolicy() {
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
                <RefreshCw className="text-sky-600" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Refund & Cancellation Policy
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-2">
                  <Calendar size={16} />
                  Last Updated: {lastUpdated}
                </p>
              </div>
            </div>

            <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-r-xl">
              <p className="text-sm text-gray-700">
                This policy outlines the terms for booking cancellations, refunds, and wallet credits on ConnectVista.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Refund Timeline</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-green-600" size={20} />
                <span className="font-semibold text-gray-900">24+ Hours</span>
              </div>
              <p className="text-sm text-gray-600">100% refund to wallet</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-yellow-600" size={20} />
                <span className="font-semibold text-gray-900">12-24 Hours</span>
              </div>
              <p className="text-sm text-gray-600">50% refund to wallet</p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="text-red-600" size={20} />
                <span className="font-semibold text-gray-900">&lt; 12 Hours</span>
              </div>
              <p className="text-sm text-gray-600">No refund</p>
            </div>
          </div>
        </motion.div>

        {/* Policy Sections */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              1. Booking Cancellation by Seeker
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="font-semibold">Cancellation before service starts:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>24+ hours before booking:</strong> 100% refund credited to your wallet</li>
                <li><strong>12-24 hours before booking:</strong> 50% refund credited to your wallet</li>
                <li><strong>Less than 12 hours:</strong> No refund (payment retained by provider)</li>
                <li><strong>No-show:</strong> No refund</li>
              </ul>
              <p className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                ⚠️ All refunds are processed as wallet credits, not to original payment method.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              2. Booking Rejection by Provider
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>If a service provider rejects your booking:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>100% refund credited to your wallet immediately</li>
                <li>No cancellation fees apply</li>
                <li>You can rebook with another provider instantly</li>
                <li>Original booking request is marked as "Rejected"</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              3. Service Not Delivered
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>If the provider fails to deliver the service:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Full refund to wallet after verification</li>
                <li>Report within 24 hours of scheduled booking time</li>
                <li>Provide evidence (photos, messages, etc.)</li>
                <li>Our team will investigate and resolve within 3-5 business days</li>
                <li>Provider may face penalties or suspension</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              4. Platform Commission
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>ConnectVista charges a 10-15% commission on all completed bookings:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Commission is non-refundable in all cases</li>
                <li>Deducted from provider's earnings</li>
                <li>Used for platform maintenance, support, and security</li>
                <li>Seekers pay the full booking amount (commission included)</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              5. Subscription Refunds
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>For provider subscription plans:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>No refunds</strong> for partial subscription periods</li>
                <li>Cancel anytime, but subscription remains active until expiry</li>
                <li>No pro-rated refunds if cancelled mid-cycle</li>
                <li>Auto-renewal can be disabled from settings</li>
                <li>Downgrading plans may result in feature restrictions</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              6. Wallet Credits
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>All refunds are processed as wallet credits:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Credits added to your ConnectVista wallet instantly</li>
                <li>Can be used for future bookings</li>
                <li>Wallet balance never expires</li>
                <li>Minimum withdrawal amount: ₹500 (for providers)</li>
                <li>Withdrawal processing time: 3-5 business days</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              7. Dispute Resolution
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>In case of refund disputes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Contact our support team within 7 days of the booking</li>
                <li>Provide booking ID and relevant details</li>
                <li>We will mediate between seeker and provider</li>
                <li>Decision is based on evidence and platform policies</li>
                <li>Final decision by ConnectVista team is binding</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              8. Contact for Refunds
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>For refund-related queries:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email: support.connectvista@gmail.com</li>
                <li>Phone: +91 93168 46548</li>
                <li>Response time: Within 24-48 hours</li>
                <li>Include booking ID in all communications</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white text-center"
        >
          <DollarSign size={48} className="mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Need Help with a Refund?</h3>
          <p className="mb-6 opacity-90">
            Our support team is ready to assist you with any refund concerns
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
