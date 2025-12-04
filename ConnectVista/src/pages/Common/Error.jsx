"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import resources from "../../resources";

export default function ErrorPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Illustration - Reduced size */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mb-8"
        >
          <div className="w-xl h-auto mx-auto bg-white rounded-3xl shadow-2xl flex items-center justify-center border-8 border-white overflow-hidden">
            <img
              src={resources.ErrorIllustration.src}
              alt="Error Occurred"
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

        {/* Content - Reduced spacing */}
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
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-mono font-bold">
              404 | Page Not Found
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Oops! Page Not Found
          </h1>

          {/* Message */}
          <div className="space-y-2">
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              The page you're looking for doesn't exist.
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-xs font-medium"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Let's get you back on track
            </motion.div>
          </div>

          {/* Action Buttons - Primary focus */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-6"
          >
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-dark)] hover:from-[var(--accent-dark)] hover:to-[var(--accent-color)] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </Link>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              {isRefreshing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Try Again
                </>
              )}
            </button>
          </motion.div>

          {/* Quick Links - Compact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center gap-4 pt-6"
          >
            <Link
              to="/contact"
              className="flex items-center px-4 py-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 group text-sm"
            >
              <Mail className="h-4 w-4 text-gray-400 mr-2 group-hover:text-[var(--accent-color)] transition-colors duration-200" />
              <span className="text-gray-700 font-medium">Support</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}