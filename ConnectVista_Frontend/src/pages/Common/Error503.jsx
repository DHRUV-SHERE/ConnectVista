import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Construction, Home, Clock, Mail, Twitter, AlertCircle } from "lucide-react";

export default function Error503() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-yellow-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Icon Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mx-auto w-48 h-48 bg-yellow-100 rounded-full flex items-center justify-center">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                y: [0, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Construction className="text-yellow-600" size={96} />
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {/* Error Code */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-mono font-bold">
              503 | Service Temporarily Unavailable
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            We'll Be Right Back!
          </h1>

          {/* Message */}
          <div className="space-y-3">
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              ConnectVista is currently undergoing scheduled maintenance. We're working hard to improve your experience.
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium"
            >
              <Clock className="h-4 w-4 mr-2" />
              Expected downtime: Less than 30 minutes
            </motion.div>
          </div>

          {/* Status Updates */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="pt-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What's happening?</h2>
              <ul className="space-y-3 text-left text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 p-1 bg-green-100 rounded-full">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span>Database optimization in progress</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 p-1 bg-green-100 rounded-full">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span>Security updates being applied</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 p-1 bg-yellow-100 rounded-full">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  </div>
                  <span>Performance improvements</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-8 py-4 border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Clock className="h-5 w-5" />
              </motion.div>
              Check Again
            </button>

            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </Link>
          </motion.div>

          {/* Stay Updated */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="pt-8"
          >
            <p className="text-sm text-gray-500 mb-3">Stay updated on our status</p>
            <div className="flex justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 text-sm group"
              >
                <Mail className="h-4 w-4 text-gray-400 mr-2 group-hover:text-sky-600 transition-colors duration-200" />
                <span className="text-gray-700 font-medium">Email Us</span>
              </Link>
              
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 text-sm group"
              >
                <Twitter className="h-4 w-4 text-gray-400 mr-2 group-hover:text-sky-600 transition-colors duration-200" />
                <span className="text-gray-700 font-medium">Follow Updates</span>
              </a>
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="pt-8 pb-4"
          >
            <div className="bg-gradient-to-r from-sky-100 to-blue-100 border border-sky-200 rounded-xl p-4 max-w-md mx-auto">
              <p className="text-sm text-gray-700 flex items-center justify-center gap-2">
                <AlertCircle size={16} className="text-sky-600" />
                Thank you for your patience! We appreciate your understanding.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
