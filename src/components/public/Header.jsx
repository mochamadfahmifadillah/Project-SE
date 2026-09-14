import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";

import { useAuthContext } from "../../context/AuthContext";
import softwareEmpire from "../../assets/images/software-empire.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading, isAuthenticated, logout } = useAuthContext();

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

    return location.pathname === path;
  };

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
          NAVIGATION
      ====================================================== */}
      <nav className="topnav" aria-label="Main navigation">
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
      </nav>

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
