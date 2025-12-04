import { Routes, Route } from "react-router-dom";
// ServiceProviderRoutes.jsx (Alternative)
import ServiceProviderLayout from "../layout/ServiceProviderLayout";
import ServiceProviderDashboard from "../pages/ServiceProvider/ServiceProviderDashboard";
import ServiceProviderProfile from "../pages/ServiceProvider/ServiceProviderProfile";
import ServiceProviderNotification from "../pages/ServiceProvider/ServiceProviderNotification";
import ServiceProviderBookings from "../pages/ServiceProvider/ServiceProviderBookings";
import ServiceProviderReviews from "../pages/ServiceProvider/ServiceProviderReviews";
import ServiceProviderSettings from "../pages/ServiceProvider/ServiceProviderSettings";
import ServiceProviderSubscription from "../pages/ServiceProvider/ServiceProviderSubscription";

const ServiceProviderRoute = (
  <Route path="/service-provider" element={<ServiceProviderLayout />}>
    <Route index element={<ServiceProviderDashboard />} />
    <Route path="dashboard" element={<ServiceProviderDashboard />} />
    <Route path="profile" element={<ServiceProviderProfile />} />
    <Route path="bookings" element={<ServiceProviderBookings />} />
    <Route path="reviews" element={<ServiceProviderReviews/>} />
    <Route path="notifications" element={<ServiceProviderNotification />} />
    <Route path="subscription" element={<ServiceProviderSubscription/>} />
    <Route path="settings" element={<ServiceProviderSettings />} />
  </Route>
);

export default ServiceProviderRoute;