import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ExternalLink,
  GitCompare,
  Handshake,
  HelpCircle,
  Heart,
  Pencil,
  Star,
  Trophy,
  Users,
  Wallet,
  Building2,
  Factory,
} from "lucide-react";

import PublicLayout from "../../layouts/PublicLayout";
import Button from "../../components/common/Button";

function RecommendationResult({ answers = {}, result = {}, onRetake }) {
  const navigate = useNavigate();

  const recommendations =
    result?.recommendations ||
    result?.data?.recommendations ||
    result?.data ||
    [];

  const safeRecommendations = Array.isArray(recommendations)
    ? recommendations
    : [];

  const topRecommendations = safeRecommendations.slice(0, 3);
  const otherRecommendations = safeRecommendations.slice(3);

  const summaryItems = useMemo(
    () => [
      {
        label: "Business Type",
        value:
          answers.business_type ||
          answers.businessType ||
          answers.business_type_name ||
          "B2B",
        icon: <Building2 size={20} strokeWidth={2} />,
      },
      {
        label: "Industry",
        value:
          answers.industry || answers.industry_name || "Retail & E-commerce",
        icon: <Factory size={20} strokeWidth={2} />,
      },
      {
        label: "Team Size",
        value:
          answers.team_size ||
          answers.teamSize ||
          answers.team_size_name ||
          "20 - 50 people",
        icon: <Users size={20} strokeWidth={2} />,
      },
      {
        label: "Budget",
        value:
          answers.budget || answers.budget_range || "$1,000 - $5,000 / month",
        icon: <Wallet size={20} strokeWidth={2} />,
      },
    ],
    [answers],
  );

  const getScore = (item) => {
    const raw =
      item?.match_score ?? item?.matchScore ?? item?.score ?? item?.fit ?? 0;

    if (typeof raw === "string" && raw.includes("%")) {
      return Math.round(parseFloat(raw));
    }

    const number = Number(raw);

    if (number > 0 && number <= 1) {
      return Math.round(number * 100);
    }

    return Math.round(number || 0);
  };

  const getRating = (item) =>
    item?.rating ?? item?.average_rating ?? item?.review_rating ?? "4.6";

  const getReviews = (item) =>
    item?.reviews_count ?? item?.review_count ?? item?.reviews ?? "2,456";

  const getDescription = (item) =>
    item?.description ||
    "Complete software platform designed to help your business attract, engage and delight customers.";

  const getFeatures = (item) => {
    if (Array.isArray(item?.features)) {
      return item.features.slice(0, 5).map((feature) => {
        if (typeof feature === "string") return feature;

        return (
          feature?.name ||
          feature?.title ||
          feature?.feature_name ||
          "Business feature"
        );
      });
    }

    if (Array.isArray(item?.tags)) {
      return item.tags.slice(0, 5);
    }

    return [
      "Meets your must-have features",
      "Fits your business requirements",
      "Within your budget range",
      "Good fit for your team size",
    ];
  };

  const getTags = (item) => {
    if (Array.isArray(item?.tags)) {
      return item.tags
        .slice(0, 3)
        .map((tag) =>
          typeof tag === "string" ? tag : tag?.name || tag?.title || "Feature",
        );
    }

    if (Array.isArray(item?.categories)) {
      return item.categories
        .slice(0, 3)
        .map((category) =>
          typeof category === "string"
            ? category
            : category?.name || category?.title || "Category",
        );
    }

    return ["CRM", "Sales Automation", "Marketing Automation"];
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
    if (score >= 90) return "Excellent Match";
    if (score >= 80) return "Great Match";
    if (score >= 70) return "Good Match";
    return "Potential Match";
  };

  const handleDetails = (item) => {
    if (!item?.slug) return;

    navigate(`/software/${item.slug}`);
  };

  const handleCompare = (item) => {
    if (!item?.slug) return;

    navigate(`/compare?software=${item.slug}`);
  };

  return (
    <PublicLayout>
      <main className="recommendation-page">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <section className="recommendation-header">
          <div>
            <span className="recommendation-eyebrow">
              RECOMMENDATION RESULT
            </span>

            <h1>Here are your top software recommendations!</h1>

            <p>
              Based on your answers, we found the best software that match your
              business needs.
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

        {/* =====================================================
            PROGRESS
        ====================================================== */}
        <section className="recommendation-progress">
          <div className="progress-line" />

          {[
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
          ].map((step, index) => {
            const active = index === 9;
            const completed = index < 3;

            return (
              <div
                className={`progress-step ${
                  active ? "active" : ""
                } ${completed ? "completed" : ""}`}
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

        {/* =====================================================
            RESULT SUMMARY
        ====================================================== */}
        <section className="result-summary">
          <div className="summary-illustration">
            <div className="summary-trophy">
              <Trophy size={42} strokeWidth={1.8} />
            </div>
          </div>

          <div className="summary-content">
            <h2>Here are your top software recommendations!</h2>

            <p>
              Based on your answers, we found the best software that match your
              business needs.
            </p>

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

        {/* =====================================================
            NO RESULT
        ====================================================== */}
        {!safeRecommendations.length && (
          <section className="recommendation-empty">
            <div className="empty-icon">
              <HelpCircle size={32} strokeWidth={1.8} />
            </div>

            <h2>No recommendations found</h2>

            <p>
              We could not find suitable software based on your current
              requirements.
            </p>

            <Button onClick={onRetake}>Try Again</Button>
          </section>
        )}

        {/* =====================================================
            TOP 3
        ====================================================== */}
        {topRecommendations.length > 0 && (
          <section className="top-recommendations">
            <div className="section-title-row">
              <div>
                <span className="section-eyebrow">TOP PICKS</span>
                <h2>Top 3 Recommended Software</h2>
              </div>

              <span className="section-count">
                {topRecommendations.length} matches
              </span>
            </div>

            <div className="recommendation-list">
              {topRecommendations.map((item, index) => {
                const score = getScore(item);
                const features = getFeatures(item);
                const tags = getTags(item);
                const logo = getLogo(item);

                return (
                  <article
                    className="recommendation-card"
                    key={item.id || item.slug || index}
                  >
                    {/* Ranking */}
                    <div className={`ranking-badge rank-${index + 1}`}>
                      {index + 1}
                    </div>

                    {/* Product */}
                    <div className="recommendation-product">
                      <div className="software-logo-large">
                        {logo ? (
                          <img src={logo} alt={item.name || "Software logo"} />
                        ) : (
                          <span>
                            {item.name?.slice(0, 2).toUpperCase() || "SW"}
                          </span>
                        )}
                      </div>

                      <div className="product-info">
                        <div className="product-name-row">
                          <h3>{item.name || "Software"}</h3>

                          {index === 0 && (
                            <span className="best-match-badge">
                              <Check size={13} strokeWidth={2.5} />
                              Best Match
                            </span>
                          )}
                        </div>

                        <div className="rating-row">
                          <span className="stars" aria-label="5 stars">
                            <Star
                              size={16}
                              fill="currentColor"
                              strokeWidth={1.5}
                            />
                            <Star
                              size={16}
                              fill="currentColor"
                              strokeWidth={1.5}
                            />
                            <Star
                              size={16}
                              fill="currentColor"
                              strokeWidth={1.5}
                            />
                            <Star
                              size={16}
                              fill="currentColor"
                              strokeWidth={1.5}
                            />
                            <Star
                              size={16}
                              fill="currentColor"
                              strokeWidth={1.5}
                            />
                          </span>

                          <strong>{getRating(item)}</strong>

                          <span>
                            ({Number(getReviews(item)).toLocaleString()})
                          </span>
                        </div>

                        <p>{getDescription(item)}</p>

                        <div className="software-tags">
                          {tags.map((tag, tagIndex) => (
                            <span key={`${tag}-${tagIndex}`}>{tag}</span>
                          ))}

                          <span>+2</span>
                        </div>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="match-score">
                      <span className="match-title">Match Score</span>

                      <div
                        className="score-gauge"
                        style={{
                          "--score": `${score * 3.6}deg`,
                        }}
                      >
                        <div className="score-gauge-inner">
                          <strong>{score}%</strong>
                        </div>
                      </div>

                      <span className="match-label">
                        {getMatchLabel(score)}
                      </span>
                    </div>

                    {/* Why Match */}
                    <div className="why-match">
                      <h4>Why it's a great match</h4>

                      <ul>
                        {features.slice(0, 4).map((feature, featureIndex) => (
                          <li key={`${feature}-${featureIndex}`}>
                            <span className="check-icon">
                              <Check size={15} strokeWidth={2.5} />
                            </span>

                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="recommendation-actions">
                      <button
                        type="button"
                        className="primary-action"
                        onClick={() => handleDetails(item)}
                      >
                        View Details
                        <ArrowRight size={16} strokeWidth={2} />
                      </button>

                      <button
                        type="button"
                        className="secondary-action"
                        onClick={() => handleCompare(item)}
                      >
                        <GitCompare size={16} strokeWidth={2} />
                        Compare
                      </button>

                      <button
                        type="button"
                        className="secondary-action"
                        onClick={() =>
                          window.open(
                            item.website || item.url || "#",
                            "_blank",
                            "noopener,noreferrer",
                          )
                        }
                      >
                        <ExternalLink size={16} strokeWidth={2} />
                        Visit Website
                      </button>

                      <button type="button" className="save-action">
                        <Heart size={16} strokeWidth={2} />
                        Save
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* =====================================================
            OTHER SOFTWARE
        ====================================================== */}
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

                return (
                  <button
                    type="button"
                    className="other-software-card"
                    key={item.id || item.slug || index}
                    onClick={() => handleDetails(item)}
                  >
                    <div className="other-logo">
                      {logo ? (
                        <img src={logo} alt={item.name} />
                      ) : (
                        item.name?.slice(0, 1).toUpperCase()
                      )}
                    </div>

                    <div>
                      <strong>{item.name}</strong>

                      <div className="other-rating">
                        <Star
                          className="small-stars"
                          size={14}
                          fill="currentColor"
                          strokeWidth={1.5}
                        />

                        <span>{getRating(item)}</span>
                      </div>
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

        {/* =====================================================
            HELP CTA
        ====================================================== */}
        <section className="recommendation-help">
          <div className="help-content">
            <span className="section-eyebrow">NEED HELP?</span>

            <h2>Need help choosing?</h2>

            <p>
              Get free consultation from our software experts and find the right
              solution for your business.
            </p>

            <Button>
              Request Free Consultation
              <ArrowRight size={17} strokeWidth={2} />
            </Button>
          </div>

          <div className="help-illustration">
            <BriefcaseBusiness size={64} strokeWidth={1.5} />
          </div>
        </section>

        {/* =====================================================
            BOTTOM ACTIONS
        ====================================================== */}
        <section className="result-bottom-actions">
          <div className="bottom-action">
            <div className="bottom-icon">
              <GitCompare size={24} strokeWidth={1.8} />
            </div>

            <div>
              <strong>Compare your top choices</strong>

              <p>Compare features, pricing, and reviews side by side.</p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/compare?software=${topRecommendations
                    .map((item) => item.slug)
                    .filter(Boolean)
                    .join(",")}`,
                )
              }
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

              <p>Get matched with verified implementation partners.</p>
            </div>

            <button type="button">
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
