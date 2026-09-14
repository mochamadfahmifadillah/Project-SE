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
      icon: "grid",
    },
    {
      path: "/account/comparisons",
      label: "Comparisons",
      icon: "compare",
    },
    {
      path: "/account/implementations",
      label: "Implementation Requests",
      icon: "chart",
    },
    {
      path: "/account/settings",
      label: "Settings",
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
            <span className="eyebrow">MY ACCOUNT</span>

            <h2>Workspace</h2>

            <p>Manage your software activity.</p>
          </div>

          <nav className="account-nav" aria-label="Account navigation">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? "account-nav-item active" : "account-nav-item"
                }
              >
                <span className="account-nav-icon">
                  <Icon name={item.icon} />
                </span>

                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* =====================================================
            CONTENT
        ====================================================== */}
        <main className="account-content">{children}</main>
      </div>
    </div>
  );
}

export default AccountLayout;
