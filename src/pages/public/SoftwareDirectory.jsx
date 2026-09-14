import { useEffect, useMemo, useState } from "react";

import PublicLayout from "../../layouts/PublicLayout";
import Icon from "../../components/common/Icon";
import { getSoftware } from "../../services/softwareService";
import { navigate } from "../../utils/helpers";
import "../../styles/softwareDirectory.css"
const PAGE_SIZE = 5;

const getCategory = (item) =>
  item?.category?.name || item?.category_name || item?.category || "Other";

const getRating = (item) =>
  Number(item?.rating ?? item?.average_rating ?? item?.reviews_avg_rating ?? 0);

const getReviews = (item) =>
  Number(
    item?.reviews_count ?? item?.review_count ?? item?.reviews?.length ?? 0,
  );

const getPrice = (item) =>
  item?.starting_price ??
  item?.price ??
  item?.pricing ??
  item?.min_price ??
  null;

const getPricingModel = (item) =>
  item?.pricing_model ||
  item?.pricingModel ||
  item?.pricing_type ||
  item?.plan_type ||
  "";

const getDescription = (item) =>
  item?.short_description ||
  item?.description ||
  item?.summary ||
  "Software solution designed to help businesses work more efficiently.";

const getLogo = (item) =>
  item?.logo ||
  item?.logo_url ||
  item?.image ||
  item?.image_url ||
  item?.icon ||
  null;

function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "Contact";
  }

  if (typeof value === "string") {
    return value;
  }

  return `$${Number(value).toLocaleString("en-US")}`;
}

function getInitial(name = "") {
  return name.trim().charAt(0).toUpperCase() || "S";
}

function getRatingStars(rating) {
  return Array.from({ length: 5 }, (_, index) => {
    const filled = index < Math.round(rating);

    return (
      <span
        key={index}
        className={filled ? "rating-star active" : "rating-star"}
      >
        ★
      </span>
    );
  });
}

