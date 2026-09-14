import { useEffect, useState } from "react";
import { Plus, RefreshCw, Sparkles } from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";

import { getAdminFeatures } from "../../services/adminService";

export default function Features() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFeatures() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminFeatures();

      setFeatures(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load features:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load features.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeatures();
  }, []);

  const columns = [
    {
      key: "name",
      label: "Feature",
    },
    {
      key: "slug",
      label: "Slug",
    },
    {
      key: "description",
      label: "Description",
      render: (row) => row.description || "-",
    },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <StatusBadge status={row.is_active ? "Published" : "Draft"} />
      ),
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-content">
          <div className="admin-state">
            <RefreshCw size={28} className="animate-spin" />

            <h2>Loading features...</h2>

            <p>We're getting the latest feature data.</p>
          </div>
        </div>
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
        <div className="admin-content">
          <div className="admin-state admin-state-error">
            <Sparkles size={28} />

            <h2>Unable to load features</h2>

            <p>{error}</p>

            <button
              type="button"
              className="btn primary"
              onClick={loadFeatures}
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <AdminLayout>
      <div className="admin-content">
        {/* ============================================================
            PAGE HEADER
        ============================================================ */}

        <div className="page-head">
          <div>
            <span className="eyebrow">CATALOG</span>

            <h1>Features</h1>

            <p>Manage features data and configuration for Software Empire.</p>
          </div>

          <div className="page-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={loadFeatures}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button type="button" className="btn primary">
              <Plus size={16} />
              Add Feature
            </button>
          </div>
        </div>

        {/* ============================================================
            FEATURE TABLE
        ============================================================ */}

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <span className="eyebrow">FEATURES</span>

              <h3>{features.length.toLocaleString()} Features</h3>
            </div>

            <Sparkles size={20} />
          </div>

          {features.length > 0 ? (
            <DataTable columns={columns} data={features} />
          ) : (
            <div className="admin-state">
              <Sparkles size={28} />

              <h2>No features yet</h2>

              <p>Add your first feature to start managing software features.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
