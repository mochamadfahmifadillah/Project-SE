export default function CompareSelector({
  software = [],
  selected = [],
  onToggle,
  max = 3,
}) {
  return (
    <div className="compare-selector">
      <div className="compare-selector-head">
        <div>
          <span className="eyebrow">SELECT SOFTWARE</span>

          <h3>Choose products to compare</h3>

          <p>Select up to {max} software products to compare side by side.</p>
        </div>

        <span className="compare-selection-count">
          {selected.length} / {max}
        </span>
      </div>

      <div className="compare-options">
        {software.map((item) => {
          const active = selected.includes(item.id);
          const disabled = !active && selected.length >= max;

          return (
            <label
              key={item.id}
              className={[
                "compare-option",
                active ? "selected" : "",
                disabled ? "disabled" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <input
                type="checkbox"
                checked={active}
                disabled={disabled}
                onChange={() => onToggle?.(item.id)}
              />

              <span className="compare-check">{active && "✓"}</span>

              <span className="compare-option-content">
                <strong>{item.name}</strong>

                <small>{item.category || "Software"}</small>
              </span>

              {active && (
                <span className="compare-selected-label">Selected</span>
              )}
            </label>
          );
        })}
      </div>

      {software.length === 0 && (
        <div className="compare-selector-empty">
          <span className="eyebrow">NO SOFTWARE FOUND</span>

          <p>There are no software products available to compare right now.</p>
        </div>
      )}

      {selected.length >= max && (
        <div className="compare-selector-hint">
          <strong>Maximum reached.</strong>

          <span>Remove a selected product before choosing another one.</span>
        </div>
      )}
    </div>
  );
}
