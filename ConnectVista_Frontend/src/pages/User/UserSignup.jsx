"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Check,
  Home,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import resources from "../../resources";

export default function ServiceSeekerSignup() {
  const navigate = useNavigate();
  const { signupSeeker } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Step 1
    name: "",
    email: "",
    phone: "",

    // Step 2
    password: "",
    confirmPassword: "",
    gender: "",

    // Step 3
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = "Phone number must be 10 digits";
        break;
      case 2:
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm password";
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        if (!formData.gender) newErrors.gender = "Please select gender";
        break;
      case 3:
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.pinCode.trim()) newErrors.pinCode = "PIN code is required";
        else if (!/^\d{6}$/.test(formData.pinCode)) newErrors.pinCode = "PIN code must be 6 digits";
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    
    try {
      // Prepare data for API
      const signupData = {
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'seeker',
        name: formData.name,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        profileImage: 'default-avatar.png'
      };

      const response = await signupSeeker(signupData);
      
      if (response.success) {
        navigate('/user/home');
      }
    } catch (error) {
      console.error('Signup error:', error);
      // Handle API errors
      if (error.message.includes('already exists')) {
        setErrors({ email: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Account Setup" },
    { number: 3, title: "Location" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration & Content */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          backgroundColor: "var(--accent-dark)",
        }}
      >
        {/* Back to Home Button - Top Left */}
        <button
          onClick={handleBackToHome}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          style={{ fontFamily: "var(--font-primary)" }}
        >
          <Home className="h-5 w-5" />
          <span className="text-lg">Back to Home</span>
        </button>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-8 space-y-8">
          {/* Illustration */}
          <motion.div
            className="w-auto h-[50vh] rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--card-bg)",
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src={resources.SignupIllustration.src}
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
            <h2
              className="text-3xl font-bold"
              style={{ color: "var(--overlay-text)" }}
            >
              Find Amazing Services
            </h2>
            <div className="flex items-center justify-center space-x-3">
              <span
                className="text-5xl font-bold"
                style={{
                  fontFamily: "ConnectVistaSecondary",
                  color: "var(--overlay-text)",
                }}
              >
                Connect
                <span style={{ color: "var(--accent-color)" }}>Vista</span>
              </span>
            </div>
            <p
              className="text-lg"
              style={{ color: "var(--overlay-text)", opacity: 0.8 }}
            >
              Join as a service seeker and discover trusted professionals in
              your community
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Progress Steps */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center">
              <motion.div
                className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: "var(--btn-bg)",
                  boxShadow: "var(--btn-hover)",
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <User className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Join as Service Seeker
              </h2>

              {/* Step Indicator */}
              <div className="mt-6 flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                        currentStep >= step.number
                          ? "border-[var(--accent-color)] text-white"
                          : "border-gray-300 text-gray-500"
                      }`}
                      style={
                        currentStep >= step.number
                          ? {
                              backgroundColor: "var(--accent-color)",
                              borderColor: "var(--accent-color)",
                            }
                          : {}
                      }
                    >
                      {currentStep > step.number ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 h-1 ${
                          currentStep > step.number
                            ? "bg-[var(--accent-color)]"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <p className="mt-4 text-sm text-gray-600">
                Step {currentStep} of 3: {steps[currentStep - 1]?.title}
              </p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.form
              key={currentStep}
              className="mt-8 space-y-6"
              onSubmit={handleSubmit}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full px-12 py-4 border placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:border-[var(--accent-color)] transition-all duration-200 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        style={errors.name ? {} : { focusRingColor: 'var(--accent-color)' }}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full px-12 py-4 border placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:border-[var(--accent-color)] transition-all duration-200 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        style={errors.email ? {} : { focusRingColor: 'var(--accent-color)' }}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full px-12 py-4 border placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:border-[var(--accent-color)] transition-all duration-200 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        style={errors.phone ? {} : { focusRingColor: 'var(--accent-color)' }}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Account Setup */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full px-12 py-4 pr-12 border placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:border-[var(--accent-color)] transition-all duration-200 ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        style={errors.password ? {} : { focusRingColor: 'var(--accent-color)' }}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full px-12 py-4 pr-12 border placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:border-[var(--accent-color)] transition-all duration-200 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        style={errors.confirmPassword ? {} : { focusRingColor: 'var(--accent-color)' }}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-4 py-4 border placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:border-[var(--accent-color)] transition-all duration-200 ${
                        errors.gender ? 'border-red-500' : 'border-gray-300'
                      }`}
                      style={errors.gender ? {} : { focusRingColor: 'var(--accent-color)' }}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Location Information */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="relative">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full px-12 py-4 border placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:border-[var(--accent-color)] transition-all duration-200 resize-none ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        style={errors.address ? {} : { focusRingColor: 'var(--accent-color)' }}
                        placeholder="Enter your complete address"
                      />
                    </div>
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        City *
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full px-4 py-4 border placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:border-[var(--accent-color)] transition-all duration-200 ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        style={errors.city ? {} : { focusRingColor: 'var(--accent-color)' }}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                      )}
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        State *
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full px-4 py-4 border placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:border-[var(--accent-color)] transition-all duration-200 ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                        style={errors.state ? {} : { focusRingColor: 'var(--accent-color)' }}
                        placeholder="State"
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="pinCode"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      PIN Code *
                    </label>
                    <input
                      id="pinCode"
                      name="pinCode"
                      type="text"
                      required
                      value={formData.pinCode}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-4 py-4 border placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:border-[var(--accent-color)] transition-all duration-200 ${
                        errors.pinCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      style={errors.pinCode ? {} : { focusRingColor: 'var(--accent-color)' }}
                      placeholder="Enter PIN code"
                    />
                    {errors.pinCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.pinCode}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex space-x-4">
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 inline-flex justify-center items-center py-4 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Previous
                  </motion.button>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 inline-flex justify-center items-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "var(--btn-bg)",
                    boxShadow: "var(--btn-hover)",
                  }}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : currentStep === 3 ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Create Account
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </motion.button>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-medium transition-colors duration-200"
                    style={{ color: "var(--accent-color)" }}
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}