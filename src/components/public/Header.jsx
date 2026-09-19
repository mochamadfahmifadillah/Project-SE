import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";

import { useAuthContext } from "../../context/AuthContext";
import softwareEmpire from "../../assets/images/software-empire.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading, isAuthenticated, logout } = useAuthContext();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const userName = user?.name || "";

  const initials =
    userName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((name) => name.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => {
    if (path === "/software") {
      return (
        location.pathname === "/software" ||
        location.pathname.startsWith("/software/")
      );
    }

    if (path === "/learn") {
      return (
        location.pathname === "/learn" ||
        location.pathname.startsWith("/learn/")
      );
    }

    if (path === "/admin/vendors") {
      return (
        location.pathname === "/admin/vendors" ||
        location.pathname.startsWith("/admin/vendors/")
      );
    }

    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="topbar">
      {/* =====================================================
          BRAND
      ====================================================== */}
      <button
        type="button"
        className="brand"
        onClick={() => navigate("/")}
        aria-label="Go to Software Empire home"
      >
        <img
          src={softwareEmpire}
          alt="Software Empire"
          className="brand-logo"
        />
      </button>

      {/* =====================================================
          DESKTOP NAVIGATION
      ====================================================== */}
      <nav className="topnav desktop-nav" aria-label="Main navigation">
        <button
          type="button"
          className={isActive("/software") ? "active" : ""}
          onClick={() => navigate("/software")}
        >
          Software
        </button>

        <button
          type="button"
          className={isActive("/compare") ? "active" : ""}
          onClick={() => navigate("/compare")}
        >
          Compare
        </button>

        <button
          type="button"
          className={isActive("/recommend") ? "active" : ""}
          onClick={() => navigate("/recommend")}
        >
          Find My Software
        </button>

        <button
          type="button"
          className={isActive("/learn") ? "active" : ""}
          onClick={() => navigate("/learn")}
        >
          Learn
        </button>

        <button
          type="button"
          className={isActive("/admin/vendors") ? "active" : ""}
          onClick={() => navigate("/admin/vendors")}
        >
          For Vendors
        </button>
      </nav>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}
      <div className="mobile-nav-wrapper" ref={mobileMenuRef}>
        <button
          type="button"
          className={`mobile-menu-button ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-haspopup="true"
        >
          <span>Menu</span>
          <ChevronDown size={15} className={mobileMenuOpen ? "rotate" : ""} />
        </button>

        {mobileMenuOpen && (
          <div className="mobile-dropdown">
            <button
              type="button"
              className={isActive("/software") ? "active" : ""}
              onClick={() => handleNavigation("/software")}
            >
              Software
            </button>

            <button
              type="button"
              className={isActive("/compare") ? "active" : ""}
              onClick={() => handleNavigation("/compare")}
            >
              Compare
            </button>

            <button
              type="button"
              className={isActive("/recommend") ? "active" : ""}
              onClick={() => handleNavigation("/recommend")}
            >
              Find My Software
            </button>

            <button
              type="button"
              className={isActive("/learn") ? "active" : ""}
              onClick={() => handleNavigation("/learn")}
            >
              Learn
            </button>

            <button
              type="button"
              className={isActive("/admin/vendors") ? "active" : ""}
              onClick={() => handleNavigation("/admin/vendors")}
            >
              For Vendors
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          ACTIONS
      ====================================================== */}
      <div className="header-actions">
        {/* AUTH LOADING */}
        {loading && (
          <div className="header-auth-loading" aria-label="Loading account" />
        )}

        {/* ===================================================
            GUEST
        ==================================================== */}
        {!loading && !isAuthenticated && (
          <div className="guest-actions">
            <button
              type="button"
              className="header-login"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              type="button"
              className="header-signup"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* ===================================================
            AUTHENTICATED
        ==================================================== */}
        {!loading && isAuthenticated && (
          <div className="header-account">
            <button
              type="button"
              className="logged-user"
              onClick={() => navigate("/account")}
              title="My Account"
              aria-label="Open my account"
            >
              <span className="avatar">{initials}</span>

              <span className="logged-user-info">
                <strong>{userName || "My Account"}</strong>
                <small>Account</small>
              </span>

              <ChevronDown size={15} />
            </button>

            <button
              type="button"
              className="header-logout"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
