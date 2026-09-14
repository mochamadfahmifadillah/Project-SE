import Icon from "../common/Icon";

export default function SearchBar({
  value = "",
  onChange,
  placeholder = "Search software...",
}) {
  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">
        <Icon name="search" />
      </span>

      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        aria-label="Search software"
        autoComplete="off"
      />

      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange?.("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}