import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import CommonHome from "./pages/Common/CommonHome";
import CommonAbout from "./pages/Common/CommonAbout";
import CommonContact from "./pages/Common/CommonContact";

import InspectProtection from "./hooks/InspectProtection";

import LoginPage from "./pages/Login";
import SignupSelection from "./pages/SignupSelector";

import UserSignup from "./pages/User/UserSignup";

import ServiceProviderSignup from "./pages/ServiceProvider/ServiceProviderSignup";
import ServiceProviderVerification from "./pages/ServiceProvider/ServiceProviderVerification";

import UnauthorizedPage from "./pages/Common/Unauthorized";
import ErrorPage from "./pages/Common/Error";

import Layout from "./layout/CommonLayout";
import { ThemeProvider } from "./contexts/ThemeContext";

// Import your separated routes
import UserRoute from "./routes/UserRoutes";
import ServiceProviderRoute from "./routes/ServiceProviderRoutes";

function App() {
  return (
    // <InspectProtection>
    <ThemeProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          {/* ✅ Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<CommonHome />} />
            <Route path="/about" element={<CommonAbout />} />
            <Route path="/contact" element={<CommonContact />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/signup" element={<SignupSelection />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route
            path="/service-provider/signup"
            element={<ServiceProviderSignup />}
          />
          <Route
            path="/service-provider/verify"
            element={<ServiceProviderVerification />}
          />
          {/* ✅ User Routes */}
          {UserRoute}
          {/* ✅ Service Provider Routes */}
          {ServiceProviderRoute}
        </Routes>
      </Router>
    </ThemeProvider>
    // </InspectProtection>
  );
}

export default App;
