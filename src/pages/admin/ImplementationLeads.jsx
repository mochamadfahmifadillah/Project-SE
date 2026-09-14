import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  RefreshCw,
  Search,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";
import StatusBadge from "../../components/admin/StatusBadge";
import { getAdminLeads } from "../../services/adminService";

export default function ImplementationLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  async function loadLeads() {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminLeads({
        search: search || undefined,
        status: status || undefined,
      });

      const data = response?.data || response || [];

      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load implementation leads:", err);

      setError(
        err?.message || "Unable to load implementation leads.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, [search, status]);

  const totalLeads = leads.length;

  const pendingLeads = useMemo(
    () =>
      leads.filter(
        (lead) => lead.status?.toLowerCase() === "pending",
      ).length,
    [leads],
  );

  const completedLeads = useMemo(
    () =>
      leads.filter(
        (lead) =>
          lead.status?.toLowerCase() === "completed" ||
          lead.status?.toLowerCase() === "closed",
      ).length,
    [leads],
  );

  return (
    <AdminLayout>
      <AdminHeader title="Implementation Leads" />

      <div className="admin-content">
        {/* HEADER */}
        <div className="page-head">
          <div>
            <span className="eyebrow">ENGAGEMENT</span>

            <h1>Implementation Leads</h1>

            <p>
              Manage companies requesting help with software
              implementation.
            </p>
          </div>

          <button
            type="button"
            className="btn secondary"
            onClick={loadLeads}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={loading ? "spin" : ""}
            />

            Refresh
          </button>
        </div>

        {/* SUMMARY */}
        <div className="kpi-grid">
          <div className="kpi">
            <span>Total Leads</span>
            <b>{totalLeads}</b>
            <em>All implementation requests</em>
          </div>

          <div className="kpi">
            <span>Pending</span>
            <b>{pendingLeads}</b>
            <em>Needs attention</em>
          </div>

          <div className="kpi">
            <span>Completed</span>
            <b>{completedLeads}</b>
            <em>Completed requests</em>
          </div>
        </div>

        {/* FILTERS */}
        <div className="admin-toolbar">
          <div className="admin-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search company, contact or email..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* ERROR */}
        {error && (
          <div className="admin-state admin-state-error">
            <h2>Unable to load leads</h2>

            <p>{error}</p>

            <button
              type="button"
              className="btn primary"
              onClick={loadLeads}
            >
              Try again
            </button>
          </div>
        )}

        {/* LOADING */}
        {!error && loading && (
          <div className="admin-state">
            <RefreshCw size={28} className="spin" />

            <h2>Loading implementation leads...</h2>

            <p>
              We're getting the latest implementation requests.
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!error && !loading && leads.length === 0 && (
          <div className="admin-state">
            <Building2 size={32} />

            <h2>No implementation leads</h2>

            <p>
              There are no implementation requests matching
              your current filters.
            </p>
          </div>
        )}

        {/* TABLE */}
        {!error && !loading && leads.length > 0 && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <span className="eyebrow">LEAD DATABASE</span>

                <h3>Implementation Requests</h3>
              </div>

              <span className="admin-muted">
                {leads.length} lead
                {leads.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Contact</th>
                    <th>Software</th>
                    <th>Contact Details</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      {/* COMPANY */}
                      <td>
                        <div className="table-primary">
                          <div className="table-avatar">
                            {(lead.company_name || "C")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {lead.company_name ||
                                "Unknown company"}
                            </strong>

                            <small>
                              Lead #{lead.id}
                            </small>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td>
                        <div className="table-contact">
                          <strong>
                            {lead.contact_name ||
                              "Unknown contact"}
                          </strong>

                          <small>
                            {lead.email || "No email"}
                          </small>
                        </div>
                      </td>

                      {/* SOFTWARE */}
                      <td>
                        <span className="software-pill">
                          {lead.software?.name ||
                            `Software #${lead.software_id}`}
                        </span>
                      </td>

                      {/* CONTACT DETAILS */}
                      <td>
                        <div className="contact-details">
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                            >
                              <Mail size={14} />
                              {lead.email}
                            </a>
                          )}

                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                            >
                              <Phone size={14} />
                              {lead.phone}
                            </a>
                          )}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td>
                        <StatusBadge
                          status={lead.status || "Pending"}
                        />
                      </td>

                      {/* DATE */}
                      <td>
                        <time>
                          {lead.created_at
                            ? new Date(
                                lead.created_at,
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </time>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
