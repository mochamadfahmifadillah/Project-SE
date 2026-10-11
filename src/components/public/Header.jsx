import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";

import { useAuthContext } from "../../context/AuthContext";
import softwareEmpire from "../../assets/images/software-empire.png";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://software-empire-backend.vercel.app/api/v1"
).replace(/\/+$/, "");

const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/i, "");

function getAvatarUrl(avatar) {
  if (typeof avatar !== "string" || !avatar.trim()) {
    return null;
  }

  const value = avatar.trim();

  // URL lengkap dari server atau layanan penyimpanan gambar.
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  // Mendukung path relatif seperti:
  // avatars/profile.png
  // storage/avatars/profile.png
  // api/v1/storage/avatars/profile.png
  const path = value
    .replace(/^\/+/, "")
    .replace(/^api\/v1\//i, "")
    .replace(/^storage\//i, "");

  if (!path || path.includes("..")) {
    return null;
  }

  return `${API_ORIGIN}/storage/${path}`;
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading, isAuthenticated, logout } = useAuthContext();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);

  const mobileMenuRef = useRef(null);

  const userName = typeof user?.name === "string" ? user.name.trim() : "";

  const initials =
    userName
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  // Menangani beberapa nama field yang umum digunakan API.
  const avatarValue =
    user?.avatar_url ??
    user?.avatar ??
    user?.profile_photo_url ??
    user?.profile_photo ??
    user?.photo_url ??
    null;

  const avatarUrl = getAvatarUrl(avatarValue);

  // Reset fallback ketika avatar pengguna berubah.
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
    if (path === "/software" || path === "/learn") {
      return (
        location.pathname === path || location.pathname.startsWith(`${path}/`)
      );
    }

    if (path === "/admin/vendors") {
      return (
        location.pathname === path || location.pathname.startsWith(`${path}/`)
      );
    }

    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  // Tutup menu mobile ketika klik di luar menu.
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
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Tutup menu mobile ketika berpindah halaman.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const renderNavigationItems = () => (
    <>
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
    </>
  );

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
        {renderNavigationItems()}
      </nav>

      {/* MOBILE MENU */}
      <div className="mobile-nav-wrapper" ref={mobileMenuRef}>
        <button
          type="button"
          className={`mobile-menu-button ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          aria-expanded={mobileMenuOpen}
          aria-haspopup="true"
          aria-label="Toggle navigation menu"
        >
          <span>Menu</span>
          <ChevronDown size={15} className={mobileMenuOpen ? "rotate" : ""} />
        </button>

        {mobileMenuOpen && (
          <div className="mobile-dropdown">{renderNavigationItems()}</div>
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
                      console.info("[Header] Avatar loaded successfully");
                    }}
                    onError={() => {
                      console.error(
                        "[Header] Avatar failed to load:",
                        avatarUrl,
                      );
                      setAvatarLoadFailed(true);
                    }}
                  />
                ) : (
                  <span aria-label="User initials">{initials}</span>
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
