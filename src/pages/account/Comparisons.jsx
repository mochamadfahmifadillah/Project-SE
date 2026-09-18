import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GitCompareArrows,
  ArrowRight,
  Plus,
  CalendarDays,
} from "lucide-react";

import Button from "../../components/common/Button";

import { getComparisons } from "../../services/comparisonService";

export default function Comparisons() {
  const navigate = useNavigate();

  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadComparisons() {
      try {
        setLoading(true);
        setError("");

        const response = await getComparisons();

        if (cancelled) return;

        const data =
          response?.data ||
          response ||
          [];

        setComparisons(
          Array.isArray(data)
            ? data
            : [],
        );
      } catch (err) {
        console.error(
          "Failed to load comparisons:",
          err,
        );

        if (!cancelled) {
          setError(
            err?.message ||
              "Unable to load your software comparisons.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadComparisons();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="page-head">
        <div>
          <span className="eyebrow">
            MY ACCOUNT
          </span>

          <h1>Comparisons</h1>

          <p>
            Review the software comparisons
            you've created and continue
            evaluating your options.
          </p>
        </div>

        <Button
          onClick={() =>
            navigate("/compare")
          }
        >
          <Plus size={17} />
          New comparison
        </Button>
      </div>

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="saved-state-card">
          <div className="saved-state-icon loading-icon">
            <GitCompareArrows size={26} />
          </div>

          <div className="saved-state-content">
            <h3>
              Loading your comparisons
            </h3>

            <p>
              We're getting your saved
              comparisons ready.
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          ERROR
      ====================================================== */}

      {!loading && error && (
        <div className="saved-state-card error-state">
          <div className="saved-state-icon">
            !
          </div>

          <div className="saved-state-content">
            <span className="eyebrow">
              SOMETHING WENT WRONG
            </span>

            <h3>
              Unable to load comparisons
            </h3>

            <p>{error}</p>

            <Button
              onClick={() =>
                window.location.reload()
              }
            >
              Try again
            </Button>
          </div>
        </div>
      )}

      {/* =====================================================
          EMPTY
      ====================================================== */}

      {!loading &&
        !error &&
        comparisons.length === 0 && (
          <div className="saved-empty">
            <div className="saved-empty-icon">
              <GitCompareArrows
                size={30}
                strokeWidth={1.8}
              />
            </div>

            <span className="eyebrow">
              YOUR COMPARISONS
            </span>

            <h2>
              No comparisons yet
            </h2>

            <p>
              Create a comparison by selecting
              two or three software products.
              Your comparison history will
              appear here.
            </p>

            <div className="saved-empty-actions">
              <Button
                onClick={() =>
                  navigate("/compare")
                }
              >
                Start comparing
                <ArrowRight size={17} />
              </Button>

              <button
                type="button"
                className="saved-text-link"
                onClick={() =>
                  navigate(
                    "/software-directory",
                  )
                }
              >
                Browse software
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

      {/* =====================================================
          COMPARISONS
      ====================================================== */}

      {!loading &&
        !error &&
        comparisons.length > 0 && (
          <>
            <div className="saved-summary">
              <div>
                <span className="eyebrow">
                  YOUR HISTORY
                </span>

                <h2>
                  {comparisons.length}{" "}
                  {comparisons.length === 1
                    ? "comparison"
                    : "comparisons"}
                </h2>
              </div>
            </div>

            <div className="card-grid">
              {comparisons.map(
                (comparison) => {
                  const items =
                    comparison.software ||
                    comparison.items ||
                    comparison.software_names ||
                    [];

                  return (
                    <article
                      className="content-card comparison-card"
                      key={comparison.id}
                    >
                      {/* CARD ICON */}

                      <div className="comparison-card-icon">
                        <GitCompareArrows
                          size={20}
                        />
                      </div>

                      <span className="eyebrow">
                        COMPARISON
                      </span>

                      <h2>
                        {comparison.name ||
                          `Comparison #${comparison.id}`}
                      </h2>

                      {/* META */}

                      <div className="comparison-meta">
                        <CalendarDays
                          size={15}
                        />

                        <span>
                          {comparison.created_at
                            ? new Date(
                                comparison.created_at,
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  month:
                                    "short",
                                  day: "numeric",
                                  year:
                                    "numeric",
                                },
                              )
                            : "Recently created"}
                        </span>
                      </div>

                      {/* SOFTWARE ITEMS */}

                      {items.length > 0 && (
                        <div className="comparison-items">
                          {items
                            .slice(0, 3)
                            .map(
                              (
                                item,
                                index,
                              ) => {
                                const name =
                                  typeof item ===
                                  "string"
                                    ? item
                                    : item.name;

                                return (
                                  <div
                                    className="comparison-item"
                                    key={
                                      item.id ||
                                      `${name}-${index}`
                                    }
                                  >
                                    <span>
                                      {(
                                        name ||
                                        "Software"
                                      )
                                        .slice(
                                          0,
                                          2,
                                        )
                                        .toUpperCase()}
                                    </span>

                                    <strong>
                                      {name ||
                                        "Software"}
                                    </strong>
                                  </div>
                                );
                              },
                            )}
                        </div>
                      )}

                      {/* ACTION */}

                      <button
                        type="button"
                        className="text-btn"
                        onClick={() =>
                          navigate(
                            `/compare?id=${comparison.id}`,
                          )
                        }
                      >
                        Open comparison

                        <ArrowRight
                          size={15}
                        />
                      </button>
                    </article>
                  );
                },
              )}
            </div>
          </>
        )}
    </div>
  );
}