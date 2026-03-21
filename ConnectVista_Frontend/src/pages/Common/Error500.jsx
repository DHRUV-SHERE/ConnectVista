import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ServerCrash, Home, RefreshCw, Mail, AlertTriangle } from "lucide-react";

export default function Error500() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Icon Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mx-auto w-48 h-48 bg-red-100 rounded-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ServerCrash className="text-red-600" size={96} />
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
            <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-mono font-bold">
              500 | Internal Server Error
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Oops! Something Went Wrong
          </h1>

          {/* Message */}
          <div className="space-y-3">
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              We're experiencing technical difficulties. Our team has been notified and is working on a fix.
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-sm font-medium"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              This is not your fault - we'll fix it soon!
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Homepage
            </Link>

            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-8 py-4 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Try Again
            </button>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="pt-8"
          >
            <p className="text-sm text-gray-500 mb-3">Problem persists?</p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 text-sm group"
            >
              <Mail className="h-4 w-4 text-gray-400 mr-2 group-hover:text-sky-600 transition-colors duration-200" />
              <span className="text-gray-700 font-medium">Contact Support</span>
            </Link>
          </motion.div>

          {/* Error Details (for developers) */}
          <motion.details
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="pt-8 text-left max-w-md mx-auto"
          >
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Technical Details (for developers)
            </summary>
            <div className="mt-3 p-4 bg-gray-100 rounded-lg text-xs text-gray-700 font-mono">
              <p>Status: 500 Internal Server Error</p>
              <p>Time: {new Date().toLocaleString()}</p>
              <p>If reporting, please include this timestamp</p>
            </div>
          </motion.details>
        </motion.div>
      </div>
    </div>
  );
}
