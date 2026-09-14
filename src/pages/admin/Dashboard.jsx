import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  GitCompareArrows,
  Package,
  Users,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";
import KPICard from "../../components/admin/KPICard";

import { getAdminDashboard } from "../../services/adminService";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("🔥 ADMIN DASHBOARD RENDERED");

  /*
  |--------------------------------------------------------------------------
  | Load Dashboard
  |--------------------------------------------------------------------------
  */

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      /*
       * adminService sudah mengembalikan:
       *
       * {
       *   summary: {...},
       *   popular_software: [...],
       *   recent_users: [...],
       *   recent_implementation_requests: [...],
       *   recent_comparisons: [...]
       * }
       */

      const data = await getAdminDashboard();

      if (!data) {
        throw new Error("Dashboard data is empty.");
      }

      console.log("📊 ADMIN DASHBOARD DATA:", data);

      setDashboard(data);
    } catch (err) {
      console.error("❌ Failed to load admin dashboard:", err);

      const message = err?.message || "Unable to load admin dashboard.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminDashboard();

        if (!mounted) return;

        if (!data) {
          throw new Error("Dashboard data is empty.");
        }

        console.log("📊 ADMIN DASHBOARD DATA:", data);

        setDashboard(data);
      } catch (err) {
        if (!mounted) return;

        console.error("❌ Failed to load admin dashboard:", err);

        setError(err?.message || "Unable to load admin dashboard.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <AdminLayout>
        <AdminHeader />

        <main className="admin-content">
          <div className="admin-state">
            <Activity size={28} />

            <h2>Loading dashboard...</h2>

            <p>We're getting the latest platform data.</p>
          </div>
        </main>
      </AdminLayout>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <AdminLayout>
        <AdminHeader />

        <main className="admin-content">
          <div className="admin-state admin-state-error">
            <Activity size={28} />

            <h2>Unable to load dashboard</h2>

            <p>{error}</p>

            <button
              type="button"
              className="btn primary"
              onClick={loadDashboard}
            >
              Try again
            </button>
          </div>
        </main>
      </AdminLayout>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Dashboard Data
  |--------------------------------------------------------------------------
  */

  const summary = dashboard?.summary ?? {};

  const popularSoftware = Array.isArray(dashboard?.popular_software)
    ? dashboard.popular_software
    : [];

  const recentUsers = Array.isArray(dashboard?.recent_users)
    ? dashboard.recent_users
    : [];

  const recentRequests = Array.isArray(
    dashboard?.recent_implementation_requests,
  )
    ? dashboard.recent_implementation_requests
    : [];

  const recentComparisons = Array.isArray(dashboard?.recent_comparisons)
    ? dashboard.recent_comparisons
    : [];

  /*
  |--------------------------------------------------------------------------
  | KPI
  |--------------------------------------------------------------------------
  */

  const totalSoftware = Number(summary.total_software ?? 0);

  const activeSoftware = Number(summary.active_software ?? 0);

  const totalUsers = Number(summary.total_users ?? 0);

  const totalComparisons = Number(summary.total_comparisons ?? 0);

  const totalSavedSoftware = Number(summary.total_saved_software ?? 0);

  const totalImplementationRequests = Number(
    summary.total_implementation_requests ?? 0,
  );

  const pendingImplementationRequests = Number(
    summary.pending_implementation_requests ?? 0,
  );

  const kpis = [
    {
      title: "Total Software",
      value: totalSoftware.toLocaleString(),
      change: `${activeSoftware.toLocaleString()} active`,
    },
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      change: "Registered users",
    },
    {
      title: "Comparisons",
      value: totalComparisons.toLocaleString(),
      change: "Saved comparisons",
    },
    {
      title: "Saved Software",
      value: totalSavedSoftware.toLocaleString(),
      change: "User shortlists",
    },
    {
      title: "Implementation Leads",
      value: totalImplementationRequests.toLocaleString(),
      change:
        pendingImplementationRequests > 0
          ? `${pendingImplementationRequests.toLocaleString()} pending`
          : "No pending requests",
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | System Services
  |--------------------------------------------------------------------------
  */

  const systemServices = [
    "Website",
    "API",
    "Recommendation Engine",
    "Search Service",
    "Database",
  ];

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <AdminLayout>
      <AdminHeader />

      <main className="admin-content">
        {/* ================================================================
            PAGE HEADER
        ================================================================= */}

        <section className="page-head">
          <div>
            <span className="eyebrow">ADMIN DASHBOARD</span>

            <h1>Platform overview</h1>

            <p>
              Monitor software, users, comparisons and implementation activity.
            </p>
          </div>
        </section>

        {/* ================================================================
            KPI
        ================================================================= */}

        <section className="kpi-grid">
          {kpis.map((item) => (
            <KPICard
              key={item.title}
              title={item.title}
              value={item.value}
              change={item.change}
            />
          ))}
        </section>

        {/* ================================================================
            DASHBOARD GRID
        ================================================================= */}

        <section className="admin-grid">
          {/* ============================================================
              TOP SOFTWARE
          ============================================================= */}

          <article className="admin-card">
            <div className="admin-card-header">
              <div>
                <span className="eyebrow">POPULAR</span>

                <h3>Top Software</h3>
              </div>

              <BarChart3 size={20} />
            </div>

            <div className="rank-list">
              {popularSoftware.length > 0 ? (
                popularSoftware.map((software, index) => (
                  <div className="rank" key={software.id}>
                    <span>{index + 1}</span>

                    <div className="rank-info">
                      <b>{software.name || "Unnamed software"}</b>

                      <small>
                        {software.category || "Uncategorized"}

                        {" · "}

                        {Number(software.rating ?? 0).toFixed(1)}

                        {" ★"}
                      </small>
                    </div>

                    <strong>
                      {Number(software.views ?? 0).toLocaleString()}
                    </strong>
                  </div>
                ))
              ) : (
                <p className="admin-muted">No software data available.</p>
              )}
            </div>
          </article>

          {/* ============================================================
              SYSTEM STATUS
          ============================================================= */}

          <article className="admin-card">
            <div className="admin-card-header">
              <div>
                <span className="eyebrow">HEALTH</span>

                <h3>System Status</h3>
              </div>

              <CheckCircle2 size={20} />
            </div>

            <div className="system-list">
              {systemServices.map((service) => (
                <div className="system-row" key={service}>
                  <i />

                  <span>{service}</span>

                  <em>Operational</em>
                </div>
              ))}
            </div>
          </article>

          {/* ============================================================
              RECENT USERS
          ============================================================= */}

          <article className="admin-card">
            <div className="admin-card-header">
              <div>
                <span className="eyebrow">USERS</span>

                <h3>Recent Users</h3>
              </div>

              <Users size={20} />
            </div>

            <div className="admin-list">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => {
                  const name = user?.name || "Unknown user";

                  const initials = name
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part.charAt(0))
                    .join("")
                    .toUpperCase();

                  return (
                    <div className="admin-list-row" key={user.id}>
                      <div className="admin-avatar">{initials || "U"}</div>

                      <div>
                        <b>{name}</b>

                        <span>{user?.email || "-"}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="admin-muted">No users yet.</p>
              )}
            </div>
          </article>

          {/* ============================================================
              IMPLEMENTATION REQUESTS
          ============================================================= */}

          <article className="admin-card">
            <div className="admin-card-header">
              <div>
                <span className="eyebrow">LEADS</span>

                <h3>Implementation Requests</h3>
              </div>

              <Package size={20} />
            </div>

            <div className="admin-list">
              {recentRequests.length > 0 ? (
                recentRequests.map((request) => {
                  const companyName =
                    request?.company_name ||
                    request?.contact_name ||
                    "Unknown company";

                  const softwareName =
                    request?.software?.name || "Software request";

                  const status = request?.status || "pending";

                  return (
                    <div className="admin-list-row" key={request.id}>
                      <div className="admin-avatar">
                        {companyName.slice(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <b>{companyName}</b>

                        <span>{softwareName}</span>
                      </div>

                      <em className={`status status-${status}`}>{status}</em>
                    </div>
                  );
                })
              ) : (
                <p className="admin-muted">No implementation requests yet.</p>
              )}
            </div>
          </article>

          {/* ============================================================
              RECENT COMPARISONS
          ============================================================= */}

          <article className="admin-card wide">
            <div className="admin-card-header">
              <div>
                <span className="eyebrow">ACTIVITY</span>

                <h3>Recent Comparisons</h3>
              </div>

              <GitCompareArrows size={20} />
            </div>

            <div className="comparison-admin-list">
              {recentComparisons.length > 0 ? (
                recentComparisons.map((comparison) => {
                  const softwareCount = Array.isArray(comparison?.software_ids)
                    ? comparison.software_ids.length
                    : 0;

                  const createdAt = comparison?.created_at
                    ? new Date(comparison.created_at)
                    : null;

                  const formattedDate =
                    createdAt && !Number.isNaN(createdAt.getTime())
                      ? createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "-";

                  return (
                    <div className="comparison-admin-row" key={comparison.id}>
                      <div className="comparison-icon">
                        <GitCompareArrows size={18} />
                      </div>

                      <div>
                        <b>
                          {comparison?.name || `Comparison #${comparison.id}`}
                        </b>

                        <span>
                          {comparison?.user?.name || "Unknown user"}
                          {" · "}
                          {softwareCount} software
                        </span>
                      </div>

                      <time>{formattedDate}</time>
                    </div>
                  );
                })
              ) : (
                <p className="admin-muted">No comparisons yet.</p>
              )}
            </div>
          </article>
        </section>
      </main>
    </AdminLayout>
  );
}
