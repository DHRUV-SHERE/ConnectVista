import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import resources from "../resources";

const PageTransitionLoader = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 400); // Adjust duration

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return loading ? (
    <div className="flex justify-center bg-transparent items-center min-h-[100vh] py-24">
      <img src={resources.CustomLoader.src} alt="Loading..." className="w-40 h-40" />
    </div>
  ) : (
    children
  );
};

export default PageTransitionLoader;
