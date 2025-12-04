"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Shield,
  CheckCircle,
  ArrowLeft,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import resources from "../../resources";

export default function ProviderVerification() {
  const [verificationData, setVerificationData] = useState({
    businessRegistration: "",
    governmentId: "",
    addressProof: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setVerificationData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate verification submission
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsSubmitting(false);

    // Redirect to success page or dashboard
    // window.location.href = "/verification-pending";
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration & Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-20"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
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
            className="w-auto h-[50vh] bg-white rounded-3xl shadow-2xl flex items-center justify-center border-8 border-white overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src={resources.SignupIllustration.src}
              alt="Verification Illustration"
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
            <h2 className="text-3xl font-bold text-gray-800">
              Account Verification
            </h2>
            <div className="flex items-center justify-center space-x-3">
              <span
                className="text-5xl font-bold"
                style={{ fontFamily: "ConnectVistaSecondary" }}
              >
                Connect
                <span style={{ color: "var(--accent-color)" }}>Vista</span>
              </span>
            </div>
            <p className="text-lg text-gray-600">
              Complete your verification to start offering services and build
              trust with customers
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Verification Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center">
              <motion.div
                className="mx-auto w-16 h-16 bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-dark)] rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <UserCheck className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Verify Your Account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Upload required documents to complete your verification
              </p>
            </div>
          </motion.div>

          {/* Verification Form */}
          <motion.form
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="mt-8 space-y-8"
          >
            {/* Grid Layout for Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Registration */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-[var(--accent-color)] transition-all duration-200"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-[var(--accent-color)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Business Registration
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Business certificate, trade license, or GST certificate
                  </p>
                  <input
                    type="file"
                    id="businessRegistration"
                    name="businessRegistration"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="businessRegistration"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-dark)] hover:from-[var(--accent-dark)] hover:to-[var(--accent-color)] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </label>
                  {verificationData.businessRegistration && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {verificationData.businessRegistration.name}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Government ID Proof */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-[var(--accent-color)] transition-all duration-200"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-[var(--accent-color)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Government ID
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Aadhaar Card, PAN Card, or government-issued ID
                  </p>
                  <input
                    type="file"
                    id="governmentId"
                    name="governmentId"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="governmentId"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-dark)] hover:from-[var(--accent-dark)] hover:to-[var(--accent-color)] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </label>
                  {verificationData.governmentId && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {verificationData.governmentId.name}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Address Proof */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-[var(--accent-color)] transition-all duration-200 md:col-span-2"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-[var(--accent-color)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Address Proof
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Utility bill, rental agreement, or property tax receipt
                  </p>
                  <input
                    type="file"
                    id="addressProof"
                    name="addressProof"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="addressProof"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-dark)] hover:from-[var(--accent-dark)] hover:to-[var(--accent-color)] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </label>
                  {verificationData.addressProof && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {verificationData.addressProof.name}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Important Notes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-blue-50 rounded-2xl p-6 border border-blue-200"
            >
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Important Verification Notes
              </h4>
              <ul className="text-blue-800 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Documents should be clear, readable, and valid
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  File size should not exceed 5MB per document
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Accepted formats: PDF, JPG, JPEG, PNG
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Verification typically takes 24-48 hours
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  You'll receive email notifications about your status
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex justify-center items-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-dark)] hover:from-[var(--accent-dark)] hover:to-[var(--accent-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Submit for Verification
                  </>
                )}
              </motion.button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Need help with verification?{" "}
                <a
                  href="/contact-support"
                  className="font-medium text-[var(--accent-color)] hover:text-[var(--accent-dark)] transition-colors duration-200"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
