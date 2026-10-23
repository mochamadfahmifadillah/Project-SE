import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ExternalLink,
  GitCompare,
  HelpCircle,
  Pencil,
  Star,
  Trophy,
  Users,
  Wallet,
  Building2,
  Factory,
  Handshake,
} from "lucide-react";

import PublicLayout from "../../layouts/PublicLayout";
import Button from "../../components/common/Button";

function RecommendationResult({ answers = {}, result = {}, onRetake }) {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Recommendations
  |--------------------------------------------------------------------------
  */

  const recommendations = useMemo(() => {
    if (Array.isArray(result?.recommendations)) {
      return result.recommendations;
    }

    if (Array.isArray(result?.data?.recommendations)) {
      return result.data.recommendations;
    }

    if (Array.isArray(result?.data)) {
      return result.data;
    }

    return [];
  }, [result]);

  const topRecommendations = recommendations.slice(0, 3);
  const otherRecommendations = recommendations.slice(3);

  /*
  |--------------------------------------------------------------------------
  | Summary Data
  |--------------------------------------------------------------------------
  */

  const getAnswer = (...values) => {
    const value = values.find((item) => {
      if (Array.isArray(item)) {
        return item.length > 0;
      }

      return item !== undefined && item !== null && item !== "";
    });

    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "Belum dijawab";
    }

    return value ?? "Belum dijawab";
  };

  const summaryItems = useMemo(
    () => [
      {
        label: "Business Type",
        value: getAnswer(
          answers.business_type,
          answers.businessType,
          answers.business_type_name,
        ),
        icon: <Building2 size={20} strokeWidth={2} />,
      },
      {
        label: "Industry",
        value: getAnswer(answers.industry, answers.industry_name),
        icon: <Factory size={20} strokeWidth={2} />,
      },
      {
        label: "Team Size",
        value: getAnswer(
          answers.team_size,
          answers.teamSize,
          answers.team_size_name,
        ),
        icon: <Users size={20} strokeWidth={2} />,
      },
      {
        label: "Budget",
        value: getAnswer(answers.budget, answers.budget_range),
        icon: <Wallet size={20} strokeWidth={2} />,
      },
    ],
    [answers],
  );

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const getScore = (item) => {
    const raw =
      item?.match_score ?? item?.matchScore ?? item?.score ?? item?.fit;

    if (raw === undefined || raw === null || raw === "") {
      return null;
    }

    if (typeof raw === "string" && raw.includes("%")) {
      const parsed = Number.parseFloat(raw);

      return Number.isFinite(parsed)
        ? Math.max(0, Math.min(100, Math.round(parsed)))
        : null;
    }

    const number = Number(raw);

    if (!Number.isFinite(number)) {
      return null;
    }

    const score = number > 0 && number <= 1 ? number * 100 : number;

    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const getRating = (item) => {
    const raw = item?.rating ?? item?.average_rating ?? item?.review_rating;

    if (raw === undefined || raw === null || raw === "") {
      return null;
    }

    const rating = Number(raw);

    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      return null;
    }

    return rating.toFixed(1);
  };

  const getReviews = (item) => {
    const raw = item?.reviews_count ?? item?.review_count ?? item?.reviews;

    if (raw === undefined || raw === null || raw === "") {
      return null;
    }

    if (typeof raw === "number") {
      return Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : null;
    }

    const number = Number(String(raw).replace(/,/g, ""));

    return Number.isFinite(number) && number >= 0 ? Math.floor(number) : null;
  };

  const getDescription = (item) => {
    return (
      item?.description ||
      item?.short_description ||
      item?.shortDescription ||
      "Deskripsi software belum tersedia."
    );
  };

  const normalizeLabel = (value) => {
    if (typeof value === "string") {
      return value.trim();
    }

    if (typeof value === "object" && value !== null) {
      return (
        value.name ||
        value.title ||
        value.feature_name ||
        value.label ||
        value.category_name ||
        ""
      );
    }

    return "";
  };

  const getFeatures = (item) => {
    const source = Array.isArray(item?.features)
      ? item.features
      : Array.isArray(item?.must_have_features)
        ? item.must_have_features
        : [];

    return source.map(normalizeLabel).filter(Boolean).slice(0, 4);
  };

  const getTags = (item) => {
    const source = Array.isArray(item?.tags)
      ? item.tags
      : Array.isArray(item?.categories)
        ? item.categories
        : [];

    return source.map(normalizeLabel).filter(Boolean).slice(0, 3);
  };

  const getLogo = (item) => {
    return (
      item?.logo ||
      item?.logo_url ||
      item?.logoUrl ||
      item?.image ||
      item?.image_url ||
      null
    );
  };

  const getMatchLabel = (score) => {
    if (score === null) {
      return "Score unavailable";
    }

    if (score >= 90) return "Excellent Match";
    if (score >= 80) return "Great Match";
    if (score >= 70) return "Good Match";

    return "Potential Match";
  };

  const getSoftwareName = (item) => {
    return item?.name || item?.software_name || "Software";
  };

  const getSoftwareSlug = (item) => {
    return item?.slug || item?.software_slug || null;
  };

  const getWebsite = (item) => {
    const website = item?.website || item?.url;

    if (typeof website !== "string" || !website.trim()) {
      return null;
    }

    if (!/^https?:\/\//i.test(website)) {
      return null;
    }

    return website;
  };

  /*
  |--------------------------------------------------------------------------
  | Handlers
  |--------------------------------------------------------------------------
  */

  const handleDetails = (item) => {
    const slug = getSoftwareSlug(item);

    if (!slug) return;

    navigate(`/software/${encodeURIComponent(slug)}`);
  };

  const handleCompare = (item) => {
    const slug = getSoftwareSlug(item);

    if (!slug) return;

    navigate(`/compare?software=${encodeURIComponent(slug)}`);
  };

  const handleVisitWebsite = (item) => {
    const website = getWebsite(item);

    if (!website) return;

    window.open(website, "_blank", "noopener,noreferrer");
  };

  const handleCompareAll = () => {
    const slugs = topRecommendations.map(getSoftwareSlug).filter(Boolean);

    if (!slugs.length) {
      navigate("/compare");
      return;
    }

    navigate(`/compare?software=${slugs.map(encodeURIComponent).join(",")}`);
  };

  const handleImplementation = () => {
    navigate("/implementation");
  };

  /*
  |--------------------------------------------------------------------------
  | Progress
  |--------------------------------------------------------------------------
  */

  const progressSteps = [
    "Business Type",
    "Business Size",
    "Industry",
    "Key Needs",
    "Must-have Features",
    "Budget",
    "Team Size",
    "Integrations",
    "Summary",
    "Results",
  ];

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <PublicLayout>
      <main className="recommendation-page">
        {/* Header */}
        <section className="recommendation-header">
          <div>
            <span className="recommendation-eyebrow">
              RECOMMENDATION RESULT
            </span>

            <h1>Your software recommendations</h1>

            <p>
              Explore software options based on the information you provided.
              Unanswered questions were left out of your submitted preferences.
            </p>
          </div>

          <Button
            variant="secondary"
            className="edit-answer-button"
            onClick={onRetake}
          >
            <Pencil size={17} strokeWidth={2} />
            Edit Answers
          </Button>
        </section>

        {/* Progress */}
        <section
          className="recommendation-progress"
          aria-label="Recommendation progress"
        >
          <div className="progress-line" />

          {progressSteps.map((step, index) => {
            const active = index === progressSteps.length - 1;
            const completed = index < progressSteps.length - 1;

            return (
              <div
                className={[
                  "progress-step",
                  active ? "active" : "",
                  completed ? "completed" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={step}
              >
                <div className="progress-circle">
                  {completed ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    index + 1
                  )}
                </div>

                <span>{step}</span>
              </div>
            );
          })}
        </section>

        {/* Result Summary */}
        <section className="result-summary">
          <div className="summary-illustration">
            <div className="summary-trophy">
              <Trophy size={42} strokeWidth={1.8} />
            </div>
          </div>

          <div className="summary-content">
            <h2>Recommendation overview</h2>

            <p>These are the preferences submitted for this recommendation.</p>

            <div className="summary-items">
              {summaryItems.map((item) => (
                <div className="summary-item" key={item.label}>
                  <div className="summary-icon">{item.icon}</div>

                  <div>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="button" className="summary-edit" onClick={onRetake}>
            <Pencil size={16} strokeWidth={2} />
            Edit Answers
          </button>
        </section>

        {/* No Results */}
        {!recommendations.length && (
          <section className="recommendation-empty">
            <div className="empty-icon">
              <HelpCircle size={32} strokeWidth={1.8} />
            </div>

            <h2>No recommendations found</h2>

            <p>
              There are no matching software recommendations for the submitted
              preferences. Try answering more questions or changing your
              preferences.
            </p>

            <Button onClick={onRetake}>Try Again</Button>
          </section>
        )}

        {/* Top 3 Recommendations */}
        {topRecommendations.length > 0 && (
          <section className="top-recommendations">
            <div className="section-title-row">
              <div>
                <span className="section-eyebrow">TOP PICKS</span>
                <h2>Top {topRecommendations.length} Recommended Software</h2>
              </div>

              <span className="section-count">
                {topRecommendations.length} matches
              </span>
            </div>

            <div className="recommendation-list">
              {topRecommendations.map((item, index) => {
                const score = getScore(item);
                const rating = getRating(item);
                const reviews = getReviews(item);
                const features = getFeatures(item);
                const tags = getTags(item);
                const logo = getLogo(item);
                const name = getSoftwareName(item);
                const website = getWebsite(item);
                const slug = getSoftwareSlug(item);

                return (
                  <article
                    className="recommendation-card"
                    key={item?.id || slug || `${name}-${index}`}
                  >
                    {/* Ranking */}
                    <div className={`ranking-badge rank-${index + 1}`}>
                      {index + 1}
                    </div>

                    {/* Product */}
                    <div className="recommendation-product">
                      <div className="software-logo-large">
                        {logo ? (
                          <img src={logo} alt={`${name} logo`} />
                        ) : (
                          <span>{name.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>

                      <div className="product-info">
                        <div className="product-name-row">
                          <h3>{name}</h3>

                          {index === 0 && (
                            <span className="best-match-badge">
                              <Check size={13} strokeWidth={2.5} />
                              Top Result
                            </span>
                          )}
                        </div>

                        {/* Rating */}
                        {rating !== null && (
                          <div className="rating-row">
                            <span
                              className="stars"
                              aria-label={`${rating} out of 5 stars`}
                            >
                              {Array.from({ length: 5 }, (_, starIndex) => (
                                <Star
                                  key={starIndex}
                                  size={16}
                                  fill={
                                    starIndex < Math.round(Number(rating))
                                      ? "currentColor"
                                      : "none"
                                  }
                                  strokeWidth={1.5}
                                />
                              ))}
                            </span>

                            <strong>{rating}</strong>

                            {reviews !== null && (
                              <span>({reviews.toLocaleString()} reviews)</span>
                            )}
                          </div>
                        )}

                        <p>{getDescription(item)}</p>

                        {/* Tags */}
                        {tags.length > 0 && (
                          <div className="software-tags">
                            {tags.map((tag, tagIndex) => (
                              <span key={`${tag}-${tagIndex}`}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="match-score">
                      <span className="match-title">Match Score</span>

                      <div
                        className="score-gauge"
                        style={{
                          "--score": `${(score ?? 0) * 3.6}deg`,
                        }}
                        aria-label={
                          score === null
                            ? "Match score unavailable"
                            : `Match score ${score}%`
                        }
                      >
                        <div className="score-gauge-inner">
                          <strong>
                            {score === null ? "N/A" : `${score}%`}
                          </strong>
                        </div>
                      </div>

                      <span className="match-label">
                        {getMatchLabel(score)}
                      </span>
                    </div>

                    {/* Why Match */}
                    <div className="why-match">
                      <h4>Software Features</h4>

                      {features.length > 0 ? (
                        <ul>
                          {features.map((feature, featureIndex) => (
                            <li key={`${feature}-${featureIndex}`}>
                              <span className="check-icon">
                                <Check size={15} strokeWidth={2.5} />
                              </span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Feature information is not available.</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="recommendation-actions">
                      <button
                        type="button"
                        className="primary-action"
                        onClick={() => handleDetails(item)}
                        disabled={!slug}
                      >
                        View Details
                        <ArrowRight size={16} strokeWidth={2} />
                      </button>

                      <button
                        type="button"
                        className="secondary-action"
                        onClick={() => handleCompare(item)}
                        disabled={!slug}
                      >
                        <GitCompare size={16} strokeWidth={2} />
                        Compare
                      </button>

                      <button
                        type="button"
                        className="secondary-action"
                        onClick={() => handleVisitWebsite(item)}
                        disabled={!website}
                      >
                        <ExternalLink size={16} strokeWidth={2} />
                        Visit Website
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Other Software */}
        {otherRecommendations.length > 0 && (
          <section className="other-software">
            <div className="other-header">
              <div>
                <span className="section-eyebrow">ALTERNATIVES</span>
                <h3>Other software you might consider</h3>
              </div>

              <span>{otherRecommendations.length} options</span>
            </div>

            <div className="other-software-grid">
              {otherRecommendations.slice(0, 4).map((item, index) => {
                const logo = getLogo(item);
                const name = getSoftwareName(item);
                const rating = getRating(item);
                const slug = getSoftwareSlug(item);

                return (
                  <button
                    type="button"
                    className="other-software-card"
                    key={item?.id || slug || `${name}-${index}`}
                    onClick={() => handleDetails(item)}
                    disabled={!slug}
                  >
                    <div className="other-logo">
                      {logo ? (
                        <img src={logo} alt={`${name} logo`} />
                      ) : (
                        name.slice(0, 1).toUpperCase()
                      )}
                    </div>

                    <div>
                      <strong>{name}</strong>

                      {rating !== null && (
                        <div className="other-rating">
                          <Star
                            className="small-stars"
                            size={14}
                            fill="currentColor"
                            strokeWidth={1.5}
                          />
                          <span>{rating}</span>
                        </div>
                      )}
                    </div>

                    <span className="arrow">
                      <ArrowRight size={18} strokeWidth={2} />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Help CTA */}
        <section className="recommendation-help">
          <div className="help-content">
            <span className="section-eyebrow">NEED HELP?</span>

            <h2>Need help choosing?</h2>

            <p>Get help exploring implementation options for your business.</p>

            <Button onClick={handleImplementation}>
              Request Consultation
              <ArrowRight size={17} strokeWidth={2} />
            </Button>
          </div>

          <div className="help-illustration">
            <BriefcaseBusiness size={64} strokeWidth={1.5} />
          </div>
        </section>

        {/* Bottom Actions */}
        <section className="result-bottom-actions">
          <div className="bottom-action">
            <div className="bottom-icon">
              <GitCompare size={24} strokeWidth={1.8} />
            </div>

            <div>
              <strong>Compare your top choices</strong>
              <p>Compare available software options side by side.</p>
            </div>

            <button
              type="button"
              onClick={handleCompareAll}
              disabled={!topRecommendations.length}
            >
              Compare Now ({topRecommendations.length})
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>

          <div className="bottom-divider">or</div>

          <div className="bottom-action">
            <div className="bottom-icon">
              <Handshake size={24} strokeWidth={1.8} />
            </div>

            <div>
              <strong>Request implementation help</strong>
              <p>Explore implementation support for your selected software.</p>
            </div>

            <button type="button" onClick={handleImplementation}>
              Get Implementation Help
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

export default RecommendationResult;
