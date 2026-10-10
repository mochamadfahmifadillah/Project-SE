import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  Check,
  ChevronRight,
  Info,
  Link2,
  Plus,
  Share2,
  Star,
} from "lucide-react";

import PublicLayout from "../../layouts/PublicLayout";
import { getSoftware } from "../../services/softwareService";
import { compareSoftware } from "../../services/compareService";
import "../../styles/compare.css";

import zohoLogo from "../../assets/logos/zoho.svg";
import hubspotLogo from "../../assets/logos/hubspot.png";
import salesforceLogo from "../../assets/logos/salesforces.png";
import odooLogo from "../../assets/logos/odoo.png";
import dynamicsLogo from "../../assets/logos/dynamics.png";
import bamboohrLogo from "../../assets/logos/bamboo.png";

const MAX_SOFTWARE = 3;
const MIN_SOFTWARE = 2;

const softwareLogos = {
  "Zoho CRM": zohoLogo,
  "HubSpot CRM": hubspotLogo,
  "Salesforce Sales Cloud": salesforceLogo,
  "Odoo ERP": odooLogo,
  "Microsoft Dynamics 365": dynamicsLogo,
  BambooHR: bamboohrLogo,
};

const navigationItems = [
  { name: "Summary", icon: "▣" },
  { name: "Features", icon: "♧" },
  { name: "Pricing", icon: "$" },
  { name: "Integrations", icon: "☆" },
  { name: "Reviews", icon: "▱" },
];

// =====================================================
// HELPERS
// =====================================================