export default function SoftwareDirectory() {
  const [software, setSoftware] = useState([]);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [pricing, setPricing] = useState("All Pricing");
  const [businessSize, setBusinessSize] = useState("All Sizes");
  const [ratingFilter, setRatingFilter] = useState("All Ratings");

  const [sortBy, setSortBy] = useState("popular");

  const [selectedSoftware, setSelectedSoftware] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD SOFTWARE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    async function loadSoftware() {
      try {
        setLoading(true);
        setError("");

        const response = await getSoftware();

        if (cancelled) return;

        const items =
          response?.data?.data ||
          response?.data ||
          response?.software ||
          response ||
          [];

        setSoftware(Array.isArray(items) ? items : []);
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load software:", err);

        setError(err?.message || "Failed to load software. Please try again.");

        setSoftware([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSoftware();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CATEGORY COUNTS
  |--------------------------------------------------------------------------
  */

  const categoryCounts = useMemo(() => {
    const counts = {};

    software.forEach((item) => {
      const name = getCategory(item);

      counts[name] = (counts[name] || 0) + 1;
    });

    return counts;
  }, [software]);

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    const result = software.filter((item) => {
      const name = (item?.name || item?.title || "").toLowerCase();

      const description = getDescription(item).toLowerCase();

      const itemCategory = getCategory(item).toLowerCase();

      const itemPricing = getPricingModel(item).toLowerCase();

      const itemBusinessSize = String(
        item?.business_size || item?.businessSize || item?.company_size || "",
      ).toLowerCase();

      const rating = getRating(item);

      const matchesSearch =
        !keyword ||
        name.includes(keyword) ||
        description.includes(keyword) ||
        itemCategory.includes(keyword);

      const matchesCategory =
        category === "All Categories" ||
        itemCategory === category.toLowerCase();

      const matchesPricing =
        pricing === "All Pricing" ||
        itemPricing.includes(pricing.toLowerCase());

      const matchesBusinessSize =
        businessSize === "All Sizes" ||
        itemBusinessSize.includes(businessSize.toLowerCase());

      let matchesRating = true;

      if (ratingFilter === "4.5+") {
        matchesRating = rating >= 4.5;
      }

      if (ratingFilter === "4.0+") {
        matchesRating = rating >= 4;
      }

      if (ratingFilter === "3.5+") {
        matchesRating = rating >= 3.5;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPricing &&
        matchesBusinessSize &&
        matchesRating
      );
    });

    /*
    |--------------------------------------------------------------------------
    | SORT
    |--------------------------------------------------------------------------
    */

    if (sortBy === "rating") {
      result.sort((a, b) => getRating(b) - getRating(a));
    }

    if (sortBy === "reviews") {
      result.sort((a, b) => getReviews(b) - getReviews(a));
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        String(a?.name || a?.title || "").localeCompare(
          String(b?.name || b?.title || ""),
        ),
      );
    }

    return result;
  }, [software, query, category, pricing, businessSize, ratingFilter, sortBy]);

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginatedSoftware = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [query, category, pricing, businessSize, ratingFilter, sortBy]);

  /*
  |--------------------------------------------------------------------------
  | ACTIONS
  |--------------------------------------------------------------------------
  */

  function toggleCompare(id) {
    setSelectedSoftware((current) => {
      if (current.includes(id)) {
        return current.filter((itemId) => itemId !== id);
      }

      if (current.length >= 2) {
        return current;
      }

      return [...current, id];
    });
  }

  function toggleFavorite(id) {
    setFavorites((current) => {
      if (current.includes(id)) {
        return current.filter((itemId) => itemId !== id);
      }

      return [...current, id];
    });
  }

  function clearFilters() {
    setQuery("");
    setCategory("All Categories");
    setPricing("All Pricing");
    setBusinessSize("All Sizes");
    setRatingFilter("All Ratings");
    setSortBy("popular");
  }

  function goToPage(nextPage) {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <PublicLayout>
      <main className="software-directory">
        {/* =====================================================
            BREADCRUMB
        ====================================================== */}

        <div className="directory-breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Home
          </button>

          <span>/</span>

          <span>Software</span>
        </div>

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <section className="directory-header">
          <div>
            <h1>All Software</h1>

            <p>
              Discover {software.length.toLocaleString()}+ software solutions to
              grow your business
            </p>
          </div>

          <div className="directory-header-art">
            <div className="art-circle">
              <Icon name="search" />
            </div>

            <div className="art-small-card">
              <Icon name="check" />
            </div>

            <div className="art-small-dot" />
          </div>
        </section>

        {/* =====================================================
            SEARCH + SORT
        ====================================================== */}

        <section className="directory-toolbar">
          <div className="directory-search">
            <Icon name="search" />

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search software, category, or business need..."
            />

            {query && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}

            <button type="button" className="search-button">
              <Icon name="search" />
            </button>
          </div>

          <div className="sort-control">
            <span>Sort by</span>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="popular">Most Popular</option>

              <option value="rating">Highest Rated</option>

              <option value="reviews">Most Reviewed</option>

              <option value="name">Name A-Z</option>
            </select>
          </div>
        </section>

        {/* =====================================================
            ACTIVE FILTERS
        ====================================================== */}

        <div className="active-filters">
          {pricing !== "All Pricing" && (
            <button
              type="button"
              className="filter-chip"
              onClick={() => setPricing("All Pricing")}
            >
              Pricing: {pricing}
              <span>×</span>
            </button>
          )}

          {businessSize !== "All Sizes" && (
            <button
              type="button"
              className="filter-chip"
              onClick={() => setBusinessSize("All Sizes")}
            >
              Business Size: {businessSize}
              <span>×</span>
            </button>
          )}

          {category !== "All Categories" && (
            <button
              type="button"
              className="filter-chip"
              onClick={() => setCategory("All Categories")}
            >
              {category}
              <span>×</span>
            </button>
          )}

          {ratingFilter !== "All Ratings" && (
            <button
              type="button"
              className="filter-chip"
              onClick={() => setRatingFilter("All Ratings")}
            >
              Rating: {ratingFilter}
              <span>×</span>
            </button>
          )}

          {(category !== "All Categories" ||
            pricing !== "All Pricing" ||
            businessSize !== "All Sizes" ||
            ratingFilter !== "All Ratings" ||
            query) && (
            <button type="button" className="clear-all" onClick={clearFilters}>
              Clear all
            </button>
          )}
        </div>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="directory-content">
          {/* ===================================================
              SIDEBAR
          ==================================================== */}

          <aside className="directory-sidebar">
            <div className="sidebar-title">
              <strong>Filters</strong>

              <button type="button" onClick={clearFilters}>
                Clear all
              </button>
            </div>

            {/* CATEGORIES */}

            <div className="filter-section">
              <div className="filter-section-title">
                <span>Categories</span>

                <span className="collapse-icon">⌃</span>
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={category === "All Categories"}
                  onChange={() => setCategory("All Categories")}
                />

                <span>All Categories</span>

                <small>{software.length}</small>
              </label>

              {Object.entries(categoryCounts)
                .slice(0, 6)
                .map(([name, count]) => (
                  <label className="checkbox-row" key={name}>
                    <input
                      type="checkbox"
                      checked={category.toLowerCase() === name.toLowerCase()}
                      onChange={() => setCategory(name)}
                    />

                    <span>{name}</span>

                    <small>{count}</small>
                  </label>
                ))}

              {Object.keys(categoryCounts).length > 6 && (
                <button type="button" className="show-more">
                  Show more⌄
                </button>
              )}
            </div>

            {/* PRICING */}

            <div className="filter-section">
              <div className="filter-section-title">
                <span>Pricing Model</span>

                <span className="collapse-icon">⌃</span>
              </div>

              {[
                "All Pricing",
                "Free",
                "Freemium",
                "Subscription",
                "One-Time Payment",
                "Custom Quote",
              ].map((item) => (
                <label className="checkbox-row" key={item}>
                  <input
                    type="checkbox"
                    checked={pricing === item}
                    onChange={() => setPricing(item)}
                  />

                  <span>{item}</span>
                </label>
              ))}
            </div>

            {/* BUSINESS SIZE */}

            <div className="filter-section">
              <div className="filter-section-title">
                <span>Business Size</span>

                <span className="collapse-icon">⌃</span>
              </div>

              {[
                "All Sizes",
                "Micro (1-10 employees)",
                "Small (11-50 employees)",
                "Medium (51-250 employees)",
                "Enterprise (250+ employees)",
              ].map((item) => (
                <label className="checkbox-row" key={item}>
                  <input
                    type="checkbox"
                    checked={businessSize === item}
                    onChange={() => setBusinessSize(item)}
                  />

                  <span>{item}</span>
                </label>
              ))}
            </div>

            {/* RATING */}

            <div className="filter-section">
              <div className="filter-section-title">
                <span>Rating</span>

                <span className="collapse-icon">⌃</span>
              </div>

              {[
                ["4.5+", "4.5 & above"],
                ["4.0+", "4.0 & above"],
                ["3.5+", "3.5 & above"],
              ].map(([value, label]) => (
                <label className="rating-filter-row" key={value}>
                  <input
                    type="checkbox"
                    checked={ratingFilter === value}
                    onChange={() => setRatingFilter(value)}
                  />

                  <span className="mini-stars">★★★★★</span>

                  <span>{label}</span>
                </label>
              ))}
            </div>
          </aside>

          {/* ===================================================
              RESULTS
          ==================================================== */}

          <section className="directory-results">
            <div className="results-top">
              <div>
                <strong>{filtered.length.toLocaleString()}</strong> software
                found
              </div>

              <div className="view-toggle">
                <button type="button" className="view-button active">
                  ▦ Grid
                </button>

                <button type="button" className="view-button">
                  ☷ List
                </button>
              </div>
            </div>

            {/* LOADING */}

            {loading && (
              <div className="directory-loading">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div className="software-skeleton" key={index}>
                    <div className="skeleton-logo" />

                    <div className="skeleton-content">
                      <div className="skeleton-line large" />
                      <div className="skeleton-line medium" />
                      <div className="skeleton-line small" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ERROR */}

            {!loading && error && (
              <div className="directory-empty">
                <div className="empty-icon">!</div>

                <h3>Unable to load software</h3>

                <p>{error}</p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* RESULTS */}

            {!loading &&
              !error &&
              paginatedSoftware.map((item, index) => {
                const id = item.id;
                const name = item?.name || item?.title || "Unnamed Software";

                const rating = getRating(item);
                const reviews = getReviews(item);
                const price = getPrice(item);
                const logo = getLogo(item);

                const tags =
                  item?.features
                    ?.slice?.(0, 3)
                    ?.map((feature) =>
                      typeof feature === "string" ? feature : feature?.name,
                    )
                    ?.filter(Boolean) || [];

                const fallbackTags = [
                  getCategory(item),
                  "Business Software",
                  "Productivity",
                ];

                const finalTags = tags.length > 0 ? tags : fallbackTags;

                return (
                  <article className="software-list-card" key={id}>
                    {/* LOGO */}

                    <div className="software-logo">
                      {logo ? (
                        <img
                          src={logo}
                          alt={`${name} logo`}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";

                            event.currentTarget.nextSibling.style.display =
                              "flex";
                          }}
                        />
                      ) : null}

                      <span
                        className="software-logo-fallback"
                        style={{
                          display: logo ? "none" : "flex",
                        }}
                      >
                        {getInitial(name)}
                      </span>
                    </div>

                    {/* MAIN INFO */}

                    <div className="software-info">
                      <div className="software-title-row">
                        <h2>{name}</h2>

                        {item?.badge && (
                          <span className="software-badge">{item.badge}</span>
                        )}
                      </div>

                      <div className="software-rating">
                        <span className="stars">{getRatingStars(rating)}</span>

                        <strong>{rating ? rating.toFixed(1) : "—"}</strong>

                        <span className="review-count">
                          ({reviews.toLocaleString()} reviews)
                        </span>
                      </div>

                      <p className="software-description">
                        {getDescription(item)}
                      </p>

                      <div className="software-tags">
                        {finalTags.slice(0, 3).map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}

                        {finalTags.length > 3 && (
                          <span>+{finalTags.length - 3}</span>
                        )}
                      </div>
                    </div>

                    {/* PRICE */}

                    <div className="software-price">
                      <span>Starting from</span>

                      <strong>{formatPrice(price)}</strong>

                      <small>/user / month</small>
                    </div>

                    {/* ACTIONS */}

                    <div className="software-actions">
                      <button
                        type="button"
                        className="favorite-button"
                        onClick={() => toggleFavorite(id)}
                        aria-label="Favorite"
                      >
                        {favorites.includes(id) ? "♥" : "♡"}
                      </button>

                      <button
                        type="button"
                        className="details-button"
                        onClick={() => navigate(`/software/${item.slug || id}`)}
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        className={
                          selectedSoftware.includes(id)
                            ? "compare-button selected"
                            : "compare-button"
                        }
                        onClick={() => toggleCompare(id)}
                      >
                        {selectedSoftware.includes(id) ? "✓ Added" : "Compare"}
                      </button>

                      <label className="add-compare">
                        <input
                          type="checkbox"
                          checked={selectedSoftware.includes(id)}
                          onChange={() => toggleCompare(id)}
                        />

                        <span>Add to Compare</span>
                      </label>
                    </div>
                  </article>
                );
              })}

            {/* EMPTY */}

            {!loading && !error && filtered.length === 0 && (
              <div className="directory-empty">
                <div className="empty-icon">
                  <Icon name="search" />
                </div>

                <h3>No software found</h3>

                <p>Try another keyword or adjust your filters.</p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* =================================================
                PAGINATION
            ================================================== */}

            {!loading && !error && filtered.length > 0 && (
              <div className="pagination">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => goToPage(page - 1)}
                >
                  ‹
                </button>

                {Array.from(
                  { length: Math.min(totalPages, 5) },
                  (_, index) => index + 1,
                ).map((pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    className={page === pageNumber ? "active" : ""}
                    onClick={() => goToPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}

                {totalPages > 5 && (
                  <>
                    <span>...</span>

                    <button type="button" onClick={() => goToPage(totalPages)}>
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => goToPage(page + 1)}
                >
                  ›
                </button>

                <div className="page-size">
                  Show
                  <select defaultValue="5">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                  per page
                </div>
              </div>
            )}
          </section>
        </div>

        {/* =====================================================
            MOBILE COMPARE BAR
        ====================================================== */}

        {selectedSoftware.length > 0 && (
          <div className="compare-floating">
            <div>
              <strong>{selectedSoftware.length}</strong> software selected
            </div>

            <button type="button" onClick={() => navigate("/compare")}>
              Compare ({selectedSoftware.length})
            </button>
          </div>
        )}
      </main>
    </PublicLayout>
  );
}
