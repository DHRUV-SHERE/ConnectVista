"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Fetch fresh profile data
          const response = await authService.getProfile();
          if (response.success) {
            setUser(response.data.user);
            setProfile(response.data.profile);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          } else {
            // If profile fetch fails but token exists, user might be logged out
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            setUser(null);
            setProfile(null);
          }
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const refreshAuth = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setUser(null);
        setProfile(null);
        return false;
      }

      const response = await authService.getProfile();
      if (response.success) {
        setUser(response.data.user);
        setProfile(response.data.profile);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return true;
      } else {
        console.warn("Profile fetch returned success: false");
        return false;
      }
    } catch (err) {
      console.error("Refresh auth failed:", err);
      // Don't clear tokens on server errors
      if (err.message.includes("Server error") || err.message.includes("500")) {
        console.log("Server error, keeping auth state");
        return false;
      }
      // Only clear on auth errors
      if (err.message.includes("401") || err.message.includes("Session")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
        setProfile(null);
      }
      return false;
    }
  };

  // In AuthContext.jsx, update the signupSeeker function:

const signupSeeker = async (userData) => {
  try {
    setLoading(true);
    setError(null);
    
    // Log what we're sending
    console.log('📤 Sending signup data:', userData);
    
    const response = await authService.signupSeeker(userData);

    if (response.success) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      setProfile(response.data.profile);
    }
    return response;
  } catch (err) {
    console.error('❌ Signup error details:', {
      error: err,
      response: err.response,
      data: err.response?.data
    });
    
    // Better error handling
    let errorMessage = "Signup failed";
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.errors) {
      // Handle Mongoose validation errors
      const errors = err.response.data.errors;
      errorMessage = Object.values(errors).map(err => err.message).join(', ');
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const signupProvider = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.signupProvider(userData);

      if (response.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        setProfile(response.data.profile);
      }
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // In AuthContext.jsx - Update the login function:
const login = async (email, password) => {
  try {
    setLoading(true);
    setError(null);
    const response = await authService.login(email, password);

    if (response.success) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      
      // IMPORTANT: If provider, fetch fresh verification status
      if (response.data.user.role === 'provider') {
        try {
          const verificationResponse = await api.get("/verification/status");
          if (verificationResponse.data.success) {
            // Update profile with verification data
            const profileData = {
              ...response.data.profile,
              isVerified: verificationResponse.data.data.provider.isVerified,
              verificationStatus: verificationResponse.data.data.provider.verificationStatus
            };
            setProfile(profileData);
            
            // Also update the response
            response.data.profile = profileData;
          }
        } catch (verificationError) {
          console.warn('Could not fetch verification status:', verificationError);
          // Continue with existing profile data
          setProfile(response.data.profile);
        }
      } else {
        setProfile(response.data.profile);
      }
    }
    return response;
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Login failed";
    setError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
};


  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      setProfile(null);
      window.location.href = "/login";
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.updateProfile(profileData);

      if (response.success && response.data?.profile) {
        setProfile(response.data.profile);
      }
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Update failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.changePassword(
        currentPassword,
        newPassword
      );
      return response;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Password change failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check if provider is verified
  const checkProviderVerification = async () => {
    if (user?.role === "provider" && profile) {
      return profile.isVerified;
    }
    return true;
  };

  // Refresh user profile data
  const refreshProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setProfile(response.data.profile);
        return response.data.profile;
      }
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    }
    return null;
  };

  const value = {
    user,
    profile,
    loading,
    error,
    signupSeeker,
    signupProvider,
    login,
    logout,
    updateProfile,
    changePassword,
    checkProviderVerification,
    refreshProfile,
    refreshAuth, // Add this
    isAuthenticated: !!user,
    isProvider: user?.role === "provider",
    isSeeker: user?.role === "seeker",
    isAdmin: user?.role === "admin",
    isVerifiedProvider: user?.role === "provider" && profile?.isVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
