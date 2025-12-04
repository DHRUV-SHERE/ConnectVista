import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X, ChevronDown, User, Building } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useState, useRef, useEffect } from "react";
import resources from "../../resources";

const CommonNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSignupDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <img
              src={resources.Logo.src}
              alt="ConnectVista Logo"
              className="h-16 w-auto object-contain transition-all mr-0"
              style={{ maxHeight: "80px" }}
            />
            <span
              className="font-bold text-3xl m-auto hidden sm:block"
              style={{
                color: "var(--text-color)",
                fontFamily: "ConnectVistaSecondary",
              }}
            >
              Connect
              <span style={{ color: "var(--accent-color)" }}>Vista</span>
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

              {/* Signup Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowSignupDropdown(!showSignupDropdown)}
                  className="px-4 py-2 rounded-md transition text-white flex items-center space-x-1"
                  style={{
                    backgroundColor: "var(--accent-color)",
                  }}
                >
                  <span>Sign Up</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showSignupDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showSignupDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-md shadow-lg py-2 border"
                    style={{
                      backgroundColor: "var(--overlay-bg)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <Link
                      to="/user/signup"
                      onClick={() => setShowSignupDropdown(false)}
                      className="flex items-center px-4 py-3 text-sm transition-all duration-200 hover:bg-opacity-10"
                      style={{
                        color: "var(--text-color)",
                        backgroundColor: showSignupDropdown
                          ? "transparent"
                          : "var(--accent-color)",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "var(--accent-color)";
                        e.target.style.backgroundColor += "20";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                      }}
                    >
                      <User
                        className="h-5 w-5 mr-3"
                        style={{ color: "var(--accent-color)" }}
                      />
                      <div>
                        <div className="font-medium">Service Seeker</div>
                        <div className="text-xs opacity-70">
                          Find and book services
                        </div>
                      </div>
                    </Link>

                    <Link
                      to="/service-provider/signup"
                      onClick={() => setShowSignupDropdown(false)}
                      className="flex items-center px-4 py-3 text-sm transition-all duration-200 hover:bg-opacity-10"
                      style={{
                        color: "var(--text-color)",
                        backgroundColor: showSignupDropdown
                          ? "transparent"
                          : "var(--accent-color)",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "var(--accent-color)";
                        e.target.style.backgroundColor += "20";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                      }}
                    >
                      <Building
                        className="h-5 w-5 mr-3"
                        style={{ color: "var(--accent-color)" }}
                      />
                      <div>
                        <div className="font-medium">Service Provider</div>
                        <div className="text-xs opacity-70">
                          Offer your services
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
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

              {/* Mobile Signup Options */}
              <div className="space-y-2">
                <div
                  className="text-xs font-medium px-2 py-1"
                  style={{ color: "var(--text-color)" }}
                >
                  Sign Up As:
                </div>
                <Link
                  to="/user/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center w-full px-4 py-3 rounded-md transition border"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <User
                    className="h-5 w-5 mr-3"
                    style={{ color: "var(--accent-color)" }}
                  />
                  <div>
                    <div className="font-medium">Service Seeker</div>
                    <div className="text-xs opacity-70">
                      Find and book services
                    </div>
                  </div>
                </Link>

                <Link
                  to="/service-provider/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center w-full px-4 py-3 rounded-md transition border"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <Building
                    className="h-5 w-5 mr-3"
                    style={{ color: "var(--accent-color)" }}
                  />
                  <div>
                    <div className="font-medium">Service Provider</div>
                    <div className="text-xs opacity-70">
                      Offer your services
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CommonNavbar;
