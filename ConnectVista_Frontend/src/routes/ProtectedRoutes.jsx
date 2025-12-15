import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    console.log("User not logged in. Redirecting to login.");
    return <Navigate to="/unauthorized" />;
  }
  
  if (role && user.role !== role) {
    console.log(
      `User role "${user.role}" does not match required role "${role}". Redirecting to unauthorized.`
    );
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
