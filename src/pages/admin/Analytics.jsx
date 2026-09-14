import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  MessageSquare,
  Package,
  Star,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import { getAdminAnalytics } from "../../services/adminService";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminAnalytics();

      const data = response?.data || {};

      setAnalytics({
        overview: {
          total_software: data?.overview?.total_software ?? 0,
          total_reviews: data?.overview?.total_reviews ?? 0,
          total_users: data?.overview?.total_users ?? 0,
          total_leads: data?.overview?.total_leads ?? 0,
        },

        software: {
          total: data?.software?.total ?? 0,
          active: data?.software?.active ?? 0,
        },

        reviews: {
          total: data?.reviews?.total ?? 0,
          average_rating: data?.reviews?.average_rating ?? 0,
        },

        users: {
          total: data?.users?.total ?? 0,
        },

        leads: {
          total: data?.leads?.total ?? 0,
          new: data?.leads?.new ?? 0,
          won: data?.leads?.won ?? 0,
          lost: data?.leads?.lost ?? 0,
        },
      });
    } catch (err) {
      console.error("Failed to load analytics:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load analytics data.",
      );
    } finally {
      setLoading(false);
    }
  }

  const overview = analytics?.overview || {};
  const software = analytics?.software || {};
  const reviews = analytics?.reviews || {};
  const users = analytics?.users || {};
  const leads = analytics?.leads || {};

  const formatNumber = (value) => Number(value || 0).toLocaleString("en-US");

  const formatRating = (value) => Number(value || 0).toFixed(1);

  return (
    <AdminLayout>
      <main className="admin-content analytics-page">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="analytics-header">
          <div>
            <span className="eyebrow">ADMIN PORTAL</span>

            <h1>Analytics</h1>

            <p>
              Monitor platform activity, engagement and implementation
              performance.
            </p>
          </div>

          <button
            type="button"
            className="analytics-refresh"
            onClick={loadAnalytics}
            disabled={loading}
          >
            <Activity size={16} className={loading ? "spin" : ""} />

            {loading ? "Refreshing..." : "Refresh data"}
          </button>
        </header>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <section className="analytics-error" role="alert">
            <div className="analytics-error-icon">
              <XCircle size={20} />
            </div>

            <div>
              <strong>Unable to load analytics</strong>

              <p>{error}</p>
            </div>

            <button type="button" onClick={loadAnalytics} disabled={loading}>
              Try again
            </button>
          </section>
        )}

        {/* =====================================================
            OVERVIEW
        ====================================================== */}

        <section className="analytics-section">
          <div className="analytics-section-heading">
            <div>
              <span className="eyebrow">PLATFORM OVERVIEW</span>

              <h2>At a glance</h2>
            </div>

            <p>Current totals across the Software Empire platform.</p>
          </div>

          <div className="analytics-overview-grid">
            <MetricCard
              icon={Package}
              label="Total Software"
              value={loading ? "—" : formatNumber(overview.total_software)}
              description="Listed in the platform"
            />

            <MetricCard
              icon={MessageSquare}
              label="Total Reviews"
              value={loading ? "—" : formatNumber(overview.total_reviews)}
              description="Submitted by users"
            />

            <MetricCard
              icon={Users}
              label="Total Users"
              value={loading ? "—" : formatNumber(overview.total_users)}
              description="Registered accounts"
            />

            <MetricCard
              icon={TrendingUp}
              label="Total Leads"
              value={loading ? "—" : formatNumber(overview.total_leads)}
              description="Implementation requests"
            />
          </div>
        </section>

        {/* =====================================================
            CORE PERFORMANCE
        ====================================================== */}

        <section className="analytics-section">
          <div className="analytics-section-heading">
            <div>
              <span className="eyebrow">CORE PERFORMANCE</span>

              <h2>Platform health</h2>
            </div>

            <p>Key indicators for catalog, reviews and users.</p>
          </div>

          <div className="analytics-three-grid">
            {/* SOFTWARE */}

            <AnalyticsCard eyebrow="CATALOG" title="Software" icon={Package}>
              <div className="analytics-primary-stat">
                <span>Total software</span>

                <strong>{loading ? "—" : formatNumber(software.total)}</strong>
              </div>

              <div className="analytics-secondary-stat">
                <span>Active listings</span>

                <strong>{loading ? "—" : formatNumber(software.active)}</strong>
              </div>
            </AnalyticsCard>

            {/* REVIEWS */}

            <AnalyticsCard eyebrow="ENGAGEMENT" title="Reviews" icon={Star}>
              <div className="analytics-primary-stat">
                <span>Total reviews</span>

                <strong>{loading ? "—" : formatNumber(reviews.total)}</strong>
              </div>

              <div className="analytics-secondary-stat">
                <span>Average rating</span>

                <strong>
                  {loading
                    ? "—"
                    : `${formatRating(reviews.average_rating)} / 5`}
                </strong>
              </div>
            </AnalyticsCard>

            {/* USERS */}

            <AnalyticsCard eyebrow="USERS" title="Accounts" icon={Users}>
              <div className="analytics-primary-stat">
                <span>Registered users</span>

                <strong>{loading ? "—" : formatNumber(users.total)}</strong>
              </div>

              <div className="analytics-secondary-stat">
                <span>Platform accounts</span>

                <strong>{loading ? "—" : "Active"}</strong>
              </div>
            </AnalyticsCard>
          </div>
        </section>

        {/* =====================================================
            IMPLEMENTATION
        ====================================================== */}

        <section className="analytics-section">
          <div className="analytics-section-heading">
            <div>
              <span className="eyebrow">IMPLEMENTATION</span>

              <h2>Lead performance</h2>
            </div>

            <p>Track the current state of implementation opportunities.</p>
          </div>

          <div className="admin-card analytics-leads-card">
            <div className="analytics-card-header">
              <div>
                <span className="eyebrow">IMPLEMENTATION FUNNEL</span>

                <h3>Lead overview</h3>
              </div>

              <div className="analytics-icon">
                <Activity size={19} />
              </div>
            </div>

            <div className="analytics-leads-grid">
              <LeadStat
                icon={Activity}
                label="Total Leads"
                value={loading ? "—" : formatNumber(leads.total)}
              />

              <LeadStat
                icon={TrendingUp}
                label="New"
                value={loading ? "—" : formatNumber(leads.new)}
              />

              <LeadStat
                icon={CheckCircle2}
                label="Won"
                value={loading ? "—" : formatNumber(leads.won)}
              />

              <LeadStat
                icon={XCircle}
                label="Lost"
                value={loading ? "—" : formatNumber(leads.lost)}
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            SUMMARY
        ====================================================== */}

        <section className="analytics-section">
          <div className="analytics-section-heading">
            <div>
              <span className="eyebrow">SUMMARY</span>

              <h2>Platform activity</h2>
            </div>
          </div>

          <div className="analytics-bottom-grid">
            {/* ACTIVITY */}

            <div className="admin-card analytics-card">
              <div className="analytics-card-header">
                <div>
                  <span className="eyebrow">ACTIVITY BREAKDOWN</span>

                  <h3>Platform totals</h3>
                </div>

                <div className="analytics-icon">
                  <Activity size={19} />
                </div>
              </div>

              <div className="analytics-summary-list">
                <SummaryItem
                  icon={Package}
                  label="Software"
                  value={loading ? "—" : formatNumber(overview.total_software)}
                />

                <SummaryItem
                  icon={Users}
                  label="Users"
                  value={loading ? "—" : formatNumber(overview.total_users)}
                />

                <SummaryItem
                  icon={MessageSquare}
                  label="Reviews"
                  value={loading ? "—" : formatNumber(overview.total_reviews)}
                />

                <SummaryItem
                  icon={TrendingUp}
                  label="Leads"
                  value={loading ? "—" : formatNumber(overview.total_leads)}
                />
              </div>
            </div>

            {/* PERFORMANCE */}

            <div className="admin-card analytics-card">
              <div className="analytics-card-header">
                <div>
                  <span className="eyebrow">KEY METRICS</span>

                  <h3>Performance indicators</h3>
                </div>

                <div className="analytics-icon">
                  <TrendingUp size={19} />
                </div>
              </div>

              <div className="analytics-performance-list">
                <PerformanceRow
                  icon={Package}
                  label="Active Software"
                  value={loading ? "—" : formatNumber(software.active)}
                />

                <PerformanceRow
                  icon={Star}
                  label="Average Rating"
                  value={
                    loading
                      ? "—"
                      : `${formatRating(reviews.average_rating)} / 5`
                  }
                />

                <PerformanceRow
                  icon={CheckCircle2}
                  label="Won Leads"
                  value={loading ? "—" : formatNumber(leads.won)}
                />

                <PerformanceRow
                  icon={UserCheck}
                  label="Registered Users"
                  value={loading ? "—" : formatNumber(users.total)}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </AdminLayout>
  );
}

