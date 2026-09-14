import { useEffect, useState } from "react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import {
  getAdminAuditLogs,
  getAdminAuditLog,
} from "../../services/adminService";

export default function AuditLogs() {
  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [auditableType, setAuditableType] = useState("");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedLog, setSelectedLog] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Fetch Audit Logs
  |--------------------------------------------------------------------------
  */

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminAuditLogs({
        search,
        action,
        auditable_type: auditableType,
        page,
        per_page: 15,
      });

      setLogs(response?.data ?? []);

      setMeta(
        response?.meta ?? {
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: 0,
        },
      );
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);

      setError(err?.response?.data?.message || "Failed to load audit logs.");

      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial Fetch
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchAuditLogs();
  }, [page, action, auditableType]);

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    setPage(1);

    fetchAuditLogs();
  };

  /*
  |--------------------------------------------------------------------------
  | Reset Filters
  |--------------------------------------------------------------------------
  */

  const handleResetFilters = () => {
    setSearch("");
    setAction("");
    setAuditableType("");
    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Detail
  |--------------------------------------------------------------------------
  */

  const handleViewDetail = async (id) => {
    try {
      setDetailLoading(true);

      const log = await getAdminAuditLog(id);

      setSelectedLog(log);
    } catch (err) {
      console.error("Failed to fetch audit log detail:", err);

      setError(
        err?.response?.data?.message || "Failed to load audit log detail.",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Formatters
  |--------------------------------------------------------------------------
  */

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    try {
      return new Date(value).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return value;
    }
  };

  const formatJson = (value) => {
    if (!value) {
      return null;
    }

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };

  const getActionClass = (value) => {
    const actionValue = String(value || "").toLowerCase();

    if (
      actionValue.includes("delete") ||
      actionValue.includes("destroy") ||
      actionValue.includes("remove")
    ) {
      return "audit-badge audit-badge-danger";
    }

    if (
      actionValue.includes("create") ||
      actionValue.includes("store") ||
      actionValue.includes("register")
    ) {
      return "audit-badge audit-badge-success";
    }

    if (actionValue.includes("update") || actionValue.includes("edit")) {
      return "audit-badge audit-badge-warning";
    }

    if (actionValue.includes("login") || actionValue.includes("logout")) {
      return "audit-badge audit-badge-info";
    }

    return "audit-badge";
  };

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

            <h1>Audit Logs</h1>

            <p>
              Monitor administrator activities and system changes across
              Software Empire.
            </p>
          </div>

          <button
            type="button"
            className="admin-button admin-button-secondary"
            onClick={fetchAuditLogs}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ================================================================ */}
        {/* ERROR */}
        {/* ================================================================ */}

        {error && <div className="admin-alert admin-alert-danger">{error}</div>}

        {/* ================================================================ */}
        {/* FILTER CARD */}
        {/* ================================================================ */}

        <div className="admin-card audit-filter-card">
          <div className="audit-filter-header">
            <div>
              <h2>
                <Filter size={18} />
                Activity Filters
              </h2>

              <p>Search and filter administrator activity logs.</p>
            </div>

            <button
              type="button"
              className="admin-button admin-button-ghost"
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </div>

          <form className="audit-filter-grid" onSubmit={handleSearchSubmit}>
            {/* Search */}

            <div className="admin-field audit-search-field">
              <label htmlFor="audit-search">Search</label>

              <div className="audit-input-wrapper">

                <input
                  id="audit-search"
                  type="text"
                  placeholder="Search activity, user, description..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            {/* Action */}

            <div className="admin-field">
              <label htmlFor="audit-action">Action</label>

              <input
                id="audit-action"
                type="text"
                placeholder="e.g. user.login"
                value={action}
                onChange={(event) => setAction(event.target.value)}
              />
            </div>

            {/* Auditable Type */}

            <div className="admin-field">
              <label htmlFor="audit-type">Auditable Type</label>

              <input
                id="audit-type"
                type="text"
                placeholder="e.g. Software"
                value={auditableType}
                onChange={(event) => setAuditableType(event.target.value)}
              />
            </div>

            {/* Submit */}

            <div className="audit-filter-action">
              <button
                type="submit"
                className="admin-button admin-button-primary"
              >
                <Search size={16} />
                Search
              </button>
            </div>
          </form>
        </div>

        {/* ================================================================ */}
        {/* STATS */}
        {/* ================================================================ */}

        <div className="audit-stat-grid">
          <div className="audit-stat-card">
            <div className="audit-stat-icon">
              <Activity size={20} />
            </div>

            <div>
              <span>Total Logs</span>

              <strong>{meta.total ?? 0}</strong>
            </div>
          </div>

          <div className="audit-stat-card">
            <div className="audit-stat-icon">
              <Eye size={20} />
            </div>

            <div>
              <span>Current Page</span>

              <strong>{meta.current_page ?? 1}</strong>
            </div>
          </div>

          <div className="audit-stat-card">
            <div className="audit-stat-icon">
              <Activity size={20} />
            </div>

            <div>
              <span>Pages</span>

              <strong>{meta.last_page ?? 1}</strong>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* TABLE */}
        {/* ================================================================ */}

        <div className="admin-card audit-table-card">
          <div className="audit-table-header">
            <div>
              <h2>Activity Logs</h2>

              <p>{meta.total ?? 0} activity records found.</p>
            </div>
          </div>

          {loading ? (
            <div className="audit-empty-state">
              <RefreshCw size={24} className="animate-spin" />

              <p>Loading audit logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="audit-empty-state">
              <Activity size={32} />

              <h3>No audit logs found</h3>

              <p>There are no activity logs matching your current filters.</p>
            </div>
          ) : (
            <div className="audit-table-wrapper">
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>User</th>
                    <th>Target</th>
                    <th>Description</th>
                    <th>IP Address</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      {/* Action */}

                      <td>
                        <span className={getActionClass(log.action)}>
                          {log.action || "-"}
                        </span>
                      </td>

                      {/* User */}

                      <td>
                        <div className="audit-user">
                          <strong>{log.user?.name || "System"}</strong>

                          {log.user?.email && <span>{log.user.email}</span>}
                        </div>
                      </td>

                      {/* Target */}

                      <td>
                        <div className="audit-target">
                          <strong>
                            {log.auditable_type
                              ? log.auditable_type.split("\\").pop()
                              : "-"}
                          </strong>

                          {log.auditable_id && <span>#{log.auditable_id}</span>}
                        </div>
                      </td>

                      {/* Description */}

                      <td>
                        <span className="audit-description">
                          {log.description || "-"}
                        </span>
                      </td>

                      {/* IP */}

                      <td>
                        <code>{log.ip_address || "-"}</code>
                      </td>

                      {/* Date */}

                      <td>
                        <span className="audit-date">
                          {formatDate(log.created_at)}
                        </span>
                      </td>

                      {/* Action */}

                      <td>
                        <button
                          type="button"
                          className="audit-view-button"
                          onClick={() => handleViewDetail(log.id)}
                          title="View audit log"
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ============================================================ */}
          {/* PAGINATION */}
          {/* ============================================================ */}

          {!loading && logs.length > 0 && (
            <div className="audit-pagination">
              <span>
                Page {meta.current_page} of {meta.last_page}
              </span>

              <div className="audit-pagination-actions">
                <button
                  type="button"
                  disabled={meta.current_page <= 1}
                  onClick={() => setPage(Math.max(1, meta.current_page - 1))}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() =>
                    setPage(Math.min(meta.last_page, meta.current_page + 1))
                  }
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* DETAIL MODAL */}
        {/* ================================================================ */}

        {selectedLog && (
          <div
            className="audit-modal-overlay"
            onClick={() => setSelectedLog(null)}
          >
            <div
              className="audit-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="audit-modal-header">
                <div>
                  <span className="eyebrow">AUDIT LOG</span>

                  <h2>Activity Detail</h2>
                </div>

                <button
                  type="button"
                  className="audit-modal-close"
                  onClick={() => setSelectedLog(null)}
                >
                  <X size={20} />
                </button>
              </div>

              {detailLoading ? (
                <div className="audit-empty-state">
                  <RefreshCw size={22} className="animate-spin" />

                  <p>Loading detail...</p>
                </div>
              ) : (
                <div className="audit-detail">
                  {/* Basic Information */}

                  <div className="audit-detail-grid">
                    <div>
                      <span>Action</span>

                      <strong>{selectedLog.action || "-"}</strong>
                    </div>

                    <div>
                      <span>Date</span>

                      <strong>{formatDate(selectedLog.created_at)}</strong>
                    </div>

                    <div>
                      <span>User</span>

                      <strong>{selectedLog.user?.name || "System"}</strong>
                    </div>

                    <div>
                      <span>Email</span>

                      <strong>{selectedLog.user?.email || "-"}</strong>
                    </div>

                    <div>
                      <span>IP Address</span>

                      <strong>{selectedLog.ip_address || "-"}</strong>
                    </div>

                    <div>
                      <span>Auditable Type</span>

                      <strong>{selectedLog.auditable_type || "-"}</strong>
                    </div>

                    <div>
                      <span>Auditable ID</span>

                      <strong>{selectedLog.auditable_id || "-"}</strong>
                    </div>
                  </div>

                  {/* Description */}

                  <div className="audit-detail-section">
                    <h3>Description</h3>

                    <p>
                      {selectedLog.description || "No description available."}
                    </p>
                  </div>

                  {/* Old Values */}

                  {selectedLog.old_values && (
                    <div className="audit-detail-section">
                      <h3>Old Values</h3>

                      <pre>{formatJson(selectedLog.old_values)}</pre>
                    </div>
                  )}

                  {/* New Values */}

                  {selectedLog.new_values && (
                    <div className="audit-detail-section">
                      <h3>New Values</h3>

                      <pre>{formatJson(selectedLog.new_values)}</pre>
                    </div>
                  )}

                  {/* User Agent */}

                  {selectedLog.user_agent && (
                    <div className="audit-detail-section">
                      <h3>User Agent</h3>

                      <pre>{selectedLog.user_agent}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
