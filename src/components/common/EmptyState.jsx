export default function EmptyState({
  title = "No data found",
  message = "There is nothing to display yet.",
  action = null,
}) {
  return (
    <div className="admin-empty-state">
      <div className="admin-empty-state-icon">
        <span>○</span>
      </div>

      <h3>{title}</h3>

      <p>{message}</p>

      {action && <div className="admin-empty-state-action">{action}</div>}
    </div>
  );
}
