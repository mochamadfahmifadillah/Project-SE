import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Bookmark, ExternalLink, Search, Star } from "lucide-react";

import Button from "../../components/common/Button";

import { getSavedSoftware } from "../../services/savedSoftwareService";

export default function SavedSoftware() {
  const navigate = useNavigate();

  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSavedSoftware() {
      try {
        setLoading(true);
        setError("");

        const response = await getSavedSoftware();

        if (cancelled) return;

        const data = response?.data || response || [];

        setSaved(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load saved software:", err);

        if (!cancelled) {
          setError(err?.message || "Unable to load your saved software.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSavedSoftware();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="saved-page">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <section className="saved-hero">
        <div className="saved-hero-copy">
          <div className="saved-kicker">
            <Bookmark size={15} />
            <span>MY SHORTLIST</span>
          </div>

          <h1>Saved software</h1>

          <p>
            Keep the software you're interested in one place. Review your
            shortlist whenever you're ready to make a decision.
          </p>
        </div>

        <div className="saved-hero-actions">
          <Button onClick={() => navigate("/software-directory")}>
            <Search size={17} />
            Explore software
          </Button>
        </div>
      </section>

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (
        <section className="saved-loading">
          <div className="saved-skeleton saved-skeleton-header" />

          <div className="saved-skeleton-grid">
            {[1, 2, 3].map((item) => (
              <div className="saved-skeleton-card" key={item}>
                <div className="saved-skeleton saved-skeleton-logo" />

                <div className="saved-skeleton saved-skeleton-line small" />
                <div className="saved-skeleton saved-skeleton-line medium" />
                <div className="saved-skeleton saved-skeleton-line" />
                <div className="saved-skeleton saved-skeleton-line short" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          ERROR
      ====================================================== */}

      {!loading && error && (
        <section className="saved-feedback saved-feedback-error">
          <div className="saved-feedback-icon">!</div>

          <div>
            <span className="saved-feedback-label">SOMETHING WENT WRONG</span>

            <h2>We couldn't load your shortlist</h2>

            <p>{error}</p>

            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </div>
        </section>
      )}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {!loading && !error && saved.length === 0 && (
        <section className="saved-empty">
          <div className="saved-empty-visual">
            <div className="saved-empty-icon">
              <Bookmark size={32} strokeWidth={1.8} />
            </div>

            <div className="saved-empty-dot dot-one" />
            <div className="saved-empty-dot dot-two" />
            <div className="saved-empty-dot dot-three" />
          </div>

          <div className="saved-empty-copy">
            <span className="saved-feedback-label">YOUR SHORTLIST</span>

            <h2>Your shortlist is empty</h2>

            <p>
              Save software you're interested in and we'll keep everything
              organized here. Compare your options when you're ready to decide.
            </p>
          </div>

          <div className="saved-empty-actions">
            <Button onClick={() => navigate("/software-directory")}>
              Explore software
              <ArrowRight size={17} />
            </Button>

            <button
              type="button"
              className="saved-text-link"
              onClick={() => navigate("/recommendation")}
            >
              Get a recommendation
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* =====================================================
          SAVED SOFTWARE
      ====================================================== */}

      {!loading && !error && saved.length > 0 && (
        <section className="saved-content">
          {/* SUMMARY */}

          <div className="saved-section-header">
            <div>
              <span className="saved-feedback-label">YOUR SHORTLIST</span>

              <h2>
                {saved.length} {saved.length === 1 ? "software" : "software"}{" "}
                saved
              </h2>
            </div>

            <span className="saved-count">
              {saved.length} of your saved products
            </span>
          </div>

          {/* GRID */}

          <div className="saved-grid">
            {saved.map((item) => {
              const initials = (item.name || "SW")
                .split(" ")
                .slice(0, 2)
                .map((word) => word.charAt(0))
                .join("")
                .toUpperCase();

              return (
                <article className="saved-card" key={item.id}>
                  {/* CARD TOP */}

                  <div className="saved-card-top">
                    <div className="saved-card-brand">
                      <div className="saved-logo">{initials}</div>

                      <div>
                        <span className="saved-category">
                          {item.category || "Software"}
                        </span>

                        <h3>{item.name}</h3>
                      </div>
                    </div>

                    <div className="saved-bookmark">
                      <Bookmark size={18} fill="currentColor" />
                    </div>
                  </div>

                  {/* RATING */}

                  <div className="saved-rating">
                    {item.rating && (
                      <>
                        <Star size={15} fill="currentColor" />

                        <strong>{item.rating}</strong>

                        <span>rating</span>
                      </>
                    )}
                  </div>

                  {/* DESCRIPTION */}

                  <p className="saved-description">
                    {item.description ||
                      "Explore features, pricing and business fit for this software."}
                  </p>

                  {/* PRICE */}

                  <div className="saved-price">
                    <span>Starting price</span>

                    <strong>{item.price || "Contact vendor"}</strong>
                  </div>

                  {/* FOOTER */}

                  <div className="saved-card-footer">
                    <button
                      type="button"
                      className="saved-view-button"
                      onClick={() => navigate(`/software/${item.slug}`)}
                    >
                      View details
                      <ArrowRight size={16} />
                    </button>

                    <button
                      type="button"
                      className="saved-external-button"
                      aria-label={`Open ${item.name}`}
                      onClick={() => navigate(`/software/${item.slug}`)}
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