function normalizeSoftwareResponse(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

function getReviewCount(item) {
  const count =
    item?.review_count ??
    item?.reviews_count ??
    (Array.isArray(item?.reviews) ? item.reviews.length : null) ??
    (typeof item?.reviews === "number" ? item.reviews : null);

  if (count === null || count === undefined || count === "") {
    return null;
  }

  const parsed = Number(count);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function formatRating(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const rating = Number(value);
  return Number.isFinite(rating) ? rating.toFixed(1) : "—";
}

function getFeatures(item) {
  return Array.isArray(item?.features) ? item.features : [];
}

function getIntegrations(item) {
  return Array.isArray(item?.integrations)
    ? item.integrations.filter(
        (integration) => integration?.is_active !== false,
      )
    : [];
}

function getFeatureKey(feature) {
  if (feature?.id !== null && feature?.id !== undefined) {
    return `id:${feature.id}`;
  }

  if (feature?.slug) {
    return `slug:${String(feature.slug).trim().toLowerCase()}`;
  }

  if (feature?.name) {
    return `name:${String(feature.name).trim().toLowerCase()}`;
  }

  return "";
}

function getLogoForSoftware(item) {
  return item?.logo || softwareLogos[item?.name] || null;
}

function getSoftwareId(item) {
  return String(item?.id ?? "");
}

// Gabungkan relasi tanpa membuang data katalog yang sudah tersedia.
// Jika respons comparison mengirim array kosong, data katalog tetap dipakai.
function mergeRelation(catalogItem, comparisonItem, relationName) {
  const comparisonRelation = comparisonItem?.[relationName];
  const catalogRelation = catalogItem?.[relationName];

  if (
    Array.isArray(comparisonRelation) &&
    comparisonRelation.length > 0
  ) {
    return comparisonRelation;
  }

  if (Array.isArray(catalogRelation)) {
    return catalogRelation;
  }

  if (Array.isArray(comparisonRelation)) {
    return comparisonRelation;
  }

  return [];
}

// =====================================================
// COMPONENT
// =====================================================

function Compare() {
  const navigate = useNavigate();

  const [software, setSoftware] = useState([]);
  const [selected, setSelected] = useState([]);

  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState(null);

  const [comparison, setComparison] = useState(null);
  const [activeSection, setActiveSection] = useState("Features");
  const [saved, setSaved] = useState(false);

  // =====================================================
  // LOAD SOFTWARE CATALOG
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    async function loadSoftware() {
      try {
        setLoading(true);
        setError(null);

        const response = await getSoftware();
        const data = normalizeSoftwareResponse(response);

        // Debug log: berada dalam scope yang benar.
        console.log("CATALOG API:", data);
        console.log(
          "FEATURES FROM CATALOG:",
          data.map((item) => ({
            id: item.id,
            name: item.name,
            features: item.features,
          })),
        );

        if (cancelled) return;

        const availableSoftware = data
          .filter((item) => item?.is_active !== false)
          .map((item) => ({
            ...item,
            logo: getLogoForSoftware(item),
          }));

        setSoftware(availableSoftware);

        setSelected((current) => {
          const availableIds = new Set(
            availableSoftware.map(getSoftwareId),
          );

          const validSelected = current
            .filter((id) => availableIds.has(String(id)))
            .slice(0, MAX_SOFTWARE);

          if (validSelected.length >= MIN_SOFTWARE) {
            return validSelected;
          }

          return availableSoftware
            .slice(0, MAX_SOFTWARE)
            .map((item) => item.id);
        });
      } catch (err) {
        console.error("Failed to load software:", err);

        if (!cancelled) {
          setError(err?.message || "Failed to load software.");
        }
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

  // =====================================================
  // MERGE CATALOG AND SAVED COMPARISON
  // =====================================================

  const chosen = useMemo(() => {
    const catalogById = new Map(
      software.map((item) => [getSoftwareId(item), item]),
    );

    const comparisonSoftware = Array.isArray(comparison?.software)
      ? comparison.software
      : [];

    const comparisonById = new Map(
      comparisonSoftware.map((item) => [getSoftwareId(item), item]),
    );

    return selected
      .map((id) => {
        const key = String(id);
        const catalogItem = catalogById.get(key);
        const comparisonItem = comparisonById.get(key);

        if (!catalogItem && !comparisonItem) return null;

        const merged = {
          ...catalogItem,
          ...comparisonItem,
          features: mergeRelation(
            catalogItem,
            comparisonItem,
            "features",
          ),
          integrations: mergeRelation(
            catalogItem,
            comparisonItem,
            "integrations",
          ),
        };

        return {
          ...merged,
          logo:
            catalogItem?.logo ||
            comparisonItem?.logo ||
            getLogoForSoftware(merged),
        };
      })
      .filter(Boolean);
  }, [software, selected, comparison]);

  // =====================================================
  // FEATURE MATRIX
  // =====================================================

  const featureRows = useMemo(() => {
    const featureMap = new Map();

    chosen.forEach((item) => {
      getFeatures(item).forEach((feature) => {
        if (feature?.is_active === false) return;

        const key = getFeatureKey(feature);

        if (key && !featureMap.has(key)) {
          featureMap.set(key, feature);
        }
      });
    });

    return Array.from(featureMap.entries()).map(([key, feature]) => ({
      key,
      label: feature.name || "Unnamed feature",
      description: feature.description || "",
      values: chosen.map((item) => {
        const exists = getFeatures(item).some(
          (itemFeature) =>
            itemFeature?.is_active !== false &&
            getFeatureKey(itemFeature) === key,
        );

        return exists ? "yes" : "unknown";
      }),
    }));
  }, [chosen]);

  // =====================================================
  // RESET / SELECTION
  // =====================================================

  const resetComparison = () => {
    setComparison(null);
    setSaved(false);
  };

  const toggle = (id) => {
    const alreadySelected = selected.some(
      (itemId) => String(itemId) === String(id),
    );

    if (alreadySelected) {
      setSelected((current) =>
        current.filter((itemId) => String(itemId) !== String(id)),
      );
    } else {
      if (selected.length >= MAX_SOFTWARE) {
        setError("You can compare a maximum of 3 software products.");
        return;
      }

      setSelected((current) => [...current, id]);
    }

    setError(null);
    resetComparison();
  };

  const removeSoftware = (id) => {
    setSelected((current) =>
      current.filter((itemId) => String(itemId) !== String(id)),
    );

    setError(null);
    resetComparison();
  };

  const addSoftware = () => {
    if (selected.length >= MAX_SOFTWARE) {
      setError("You can compare a maximum of 3 software products.");
      return;
    }

    const available = software.find(
      (item) =>
        !selected.some((id) => String(id) === String(item.id)),
    );

    if (available) toggle(available.id);
  };

  // =====================================================
  // COMPARE API
  // =====================================================

  const handleCompare = async () => {
    if (selected.length < MIN_SOFTWARE) {
      setError("Select at least 2 software products to compare.");
      return;
    }

    if (selected.length > MAX_SOFTWARE) {
      setError("You can compare a maximum of 3 software products.");
      return;
    }

    try {
      setComparing(true);
      setError(null);

      const response = await compareSoftware(selected);

      if (!response?.success || !response?.data?.comparison) {
        throw new Error(
          response?.message || "The comparison could not be saved.",
        );
      }

      const savedComparison = response.data.comparison;

      setComparison(savedComparison);
      setSaved(true);

      console.log(
        "Software comparison loaded:",
        savedComparison.software?.map((item) => ({
          id: item.id,
          name: item.name,
          features: item.features,
          integrations: item.integrations,
        })),
      );
    } catch (err) {
      console.error("Failed to compare software:", err);
      setError(err?.message || "Failed to compare software.");
    } finally {
      setComparing(false);
    }
  };

  const handleSave = async () => {
    if (comparison?.id) {
      setSaved(true);
      return;
    }

    await handleCompare();
  };

  // =====================================================
  // SHARE
  // =====================================================

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Software Empire - Software Comparison",
          text: "Compare software with Software Empire.",
          url: window.location.href,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        window.alert("Link copied.");
        return;
      }

      setError("Sharing is not supported by this browser.");
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error("Share failed:", err);
        setError("Failed to share the link.");
      }
    }
  };

  // =====================================================
  // DISPLAY HELPERS
  // =====================================================

  const getLogo = (item) => {
    const logo = getLogoForSoftware(item);

    if (logo) {
      return (
        <img
          src={logo}
          alt={`${item.name} logo`}
          className="comparison-logo-image"
        />
      );
    }

    return (
      <div className="comparison-logo-fallback">
        {item.name?.slice(0, 2).toUpperCase() || "SW"}
      </div>
    );
  };

  const getPrice = (item) => {
    if (
      item.price === null ||
      item.price === undefined ||
      String(item.price).trim() === ""
    ) {
      return "Not available";
    }

    return item.price;
  };

  const getRating = (item) => formatRating(item.rating);

  const showSection = (section) =>
    activeSection === "Summary" || activeSection === section;

  const renderFeatureStatus = (status) => {
    if (status === "yes") {
      return (
        <span
          className="feature-status yes"
          title="Feature is recorded for this software"
          aria-label="Feature recorded"
        >
          <Check size={14} strokeWidth={2.5} />
        </span>
      );
    }

    return (
      <span
        className="feature-status unavailable"
        title="Feature availability has not been documented"
        aria-label="Not documented"
      >
        —
      </span>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <PublicLayout>
        <main className="compare-page">
          <div className="compare-loading">
            <div className="loading-spinner" />
            <h3>Loading comparison...</h3>
            <p>Please wait while we load the software directory.</p>
          </div>
        </main>
      </PublicLayout>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && software.length === 0) {
    return (
      <PublicLayout>
        <main className="compare-page">
          <div className="compare-empty">
            <h2>Failed to load software</h2>
            <p>{error}</p>
          </div>
        </main>
      </PublicLayout>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <PublicLayout>
      <main className="compare-page">
        <div className="compare-breadcrumb">
          <span>Home</span>
          <ChevronRight size={13} />
          <strong>Compare Software</strong>
        </div>

        <div className="compare-header">
          <div>
            <h1>Compare Software</h1>
            <p>Compare 2–3 software solutions side by side</p>
          </div>

          <div className="compare-header-actions">
            <button
              type="button"
              className={`compare-action-button ${saved ? "active" : ""}`}
              onClick={handleSave}
              disabled={comparing || chosen.length < MIN_SOFTWARE}
            >
              <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save Comparison"}
            </button>

            <button
              type="button"
              className="compare-action-button"
              onClick={handleShare}
            >
              <Share2 size={15} />
              Share
            </button>
          </div>
        </div>

        {/* SOFTWARE SELECTION */}

        <section className="selected-software-section">
          {chosen.map((item) => (
            <div className="selected-software-card" key={item.id}>
              <div className="selected-software-logo">{getLogo(item)}</div>

              <div className="selected-software-info">
                <strong>{item.name}</strong>
                <button
                  type="button"
                  onClick={() => removeSoftware(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {chosen.length < MAX_SOFTWARE && (
            <button
              type="button"
              className="add-software-card"
              onClick={addSoftware}
              disabled={chosen.length >= software.length}
            >
              <Plus size={16} />
              <strong>Add Software</strong>
              <span>Up to {MAX_SOFTWARE}</span>
            </button>
          )}
        </section>

        {error && (
          <div className="compare-inline-error" role="alert">
            <Info size={15} />
            {error}
          </div>
        )}

        {chosen.length >= MIN_SOFTWARE ? (
          <section className="comparison-layout">
            <aside className="comparison-sidebar">
              <nav className="comparison-navigation">
                {navigationItems.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className={activeSection === item.name ? "active" : ""}
                    onClick={() => setActiveSection(item.name)}
                    aria-current={
                      activeSection === item.name ? "page" : undefined
                    }
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.name}
                  </button>
                ))}
              </nav>

              <div className="recommendation-card">
                <h3>Not sure yet?</h3>
                <p>Get a recommendation based on your business needs.</p>
                <button
                  type="button"
                  onClick={() => navigate("/recommend")}
                >
                  <Star size={13} />
                  Get Recommendation
                </button>
              </div>

              <div className="comparison-legend">
                <h3>Legend</h3>
                <div>
                  <span className="legend-icon yes">
                    <Check size={10} />
                  </span>
                  Recorded feature
                </div>
                <div>
                  <span className="legend-icon unavailable">—</span>
                  Not documented
                </div>
                <div>
                  <span className="legend-icon info">
                    <Info size={10} />
                  </span>
                  View more information
                </div>
              </div>
            </aside>

            <div className="comparison-content">
              <div
                className="comparison-table-wrapper"
                style={{ "--product-count": chosen.length }}
              >
                {/* PRODUCT HEADERS */}

                <div className="comparison-product-row">
                  <div className="matrix-label-cell">
                    <span>Comparison</span>
                  </div>

                  {chosen.map((item) => {
                    const reviewCount = getReviewCount(item);

                    return (
                      <div className="product-column-header" key={item.id}>
                        <div className="product-heading">
                          <div className="matrix-logo">{getLogo(item)}</div>
                          <div>
                            <h3>{item.name}</h3>
                            <div className="matrix-rating">
                              <Star
                                size={11}
                                fill="#f4a91b"
                                color="#f4a91b"
                              />
                              <strong>{getRating(item)}</strong>
                              <span>
                                {reviewCount === null
                                  ? "(Review count unavailable)"
                                  : `(${reviewCount} reviews)`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="matrix-details-button"
                          onClick={() => navigate(`/software/${item.slug}`)}
                        >
                          View Details
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* SUMMARY */}

                {showSection("Summary") && (
                  <>
                    <div className="matrix-row">
                      <div className="matrix-label-cell">Category</div>
                      {chosen.map((item) => (
                        <div className="matrix-value-cell" key={item.id}>
                          {item.category || "Not available"}
                        </div>
                      ))}
                    </div>

                    <div className="matrix-row">
                      <div className="matrix-label-cell">Description</div>
                      {chosen.map((item) => (
                        <div className="matrix-value-cell" key={item.id}>
                          {item.description || "Not available"}
                        </div>
                      ))}
                    </div>

                    <div className="matrix-row overall-row">
                      <div className="matrix-label-cell">
                        <strong>Overall Rating</strong>
                      </div>

                      {chosen.map((item) => {
                        const rating =
                          item.rating === null ||
                          item.rating === undefined ||
                          item.rating === ""
                            ? null
                            : Number(item.rating);

                        const validRating =
                          rating !== null &&
                          Number.isFinite(rating) &&
                          rating >= 0 &&
                          rating <= 5;

                        return (
                          <div
                            className="matrix-value-cell overall-score-cell"
                            key={item.id}
                          >
                            {validRating ? (
                              <>
                                <div className="score-number">
                                  <strong>{rating.toFixed(1)}</strong>
                                  <span>/ 5</span>
                                </div>
                                <div className="score-bar">
                                  <span
                                    style={{
                                      width: `${(rating / 5) * 100}%`,
                                    }}
                                  />
                                </div>
                              </>
                            ) : (
                              <span>Not rated</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="matrix-section-title">
                      <span>Feature Comparison</span>
                    </div>

                    {featureRows.length > 0 ? (
                      featureRows.map((row) => (
                        <div className="matrix-row" key={row.key}>
                          <div className="matrix-label-cell">{row.label}</div>

                          {row.values.map((status, index) => (
                            <div
                              className="matrix-value-cell feature-cell"
                              key={`${row.key}-${chosen[index].id}`}
                            >
                              {renderFeatureStatus(status)}
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="matrix-row">
                        <div className="matrix-label-cell">Features</div>
                        <div
                          className="matrix-value-cell"
                          style={{ gridColumn: `span ${chosen.length}` }}
                        >
                          No feature data has been recorded yet.
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* PRICING */}

                {showSection("Pricing") && (
                  <div className="matrix-row">
                    <div className="matrix-label-cell">Price</div>
                    {chosen.map((item) => (
                      <div
                        className="matrix-value-cell price-cell"
                        key={item.id}
                      >
                        <strong>{getPrice(item)}</strong>
                      </div>
                    ))}
                  </div>
                )}

                {/* FEATURES */}

                {showSection("Features") && (
                  <>
                    <div className="matrix-section-title">
                      <span>Documented Features</span>
                    </div>

                    {featureRows.length > 0 ? (
                      featureRows.map((row) => (
                        <div className="matrix-row" key={row.key}>
                          <div className="matrix-label-cell">
                            <span>{row.label}</span>
                            {row.description && (
                              <small>{row.description}</small>
                            )}
                          </div>

                          {row.values.map((status, index) => (
                            <div
                              className="matrix-value-cell feature-cell"
                              key={`${row.key}-${chosen[index].id}`}
                            >
                              {renderFeatureStatus(status)}
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="matrix-row">
                        <div className="matrix-label-cell">Features</div>
                        <div
                          className="matrix-value-cell"
                          style={{ gridColumn: `span ${chosen.length}` }}
                        >
                          No feature data was returned by the software
                          catalog. Check the GET /api/v1/software response
                          to confirm that it includes a features array.
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* INTEGRATIONS */}

                {showSection("Integrations") && (
                  <>
                    <div className="matrix-section-title">
                      <span>Documented Integrations</span>
                    </div>

                    <div className="matrix-row">
                      <div className="matrix-label-cell">Integrations</div>

                      {chosen.map((item) => {
                        const integrations = getIntegrations(item);

                        return (
                          <div className="matrix-value-cell" key={item.id}>
                            {integrations.length > 0
                              ? integrations
                                  .map((integration) => integration.name)
                                  .filter(Boolean)
                                  .join(", ") || "Not documented"
                              : "Not documented"}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* REVIEWS */}

                {showSection("Reviews") && (
                  <>
                    <div className="matrix-section-title">
                      <span>Reviews</span>
                    </div>

                    <div className="matrix-row">
                      <div className="matrix-label-cell">Average Rating</div>
                      {chosen.map((item) => (
                        <div className="matrix-value-cell" key={item.id}>
                          {getRating(item)}
                          {item.rating !== null &&
                            item.rating !== undefined &&
                            item.rating !== "" &&
                            " / 5"}
                        </div>
                      ))}
                    </div>

                    <div className="matrix-row">
                      <div className="matrix-label-cell">
                        Number of Reviews
                      </div>
                      {chosen.map((item) => {
                        const count = getReviewCount(item);

                        return (
                          <div className="matrix-value-cell" key={item.id}>
                            {count === null ? "Not available" : count}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="comparison-footnote">
                Comparison results are based on information currently
                available in the database. A feature marked as not documented
                should not be interpreted as a confirmed absence of that
                feature.
              </div>

              {comparison?.id && (
                <div className="comparison-success">
                  <Check size={16} />
                  <div>
                    <strong>Comparison saved successfully</strong>
                    <span>Comparison ID: {comparison.id}</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : (
          <div className="compare-empty">
            <div className="compare-empty-icon">
              <Link2 size={25} />
            </div>
            <h2>Select at least 2 software</h2>
            <p>
              Choose at least two software products above to start comparing
              them.
            </p>
          </div>
        )}

        {/* BOTTOM ACTIONS */}

        {chosen.length >= MIN_SOFTWARE && (
          <div className="compare-bottom-actions">
            <button
              type="button"
              className="bottom-primary-button"
              onClick={handleCompare}
              disabled={comparing}
            >
              {comparing ? "Comparing..." : "View Full Comparison"}
            </button>

            <button
              type="button"
              className={`bottom-save-button ${saved ? "active" : ""}`}
              onClick={handleSave}
              disabled={comparing}
            >
              <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
              {saved ? "Comparison Saved" : "Save Comparison"}
            </button>
          </div>
        )}
      </main>
    </PublicLayout>
  );
}

export default Compare;