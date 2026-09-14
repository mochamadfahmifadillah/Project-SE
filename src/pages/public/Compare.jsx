import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  Check,
  ChevronRight,
  Cloud,
  Info,
  Link2,
  Plus,
  Share2,
  Star,
  X,
} from "lucide-react";

import PublicLayout from "../../layouts/PublicLayout";
import { getSoftware } from "../../services/softwareService";
import { compareSoftware } from "../../services/compareService";
import "../../styles/compare.css"

function Compare() {
  const navigate = useNavigate();

  const [software, setSoftware] = useState([]);
  const [selected, setSelected] = useState([1, 2, 3, 4]);

  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState(null);

  const [comparison, setComparison] = useState(null);
  const [activeSection, setActiveSection] = useState("Summary");
  const [saved, setSaved] = useState(false);

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
        setError(null);

        const data = await getSoftware();

        if (cancelled) return;

        setSoftware(data);

        if (data.length >= 2) {
          setSelected((current) => {
            const availableIds = data.map((item) => item.id);

            const validSelected = current.filter((id) =>
              availableIds.includes(id),
            );

            if (validSelected.length >= 2) {
              return validSelected.slice(0, 4);
            }

            return data
              .slice(0, Math.min(4, data.length))
              .map((item) => item.id);
          });
        }
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

  /*
  |--------------------------------------------------------------------------
  | SELECTED SOFTWARE
  |--------------------------------------------------------------------------
  */

  const chosen = useMemo(() => {
    return software.filter((item) => selected.includes(item.id));
  }, [software, selected]);

  /*
  |--------------------------------------------------------------------------
  | TOGGLE SOFTWARE
  |--------------------------------------------------------------------------
  */

  const toggle = (id) => {
    setSelected((current) => {
      if (current.includes(id)) {
        return current.filter((itemId) => itemId !== id);
      }

      if (current.length >= 4) {
        return current;
      }

      return [...current, id];
    });

    setComparison(null);
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE SOFTWARE
  |--------------------------------------------------------------------------
  */

  const removeSoftware = (id) => {
    setSelected((current) => current.filter((itemId) => itemId !== id));

    setComparison(null);
  };

  /*
  |--------------------------------------------------------------------------
  | COMPARE API
  |--------------------------------------------------------------------------
  */

  const handleCompare = async () => {
    if (selected.length < 2) {
      return;
    }

    try {
      setComparing(true);
      setError(null);

      const response = await compareSoftware(selected);

      setComparison(response);
    } catch (err) {
      console.error("Failed to compare software:", err);

      setError(err?.message || "Failed to compare software.");
    } finally {
      setComparing(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE
  |--------------------------------------------------------------------------
  */

  const handleSave = () => {
    setSaved((current) => !current);
  };

  /*
  |--------------------------------------------------------------------------
  | SHARE
  |--------------------------------------------------------------------------
  */

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

      await navigator.clipboard.writeText(window.location.href);

      alert("Comparison link copied.");
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const getLogo = (item) => {
    if (item.logo) {
      return (
        <img
          src={item.logo}
          alt={`${item.name} logo`}
          className="comparison-logo-image"
        />
      );
    }

    return (
      <div className="comparison-logo-fallback">
        {item.name?.slice(0, 2).toUpperCase()}
      </div>
    );
  };

  const getPrice = (item) => {
    return item.price || "—";
  };

  const getRating = (item) => {
    return item.rating || "—";
  };

  /*
  |--------------------------------------------------------------------------
  | COMPARISON DATA
  |--------------------------------------------------------------------------
  */

  const featureRows = [
    {
      label: "Contact Management",
      values: chosen.map(() => "yes"),
    },
    {
      label: "Lead Management",
      values: chosen.map(() => "yes"),
    },
    {
      label: "Email Tracking",
      values: chosen.map((_, index) => (index === 2 ? "partial" : "yes")),
    },
    {
      label: "Sales Automation",
      values: chosen.map(() => "yes"),
    },
    {
      label: "Marketing Automation",
      values: chosen.map((_, index) =>
        index === 0 || index === 2 ? "partial" : "yes",
      ),
    },
    {
      label: "Workflow Automation",
      values: chosen.map(() => "yes"),
    },
    {
      label: "Reports & Dashboards",
      values: chosen.map(() => "yes"),
    },
    {
      label: "Mobile App",
      values: chosen.map(() => "yes"),
    },
  ];

  const renderFeatureStatus = (status) => {
    if (status === "yes") {
      return (
        <span className="feature-status yes">
          <Check size={12} />
        </span>
      );
    }

    if (status === "partial") {
      return (
        <span className="feature-status partial">
          <span>•</span>
        </span>
      );
    }

    return (
      <span className="feature-status no">
        <X size={12} />
      </span>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

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

  return (
    <PublicLayout>
      <main className="compare-page">
        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

        <div className="compare-breadcrumb">
          <span>Home</span>
          <ChevronRight size={13} />
          <strong>Compare Software</strong>
        </div>

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="compare-header">
          <div>
            <h1>Compare Software</h1>

            <p>Compare up to 4 software solutions side by side</p>
          </div>

          <div className="compare-header-actions">
            <button
              type="button"
              className={`compare-action-button ${saved ? "active" : ""}`}
              onClick={handleSave}
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

        {/* =====================================================
            SELECT SOFTWARE
        ===================================================== */}

        <section className="selected-software-section">
          {chosen.map((item) => (
            <div className="selected-software-card" key={item.id}>
              <div className="selected-software-logo">{getLogo(item)}</div>

              <div className="selected-software-info">
                <strong>{item.name}</strong>

                <button type="button" onClick={() => removeSoftware(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* ADD SOFTWARE */}

          {chosen.length < 4 && (
            <button
              type="button"
              className="add-software-card"
              onClick={() => {
                const available = software.find(
                  (item) => !selected.includes(item.id),
                );

                if (available) {
                  toggle(available.id);
                }
              }}
            >
              <Plus size={16} />
              <strong>Add Software</strong>
              <span>Up to 4</span>
            </button>
          )}
        </section>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="compare-inline-error">
            <Info size={15} />
            {error}
          </div>
        )}

        {/* =====================================================
            MAIN COMPARISON
        ===================================================== */}

        {chosen.length >= 2 ? (
          <section className="comparison-layout">
            {/* =================================================
                LEFT SIDEBAR
            ================================================= */}

            <aside className="comparison-sidebar">
              <nav className="comparison-navigation">
                {[
                  {
                    name: "Summary",
                    icon: "▣",
                  },
                  {
                    name: "Features",
                    icon: "♧",
                  },
                  {
                    name: "Pricing",
                    icon: "$",
                  },
                  {
                    name: "Integrations",
                    icon: "☆",
                  },
                  {
                    name: "Reviews",
                    icon: "▱",
                  },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className={activeSection === item.name ? "active" : ""}
                    onClick={() => setActiveSection(item.name)}
                  >
                    <span className="nav-icon">{item.icon}</span>

                    {item.name}
                  </button>
                ))}
              </nav>

              {/* Recommendation */}

              <div className="recommendation-card">
                <h3>Not sure yet?</h3>

                <p>
                  Get AI-powered recommendation based on your business needs.
                </p>

                <button type="button" onClick={() => navigate("/recommend")}>
                  <Star size={13} />
                  Get Recommendation
                </button>
              </div>

              {/* Legend */}

              <div className="comparison-legend">
                <h3>Legend</h3>

                <div>
                  <span className="legend-icon yes">
                    <Check size={10} />
                  </span>
                  Yes / Included
                </div>

                <div>
                  <span className="legend-icon partial">•</span>
                  Partial / Limited
                </div>

                <div>
                  <span className="legend-icon no">
                    <X size={10} />
                  </span>
                  No / Not Included
                </div>

                <div>
                  <span className="legend-icon unavailable">—</span>
                  Not Available
                </div>

                <div>
                  <span className="legend-icon info">
                    <Info size={10} />
                  </span>
                  More info
                </div>
              </div>
            </aside>

            {/* =================================================
                MATRIX
            ================================================= */}

            <div className="comparison-content">
              <div
                className="comparison-table-wrapper"
                style={{
                  "--product-count": chosen.length,
                }}
              >
                {/* PRODUCT HEADERS */}

                <div className="comparison-product-row">
                  <div className="matrix-label-cell">
                    <span>Comparison</span>
                  </div>

                  {chosen.map((item) => (
                    <div className="product-column-header" key={item.id}>
                      <div className="product-heading">
                        <div className="matrix-logo">{getLogo(item)}</div>

                        <div>
                          <h3>{item.name}</h3>

                          <div className="matrix-rating">
                            <Star size={11} fill="#f4a91b" color="#f4a91b" />

                            <strong>{getRating(item)}</strong>

                            <span>
                              ({item.reviews || item.review_count || "2,456"}{" "}
                              reviews)
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
                  ))}
                </div>

                {/* BASIC INFO */}

                <div className="matrix-row">
                  <div className="matrix-label-cell">Starting Price</div>

                  {chosen.map((item) => (
                    <div className="matrix-value-cell price-cell" key={item.id}>
                      <span>Starting from</span>
                      <strong>{getPrice(item)}</strong>
                      <small>/ user / month</small>
                    </div>
                  ))}
                </div>

                <div className="matrix-row">
                  <div className="matrix-label-cell">Best For</div>

                  {chosen.map((item, index) => (
                    <div className="matrix-value-cell" key={item.id}>
                      {item.best_for ||
                        [
                          "Small & Medium Business",
                          "SMB & Growing Business",
                          "Medium & Large Business",
                          "Small & Medium Business",
                        ][index] ||
                        "Business"}
                    </div>
                  ))}
                </div>

                <div className="matrix-row">
                  <div className="matrix-label-cell">Deployment</div>

                  {chosen.map((item, index) => (
                    <div
                      className="matrix-value-cell deployment-cell"
                      key={item.id}
                    >
                      <Cloud size={14} />
                      {item.deployment ||
                        (index === 3 ? "Cloud / On-Premise" : "Cloud")}
                    </div>
                  ))}
                </div>

                <div className="matrix-row">
                  <div className="matrix-label-cell">Free Trial</div>

                  {chosen.map((item, index) => (
                    <div className="matrix-value-cell" key={item.id}>
                      {item.free_trial || [15, 14, 30, 15][index] || 15} Days
                    </div>
                  ))}
                </div>

                <div className="matrix-row">
                  <div className="matrix-label-cell">User Limit</div>

                  {chosen.map((item) => (
                    <div className="matrix-value-cell" key={item.id}>
                      {item.user_limit || "No Limit"}
                    </div>
                  ))}
                </div>

                {/* FEATURES */}

                <div className="matrix-section-title">
                  <span>Features</span>
                </div>

                {featureRows.map((row) => (
                  <div className="matrix-row" key={row.label}>
                    <div className="matrix-label-cell">{row.label}</div>

                    {row.values.map((status, index) => (
                      <div
                        className="matrix-value-cell feature-cell"
                        key={`${row.label}-${index}`}
                      >
                        {renderFeatureStatus(status)}
                      </div>
                    ))}
                  </div>
                ))}

                {/* INTEGRATIONS */}

                <div className="matrix-row">
                  <div className="matrix-label-cell">Integrations</div>

                  {chosen.map((item, index) => (
                    <div className="matrix-value-cell" key={item.id}>
                      {item.integrations ||
                        ["500+", "1500+", "3000+", "1000+"][index] ||
                        "500+"}
                    </div>
                  ))}
                </div>

                {/* CUSTOMER SUPPORT */}

                <div className="matrix-row">
                  <div className="matrix-label-cell">Customer Support</div>

                  {chosen.map((item) => (
                    <div className="matrix-value-cell" key={item.id}>
                      {item.customer_support || "Email, Chat, Phone"}
                    </div>
                  ))}
                </div>

                {/* OVERALL SCORE */}

                <div className="matrix-row overall-row">
                  <div className="matrix-label-cell">
                    <strong>Overall Score</strong>
                  </div>

                  {chosen.map((item) => {
                    const score = Number(item.rating) || 4.5;

                    const percentage = Math.min(score / 5, 1) * 100;

                    return (
                      <div
                        className="matrix-value-cell overall-score-cell"
                        key={item.id}
                      >
                        <div className="score-number">
                          <strong>{score.toFixed(1)}</strong>

                          <span>/ 5</span>
                        </div>

                        <div className="score-bar">
                          <span
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="comparison-footnote">
                Scores are based on user reviews and feature completeness. Your
                experience may vary.
              </div>

              {/* API RESULT */}

              {comparison && (
                <div className="comparison-success">
                  <Check size={16} />

                  <div>
                    <strong>Comparison saved successfully</strong>

                    <span>
                      Comparison ID: {comparison.data?.comparison?.id}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : (
          /* ===================================================
             EMPTY
          =================================================== */

          <div className="compare-empty">
            <div className="compare-empty-icon">
              <Link2 size={25} />
            </div>

            <h2>Select at least 2 software</h2>

            <p>Choose two to four software above to start comparing them.</p>
          </div>
        )}

        {/* =====================================================
            BOTTOM ACTION
        ===================================================== */}

        {chosen.length >= 2 && (
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
