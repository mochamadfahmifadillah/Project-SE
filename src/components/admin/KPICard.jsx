export default function KPICard({
  title,
  value,
  change,
  changeLabel = "vs last period",
  icon: Icon,
}) {
  const hasChange = change !== undefined && change !== null;
  const isPositive = Number(change) >= 0;

  return (
    <div className="admin-kpi-card">
      <div className="admin-kpi-top">
        <span className="admin-kpi-title">{title}</span>

        {Icon && (
          <div className="admin-kpi-icon">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="admin-kpi-value">{value ?? "—"}</div>

      {hasChange && (
        <div className="admin-kpi-change">
          <em className={isPositive ? "positive" : "negative"}>
            {isPositive ? "↑" : "↓"} {Math.abs(Number(change))}%
          </em>

          <span>{changeLabel}</span>
        </div>
      )}
    </div>
  );
}
