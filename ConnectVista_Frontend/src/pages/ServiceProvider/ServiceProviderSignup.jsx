"use client";
import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Building,
  Briefcase,
  Award,
  Home,
  FileText,
  DollarSign,
  AlertCircle,
  Wrench
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import resources from "../../resources";
import toast from "react-hot-toast";
import serviceCategoriesData from "../../data/services.json";
import MapLocationPicker from "../../components/Common/MapLocationPicker";

export default function ServiceProviderSignup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signupProvider } = useAuth();
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Step 1: Personal & Business Info
    name: "",
    businessName: "",
    email: "",
    phone: "",

    // Step 2: Professional Details
    password: "",
    description: "",
    experienceYears: "",
    startingPrice: "",
    emergencyCharge: "",
    extraChargeNote: "",

    // Step 3: Service Selection
    selectedServices: [],
    selectedSubServices: {},
    customService: "",
    hasCustomService: false,

    // Step 4: Location
    street: "",
    city: "",
    state: "",
    pinCode: "",
    latitude: null,
    longitude: null,
    languages: [],
  });

  const handleAddressSelect = (addressData) => {
    setFormData(prev => ({
      ...prev,
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      pinCode: addressData.pinCode,
      latitude: addressData.latitude,
      longitude: addressData.longitude
    }));
    
    // Clear location errors
    setErrors(prev => ({
      ...prev,
      street: "",
      city: "",
      state: "",
      pinCode: ""
    }));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [customLanguage, setCustomLanguage] = useState("");

  // Get service categories from JSON data
  const serviceCategories = useMemo(() => {
    return serviceCategoriesData?.serviceCategories || [];
  }, []);

  const languages = ["English", "Hindi", "Spanish", "French", "German", "Chinese", "Arabic"];

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = "Phone number must be 10 digits";
        break;
      case 2:
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (!formData.experienceYears) newErrors.experienceYears = "Experience is required";
        else if (formData.experienceYears < 0) newErrors.experienceYears = "Experience cannot be negative";
        if (!formData.startingPrice) newErrors.startingPrice = "Starting price is required";
        else if (formData.startingPrice < 0) newErrors.startingPrice = "Price cannot be negative";
        break;
      case 3:
        if (formData.selectedServices.length === 0 && !formData.hasCustomService) {
          newErrors.services = "Please select at least one service category";
        }
        if (formData.hasCustomService && !formData.customService.trim()) {
          newErrors.customService = "Please describe your custom service";
        }
        break;
      case 4:
        if (!formData.street.trim()) newErrors.street = "Street address is required";
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
    
    if (currentStep < 4) {
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
        role: 'provider',
        name: formData.name,
        businessName: formData.businessName,
        description: formData.description,
        experienceYears: parseInt(formData.experienceYears) || 0,
        startingPrice: parseFloat(formData.startingPrice),
        emergencyCharge: parseFloat(formData.emergencyCharge) || 0,
        extraChargeNote: formData.extraChargeNote,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        languages: formData.languages,
        selectedServices: formData.selectedServices,
        selectedSubServices: formData.selectedSubServices,
        customService: formData.hasCustomService ? formData.customService : null
      };

      const response = await signupProvider(signupData);
      
      if (response.success) {
        toast.success('Registration successful! Please verify your account to access dashboard.');
        navigate('/service-provider/verify');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Registration failed');
      
      // Handle API errors
      if (error.message.includes('already exists')) {
        setErrors({ email: error.message });
      } else if (error.message.includes('email')) {
        setErrors({ email: error.message });
      } else if (error.message.includes('phone')) {
        setErrors({ phone: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || '' : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => {
      const isSelected = prev.selectedServices.includes(serviceId);
      const newSelectedServices = isSelected
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId];
      
      // Remove sub-services if service is deselected
      const newSelectedSubServices = { ...prev.selectedSubServices };
      if (isSelected) {
        delete newSelectedSubServices[serviceId];
      }
      
      return {
        ...prev,
        selectedServices: newSelectedServices,
        selectedSubServices: newSelectedSubServices
      };
    });
    if (errors.services) setErrors(prev => ({ ...prev, services: '' }));
  };

  const handleSubServiceToggle = (serviceId, subService) => {
    setFormData(prev => {
      const currentSubServices = prev.selectedSubServices[serviceId] || [];
      const isSelected = currentSubServices.includes(subService);
      
      return {
        ...prev,
        selectedSubServices: {
          ...prev.selectedSubServices,
          [serviceId]: isSelected
            ? currentSubServices.filter(sub => sub !== subService)
            : [...currentSubServices, subService]
        }
      };
    });
  };

  const handleCustomServiceToggle = () => {
    setFormData(prev => ({
      ...prev,
      hasCustomService: !prev.hasCustomService,
      customService: !prev.hasCustomService ? prev.customService : ''
    }));
    if (errors.services) setErrors(prev => ({ ...prev, services: '' }));
    if (errors.customService) setErrors(prev => ({ ...prev, customService: '' }));
  };
  const handleLanguageToggle = (language) => {
    setFormData(prev => {
      if (prev.languages.includes(language)) {
        return {
          ...prev,
          languages: prev.languages.filter(lang => lang !== language)
        };
      } else {
        return {
          ...prev,
          languages: [...prev.languages, language]
        };
      }
    });
  };

  const addCustomLanguage = () => {
    if (customLanguage.trim() && !formData.languages.includes(customLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, customLanguage.trim()]
      }));
      setCustomLanguage("");
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
    navigate("/")
  }

  const steps = [
    { number: 1, title: "Business Info" },
    { number: 2, title: "Professional Details" },
    { number: 3, title: "Service Selection" },
    { number: 4, title: "Location" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration & Content */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ 
          backgroundColor: 'var(--accent-dark)'
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
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-bg)'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src={resources.SignupIllustration.src}
              alt="Provider Signup Illustration"
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
              Grow Your Business
            </h2>
            <div className="flex items-center justify-center space-x-3">
              <span
                className="text-5xl font-bold"
                style={{ fontFamily: "ConnectVistaSecondary", color: 'var(--overlay-text)' }}
              >
                Connect
                <span style={{ color: "var(--accent-color)" }}>Vista</span>
              </span>
            </div>
            <p className="text-lg" style={{ color: 'var(--overlay-text)', opacity: 0.8 }}>
              Join as a service provider and reach thousands of customers in your area
            </p>
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-white">
                <Check className="h-5 w-5" />
                <span>Verification required before accessing dashboard</span>
              </div>
              <div className="flex items-center gap-2 text-white mt-2">
                <Check className="h-5 w-5" />
                <span>Admin approval typically takes 24-48 hours</span>
              </div>
            </div>
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
                  background: 'var(--btn-bg)',
                  boxShadow: 'var(--btn-hover)'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Building className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Join as Service Provider
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
                      style={currentStep >= step.number ? { 
                        backgroundColor: 'var(--accent-color)',
                        borderColor: 'var(--accent-color)'
                      } : {}}
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
                Step {currentStep} of 4: {steps[currentStep - 1]?.title}
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
              {/* Step 1: Business Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="relative">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                        placeholder="Your full name"
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div className="relative">
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="businessName"
                        name="businessName"
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full px-12 py-4 border placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:border-[var(--accent-color)] transition-all duration-200 ${
                          errors.businessName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Your business name"
                      />
                    </div>
                    {errors.businessName && <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>}
                  </div>

                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                        placeholder="business@example.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="relative">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
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
                        placeholder="+91 9876543210"
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Professional Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                        placeholder="Create a secure password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div className="relative">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="appearance-none relative block w-full px-12 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] transition-all duration-200 resize-none"
                        placeholder="Describe your business/services (max 1000 characters)"
                        maxLength={1000}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 text-right">
                      {formData.description.length}/1000 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-2">
                        Experience (Years) *
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="experienceYears"
                          name="experienceYears"
                          type="number"
                          min="0"
                          max="50"
                          required
                          value={formData.experienceYears}
                          onChange={handleChange}
                          className={`appearance-none relative block w-full px-12 py-4 border placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:border-[var(--accent-color)] transition-all duration-200 ${
                            errors.experienceYears ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Years"
                        />
                      </div>
                      {errors.experienceYears && <p className="mt-1 text-sm text-red-600">{errors.experienceYears}</p>}
                    </div>

                    <div className="relative">
                      <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700 mb-2">
                        Starting Price (₹) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="startingPrice"
                          name="startingPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          value={formData.startingPrice}
                          onChange={handleChange}
                          className={`appearance-none relative block w-full px-12 py-4 border placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:border-[var(--accent-color)] transition-all duration-200 ${
                            errors.startingPrice ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.startingPrice && <p className="mt-1 text-sm text-red-600">{errors.startingPrice}</p>}
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="emergencyCharge" className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Charge (₹)
                    </label>
                    <div className="relative">
                      <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="emergencyCharge"
                        name="emergencyCharge"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.emergencyCharge}
                        onChange={handleChange}
                        className="appearance-none relative block w-full px-12 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] transition-all duration-200"
                        placeholder="Additional charge for emergency services"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="extraChargeNote" className="block text-sm font-medium text-gray-700 mb-2">
                      Extra Charge Notes
                    </label>
                    <textarea
                      id="extraChargeNote"
                      name="extraChargeNote"
                      rows={2}
                      value={formData.extraChargeNote}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] transition-all duration-200 resize-none"
                      placeholder="Any additional charges or notes about pricing"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Service Selection */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Select Your Service Categories *
                    </label>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-300 rounded-xl p-4">
                      {serviceCategories.map(category => {
                        const isSelected = formData.selectedServices.includes(category.id);
                        return (
                          <div key={category.id} className="space-y-2">
                            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleServiceToggle(category.id)}
                                className="mt-1 h-4 w-4 text-[var(--accent-color)] border-gray-300 rounded focus:ring-[var(--accent-color)]"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Wrench className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium text-gray-900">{category.name}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {category.subServices.length} sub-services available
                                </p>
                              </div>
                            </label>
                            
                            {/* Sub-services */}
                            {isSelected && (
                              <div className="ml-7 pl-4 border-l-2 border-gray-200 space-y-1">
                                <p className="text-xs font-medium text-gray-600 mb-2">
                                  Optional sub-services:
                                </p>
                                <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                                  {category.subServices.slice(0, 8).map(subService => (
                                    <label key={subService} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                      <input
                                        type="checkbox"
                                        checked={(formData.selectedSubServices[category.id] || []).includes(subService)}
                                        onChange={() => handleSubServiceToggle(category.id, subService)}
                                        className="h-3 w-3 text-[var(--accent-color)] border-gray-300 rounded focus:ring-[var(--accent-color)]"
                                      />
                                      <span className="text-gray-700">{subService}</span>
                                    </label>
                                  ))}
                                  {category.subServices.length > 8 && (
                                    <p className="text-xs text-gray-500 italic">
                                      +{category.subServices.length - 8} more available
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {errors.services && <p className="mt-1 text-sm text-red-600">{errors.services}</p>}
                  </div>

                  {/* Custom Service Option */}
                  <div className="mt-6">
                    <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasCustomService}
                        onChange={handleCustomServiceToggle}
                        className="mt-1 h-4 w-4 text-[var(--accent-color)] border-gray-300 rounded focus:ring-[var(--accent-color)]"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">Other (Not listed)</span>
                        <p className="text-sm text-gray-600 mt-1">
                          Describe a custom service not available in the list above
                        </p>
                      </div>
                    </label>
                    
                    {formData.hasCustomService && (
                      <div className="mt-3">
                        <textarea
                          value={formData.customService}
                          onChange={(e) => setFormData(prev => ({ ...prev, customService: e.target.value }))}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-[var(--accent-color)] transition-all duration-200 resize-none ${
                            errors.customService ? 'border-red-500' : 'border-gray-300'
                          }`}
                          rows={3}
                          placeholder="Describe your custom service in detail..."
                        />
                        {errors.customService && <p className="mt-1 text-sm text-red-600">{errors.customService}</p>}
                        <p className="mt-1 text-xs text-gray-500">
                          This will be submitted as a pending service request for admin approval
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Location Information */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Location *
                    </label>
                    <MapLocationPicker 
                      onLocationSelect={handleAddressSelect}
                    />
                    {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street}</p>}
                  </div>

                  {formData.city && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="col-span-2">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Detected Street/Area</p>
                        <p className="text-sm font-semibold text-gray-700">{formData.street || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">City</p>
                        <p className="text-sm font-semibold text-gray-700">{formData.city}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">State</p>
                        <p className="text-sm font-semibold text-gray-700">{formData.state}</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">PIN Code</p>
                        <p className="text-sm font-semibold text-gray-700">{formData.pinCode || 'N/A'}</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Coordinates</p>
                        <p className="text-[10px] font-mono text-blue-600">
                          {formData.latitude?.toFixed(4)}, {formData.longitude?.toFixed(4)}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages Spoken
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {languages.map(language => (
                        <button
                          key={language}
                          type="button"
                          onClick={() => handleLanguageToggle(language)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            formData.languages.includes(language)
                              ? 'bg-[var(--accent-color)] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomLanguage())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                        placeholder="Add custom language"
                      />
                      <button
                        type="button"
                        onClick={addCustomLanguage}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {formData.languages.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Selected: {formData.languages.join(', ')}</p>
                      </div>
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
                    background: 'var(--btn-bg)',
                    boxShadow: 'var(--btn-hover)'
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
                  ) : currentStep === 4 ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Complete Registration
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
                  <Link
                    to="/login"
                    className="font-medium transition-colors duration-200"
                    style={{ color: 'var(--accent-color)' }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}