/*
|--------------------------------------------------------------------------
| Metric Card
|--------------------------------------------------------------------------
*/

function MetricCard({ icon: Icon, label, value, description }) {
  return (
    <article className="analytics-metric-card">
      <div className="analytics-metric-icon">
        <Icon size={19} />
      </div>

      <div className="analytics-metric-copy">
        <span>{label}</span>

        <strong>{value}</strong>

        <small>{description}</small>
      </div>
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Analytics Card
|--------------------------------------------------------------------------
*/

function AnalyticsCard({ eyebrow, title, icon: Icon, children }) {
  return (
    <article className="admin-card analytics-card">
      <div className="analytics-card-header">
        <div>
          <span className="eyebrow">{eyebrow}</span>

          <h3>{title}</h3>
        </div>

        <div className="analytics-icon">
          <Icon size={19} />
        </div>
      </div>

      <div className="analytics-card-body">{children}</div>
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Lead Stat
|--------------------------------------------------------------------------
*/

function LeadStat({ icon: Icon, label, value }) {
  return (
    <div className="lead-stat">
      <div className="lead-stat-label">
        <Icon size={17} />

        <span>{label}</span>
      </div>

      <strong>{value}</strong>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Summary Item
|--------------------------------------------------------------------------
*/

function SummaryItem({ icon: Icon, label, value }) {
  return (
    <div className="summary-item">
      <div className="summary-item-label">
        <Icon size={16} />

        <span>{label}</span>
      </div>

      <strong>{value}</strong>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Performance Row
|--------------------------------------------------------------------------
*/

function PerformanceRow({ icon: Icon, label, value }) {
  return (
    <div className="performance-row">
      <div className="performance-row-label">
        <Icon size={17} />

        <span>{label}</span>
      </div>

      <strong>{value}</strong>
    </div>
  );
}
