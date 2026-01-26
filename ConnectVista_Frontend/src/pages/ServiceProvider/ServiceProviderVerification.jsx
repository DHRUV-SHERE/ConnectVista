"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Shield,
  CheckCircle,
  ArrowLeft,
  UserCheck,
  AlertCircle,
  Clock,
  XCircle,
  Eye,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import resources from "../../resources";
import toast from "react-hot-toast";

const documentTypes = [
  {
    id: "business-registration",
    name: "Business Registration",
    description: "Business certificate, trade license, or GST certificate",
    required: true,
    fieldName: "businessRegistration",
    accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  },
  {
    id: "government-id",
    name: "Government ID",
    description: "Aadhaar Card, PAN Card, or government-issued ID",
    required: true,
    fieldName: "governmentId",
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    id: "address-proof",
    name: "Address Proof",
    description: "Utility bill, rental agreement, or property tax receipt",
    required: true,
    fieldName: "addressProof",
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    id: "tax-certificate",
    name: "Tax Certificate",
    description: "Latest tax return or tax clearance certificate",
    required: false,
    fieldName: "taxCertificate",
    accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  },
  {
    id: "insurance",
    name: "Insurance Certificate",
    description: "Professional liability or business insurance",
    required: false,
    fieldName: "insurance",
    accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  },
];

