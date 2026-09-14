import { useEffect, useMemo, useState } from "react";
import {
  Edit,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";

import {
  createAdminUser,
  deleteAdminUser,
  getAdminRoles,
  getAdminUsers,
  updateAdminUser,
} from "../../services/adminService";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  roles: [],
};

const DEFAULT_META = {
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
};

/*
|--------------------------------------------------------------------------
| Users Roles Page
|--------------------------------------------------------------------------
*/

export default function UsersRoles() {
  /*
  |--------------------------------------------------------------------------
  | Users
  |--------------------------------------------------------------------------
  */

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [meta, setMeta] = useState(DEFAULT_META);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | UI State
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Modal
  |--------------------------------------------------------------------------
  */

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  /*
  |--------------------------------------------------------------------------
  | Load Roles
  |--------------------------------------------------------------------------
  */

  async function loadRoles() {
    try {
      setRolesLoading(true);

      const response = await getAdminRoles();

      setRoles(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load roles:", err);

      setError(err?.response?.data?.message || "Failed to load roles.");
    } finally {
      setRolesLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Load Users
  |--------------------------------------------------------------------------
  */

  async function loadUsers(customPage = page) {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminUsers({
        search,
        role: roleFilter,
        page: customPage,
        per_page: 15,
      });

      setUsers(Array.isArray(response?.data) ? response.data : []);

      setMeta(response?.meta ?? DEFAULT_META);
    } catch (err) {
      console.error("Failed to load users:", err);

      setUsers([]);

      setError(err?.response?.data?.message || "Failed to load users.");
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
    loadRoles();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Reload Users
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadUsers(page);
  }, [page, roleFilter]);

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  function handleSearchSubmit(event) {
    event.preventDefault();

    setPage(1);
    loadUsers(1);
  }

  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  async function handleRefresh() {
    setSuccess("");
    setError("");

    await Promise.all([loadUsers(page), loadRoles()]);
  }

  /*
  |--------------------------------------------------------------------------
  | Open Create Modal
  |--------------------------------------------------------------------------
  */

  function openCreateModal() {
    setEditingUser(null);

    setForm({
      ...EMPTY_FORM,
      roles: [],
    });

    setError("");
    setSuccess("");

    setModalOpen(true);
  }

  /*
  |--------------------------------------------------------------------------
  | Open Edit Modal
  |--------------------------------------------------------------------------
  */

  function openEditModal(user) {
    const userRoles = Array.isArray(user?.roles)
      ? user.roles.map((role) => role.id)
      : [];

    setEditingUser(user);

    setForm({
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      roles: userRoles,
    });

    setError("");
    setSuccess("");

    setModalOpen(true);
  }

  /*
  |--------------------------------------------------------------------------
  | Close Modal
  |--------------------------------------------------------------------------
  */

  function closeModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditingUser(null);
    setForm(EMPTY_FORM);
  }

  /*
  |--------------------------------------------------------------------------
  | Form Change
  |--------------------------------------------------------------------------
  */

  function handleInputChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | Role Change
  |--------------------------------------------------------------------------
  */

  function handleRoleChange(roleId) {
    const numericRoleId = Number(roleId);

    setForm((current) => {
      const exists = current.roles.includes(numericRoleId);

      return {
        ...current,
        roles: exists
          ? current.roles.filter((id) => id !== numericRoleId)
          : [...current.roles, numericRoleId],
      };
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Submit User
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.name.trim()) {
        setError("Name is required.");
        return;
      }

      if (!form.email.trim()) {
        setError("Email is required.");
        return;
      }

      if (!editingUser && !form.password) {
        setError("Password is required.");
        return;
      }

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        roles: form.roles,
      };

      /*
      |--------------------------------------------------------------------------
      | Password
      |--------------------------------------------------------------------------
      |
      | Password hanya dikirim ketika:
      |
      | - Create user
      | - Edit user dan password diisi
      |
      */

      if (form.password.trim()) {
        payload.password = form.password;
      }

      if (editingUser) {
        await updateAdminUser(editingUser.id, payload);

        setSuccess("User updated successfully.");
      } else {
        await createAdminUser(payload);

        setSuccess("User created successfully.");
      }

      setModalOpen(false);
      setEditingUser(null);
      setForm(EMPTY_FORM);

      await loadUsers(page);
    } catch (err) {
      console.error("Failed to save user:", err);

      setError(
        err?.response?.data?.message || err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : "Failed to save user.",
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Delete User
  |--------------------------------------------------------------------------
  */

  async function handleDelete(user) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(user.id);
      setError("");
      setSuccess("");

      await deleteAdminUser(user.id);

      setSuccess("User deleted successfully.");

      /*
      |--------------------------------------------------------------------------
      | If current page becomes empty,
      | go back one page.
      |--------------------------------------------------------------------------
      */

      if (users.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadUsers(page);
      }
    } catch (err) {
      console.error("Failed to delete user:", err);

      setError(err?.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  function goToPage(nextPage) {
    if (nextPage < 1 || nextPage > meta.last_page) {
      return;
    }

    setPage(nextPage);
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const statistics = useMemo(() => {
    const totalUsers = meta.total ?? 0;

    const adminCount = users.filter(
      (user) =>
        Array.isArray(user.roles) &&
        user.roles.some((role) => role.name === "admin"),
    ).length;

    const regularUsers = users.filter(
      (user) =>
        !Array.isArray(user.roles) ||
        !user.roles.some((role) => role.name === "admin"),
    ).length;

    return {
      totalUsers,
      adminCount,
      regularUsers,
    };
  }, [users, meta.total]);

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <AdminLayout>
      <div className="admin-content">
        {/* ================================================================ */}
        {/* PAGE HEADER */}
        {/* ================================================================ */}

        <div className="page-head">
          <div>
            <span className="eyebrow">ADMIN PORTAL</span>

            <h1>Users & Roles</h1>

            <p>
              Manage users, roles, and access configuration for Software Empire.
            </p>
          </div>

          <div className="page-head-actions">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={handleRefresh}
              disabled={loading || rolesLoading}
            >
              <RefreshCw size={16} className={loading ? "spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={openCreateModal}
            >
              <Plus size={17} />
              Add User
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* ALERTS */}
        {/* ================================================================ */}

        {error && (
          <div className="admin-alert admin-alert-error">
            <div>
              <strong>Something went wrong</strong>

              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {success && (
          <div className="admin-alert admin-alert-success">
            <div>
              <strong>Success</strong>

              <p>{success}</p>
            </div>

            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Close success"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* ================================================================ */}
        {/* STATISTICS */}
        {/* ================================================================ */}

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Users size={20} />
            </div>

            <div>
              <span>Total Users</span>

              <strong>{statistics.totalUsers}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Shield size={20} />
            </div>

            <div>
              <span>Admins</span>

              <strong>{statistics.adminCount}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <User size={20} />
            </div>

            <div>
              <span>Users</span>

              <strong>{statistics.regularUsers}</strong>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* USERS CARD */}
        {/* ================================================================ */}

        <div className="admin-card">
          {/* -------------------------------------------------------------- */}
          {/* Toolbar */}
          {/* -------------------------------------------------------------- */}

          <div className="admin-card-head">
            <div>
              <h2>User Management</h2>

              <p>Manage accounts and assign roles to users.</p>
            </div>
          </div>

          <div className="admin-toolbar">
            {/* Search */}

            <form className="admin-search" onSubmit={handleSearchSubmit}>
              <Search size={17} />

              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);

                    setTimeout(() => loadUsers(1), 0);
                  }}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </form>

            {/* Role Filter */}

            <select
              className="admin-select"
              value={roleFilter}
              onChange={(event) => {
                setRoleFilter(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All Roles</option>

              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.display_name || role.name}
                </option>
              ))}
            </select>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Table */}
          {/* -------------------------------------------------------------- */}

          <div className="admin-table-wrap">
            {loading ? (
              <div className="admin-loading">
                <RefreshCw size={22} className="spin" />

                <span>Loading users...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">
                  <Users size={24} />
                </div>

                <h3>No users found</h3>

                <p>Try changing your search or role filter.</p>

                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={openCreateModal}
                >
                  <Plus size={16} />
                  Add User
                </button>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>

                    <th>Email</th>

                    <th>Roles</th>

                    <th>Created</th>

                    <th className="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>

                          <div>
                            <strong>{user.name}</strong>

                            <span>ID #{user.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-email">{user.email}</span>
                      </td>

                      <td>
                        <div className="role-list">
                          {Array.isArray(user.roles) &&
                          user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <span
                                key={role.id}
                                className={
                                  role.name === "admin"
                                    ? "role-badge role-badge-admin"
                                    : "role-badge"
                                }
                              >
                                {role.display_name || role.name}
                              </span>
                            ))
                          ) : (
                            <span className="role-badge role-badge-muted">
                              No Role
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "-"}
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            title="Edit user"
                            onClick={() => openEditModal(user)}
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            type="button"
                            className="icon-btn icon-btn-danger"
                            title="Delete user"
                            disabled={deletingId === user.id}
                            onClick={() => handleDelete(user)}
                          >
                            {deletingId === user.id ? (
                              <RefreshCw size={16} className="spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Pagination */}
          {/* -------------------------------------------------------------- */}

          {!loading && users.length > 0 && (
            <div className="admin-pagination">
              <span>
                Showing page <strong>{meta.current_page}</strong> of{" "}
                <strong>{meta.last_page}</strong> ·{" "}
                <strong>{meta.total}</strong> users
              </span>

              <div className="pagination-actions">
                <button
                  type="button"
                  className="admin-pagination-btn"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                >
                  Previous
                </button>

                <span className="pagination-current">{meta.current_page}</span>

                <button
                  type="button"
                  className="admin-pagination-btn"
                  disabled={page >= meta.last_page}
                  onClick={() => goToPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* ROLES CARD */}
        {/* ================================================================ */}

        <div className="admin-card">
          <div className="admin-card-head">
            <div>
              <h2>Available Roles</h2>

              <p>Roles available for assigning to users.</p>
            </div>
          </div>

          {rolesLoading ? (
            <div className="admin-loading admin-loading-small">
              <RefreshCw size={18} className="spin" />

              <span>Loading roles...</span>
            </div>
          ) : roles.length === 0 ? (
            <div className="admin-empty admin-empty-small">
              <Shield size={22} />

              <p>No roles available.</p>
            </div>
          ) : (
            <div className="roles-grid">
              {roles.map((role) => (
                <div className="role-card" key={role.id}>
                  <div className="role-card-icon">
                    <Shield size={18} />
                  </div>

                  <div>
                    <strong>{role.display_name || role.name}</strong>

                    <span>{role.name}</span>

                    {role.description && <p>{role.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* USER MODAL */}
      {/* ================================================================== */}

      {modalOpen && (
        <div
          className="admin-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="admin-modal">
            {/* ------------------------------------------------------------ */}
            {/* Modal Header */}
            {/* ------------------------------------------------------------ */}

            <div className="admin-modal-head">
              <div>
                <span className="eyebrow">USER MANAGEMENT</span>

                <h2>{editingUser ? "Edit User" : "Add User"}</h2>

                <p>
                  {editingUser
                    ? "Update user information and assigned roles."
                    : "Create a new Software Empire user account."}
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={19} />
              </button>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Form */}
            {/* ------------------------------------------------------------ */}

            <form onSubmit={handleSubmit} className="admin-form">
              {/* Name */}

              <div className="form-group">
                <label htmlFor="user-name">Name</label>

                <input
                  id="user-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  autoComplete="name"
                  disabled={saving}
                />
              </div>

              {/* Email */}

              <div className="form-group">
                <label htmlFor="user-email">Email</label>

                <input
                  id="user-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  autoComplete="email"
                  disabled={saving}
                />
              </div>

              {/* Password */}

              <div className="form-group">
                <label htmlFor="user-password">
                  Password
                  {editingUser && (
                    <span className="optional-label">Optional</span>
                  )}
                </label>

                <input
                  id="user-password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleInputChange}
                  placeholder={
                    editingUser
                      ? "Leave blank to keep current password"
                      : "Minimum 8 characters"
                  }
                  autoComplete={editingUser ? "new-password" : "new-password"}
                  disabled={saving}
                />
              </div>

              {/* Roles */}

              <div className="form-group">
                <label>Roles</label>

                <div className="role-selector">
                  {rolesLoading ? (
                    <div className="role-selector-loading">
                      <RefreshCw size={15} className="spin" />
                      Loading roles...
                    </div>
                  ) : roles.length === 0 ? (
                    <p className="form-help">No roles available.</p>
                  ) : (
                    roles.map((role) => {
                      const selected = form.roles.includes(role.id);

                      return (
                        <label
                          key={role.id}
                          className={`role-option ${
                            selected ? "role-option-selected" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => handleRoleChange(role.id)}
                            disabled={saving}
                          />

                          <div>
                            <strong>{role.display_name || role.name}</strong>

                            <span>{role.name}</span>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>

                <span className="form-help">
                  A user can have one or more roles.
                </span>
              </div>

              {/* ---------------------------------------------------------- */}
              {/* Form Error */}
              {/* ---------------------------------------------------------- */}

              {error && <div className="form-error">{error}</div>}

              {/* ---------------------------------------------------------- */}
              {/* Modal Footer */}
              {/* ---------------------------------------------------------- */}

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <RefreshCw size={16} className="spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingUser ? <Edit size={16} /> : <Plus size={16} />}

                      {editingUser ? "Update User" : "Create User"}
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
