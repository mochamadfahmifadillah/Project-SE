import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import {
  getAdminBusinessSizes,
  createAdminBusinessSize,
  updateAdminBusinessSize,
  deleteAdminBusinessSize,
} from "../../services/adminService";

export default function BusinessSizes() {
  const [businessSizes, setBusinessSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Business Sizes
  |--------------------------------------------------------------------------
  */

  const loadBusinessSizes = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminBusinessSizes();

      setBusinessSizes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load business sizes:", err);

      setError(
        err?.response?.data?.message || "Failed to load business sizes.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadBusinessSizes();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Open Create Modal
  |--------------------------------------------------------------------------
  */

  const handleCreate = () => {
    setEditingId(null);

    setForm({
      name: "",
      description: "",
    });

    setError("");
    setShowModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Open Edit Modal
  |--------------------------------------------------------------------------
  */

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      name: item.name ?? "",
      description: item.description ?? "",
    });

    setError("");
    setShowModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Close Modal
  |--------------------------------------------------------------------------
  */

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingId(null);

    setForm({
      name: "",
      description: "",
    });

    setError("");
  };

  /*
  |--------------------------------------------------------------------------
  | Form Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Business size name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
      };

      if (editingId) {
        await updateAdminBusinessSize(editingId, payload);
      } else {
        await createAdminBusinessSize(payload);
      }

      await loadBusinessSizes();

      handleCloseModal();
    } catch (err) {
      console.error("Failed to save business size:", err);

      const validationErrors = err?.response?.data?.errors;

      if (validationErrors) {
        const firstError = Object.values(validationErrors).flat().find(Boolean);

        setError(firstError || "Failed to save business size.");
      } else {
        setError(
          err?.response?.data?.message || "Failed to save business size.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteAdminBusinessSize(item.id);

      await loadBusinessSizes();
    } catch (err) {
      console.error("Failed to delete business size:", err);

      setError(
        err?.response?.data?.message || "Failed to delete business size.",
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const filteredBusinessSizes = businessSizes.filter((item) => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return (
      item.name?.toLowerCase().includes(keyword) ||
      item.description?.toLowerCase().includes(keyword)
    );
  });

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <AdminLayout>
      <div className="admin-content business-sizes-page">
        {/* Page Header */}
        <div className="page-head">
          <div>
            <span className="eyebrow">ADMIN PORTAL</span>

            <h1>Business Sizes</h1>

            <p>Manage business size classifications for Software Empire.</p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={handleCreate}
          >
            <Plus size={17} />
            Add Business Size
          </button>
        </div>

        {/* Error */}
        {error && !showModal && (
          <div className="admin-alert error">{error}</div>
        )}

        {/* Content Card */}
        <div className="admin-card business-sizes-card">
          <div className="card-toolbar">
            <div>
              <h2>Business Sizes</h2>

              <p>
                Define the business size classifications available throughout
                the platform.
              </p>
            </div>

            <div className="business-size-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search business sizes..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th className="action-column">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="table-state">
                      Loading business sizes...
                    </td>
                  </tr>
                ) : filteredBusinessSizes.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="table-state">
                      {search
                        ? "No business sizes found."
                        : "No business sizes available yet."}
                    </td>
                  </tr>
                ) : (
                  filteredBusinessSizes.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="business-size-name">{item.name}</div>
                      </td>

                      <td>
                        <span className="description-cell">
                          {item.description || "No description"}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="icon-button edit"
                            title="Edit"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="icon-button delete"
                            title="Delete"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!loading && filteredBusinessSizes.length > 0 && (
            <div className="table-footer">
              <span>
                Showing <strong>{filteredBusinessSizes.length}</strong> business
                size
                {filteredBusinessSizes.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="modal-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                handleCloseModal();
              }
            }}
          >
            <div className="admin-modal">
              <div className="modal-header">
                <div>
                  <span className="eyebrow">BUSINESS SIZE</span>

                  <h2>
                    {editingId ? "Edit Business Size" : "Add Business Size"}
                  </h2>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  <X size={19} />
                </button>
              </div>

              <form className="business-size-form" onSubmit={handleSubmit}>
                {error && <div className="admin-alert error">{error}</div>}

                <div className="form-group">
                  <label htmlFor="business-size-name">Name</label>

                  <input
                    id="business-size-name"
                    name="name"
                    type="text"
                    placeholder="e.g. Small Business"
                    value={form.name}
                    onChange={handleChange}
                    disabled={saving}
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="business-size-description">Description</label>

                  <textarea
                    id="business-size-description"
                    name="description"
                    rows="4"
                    placeholder="Describe this business size..."
                    value={form.description}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={handleCloseModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update Business Size"
                        : "Create Business Size"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
