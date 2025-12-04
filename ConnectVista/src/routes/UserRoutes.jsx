// routes/UserRoutes.jsx
import { Route } from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import UserHome from "../pages/User/UserHome";
import ProtectedRoute from "./ProtectedRoutes";
import AboutPage from "../pages/Common/CommonAbout";
import ContactPage from "../pages/Common/CommonContact";
import UserServices from "../pages/User/UserServices";
import UserExplore from "../pages/User/UserExplore";

const UserRoute = (
  <Route>
    <Route path="/user" element={<UserLayout />}>
      <Route index element={<UserHome />} />
      <Route path="home" element={<UserHome />} />
      <Route path="services" element={<UserServices />} />
      <Route path="explore" element={<UserExplore />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
    </Route>
  </Route>
);

export default UserRoute;
