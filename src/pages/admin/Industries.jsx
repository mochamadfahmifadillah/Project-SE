import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw, Factory } from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";

import { getAdminIndustries } from "../../services/adminService";

export default function Industries() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadIndustries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminIndustries();

      setIndustries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load industries:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load industries.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIndustries();
  }, [loadIndustries]);

  const columns = [
    {
      key: "name",
      label: "Industry",
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

            <h2>Loading industries...</h2>

            <p>We're getting the latest industry data.</p>
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
            <Factory size={28} />

            <h2>Unable to load industries</h2>

            <p>{error}</p>

            <button
              type="button"
              className="btn primary"
              onClick={loadIndustries}
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
      <div className="admin-content industries-page">
        {/* ============================================================
            PAGE HEADER
        ============================================================ */}

        <div className="page-head">
          <div>
            <span className="eyebrow">CATALOG</span>

            <h1>Industries</h1>

            <p>Manage industries data and configuration for Software Empire.</p>
          </div>

          <div className="page-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={loadIndustries}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button type="button" className="btn primary">
              <Plus size={16} />
              Add Industry
            </button>
          </div>
        </div>

        {/* ============================================================
            INDUSTRY TABLE
        ============================================================ */}

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <span className="eyebrow">INDUSTRIES</span>

              <h3>{industries.length.toLocaleString()} Industries</h3>
            </div>

            <Factory size={20} />
          </div>

          {industries.length > 0 ? (
            <DataTable columns={columns} data={industries} />
          ) : (
            <div className="admin-state">
              <Factory size={28} />

              <h2>No industries yet</h2>

              <p>
                Add your first industry to start managing software industries.
              </p>

              <button type="button" className="btn primary">
                <Plus size={16} />
                Add Industry
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
