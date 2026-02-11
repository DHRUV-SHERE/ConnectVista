import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoutes";
import CommonHome from "./pages/Common/CommonHome";
import CommonAbout from "./pages/Common/CommonAbout";
import CommonContact from "./pages/Common/CommonContact";

import LoginPage from "./pages/Login";
import SignupSelection from "./pages/SignupSelector";

import UserSignup from "./pages/User/UserSignup";
import ServiceProviderSignup from "./pages/ServiceProvider/ServiceProviderSignup";
import ServiceProviderVerification from "./pages/ServiceProvider/ServiceProviderVerification";

import UnauthorizedPage from "./pages/Common/Unauthorized";
import ErrorPage from "./pages/Common/Error";

import Layout from "./layout/CommonLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext";

// Import layouts and components
import UserLayout from "./layout/UserLayout";
import ServiceProviderLayout from "./layout/ServiceProviderLayout";
import UserHome from "./pages/User/UserHome";
import UserServices from "./pages/User/UserServices";
import UserExplore from "./pages/User/UserExplore";
import UserProfile from "./pages/User/UserProfile";
import UserNotification from "./pages/User/UserNotification";
import UserBookings from "./pages/User/UserBookings";
import ServiceProviderDashboard from "./pages/ServiceProvider/ServiceProviderDashboard";
import ServiceProviderProfile from "./pages/ServiceProvider/ServiceProviderProfile";
import ServiceManagement from "./pages/ServiceProvider/ServiceManagement";
import ServiceProviderNotification from "./pages/ServiceProvider/ServiceProviderNotification";
import ServiceProviderBookings from "./pages/ServiceProvider/ServiceProviderBookings";
import ServiceProviderReviews from "./pages/ServiceProvider/ServiceProviderReviews";
import ServiceProviderSettings from "./pages/ServiceProvider/ServiceProviderSettings";
import ServiceProviderSubscription from "./pages/ServiceProvider/ServiceProviderSubscription";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider>
          <Router>
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            {/* ✅ Public Routes WITH Layout (Header/Footer) */}
            <Route element={<Layout />}>
              <Route path="/" element={<CommonHome />} />
              <Route path="/about" element={<CommonAbout />} />
              <Route path="/contact" element={<CommonContact />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Route>

            {/* ✅ Auth Routes WITHOUT Layout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupSelection />} />
            <Route path="/user/signup" element={<UserSignup />} />
            <Route
              path="/service-provider/signup"
              element={<ServiceProviderSignup />}
            />

            {/* ✅ User Protected Routes */}
            <Route path="/user" element={
              <ProtectedRoute allowedRoles={['seeker']}>
                <UserLayout />
              </ProtectedRoute>
            }>
              <Route index element={<UserHome />} />
              <Route path="home" element={<UserHome />} />
              <Route path="services" element={<UserServices />} />
              <Route path="explore" element={<UserExplore />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="notifications" element={<UserNotification />} />
              <Route path="bookings" element={<UserBookings />} />
              <Route path="about" element={<CommonAbout />} />
              <Route path="contact" element={<CommonContact />} />
            </Route>

            {/* ✅ Service Provider Protected Routes */}
            <Route path="/service-provider" element={
              <ProtectedRoute allowedRoles={['provider']} checkVerification={true}>
                <ServiceProviderLayout />
              </ProtectedRoute>
            }>
              <Route index element={<ServiceProviderDashboard />} />
              <Route path="dashboard" element={<ServiceProviderDashboard />} />
              <Route path="profile" element={<ServiceProviderProfile />} />
              <Route path="services" element={<ServiceManagement />} />
              <Route path="bookings" element={<ServiceProviderBookings />} />
              <Route path="reviews" element={<ServiceProviderReviews />} />
              <Route path="notifications" element={<ServiceProviderNotification />} />
              <Route path="subscription" element={<ServiceProviderSubscription />} />
              <Route path="settings" element={<ServiceProviderSettings />} />
            </Route>

            {/* ✅ Service Provider Verification */}
            <Route path="/service-provider/verify" element={
              <ProtectedRoute allowedRoles={['provider']}>
                <ServiceProviderVerification />
              </ProtectedRoute>
            } />

            {/* ✅ Error Routes */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
          </Router>
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;