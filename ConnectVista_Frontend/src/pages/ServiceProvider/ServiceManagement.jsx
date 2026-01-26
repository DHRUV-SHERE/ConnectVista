"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Save, Wrench, Check, ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { serviceAPI } from "../../services/serviceAPI";
import serviceCategoriesData from "../../data/services.json";
import toast from "react-hot-toast";

export default function ServiceManagement() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedSubServices, setSelectedSubServices] = useState([]);
  const [customService, setCustomService] = useState("");
  const [hasCustomService, setHasCustomService] = useState(false);

  const serviceCategories = useMemo(() => {
    return serviceCategoriesData?.serviceCategories || [];
  }, []);

  // Load current service data
  useEffect(() => {
    const loadServiceData = async () => {
      try {
        setLoading(true);
        const response = await serviceAPI.getProviderService();
        
        if (response.success && response.data) {
          const providerService = response.data;
          
          // Set main service
          if (providerService.mainService) {
            setSelectedService(providerService.mainService.name);
          }
          
          // Set sub-services
          if (providerService.subServices && providerService.subServices.length > 0) {
            const subServiceNames = providerService.subServices.map(sub => sub.name);
            setSelectedSubServices(subServiceNames);
          }
          
          // Set custom service
          if (providerService.mainService?.name === 'other' && providerService.customService) {
            setHasCustomService(true);
            setCustomService(providerService.customService.name || '');
          }
        }
      } catch (error) {
        console.error("Failed to load service data:", error);
        toast.error("Failed to load service data");
      } finally {
        setLoading(false);
      }
    };

    loadServiceData();
  }, []);

  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    setSelectedSubServices([]); // Clear sub-services when changing main service
  };

  const handleSubServiceToggle = (subService) => {
    setSelectedSubServices(prev => 
      prev.includes(subService)
        ? prev.filter(sub => sub !== subService)
        : [...prev, subService]
    );
  };

  const handleSave = async () => {
    if (!selectedService && !hasCustomService) {
      toast.error("Please select at least one service category");
      return;
    }

    if (hasCustomService && !customService.trim()) {
      toast.error("Please describe your custom service");
      return;
    }

    setSaving(true);
    
    try {
      const updateData = {
        categoryKey: hasCustomService ? 'other' : selectedService,
        subServiceKeys: hasCustomService ? [] : selectedSubServices,
        customServiceName: hasCustomService ? customService : null
      };

      const response = await serviceAPI.saveProviderService(updateData);
      
      if (response.success) {
        toast.success("Services updated successfully!");
      }
    } catch (error) {
      console.error("Failed to save services:", error);
      toast.error(error.message || "Failed to save services");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--accent-color)] border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Loading services...</h2>
        </div>
      </div>
    );
  }

  const selectedCategory = serviceCategories.find(cat => cat.id === selectedService);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/service-provider/profile"
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
              <p className="text-gray-600 mt-1">Select your primary service category and specializations</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Service Category Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-[var(--accent-color)]" />
                Primary Service Category
              </h2>
              <p className="text-sm text-gray-600 mt-1">Choose one main service category that best describes your business</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceCategories.map(category => (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedService === category.id
                        ? 'border-[var(--accent-color)] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleServiceSelect(category.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedService === category.id ? 'bg-[var(--accent-color)]' : 'bg-gray-100'
                      }`}>
                        <Wrench className={`h-4 w-4 ${
                          selectedService === category.id ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {category.subServices.length} specializations available
                        </p>
                        {selectedService === category.id && (
                          <div className="flex items-center gap-1 mt-2 text-[var(--accent-color)]">
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sub-Services Selection */}
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedCategory.name} - Specializations
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Select multiple specializations within {selectedCategory.name} (optional)
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedCategory.subServices.map(subService => (
                    <motion.label
                      key={subService}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        selectedSubServices.includes(subService)
                          ? 'bg-blue-50 border-2 border-[var(--accent-color)]'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubServices.includes(subService)}
                        onChange={() => handleSubServiceToggle(subService)}
                        className="h-4 w-4 text-[var(--accent-color)] border-gray-300 rounded focus:ring-[var(--accent-color)]"
                      />
                      <span className="text-sm font-medium text-gray-900">{subService}</span>
                    </motion.label>
                  ))}
                </div>
                
                {selectedSubServices.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Selected specializations:</strong> {selectedSubServices.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Custom Service Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Custom Service</h2>
              <p className="text-sm text-gray-600 mt-1">Offer a service not listed above</p>
            </div>
            
            <div className="p-6">
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCustomService}
                  onChange={(e) => setHasCustomService(e.target.checked)}
                  className="mt-1 h-4 w-4 text-[var(--accent-color)] border-gray-300 rounded focus:ring-[var(--accent-color)]"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">Other (Not listed)</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Describe a custom service not available in the categories above
                  </p>
                </div>
              </label>
              
              {hasCustomService && (
                <div className="mt-4">
                  <textarea
                    value={customService}
                    onChange={(e) => setCustomService(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Describe your custom service in detail..."
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    This will be submitted as a pending service request for admin approval
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Important Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6"
          >
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Service Selection Guidelines
            </h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>You can select only ONE primary service category</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Multiple specializations can be selected within your chosen category</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Custom services require admin approval before being visible to customers</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>You can update your services anytime from this page</span>
              </li>
            </ul>
          </motion.div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Link
              to="/service-provider/profile"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <motion.button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-[var(--accent-color)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Services
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}