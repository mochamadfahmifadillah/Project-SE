import { useEffect, useState } from "react";
import { Plus, RefreshCw, Store } from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";

import { getAdminVendors } from "../../services/adminService";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadVendors() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminVendors();

      setVendors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load vendors:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load vendors.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVendors();
  }, []);

  const columns = [
    {
      key: "name",
      label: "Vendor",
    },
    {
      key: "slug",
      label: "Slug",
    },
    {
      key: "website",
      label: "Website",
      render: (row) =>
        row.website ? (
          <a href={row.website} target="_blank" rel="noreferrer">
            {row.website}
          </a>
        ) : (
          "-"
        ),
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

            <h2>Loading vendors...</h2>

            <p>We're getting the latest vendor data.</p>
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
            <Store size={28} />

            <h2>Unable to load vendors</h2>

            <p>{error}</p>

            <button type="button" className="btn primary" onClick={loadVendors}>
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

            <h1>Vendors</h1>

            <p>Manage vendors data and configuration for Software Empire.</p>
          </div>

          <div className="page-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={loadVendors}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button type="button" className="btn primary">
              <Plus size={16} />
              Add Vendor
            </button>
          </div>
        </div>

        {/* ============================================================
            VENDOR TABLE
        ============================================================ */}

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <span className="eyebrow">VENDORS</span>

              <h3>{vendors.length.toLocaleString()} Vendors</h3>
            </div>

            <Store size={20} />
          </div>

          {vendors.length > 0 ? (
            <DataTable columns={columns} data={vendors} />
          ) : (
            <div className="admin-state">
              <Store size={28} />

              <h2>No vendors yet</h2>

              <p>Add your first vendor to start managing software vendors.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
