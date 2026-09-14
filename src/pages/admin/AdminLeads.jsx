import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";
import StatusBadge from "../../components/admin/StatusBadge";

import { getAdminLeads } from "../../services/adminService";

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All statuses",
  },
  {
    value: "NEW",
    label: "New",
  },
  {
    value: "ASSIGNED",
    label: "Assigned",
  },
  {
    value: "CONTACTED",
    label: "Contacted",
  },
  {
    value: "QUALIFIED",
    label: "Qualified",
  },
  {
    value: "PROPOSAL_SENT",
    label: "Proposal Sent",
  },
  {
    value: "WON",
    label: "Won",
  },
  {
    value: "LOST",
    label: "Lost",
  },
];

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  /*
  |--------------------------------------------------------------------------
  | Load Leads
  |--------------------------------------------------------------------------
  */

  async function loadLeads(
    currentPage = page,
    currentSearch = search,
    currentStatus = status,
  ) {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: currentPage,
        per_page: 15,
      };

      /*
      |--------------------------------------------------------------------------
      | Search
      |--------------------------------------------------------------------------
      */

      if (currentSearch.trim()) {
        params.search = currentSearch.trim();
      }

      /*
      |--------------------------------------------------------------------------
      | Status
      |--------------------------------------------------------------------------
      */

      if (currentStatus !== "all") {
        params.status = currentStatus;
      }

      const response = await getAdminLeads(params);

      /*
      |--------------------------------------------------------------------------
      | Laravel Response
      |--------------------------------------------------------------------------
      |
      | {
      |   success: true,
      |   data: [],
      |   meta: {
      |      current_page,
      |      last_page,
      |      per_page,
      |      total
      |   }
      | }
      |
      */

      const data = response?.data || [];

      const responseMeta = response?.meta || {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
      };

      setLeads(Array.isArray(data) ? data : []);

      setMeta({
        current_page: responseMeta.current_page ?? 1,

        last_page: responseMeta.last_page ?? 1,

        per_page: responseMeta.per_page ?? 15,

        total: responseMeta.total ?? 0,
      });
    } catch (err) {
      console.error("Failed to load implementation leads:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load implementation leads.",
      );

      setLeads([]);
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
    loadLeads(1, "", "all");
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Search / Status Change
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);

      loadLeads(1, search, status);
    }, 400);

    return () => clearTimeout(timer);
  }, [search, status]);

  /*
  |--------------------------------------------------------------------------
  | Summary
  |--------------------------------------------------------------------------
  |
  | Summary dihitung dari data yang tersedia di halaman saat ini.
  | Total keseluruhan menggunakan meta.total dari backend.
  |
  */

  const summary = useMemo(() => {
    const total = meta.total || 0;

    const newLeads = leads.filter((lead) => lead.status === "NEW").length;

    const contacted = leads.filter(
      (lead) => lead.status === "CONTACTED",
    ).length;

    const qualified = leads.filter(
      (lead) => lead.status === "QUALIFIED",
    ).length;

    const won = leads.filter((lead) => lead.status === "WON").length;

    return {
      total,
      newLeads,
      contacted,
      qualified,
      won,
    };
  }, [leads, meta.total]);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  function handlePageChange(nextPage) {
    if (nextPage < 1) {
      return;
    }

    if (nextPage > meta.last_page) {
      return;
    }

    setPage(nextPage);

    loadLeads(nextPage, search, status);
  }

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  function formatStatus(statusValue) {
    if (!statusValue) {
      return "NEW";
    }

    return statusValue;
  }

  function formatDate(date) {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <AdminLayout>
      <AdminHeader title="Implementation Leads" />

      <div className="admin-content">
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="page-head">
          <div>
            <span className="eyebrow">ENGAGEMENT</span>

            <h1>Implementation Leads</h1>

            <p>
              Manage software implementation requests submitted by businesses.
            </p>
          </div>

          <button
            type="button"
            className="btn secondary"
            onClick={() => loadLeads(page, search, status)}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            Refresh
          </button>
        </div>

        {/* =====================================================
            SUMMARY
        ===================================================== */}

        <div className="kpi-grid">
          {/* TOTAL */}

          <div className="kpi">
            <span>Total Leads</span>

            <b>{summary.total}</b>

            <em>All implementation requests</em>
          </div>

          {/* NEW */}

          <div className="kpi">
            <span>New</span>

            <b>{summary.newLeads}</b>

            <em>Awaiting assignment</em>
          </div>

          {/* CONTACTED */}

          <div className="kpi">
            <span>Contacted</span>

            <b>{summary.contacted}</b>

            <em>Leads already contacted</em>
          </div>

          {/* QUALIFIED */}

          <div className="kpi">
            <span>Qualified</span>

            <b>{summary.qualified}</b>

            <em>Qualified opportunities</em>
          </div>

          {/* WON */}

          <div className="kpi">
            <span>Won</span>

            <b>{summary.won}</b>

            <em>Successful implementations</em>
          </div>
        </div>

        {/* =====================================================
            FILTER BAR
        ===================================================== */}

        <div className="admin-toolbar">
          {/* SEARCH */}

          <div className="admin-search">
            <Search size={17} />

            <input
              type="text"
              value={search}
              placeholder="Search company, contact, email..."
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {/* STATUS */}

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="admin-state admin-state-error">
            <div className="admin-state-icon">!</div>

            <h2>Unable to load implementation leads</h2>

            <p>{error}</p>

            <button
              type="button"
              className="btn primary"
              onClick={() => loadLeads(page, search, status)}
            >
              Try again
            </button>
          </div>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}

        {!error && loading && (
          <div className="admin-state">
            <RefreshCw size={28} className="spin" />

            <h2>Loading implementation leads...</h2>

            <p>We're getting the latest requests from the platform.</p>
          </div>
        )}

        {/* =====================================================
            EMPTY
        ===================================================== */}

        {!error && !loading && leads.length === 0 && (
          <div className="admin-state">
            <Building2 size={32} />

            <h2>
              {meta.total === 0
                ? "No implementation leads yet"
                : "No leads found"}
            </h2>

            <p>
              {meta.total === 0
                ? "Implementation requests submitted by users will appear here."
                : "Try changing your search or status filter."}
            </p>
          </div>
        )}

        {/* =====================================================
            TABLE
        ===================================================== */}

        {!error && !loading && leads.length > 0 && (
          <div className="admin-card">
            {/* HEADER */}

            <div className="admin-card-header">
              <div>
                <span className="eyebrow">LEAD DATABASE</span>

                <h3>Implementation Requests</h3>
              </div>

              <span className="admin-muted">
                {meta.total} {meta.total === 1 ? "lead" : "leads"}
              </span>
            </div>

            {/* TABLE */}

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company</th>

                    <th>Contact</th>

                    <th>Software</th>

                    <th>Status</th>

                    <th>Assigned To</th>

                    <th>Submitted</th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      {/* =================================================
                              COMPANY
                          ================================================= */}

                      <td>
                        <div className="table-primary">
                          <div className="table-avatar">
                            {(lead.company_name || "CO")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {lead.company_name || "Unknown company"}
                            </strong>

                            <small>Lead #{lead.id}</small>
                          </div>
                        </div>
                      </td>

                      {/* =================================================
                              CONTACT
                          ================================================= */}

                      <td>
                        <div className="table-contact">
                          <strong>
                            {lead.contact_name || "Unknown contact"}
                          </strong>

                          {lead.email && (
                            <a href={`mailto:${lead.email}`}>
                              <Mail size={13} />

                              {lead.email}
                            </a>
                          )}

                          {lead.phone && (
                            <a href={`tel:${lead.phone}`}>
                              <Phone size={13} />

                              {lead.phone}
                            </a>
                          )}
                        </div>
                      </td>

                      {/* =================================================
                              SOFTWARE
                          ================================================= */}

                      <td>
                        <div className="software-cell">
                          <span className="software-icon">
                            <Building2 size={15} />
                          </span>

                          <div>
                            <strong>
                              {lead.software?.name ||
                                `Software #${lead.software_id}`}
                            </strong>

                            {lead.software?.slug && (
                              <small>{lead.software.slug}</small>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* =================================================
                              STATUS
                          ================================================= */}

                      <td>
                        <StatusBadge status={formatStatus(lead.status)} />
                      </td>

                      {/* =================================================
                              ASSIGNED ADMIN
                          ================================================= */}

                      <td>
                        {lead.assignedAdmin ? (
                          <div className="table-contact">
                            <strong>{lead.assignedAdmin.name}</strong>

                            {lead.assignedAdmin.email && (
                              <a href={`mailto:${lead.assignedAdmin.email}`}>
                                <Mail size={13} />

                                {lead.assignedAdmin.email}
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="admin-muted">Unassigned</span>
                        )}
                      </td>

                      {/* =================================================
                              DATE
                          ================================================= */}

                      <td>
                        <div className="date-cell">
                          <CalendarDays size={14} />

                          <span>{formatDate(lead.created_at)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* =================================================
                  MESSAGE PREVIEW
              ================================================= */}

            {leads.some((lead) => lead.message) && (
              <div className="lead-messages">
                {leads.map((lead) =>
                  lead.message ? (
                    <div className="lead-message" key={`message-${lead.id}`}>
                      <MessageSquare size={15} />

                      <div>
                        <strong>
                          {lead.company_name || "Unknown company"}
                        </strong>

                        <p>{lead.message}</p>
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            )}

            {/* =================================================
                  PAGINATION
              ================================================= */}

            {meta.last_page > 1 && (
              <div className="admin-pagination">
                <button
                  type="button"
                  className="btn secondary"
                  disabled={page <= 1 || loading}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </button>

                <span>
                  Page <strong>{meta.current_page}</strong> of{" "}
                  <strong>{meta.last_page}</strong>
                </span>

                <button
                  type="button"
                  className="btn secondary"
                  disabled={page >= meta.last_page || loading}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
