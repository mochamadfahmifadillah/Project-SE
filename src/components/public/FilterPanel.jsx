export default function FilterPanel({ filters = {}, onChange }) {
  const handleChange = (key, value) => {
    onChange?.(key, value);
  };

  return (
    <aside className="filter-panel">
      {/* HEADER */}
      <div className="filter-panel-header">
        <div>
          <span className="eyebrow">REFINE RESULTS</span>
          <h3>Filters</h3>
        </div>

        <span className="filter-count">
          {Object.values(filters).filter(Boolean).length}
        </span>
      </div>

      {/* BUSINESS SIZE */}
      <div className="filter-group">
        <label htmlFor="business-size">Business size</label>

        <select
          id="business-size"
          value={filters.businessSize || ""}
          onChange={(event) => handleChange("businessSize", event.target.value)}
        >
          <option value="">Any size</option>
          <option value="small">Small business</option>
          <option value="mid">Mid-market</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      {/* PRICING */}
      <div className="filter-group">
        <label htmlFor="pricing">Pricing</label>

        <select
          id="pricing"
          value={filters.pricing || ""}
          onChange={(event) => handleChange("pricing", event.target.value)}
        >
          <option value="">Any pricing</option>
          <option value="free">Free</option>
          <option value="subscription">Subscription</option>
        </select>
      </div>

      {/* RATING */}
      <div className="filter-group">
        <label htmlFor="rating">Minimum rating</label>

        <select
          id="rating"
          value={filters.rating || ""}
          onChange={(event) => handleChange("rating", event.target.value)}
        >
          <option value="">Any rating</option>
          <option value="4">4+ stars</option>
          <option value="4.5">4.5+ stars</option>
        </select>
      </div>

      {/* ACTIVE FILTER INFO */}
      {Object.values(filters).some(Boolean) && (
        <div className="filter-active">
          <span>Filters applied</span>

          <strong>{Object.values(filters).filter(Boolean).length}</strong>
        </div>
      )}
    </aside>
  );
}
