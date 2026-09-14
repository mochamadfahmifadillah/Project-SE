import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Edit,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import {
  getAdminIntegrations,
  createAdminIntegration,
  updateAdminIntegration,
  deleteAdminIntegration,
} from "../../services/adminService";

export default function Integrations() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    software_id: "",
    is_active: true,
  });

  /*
  |--------------------------------------------------------------------------
  | Load Integrations
  |--------------------------------------------------------------------------
  */

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminIntegrations();

      setIntegrations(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Failed to load integrations:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load integrations."
      );

      setIntegrations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const filteredIntegrations = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return integrations;
    }

    return integrations.filter((integration) => {
      return (
        integration?.name?.toLowerCase().includes(keyword) ||
        integration?.description?.toLowerCase().includes(keyword) ||
        integration?.software?.name?.toLowerCase().includes(keyword)
      );
    });
  }, [integrations, search]);

  /*
  |--------------------------------------------------------------------------
  | Modal
  |--------------------------------------------------------------------------
  */

  const openCreateModal = () => {
    setEditingIntegration(null);

    setForm({
      name: "",
      description: "",
      software_id: "",
      is_active: true,
    });

    setModalOpen(true);
  };

  const openEditModal = (integration) => {
    setEditingIntegration(integration);

    setForm({
      name: integration?.name ?? "",
      description: integration?.description ?? "",
      software_id: integration?.software_id
        ? String(integration.software_id)
        : "",
      is_active:
        integration?.is_active === undefined
          ? true
          : Boolean(integration.is_active),
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) {
      return;
    }

    setModalOpen(false);
    setEditingIntegration(null);
  };

  /*
  |--------------------------------------------------------------------------
  | Form
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        software_id: form.software_id
          ? Number(form.software_id)
          : null,
        is_active: form.is_active,
      };

      if (editingIntegration) {
        await updateAdminIntegration(
          editingIntegration.id,
          payload
        );
      } else {
        await createAdminIntegration(payload);
      }

      setModalOpen(false);
      setEditingIntegration(null);

      await loadIntegrations();
    } catch (err) {
      console.error("Failed to save integration:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to save integration."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (integration) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${integration?.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteAdminIntegration(integration.id);

      await loadIntegrations();
    } catch (err) {
      console.error("Failed to delete integration:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to delete integration."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <AdminLayout>
      <div className="admin-content">
        {/* Page Header */}
        <div className="page-head">
          <div>
            <span className="eyebrow">ADMIN PORTAL</span>

            <h1>Integrations</h1>

            <p>
              Manage software integrations available throughout
              Software Empire.
            </p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={openCreateModal}
          >
            <Plus size={17} />
            Add Integration
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="admin-alert admin-alert-error">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Main Card */}
        <div className="admin-card integrations-card">
          <div className="admin-card-header">
            <div>
              <h2>Integrations</h2>

              <p>
                Define the integrations supported by software
                available on the platform.
              </p>
            </div>

            <button
              type="button"
              className="admin-icon-button"
              onClick={loadIntegrations}
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw
                size={17}
                className={loading ? "is-spinning" : ""}
              />
            </button>
          </div>

          {/* Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-search">
              <Search size={17} />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search integrations..."
              />
            </div>

            <div className="admin-result-count">
              {filteredIntegrations.length} integration
              {filteredIntegrations.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="admin-table-state">
              <RefreshCw
                size={22}
                className="is-spinning"
              />

              <span>Loading integrations...</span>
            </div>
          ) : filteredIntegrations.length === 0 ? (
            /* Empty */
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                <Plus size={22} />
              </div>

              <h3>
                {search
                  ? "No integrations found"
                  : "No integrations available yet."}
              </h3>

              <p>
                {search
                  ? "Try another search keyword."
                  : "Create your first integration to make it available throughout the platform."}
              </p>

              {!search && (
                <button
                  type="button"
                  className="admin-primary-button"
                  onClick={openCreateModal}
                >
                  <Plus size={17} />
                  Add Integration
                </button>
              )}
            </div>
          ) : (
            /* Table */
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Software</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th className="action-column">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredIntegrations.map(
                    (integration) => (
                      <tr key={integration.id}>
                        <td>
                          <div className="integration-name">
                            <div className="integration-avatar">
                              {integration?.name
                                ?.slice(0, 1)
                                ?.toUpperCase() || "I"}
                            </div>

                            <div>
                              <strong>
                                {integration.name}
                              </strong>

                              <span>
                                ID #{integration.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          {integration?.software?.name ||
                            integration?.software_name ||
                            "-"}
                        </td>

                        <td>
                          <span className="integration-description">
                            {integration.description ||
                              "No description provided."}
                          </span>
                        </td>

                        <td>
                          {integration.is_active ? (
                            <span className="status-badge status-active">
                              <Check size={13} />
                              Active
                            </span>
                          ) : (
                            <span className="status-badge status-inactive">
                              Inactive
                            </span>
                          )}
                        </td>

                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="admin-action-button"
                              onClick={() =>
                                openEditModal(
                                  integration
                                )
                              }
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>

                            <button
                              type="button"
                              className="admin-action-button admin-action-danger"
                              onClick={() =>
                                handleDelete(
                                  integration
                                )
                              }
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="admin-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !submitting
            ) {
              closeModal();
            }
          }}
        >
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <span className="eyebrow">
                  {editingIntegration
                    ? "EDIT INTEGRATION"
                    : "NEW INTEGRATION"}
                </span>

                <h2>
                  {editingIntegration
                    ? "Edit Integration"
                    : "Add Integration"}
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
                disabled={submitting}
              >
                <X size={19} />
              </button>
            </div>

            <form
              className="admin-form"
              onSubmit={handleSubmit}
            >
              {/* Name */}
              <div className="admin-form-group">
                <label htmlFor="integration-name">
                  Integration Name
                </label>

                <input
                  id="integration-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Slack"
                  required
                />
              </div>

              {/* Software */}
              <div className="admin-form-group">
                <label htmlFor="integration-software">
                  Software ID
                </label>

                <input
                  id="integration-software"
                  name="software_id"
                  type="number"
                  min="1"
                  value={form.software_id}
                  onChange={handleChange}
                  placeholder="Enter software ID"
                />

                <small>
                  Enter the software ID associated with this
                  integration.
                </small>
              </div>

              {/* Description */}
              <div className="admin-form-group">
                <label htmlFor="integration-description">
                  Description
                </label>

                <textarea
                  id="integration-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this integration..."
                  rows={4}
                />
              </div>

              {/* Status */}
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />

                <span>
                  <strong>Active</strong>
                  <small>
                    Make this integration available on the
                    platform.
                  </small>
                </span>
              </label>

              {/* Actions */}
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={
                    submitting || !form.name.trim()
                  }
                >
                  {submitting ? (
                    <>
                      <RefreshCw
                        size={16}
                        className="is-spinning"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      {editingIntegration
                        ? "Save Changes"
                        : "Create Integration"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}