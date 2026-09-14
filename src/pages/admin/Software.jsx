import { useEffect, useState } from "react";
import { RefreshCw, Plus } from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";

import { getAdminSoftware } from "../../services/softwareService";

export default function Software() {
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSoftware = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("🚀 Loading admin software...");

      const result = await getAdminSoftware();

      console.log("✅ Admin software result:", result);

      if (!Array.isArray(result)) {
        console.error("❌ Result bukan array:", result);
        setSoftware([]);
        return;
      }

      setSoftware(result);
    } catch (error) {
      console.error("❌ Admin software error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load software.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSoftware();
  }, []);

  const columns = [
    {
      key: "name",
      label: "Software",
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "rating",
      label: "Rating",
      render: (row) =>
        row.rating !== null && row.rating !== undefined
          ? `${Number(row.rating).toFixed(1)} ★`
          : "-",
    },
    {
      key: "views",
      label: "Views",
      render: (row) => Number(row.views || 0).toLocaleString(),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <StatusBadge status={row.is_active ? "Published" : "Draft"} />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-content">
        {/* HEADER */}
        <div className="page-head">
          <div>
            <span className="eyebrow">CATALOG</span>

            <h1>Software</h1>

            <p>Manage software listed on Software Empire.</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="btn"
              onClick={loadSoftware}
              disabled={loading}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button type="button" className="btn primary">
              <Plus size={16} />
              Add Software
            </button>
          </div>
        </div>

        {/* CONTENT */}

        {loading && (
          <div className="admin-card">
            <div className="admin-state">
              <h2>Loading software...</h2>

              <p>Fetching software from the server.</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="admin-card">
            <div className="admin-state admin-state-error">
              <h2>Unable to load software</h2>

              <p>{error}</p>

              <button
                type="button"
                className="btn primary"
                onClick={loadSoftware}
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="admin-card">
            {software.length === 0 ? (
              <div className="admin-state">
                <h2>No software found</h2>

                <p>The API returned an empty software list.</p>
              </div>
            ) : (
              <>
                <div className="admin-card-header">
                  <div>
                    <span className="eyebrow">SOFTWARE</span>

                    <h3>{software.length} Software</h3>
                  </div>
                </div>

                <DataTable columns={columns} data={software} />
              </>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
