import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoutes";
import CommonHome from "./pages/Common/CommonHome";
import CommonAbout from "./pages/Common/CommonAbout";
import CommonContact from "./pages/Common/CommonContact";

import LoginPage from "./pages/Login";
import SignupSelection from "./pages/SignupSelector";
import ForgotPassword from "./pages/Common/ForgotPassword";
import ResetPassword from "./pages/Common/ResetPassword";

import UserSignup from "./pages/User/UserSignup";
import ServiceProviderSignup from "./pages/ServiceProvider/ServiceProviderSignup";
import ServiceProviderVerification from "./pages/ServiceProvider/ServiceProviderVerification";

import UnauthorizedPage from "./pages/Common/Unauthorized";
import ErrorPage from "./pages/Common/Error";
import Error500 from "./pages/Common/Error500";
import Error503 from "./pages/Common/Error503";
import TermsOfService from "./pages/Common/TermsOfService";
import PrivacyPolicy from "./pages/Common/PrivacyPolicy";
import RefundPolicy from "./pages/Common/RefundPolicy";
import CookiePolicy from "./pages/Common/CookiePolicy";

import Layout from "./layout/CommonLayout";
import { ModalProvider } from "./contexts/ModalContext";
import { SocketProvider } from "./contexts/SocketContext";
import ScrollToTop from "./components/Common/ScrollToTop";

// Import layouts and components
import UserLayout from "./layout/UserLayout";
import ServiceProviderLayout from "./layout/ServiceProviderLayout";
import UserHome from "./pages/User/UserHome";
import UserDashboard from "./pages/User/UserDashboard";
import UserServices from "./pages/User/UserServices";
import UserExplore from "./pages/User/UserExplore";
import UserProfile from "./pages/User/UserProfile";
import UserNotification from "./pages/User/UserNotification";
import UserBookings from "./pages/User/UserBookings";
import UserInvoices from "./pages/User/UserInvoices";
import UserAccountLayout from "./layout/UserAccountLayout";
import ServiceProviderDashboard from "./pages/ServiceProvider/ServiceProviderDashboard";
import ServiceProviderProfile from "./pages/ServiceProvider/ServiceProviderProfile";
import ServiceManagement from "./pages/ServiceProvider/ServiceManagement";
import ServiceProviderNotification from "./pages/ServiceProvider/ServiceProviderNotification";
import ServiceProviderBookings from "./pages/ServiceProvider/ServiceProviderBookings";
import ServiceProviderReviews from "./pages/ServiceProvider/ServiceProviderReviews";
import ServiceProviderSettings from "./pages/ServiceProvider/ServiceProviderSettings";
import ServiceProviderSubscription from "./pages/ServiceProvider/ServiceProviderSubscription";
import ServiceProviderWallet from "./pages/ServiceProvider/ServiceProviderWallet";
import ServiceProviderInvoices from "./pages/ServiceProvider/ServiceProviderInvoices";
import PaymentPage from "./pages/PaymentPage";
import Chat from "./pages/Common/Chat";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ModalProvider>
          <Router>
          <ScrollToTop />
          <Toaster 
            position="bottom-right" 
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#363636',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '12px 24px',
              },
            }}
          />
          <Routes>
            {/* ✅ Public Routes WITH Layout (Header/Footer) */}
            <Route element={<Layout />}>
              <Route path="/" element={<CommonHome />} />
              <Route path="/about" element={<CommonAbout />} />
              <Route path="/contact" element={<CommonContact />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Route>

            {/* ✅ Legal Pages (WITHOUT Layout for full screen) */}
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />

            {/* ✅ Error Pages (WITHOUT Layout for full screen) */}
            <Route path="/error/500" element={<Error500 />} />
            <Route path="/error/503" element={<Error503 />} />

            {/* ✅ Auth Routes WITHOUT Layout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/signup" element={<SignupSelection />} />
            <Route path="/user/signup" element={<UserSignup />} />
            <Route path="/payment" element={<PaymentPage />} />
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
              <Route path="invoices" element={<UserInvoices />} />
              <Route path="chat" element={<Chat />} />
              <Route path="chat/:bookingId" element={<Chat />} />
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
              <Route path="wallet" element={<ServiceProviderWallet />} />
              <Route path="invoices" element={<ServiceProviderInvoices />} />
              <Route path="chat" element={<Chat />} />
              <Route path="chat/:bookingId" element={<Chat />} />
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
        </ModalProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;