const getStatusIcon = (status) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "rejected":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "pending":
      return <Clock className="h-5 w-5 text-amber-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function ProviderVerification() {
  const { refreshProfile, profile, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const [verificationData, setVerificationData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasCheckedRedirect = useRef(false);
  const hasLoadedStatus = useRef(false);

  // Fetch verification status
  const fetchVerificationStatus = async () => {
    try {
      console.log("Fetching verification status...");
      const response = await api.get("/api/verification/status");
      console.log("API Response:", response.data);
      
      if (response.data.success) {
        const data = response.data.data;
        setVerificationStatus(data);
        hasLoadedStatus.current = true;
        return data;
      } else {
        throw new Error(response.data.message || "Failed to fetch verification status");
      }
    } catch (error) {
      console.error("Failed to fetch verification status:", error);
      setError(error.message || "Failed to load verification status");
      
      // Create a fallback verification status
      const fallbackStatus = {
        provider: {
          isVerified: false,
          verificationStatus: "not-submitted"
        },
        verification: null
      };
      setVerificationStatus(fallbackStatus);
      hasLoadedStatus.current = true;
      return fallbackStatus;
    }
  };

  // Initial load
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (hasLoadedStatus.current) return;
      
      try {
        await fetchVerificationStatus();
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Check if user should be redirected (only once after loading)
  useEffect(() => {
    const checkRedirect = async () => {
      // Skip if still loading or already checked
      if (isLoading || hasCheckedRedirect.current || !hasLoadedStatus.current) return;
      
      console.log("Checking if should redirect...");
      console.log("Verification status:", verificationStatus);
      console.log("Profile:", profile);
      
      let shouldRedirect = false;
      
      // Check verification status from API
      if (verificationStatus?.provider?.verificationStatus === "approved") {
        console.log("✅ Verified via API, redirecting to dashboard");
        shouldRedirect = true;
      }
      
      // Check profile from auth context
      if (profile?.isVerified) {
        console.log("✅ Verified via profile, redirecting to dashboard");
        shouldRedirect = true;
      }
      
      if (shouldRedirect) {
        hasCheckedRedirect.current = true;
        
        // Show success message briefly, then redirect
        toast.success("Your account is already verified! Redirecting to dashboard...");
        
        setTimeout(() => {
          console.log("Redirecting to dashboard...");
          navigate("/service-provider/dashboard", { replace: true });
        }, 1500);
      } else {
        console.log("❌ Not verified, showing verification form");
        console.log("Status:", verificationStatus?.provider?.verificationStatus);
        hasCheckedRedirect.current = true;
      }
    };

    checkRedirect();
  }, [isLoading, verificationStatus, profile, navigate]);

  const handleFileChange = (fieldName, file) => {
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should not exceed 5MB");
        return;
      }

      // Check file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Invalid file type. Please upload JPG, PNG, PDF, DOC, or DOCX files."
        );
        return;
      }

      setVerificationData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if at least one required document is selected
    const requiredDocs = documentTypes.filter((doc) => doc.required);
    const hasRequiredDocs = requiredDocs.some(
      (doc) => verificationData[doc.fieldName]
    );

    if (!hasRequiredDocs) {
      toast.error(
        "Please upload at least one required document (Business Registration, Government ID, or Address Proof)"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append files to formData
      Object.entries(verificationData).forEach(([fieldName, file]) => {
        if (file) {
          formData.append(fieldName, file);
        }
      });

      const response = await api.post("/api/verification/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress({ overall: progress });
        },
      });

      if (response.data.success) {
        toast.success(
          "Documents uploaded successfully! Verification is under review."
        );
        setVerificationData({});
        
        // Refresh data
        await refreshProfile();
        await refreshAuth();
        
        // Fetch updated verification status
        hasLoadedStatus.current = false;
        await fetchVerificationStatus();
        
        // Redirect to dashboard (even though verification is pending)
        setTimeout(() => {
          navigate("/service-provider/dashboard", { replace: true });
        }, 2000);
      }
    } catch (error) {
      toast.error(
        error.message || "Failed to upload documents. Please try again."
      );
      console.error("Upload error:", error);
    } finally {
      setIsSubmitting(false);
      setUploadProgress({});
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    try {
      const response = await api.delete(`/api/verification/document/${documentId}`);
      if (response.data.success) {
        toast.success("Document deleted successfully");
        // Reset loaded status to fetch fresh data
        hasLoadedStatus.current = false;
        await fetchVerificationStatus();
      }
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--accent-color)] border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">
            Loading verification status...
          </h2>
          <p className="text-gray-600 mt-2">
            Please wait while we check your verification status
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !verificationStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center max-w-md mx-4">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Unable to Load Verification Status
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={async () => {
                setIsLoading(true);
                setError(null);
                await fetchVerificationStatus();
                setIsLoading(false);
              }}
              className="px-6 py-3 bg-[var(--accent-color)] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/service-provider/dashboard")}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user is already approved (fallback check)
  if (verificationStatus?.provider?.verificationStatus === "approved" && !hasCheckedRedirect.current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center max-w-md mx-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-14 w-14 text-green-500" />
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-800 mb-3"
          >
            Verification Approved! 🎉
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mb-6 text-lg"
          >
            Your account is fully verified and ready to use.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <p className="text-green-600 font-medium">
              ✓ Redirecting to dashboard...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "linear" }}
              />
            </div>
            <button
              onClick={() => navigate("/service-provider/dashboard", { replace: true })}
              className="mt-4 inline-flex items-center px-6 py-3 bg-[var(--accent-color)] text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
              Go to Dashboard Now
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Click the button above if you're not redirected automatically
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const renderDocumentCard = (docType) => {
    const document = verificationStatus?.verification?.documents?.find(
      (doc) => doc.documentType === docType.id
    );

    const selectedFile = verificationData[docType.fieldName];
    const fileSize = selectedFile
      ? (selectedFile.size / (1024 * 1024)).toFixed(2)
      : 0;

    return (
      <motion.div
        key={docType.id}
        whileHover={{ scale: 1.02 }}
        className={`bg-gray-50 rounded-2xl p-6 border-2 transition-all duration-200 ${
          document
            ? "border-solid border-gray-300"
            : "border-dashed border-gray-300 hover:border-[var(--accent-color)]"
        } ${
          docType.required && !document && !selectedFile
            ? "border-red-300 hover:border-red-400"
            : ""
        }`}
      >
        <div className="text-center">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
              document
                ? getStatusColor(document.status).split(" ")[0]
                : "bg-blue-100"
            }`}
          >
            {document ? (
              getStatusIcon(document.status)
            ) : (
              <FileText
                className={`h-6 w-6 ${
                  docType.required && !selectedFile
                    ? "text-red-500"
                    : "text-[var(--accent-color)]"
                }`}
              />
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {docType.name}
            </h3>
            {docType.required && (
              <span className="text-xs text-red-500">* Required</span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4">{docType.description}</p>

          {document ? (
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(document.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Uploaded on{" "}
                        {new Date(document.uploadedAt).toLocaleDateString()}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          getStatusColor(document.status).split(" ")[1]
                        }`}
                      >
                        Status:{" "}
                        {document.status.charAt(0).toUpperCase() +
                          document.status.slice(1)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      href={document.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Document"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                    {document.status === "pending" && (
                      <button
                        onClick={() => handleDeleteDocument(document._id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {document.rejectionReason && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-xs text-red-700">
                      <span className="font-semibold">Rejection Reason:</span>{" "}
                      {document.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {document.status === "pending" && (
                <p className="text-xs text-amber-600">
                  ⏳ Document is under review. You can upload a new file if
                  needed.
                </p>
              )}
            </div>
          ) : (
            <>
              <input
                type="file"
                id={docType.fieldName}
                name={docType.fieldName}
                accept={docType.accept}
                onChange={(e) =>
                  handleFileChange(docType.fieldName, e.target.files[0])
                }
                className="hidden"
              />
              <label
                htmlFor={docType.fieldName}
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-dark)] hover:from-[var(--accent-dark)] hover:to-[var(--accent-color)] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </label>

              {selectedFile && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {fileSize} MB • Ready to upload
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setVerificationData((prev) => {
                          const newData = { ...prev };
                          delete newData[docType.fieldName];
                          return newData;
                        });
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Accepted:{" "}
                {docType.accept.replace(/\./g, "").split(",").join(", ")} • Max
                5MB
              </p>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration & Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
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

            {/* Status Indicator */}
            {verificationStatus && (
              <div
                className={`p-4 rounded-xl ${getStatusColor(
                  verificationStatus.provider?.verificationStatus || "pending"
                )}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">
                    Current Status:{" "}
                    {verificationStatus.provider?.verificationStatus?.toUpperCase() ||
                      "PENDING"}
                  </span>
                </div>
                <p className="text-sm mt-2">
                  📋{" "}
                  {verificationStatus.provider?.verificationStatus === "pending"
                    ? "Your verification is pending review"
                    : verificationStatus.provider?.verificationStatus ===
                      "rejected"
                    ? "Please upload documents to re-apply"
                    : "Please upload documents to get verified"}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Verification Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="max-w-4xl w-full space-y-8 py-8">
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

              {/* Progress Bar */}
              <div className="mt-4 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Verification Progress
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {verificationStatus?.verification?.documents?.length > 0
                      ? "75%"
                      : "25%"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width:
                        verificationStatus?.verification?.documents?.length > 0
                          ? "75%"
                          : "25%",
                    }}
                  ></div>
                </div>
              </div>
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
            <div className="space-y-8">
              {/* Required Documents */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="p-2 bg-red-100 text-red-600 rounded-lg mr-2">
                    Required Documents
                  </span>
                  <span className="text-gray-700">
                    Must be submitted for verification
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {documentTypes
                    .filter((doc) => doc.required)
                    .map(renderDocumentCard)}
                </div>
              </div>

              {/* Optional Documents */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-2">
                    Optional Documents
                  </span>
                  <span className="text-gray-700">
                    Additional documents for faster approval
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {documentTypes
                    .filter((doc) => !doc.required)
                    .map(renderDocumentCard)}
                </div>
              </div>
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
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Documents should be clear, readable, and valid</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>File size should not exceed 5MB per document</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Accepted formats: PDF, JPG, JPEG, PNG, DOC, DOCX</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Verification typically takes 24-48 hours</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    You'll receive email notifications about your status
                  </span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    You can delete pending documents and re-upload if needed
                  </span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    After submission, you'll be redirected to dashboard while
                    verification is pending
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {Object.keys(verificationData).length > 0 && (
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex justify-center items-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-dark)] hover:from-[var(--accent-dark)] hover:to-[var(--accent-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      <span>Uploading... {uploadProgress.overall || 0}%</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Upload {Object.keys(verificationData).length} Document(s)
                    </>
                  )}
                </motion.button>
              )}

              <Link
                to="/service-provider/dashboard"
                className="flex-1 inline-flex justify-center items-center py-4 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>

            {/* Status Info */}
            {verificationStatus && (
              <div className="text-center pt-4">
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-xl ${getStatusColor(
                    verificationStatus.provider?.verificationStatus || "pending"
                  )}`}
                >
                  {getStatusIcon(
                    verificationStatus.provider?.verificationStatus || "pending"
                  )}
                  <span className="ml-2 font-medium">
                    Overall Status:{" "}
                    {verificationStatus.provider?.verificationStatus?.toUpperCase() ||
                      "PENDING"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {verificationStatus.provider?.verificationStatus === "pending"
                    ? "Your verification is under review. You will be notified once approved."
                    : verificationStatus.provider?.verificationStatus ===
                      "rejected"
                    ? "Your verification was rejected. Please upload updated documents."
                    : "Please upload documents to start verification process."}
                </p>
                {verificationStatus.verification?.reviewedAt && (
                  <p className="text-xs text-gray-600 mt-1">
                    Last reviewed:{" "}
                    {new Date(
                      verificationStatus.verification.reviewedAt
                    ).toLocaleDateString()}
                  </p>
                )}

                {/* Manual redirect button for approved users (just in case) */}
                {verificationStatus.provider?.verificationStatus ===
                  "approved" && (
                  <div className="mt-4">
                    <button
                      onClick={() => navigate("/service-provider/dashboard", { replace: true })}
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      Click here if not redirected automatically
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.form>
        </div>
      </div>
    </div>
  );
}