import { useEffect, useState } from "react";
import { FolderTree, Plus, RefreshCw } from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";

import { getAdminCategories } from "../../services/adminService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Categories
  |--------------------------------------------------------------------------
  */

  async function loadCategories(isRefresh = false) {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getAdminCategories();

      /*
      |--------------------------------------------------------------------------
      | Normalize Response
      |--------------------------------------------------------------------------
      |
      | Support:
      | - direct array
      | - { data: [] }
      |
      */

      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];

      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load categories.",
      );

      setCategories([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadCategories();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Table Columns
  |--------------------------------------------------------------------------
  */

  const columns = [
    {
      key: "name",
      label: "Category",
      render: (row) => (
        <div className="table-primary">
          <div className="table-avatar">
            <FolderTree size={16} />
          </div>

          <div>
            <strong>{row.name || "Unnamed category"}</strong>

            <small>Category #{row.id}</small>
          </div>
        </div>
      ),
    },

    {
      key: "slug",
      label: "Slug",
      render: (row) => <code className="table-code">{row.slug || "-"}</code>,
    },

    {
      key: "description",
      label: "Description",
      render: (row) => (
        <span className="description-cell">
          {row.description || "No description"}
        </span>
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

            <h2>Loading categories...</h2>

            <p>We're getting the latest category data.</p>
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
            <FolderTree size={28} />

            <h2>Unable to load categories</h2>

            <p>{error}</p>

            <button
              type="button"
              className="btn primary"
              onClick={() => loadCategories()}
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
      <div className="admin-content categories-page">
        {/* ================================================================
            PAGE HEADER
        ================================================================ */}

        <div className="page-head">
          <div>
            <span className="eyebrow">CATALOG</span>

            <h1>Categories</h1>

            <p>
              Manage software categories available throughout Software Empire.
            </p>
          </div>

          <div className="page-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => loadCategories(true)}
              disabled={refreshing}
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button
              type="button"
              className="btn primary"
              onClick={() => {
                /*
                 * TODO:
                 * Connect to category create modal/page
                 * after create endpoint/UI is ready.
                 */
              }}
            >
              <Plus size={16} />
              Add Category
            </button>
          </div>
        </div>

        {/* ================================================================
            CONTENT
        ================================================================ */}

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <span className="eyebrow">CATEGORIES</span>

              <h3>
                {categories.length.toLocaleString()}{" "}
                {categories.length === 1 ? "Category" : "Categories"}
              </h3>

              <p>Organize software into categories to make discovery easier.</p>
            </div>

            <FolderTree size={20} />
          </div>

          {categories.length > 0 ? (
            <DataTable columns={columns} data={categories} />
          ) : (
            <div className="admin-state">
              <FolderTree size={28} />

              <h2>No categories yet</h2>

              <p>Add your first category to start organizing software.</p>

              <button type="button" className="btn primary">
                <Plus size={16} />
                Add Category
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
