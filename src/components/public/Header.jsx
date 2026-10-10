import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";

import { useAuthContext } from "../../context/AuthContext";
import softwareEmpire from "../../assets/images/software-empire.png";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

function getAvatarUrl(avatar) {
  if (typeof avatar !== "string" || !avatar.trim()) {
    return null;
  }

  const value = avatar.trim();

  // Full URL, data URL, or temporary blob URL.
  if (/^(https?:\/\/|data:image\/|blob:)/i.test(value)) {
    return value;
  }

  const path = value.replace(/^\/+/, "");

  // Laravel public storage path.
  if (path.startsWith("storage/")) {
    return `${API_BASE_URL}/${path}`;
  }

  // Path saved relative to Laravel's public storage.
  return `${API_BASE_URL}/storage/${path}`;
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading, isAuthenticated, logout } = useAuthContext();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);

  const mobileMenuRef = useRef(null);

  const userName = user?.name?.trim() || "";

  const initials =
    userName
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const avatarUrl = getAvatarUrl(user?.avatar);

  // DEBUG: periksa data avatar di browser Console.
  useEffect(() => {
    console.log("[Header] User:", user);
    console.log("[Header] Avatar field:", user?.avatar);
    console.log("[Header] Avatar URL:", avatarUrl);
  }, [user, avatarUrl]);

  // Reset status error saat URL gambar berubah.
  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [avatarUrl]);

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

  // Close mobile menu when clicking outside.
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

  // Close mobile menu when route changes.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="topbar">
      {/* BRAND */}
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

      {/* DESKTOP NAVIGATION */}
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

      {/* MOBILE MENU */}
      <div className="mobile-nav-wrapper" ref={mobileMenuRef}>
        <button
          type="button"
          className={`mobile-menu-button ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen((previous) => !previous)}
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

      {/* ACCOUNT ACTIONS */}
      <div className="header-actions">
        {loading && (
          <div className="header-auth-loading" aria-label="Loading account" />
        )}

        {/* GUEST */}
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

        {/* AUTHENTICATED USER */}
        {!loading && isAuthenticated && (
          <div className="header-account">
            <button
              type="button"
              className="logged-user"
              onClick={() => navigate("/account")}
              title="My Account"
              aria-label="Open my account"
            >
              <span className="avatar">
                {avatarUrl && !avatarLoadFailed ? (
                  <img
                    key={avatarUrl}
                    src={avatarUrl}
                    alt={`${userName || "User"} profile`}
                    className="avatar-image"
                    onLoad={() => {
                      console.log("[Header] Avatar loaded:", avatarUrl);
                    }}
                    onError={() => {
                      console.error(
                        "[Header] Failed to load avatar:",
                        avatarUrl,
                      );
                      setAvatarLoadFailed(true);
                    }}
                  />
                ) : (
                  initials
                )}
              </span>

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
