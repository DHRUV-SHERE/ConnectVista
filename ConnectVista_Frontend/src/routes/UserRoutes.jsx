import { Routes, Route } from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import UserHome from "../pages/User/UserHome";
import AboutPage from "../pages/Common/CommonAbout";
import ContactPage from "../pages/Common/CommonContact";
import UserServices from "../pages/User/UserServices";
import UserExplore from "../pages/User/UserExplore";
import UserProfile from "../pages/User/UserProfile";
import UserNotification from "../pages/User/UserNotification";

const UserRoutes = (
  <Route element={<UserLayout />}>
    <Route index element={<UserHome />} />
    <Route path="home" element={<UserHome />} />
    <Route path="services" element={<UserServices />} />
    <Route path="explore" element={<UserExplore />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="profile" element={<UserProfile />} />
    <Route path="notifications" element={<UserNotification />} />
  </Route>
);

export default UserRoutes;