import { Outlet } from "react-router-dom";
import Navbar from "../components/Common/CommonNavbar";
import Footer from "../components/Footer";
import PageTransitionLoader from "../components/PageTransitionLoader";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-grow w-full">
        <PageTransitionLoader>
          <Outlet />
        </PageTransitionLoader>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;