import { NavLink } from "react-router-dom";

import Header from "../components/public/Header";
import Icon from "../components/common/Icon";

function AccountLayout({ children }) {
  const menuItems = [
    {
      path: "/account",
      label: "Overview",
      icon: "user",
      end: true,
    },
    {
      path: "/account/saved",
      label: "Saved Software",
      icon: "bookmark",
    },
    {
      path: "/account/comparisons",
      label: "My Comparisons",
      icon: "compare",
    },
    {
      path: "/account/recommendations",
      label: "Recommendations",
      icon: "lightbulb",
    },
    {
      path: "/account/reviews",
      label: "My Reviews",
      icon: "star",
    },
    {
      path: "/account/implementations",
      label: "Implementation Requests",
      icon: "file",
    },
    {
      path: "/account/notifications",
      label: "Notifications",
      icon: "bell",
    },
    {
      path: "/account/profile",
      label: "Profile",
      icon: "user",
    },
    {
      path: "/account/settings",
      label: "Account Settings",
      icon: "settings",
    },
  ];

  return (
    <div className="app-shell">
      <Header />

      <div className="account-shell">
        {/* =====================================================
            SIDEBAR
        ====================================================== */}
        <aside className="account-side">
          <div className="account-side-header">
            <h2>My Account</h2>
          </div>

          <nav
            className="account-nav"
            aria-label="Account navigation"
          >
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  isActive
                    ? "account-nav-item active"
                    : "account-nav-item"
                }
              >
                <span className="account-nav-icon">
                  <Icon name={item.icon} />
                </span>

                <span className="account-nav-label">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* =====================================================
              RECOMMENDATION CARD
          ====================================================== */}
          <div className="account-recommendation">
            <div className="account-recommendation-icon">
              <Icon name="crown" />
            </div>

            <h3>Get Better Recommendations</h3>

            <p>
              Complete your profile to get more accurate
              software matches.
            </p>

            <NavLink
              to="/account/profile"
              className="account-recommendation-button"
            >
              Complete Profile
            </NavLink>

            <div className="account-completion">
              <div className="account-completion-header">
                <span>Profile Completeness</span>
                <strong>85%</strong>
              </div>

              <div className="account-completion-track">
                <div
                  className="account-completion-progress"
                  style={{ width: "85%" }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* =====================================================
            CONTENT
        ====================================================== */}
        <main className="account-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AccountLayout;