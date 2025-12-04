import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useState } from "react";
import resources from "../../resources";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/user/home", label: "Home" },
    { to: "/user/services", label: "Services" },
    { to: "/user/explore", label: "Explore" },
    { to: "/user/about", label: "About" },
    { to: "/user/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b"
      style={{
        background: "var(--overlay-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/user/home" className="flex items-center space-x-2 shrink-0">
            <img
              src={resources.Logo.src}
              alt="ConnectVista Logo"
              className="h-16 w-auto object-contain transition-all mr-0" // Adjusted size for 585×427 logo
              style={{ maxHeight: "80px" }} // Ensure it doesn't get too tall
            />
            <span
              className="font-bold text-3xl m-auto hidden sm:block"
              style={{ color: "var(--text-color)", fontFamily: "ConnectVistaSecondary" }}
            >
              Connect
              <span style={{ color: "var(--accent-color)" }}>Vista</span> {/* Made Vista part use accent color */}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isActive(link.to)
                    ? "text-white"
                    : "text-[var(--text-color)] hover:bg-[var(--accent-color)] hover:bg-opacity-10"
                }`}
                style={{
                  backgroundColor: isActive(link.to)
                    ? "var(--accent-color)"
                    : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border transition"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
              }}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Auth Buttons (Desktop) */}
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/login">
                <button
                  className="px-4 py-2 rounded-md transition border"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button
                  className="px-4 py-2 rounded-md transition text-white"
                  style={{
                    backgroundColor: "var(--accent-color)",
                  }}
                >
                  Sign Up
                </button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md md:hidden transition border"
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
                color: "var(--text-color)",
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            className="md:hidden py-4 space-y-2 border-t"
            style={{ borderColor: "var(--border-color)" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isActive(link.to)
                    ? "text-white"
                    : "text-[var(--text-color)] hover:bg-[var(--accent-color)] hover:bg-opacity-10"
                }`}
                style={{
                  backgroundColor: isActive(link.to)
                    ? "var(--accent-color)"
                    : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Buttons Mobile */}
            <div
              className="flex flex-col space-y-2 pt-4 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <button
                  className="w-full px-4 py-2 rounded-md transition border"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  Login
                </button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <button
                  className="w-full px-4 py-2 rounded-md transition text-white"
                  style={{
                    backgroundColor: "var(--accent-color)",
                  }}
                >
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;