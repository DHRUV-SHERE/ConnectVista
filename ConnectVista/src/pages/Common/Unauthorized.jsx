"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import resources from "../../resources";

export default function UnauthorizedPage() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to login page
          window.location.href = "/login";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-12"
        >
          <div className="w-96 h-auto mx-auto bg-white rounded-3xl shadow-2xl flex items-center justify-center border-8 border-white overflow-hidden">
            <img
              src={resources.UnauthorizedIllustration.src }
              alt="Unauthorized Access"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Icon
          <div className="flex justify-center">
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Shield className="h-10 w-10 text-white" />
            </motion.div>
          </div> */}

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900">
            Access Denied
          </h1>

          {/* Message */}
          <div className="space-y-4">
            <p className="text-xl text-gray-600 max-w-md mx-auto">
              You need to be logged in to access this page.
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 border border-red-200 text-red-700 text-sm font-medium"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Redirecting to login in {countdown} seconds...
            </motion.div>
          </div>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 10, ease: "linear" }}
            className="h-2 bg-red-200 rounded-full overflow-hidden mx-auto max-w-sm"
          >
            <div className="h-full bg-red-500 rounded-full" />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-dark)] hover:from-[var(--accent-dark)] hover:to-[var(--accent-color)] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign In Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>

            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              Go Back Home
            </Link>
          </motion.div>

          {/* Additional Help */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="pt-8 border-t border-gray-200 mt-8"
          >
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/signup-select"
                className="font-medium text-[var(--accent-color)] hover:text-[var(--accent-dark)] transition-colors duration-200"
              >
                Create one here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}