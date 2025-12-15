import { Outlet } from "react-router-dom";
import UserNavbar from "../components/User/UserNavbar";
import Footer from "../components/Footer";
import PageTransitionLoader from "../components/PageTransitionLoader";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <UserNavbar />
      <main className="flex-grow w-auto">
        <PageTransitionLoader>
          <Outlet />
        </PageTransitionLoader>
      </main>
      <Footer />
    </div>
  );
};
export default Layout;
