import { Outlet } from "react-router-dom";
import Navbar from "../components/Common/CommonNavbar";
import {useAuth} from "../contexts/AuthContext";
import Footer from "../components/Footer";
import PageTransitionLoader from "../components/PageTransitionLoader";
import {Link, useNavigate} from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();
  const {isAuthenticated, isProvider, isSeeker, profile} = useAuth();

   const handleHomeClick = (e) => {
    e.preventDefault();
    
    if (isAuthenticated) {
      if (isSeeker) {
        navigate("/user/home");
      } else if (isProvider) {
        // Check if provider is verified
        if (profile?.isVerified) {
          navigate("/service-provider/dashboard");
        } else {
          navigate("/service-provider/verify");
        }
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar onHomeClick={handleHomeClick} />
      <main className="flex-grow w-full">
        <PageTransitionLoader>
          <Outlet />
        </PageTransitionLoader>
      </main>
      <Footer onHomeClick={handleHomeClick} />
    </div>
  );
};

export default Layout;