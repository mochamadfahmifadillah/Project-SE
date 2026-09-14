const STATUS_CONFIG = {
  operational: {
    label: "Operational",
    className: "operational",
  },

  active: {
    label: "Active",
    className: "active",
  },

  inactive: {
    label: "Inactive",
    className: "inactive",
  },

  pending: {
    label: "Pending",
    className: "pending",
  },

  approved: {
    label: "Approved",
    className: "approved",
  },

  rejected: {
    label: "Rejected",
    className: "rejected",
  },

  completed: {
    label: "Completed",
    className: "completed",
  },

  cancelled: {
    label: "Cancelled",
    className: "cancelled",
  },
};

export default function StatusBadge({ status = "Operational" }) {
  const normalized = String(status || "Operational")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  const config = STATUS_CONFIG[normalized] || {
    label: status || "Unknown",
    className: "unknown",
  };

  return (
    <span className={`admin-status-badge ${config.className}`}>
      <span className="admin-status-dot" />
      {config.label}
    </span>
  );
}
