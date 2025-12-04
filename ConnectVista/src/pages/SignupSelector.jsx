"use client"
import { motion } from "framer-motion"
import { User, Building, ArrowRight, Home } from "lucide-react"
import { Link } from "react-router-dom"
import resources from "../resources"

export default function SignupSelection() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration & Content */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ 
          backgroundColor: 'var(--accent-dark)' // Using Deep Coral for the background
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: 'var(--accent-color)', // Using Coral Flame for animated elements
                opacity: 0.15
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-8 space-y-8">
          {/* Illustration */}
          <motion.div
            className="w-auto h-[50vh] rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden"
            style={{ 
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-bg)'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src={resources.LoginIllustration.src}
              alt="Signup Illustration"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Welcome Text */}
          <motion.div
            className="text-center space-y-6 w-full max-w-md"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold" style={{ color: 'var(--overlay-text)' }}>
              Join Connect<span style={{color:"var(--accent-color)"}}>Vista</span>
            </h2>
            <p className="text-lg" style={{ color: 'var(--overlay-text)', opacity: 0.8 }}>
              Choose how you want to experience our platform. Find amazing services or offer your expertise to the community.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Selection Options */}
      <div className="flex-1 flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center">
              <motion.div
                className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ 
                  background: 'var(--btn-bg)',
                  boxShadow: 'var(--btn-hover)'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <User className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Join Our Community
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Choose your role to get started
              </p>
            </div>
          </motion.div>

          <div className="space-y-6">
            {/* Service Seeker Option */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/user/signup">
                <motion.div
                  className="group relative p-6 border-2 border-gray-200 rounded-2xl hover:border-[var(--accent-color)] transition-all duration-300 cursor-pointer bg-white hover:shadow-lg"
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300"
                        style={{ 
                          backgroundColor: 'var(--accent-fade)',
                        }}
                      >
                        <User className="h-6 w-6" style={{ color: 'var(--accent-color)' }} />
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--accent-color)] transition-colors duration-300">
                        Service Seeker
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Looking for services? Find trusted professionals, compare prices, and book appointments easily.
                      </p>
                      <div className="mt-4 flex items-center font-medium" style={{ color: 'var(--accent-color)' }}>
                        <span>Get started as seeker</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            {/* Service Provider Option */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/service-provider/signup">
                <motion.div
                  className="group relative p-6 border-2 border-gray-200 rounded-2xl hover:border-[var(--accent-color)] transition-all duration-300 cursor-pointer bg-white hover:shadow-lg"
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300"
                        style={{ 
                          backgroundColor: 'var(--accent-fade)',
                        }}
                      >
                        <Building className="h-6 w-6" style={{ color: 'var(--accent-color)' }} />
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--accent-color)] transition-colors duration-300">
                        Service Provider
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Offering services? Showcase your skills, reach more customers, and grow your business.
                      </p>
                      <div className="mt-4 flex items-center font-medium" style={{ color: 'var(--accent-color)' }}>
                        <span>Join as provider</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* Back to Login */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium transition-colors duration-200"
                style={{ color: 'var(--accent-color)' }}
              >
                Sign in
              </Link>
            </p>
            <Link
              to="/"
              className="inline-flex items-center mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to home
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}