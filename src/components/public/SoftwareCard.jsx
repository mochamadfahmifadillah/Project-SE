import Rating from "./Rating";

export default function SoftwareCard({
  item = {},
  selected = false,
  onSelect,
}) {
  const name = item?.name || "Software";

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <article className={`software-card ${selected ? "selected" : ""}`}>
      {/* =====================================================
          LOGO
      ====================================================== */}
      <div className="software-logo" aria-hidden="true">
        {initials}
      </div>

      <div className="card-body">
        {/* ===================================================
            CATEGORY + TAG
        ==================================================== */}
        <div className="row-between">
          <span className="eyebrow">{item?.category || "SOFTWARE"}</span>

          {item?.tag && <span className="tag">{item.tag}</span>}
        </div>

        {/* ===================================================
            NAME
        ==================================================== */}
        <h3>{name}</h3>

        {/* ===================================================
            RATING
        ==================================================== */}
        <Rating rating={item?.rating || 0} reviews={item?.reviews || 1240} />

        {/* ===================================================
            DESCRIPTION
        ==================================================== */}
        <p className="software-card-description">
          {item?.description ||
            "Flexible business software with configurable workflows, integrations and analytics."}
        </p>

        {/* ===================================================
            META
        ==================================================== */}
        <div className="card-meta">
          <span>{item?.price || "Contact vendor"}</span>

          <span className="card-details">
            View details
            <span aria-hidden="true">→</span>
          </span>
        </div>

        {/* ===================================================
            COMPARE
        ==================================================== */}
        {onSelect && (
          <label className={`software-compare ${selected ? "selected" : ""}`}>
            <input type="checkbox" checked={selected} onChange={onSelect} />

            <span className="software-compare-box">{selected && "✓"}</span>

            <span>Add to compare</span>
          </label>
        )}
      </div>
    </article>
  );
}
