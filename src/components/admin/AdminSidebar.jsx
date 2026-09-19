import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Building2,
  FolderTree,
  Star,
  Users,
  BarChart3,
  Settings,
  FileText,
  ClipboardList,
  Handshake,
  ScrollText,
  Puzzle,
  Layers3,
  BriefcaseBusiness,
} from "lucide-react";

const groups = [
  {
    label: "CATALOG",
    items: [
      { label: "Software", path: "/admin/software", icon: Package },
      { label: "Vendors", path: "/admin/vendors", icon: Building2 },
      { label: "Categories", path: "/admin/categories", icon: FolderTree },
      { label: "Features", path: "/admin/features", icon: Layers3 },
      {
        label: "Industries",
        path: "/admin/industries",
        icon: BriefcaseBusiness,
      },
      { label: "Business Sizes", path: "/admin/business-sizes", icon: Users },
      { label: "Integrations", path: "/admin/integrations", icon: Puzzle },
    ],
  },
  {
    label: "ENGAGEMENT",
    items: [
      { label: "Reviews", path: "/admin/reviews", icon: Star },
      {
        label: "Implementation Leads",
        path: "/admin/implementation-leads",
        icon: ClipboardList,
      },
      { label: "Partners", path: "/admin/partners", icon: Handshake },
    ],
  },
  {
    label: "CONTENT",
    items: [
      { label: "Articles", path: "/admin/articles", icon: FileText },
      { label: "Tutorials", path: "/admin/tutorials", icon: FileText },
      { label: "Case Studies", path: "/admin/case-studies", icon: FileText },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      {
        label: "Analytics",
        path: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { label: "Users & Roles", path: "/admin/users", icon: Users },
      { label: "Settings", path: "/admin/settings", icon: Settings },
      { label: "Audit Logs", path: "/admin/audit-logs", icon: ScrollText },
    ],
  },
];

function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("") || "U"
  );
}

function getRoleName(user) {
  if (!user) return "Administrator";

  if (typeof user.role === "string") {
    return user.role;
  }

  if (user.role?.name) {
    return user.role.name;
  }

  if (user.roles?.length > 0) {
    return user.roles[0]?.name || "Administrator";
  }

  return "Administrator";
}

export default function AdminSidebar({ user = null }) {
  const userName = user?.name || "Admin";
  const userRole = getRoleName(user);

  return (
    <aside className="admin-side">
      {/* BRAND */}
      <div className="admin-brand">
        <b>SOFTWARE</b>
        <strong>EMPIRE</strong>
        <small>ADMIN PORTAL</small>
      </div>

      {/* DASHBOARD */}
      <NavLink
        to="/admin"
        end
        className={({ isActive }) =>
          `admin-nav-item ${isActive ? "active" : ""}`
        }
      >
        <LayoutDashboard size={17} />
        <span>Dashboard</span>
      </NavLink>

      {/* MENU */}
      <nav className="admin-nav">
        {groups.map((group) => (
          <div className="admin-nav-group" key={group.label}>
            <span className="admin-nav-label">{group.label}</span>

            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `admin-nav-item ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* CURRENT USER */}
      <div className="admin-side-user">
        <div className="admin-side-avatar">
          {getInitials(userName)}
        </div>

        <div className="admin-side-user-info">
          <strong>{userName}</strong>
          <span>{userRole}</span>
        </div>
      </div>
    </aside>
  );
}