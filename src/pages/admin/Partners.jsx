import { useEffect, useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Loader2,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import { getAdminPartners } from "../../services/adminService";

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPartners = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminPartners();

      setPartners(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Failed to load partners:", err);

      setError(err?.message || "Failed to load partners. Please try again.");

      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const activePartners = partners.filter(
    (partner) =>
      partner?.is_active === true ||
      partner?.is_active === 1 ||
      partner?.status === "active",
  ).length;

  return (
    <AdminLayout>
      <div className="admin-content">
        {/* --------------------------------------------------------------- */}
        {/* Page Header */}
        {/* --------------------------------------------------------------- */}

        <div className="page-head">
          <div>
            <span className="eyebrow">ADMIN PORTAL</span>

            <h1>Partners</h1>

            <p>
              Manage partners and partnership data available throughout Software
              Empire.
            </p>
          </div>

          <div className="page-head-actions">
            <button
              type="button"
              className="admin-button secondary"
              onClick={loadPartners}
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button type="button" className="admin-button primary">
              <Plus size={17} />
              Add Partner
            </button>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Error */}
        {/* --------------------------------------------------------------- */}

        {error && (
          <div className="admin-alert error">
            <AlertCircle size={18} />

            <div>
              <strong>Failed to load partners</strong>

              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={loadPartners}
              className="admin-alert-action"
            >
              Try again
            </button>
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* Stats */}
        {/* --------------------------------------------------------------- */}

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Users size={20} />
            </div>

            <div>
              <span>Total Partners</span>

              <strong>{loading ? "—" : partners.length}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Active Partners</span>

              <strong>{loading ? "—" : activePartners}</strong>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Partners Card */}
        {/* --------------------------------------------------------------- */}

        <div className="admin-card">
          <div className="admin-card-head">
            <div>
              <h2>Partners</h2>

              <p>
                Manage organizations and partners working with Software Empire.
              </p>
            </div>

            <button type="button" className="admin-button primary">
              <Plus size={17} />
              Add Partner
            </button>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Loading */}
          {/* ------------------------------------------------------------- */}

          {loading && (
            <div className="admin-empty-state">
              <Loader2 size={28} className="animate-spin" />

              <h3>Loading partners...</h3>

              <p>Please wait while partner data is being loaded.</p>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* Empty */}
          {/* ------------------------------------------------------------- */}

          {!loading && !error && partners.length === 0 && (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                <Building2 size={28} />
              </div>

              <h3>No partners available yet.</h3>

              <p>
                Create your first partner to make it available throughout the
                platform.
              </p>

              <button type="button" className="admin-button primary">
                <Plus size={17} />
                Add Partner
              </button>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* Partners Table */}
          {/* ------------------------------------------------------------- */}

          {!loading && !error && partners.length > 0 && (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Partner</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Website</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {partners.map((partner) => {
                    const isActive =
                      partner?.is_active === true ||
                      partner?.is_active === 1 ||
                      partner?.status === "active";

                    return (
                      <tr key={partner.id}>
                        <td>
                          <div className="admin-table-primary">
                            <div className="admin-table-icon">
                              <Building2 size={17} />
                            </div>

                            <div>
                              <strong>
                                {partner.name || "Unnamed Partner"}
                              </strong>

                              {partner.slug && <span>{partner.slug}</span>}
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="admin-table-description">
                            {partner.description || "No description available."}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`admin-status ${
                              isActive ? "active" : "inactive"
                            }`}
                          >
                            <span className="admin-status-dot" />

                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td>
                          {partner.url ? (
                            <a
                              href={partner.url}
                              target="_blank"
                              rel="noreferrer"
                              className="admin-table-link"
                            >
                              Visit website
                            </a>
                          ) : (
                            <span className="admin-table-muted">—</span>
                          )}
                        </td>

                        <td>
                          <div className="admin-table-actions">
                            <button
                              type="button"
                              className="admin-table-button"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="admin-table-button danger"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
