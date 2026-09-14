import PublicLayout from "../../layouts/PublicLayout";
import Icon from "../../components/common/Icon";
import { software } from "../../data/software";
import { navigate } from "../../utils/helpers";

import tokopediaLogo from "../../assets/images/tokopedia.png";
import bukalapakLogo from "../../assets/images/bukalapak.png";
import travelokaLogo from "../../assets/images/traveloka.webp";
import ruangguruLogo from "../../assets/images/ruangguru.png";
import jntLogo from "../../assets/images/jnt-express.png";
import sociollaLogo from "../../assets/images/sociolla.webp";
import mekariLogo from "../../assets/images/mekari.png";
import bcaLogo from "../../assets/images/bca.png";

import "../../styles/home.css";

const categories = [
  {
    name: "CRM",
    count: "124 Software",
    icon: "users",
  },
  {
    name: "ERP",
    count: "98 Software",
    icon: "layers",
  },
  {
    name: "Accounting",
    count: "86 Software",
    icon: "wallet",
  },
  {
    name: "HR Software",
    count: "72 Software",
    icon: "users",
  },
  {
    name: "Marketing",
    count: "66 Software",
    icon: "megaphone",
  },
  {
    name: "Project Management",
    count: "58 Software",
    icon: "clipboard",
  },
  {
    name: "Help Desk",
    count: "45 Software",
    icon: "headphones",
  },
];

const popularSearches = [
  "CRM",
  "Accounting",
  "ERP",
  "HR Software",
  "Project Management",
];

const recommendations = [
  {
    rank: 1,
    name: "Zoho CRM",
    rating: "4.6",
    logo: "∞",
  },
  {
    rank: 2,
    name: "HubSpot CRM",
    rating: "4.5",
    logo: "H",
  },
  {
    rank: 3,
    name: "Salesforce Sales Cloud",
    rating: "4.4",
    logo: "☁",
  },
];

const features = [
  {
    icon: "box",
    title: "1000+ Software",
    description: "Explore verified business software across all categories.",
  },
  {
    icon: "scale",
    title: "Compare Easily",
    description: "Compare features, pricing, and reviews side by side.",
  },
  {
    icon: "sparkles",
    title: "Smart Recommendation",
    description: "Get AI-powered recommendations based on your business needs.",
  },
  {
    icon: "shield",
    title: "Trusted Reviews",
    description: "Real user reviews to help you make confident decisions.",
  },
];

const fallbackSoftware = [
  {
    id: 1,
    name: "Zoho CRM",
    category: "CRM",
    rating: 4.6,
    reviews_count: 1240,
    pricing: "$14 / user / month",
    logo: "∞",
  },
  {
    id: 2,
    name: "HubSpot CRM",
    category: "CRM",
    rating: 4.5,
    reviews_count: 1080,
    pricing: "$15 / user / month",
    logo: "H",
  },
  {
    id: 3,
    name: "Salesforce",
    category: "CRM",
    rating: 4.4,
    reviews_count: 980,
    pricing: "$25 / user / month",
    logo: "☁",
  },
  {
    id: 4,
    name: "Odoo ERP",
    category: "ERP",
    rating: 4.3,
    reviews_count: 760,
    pricing: "$24.90 / user / month",
    logo: "odoo",
  },
  {
    id: 5,
    name: "Microsoft 365",
    category: "Productivity",
    rating: 4.6,
    reviews_count: 890,
    pricing: "$6 / user / month",
    logo: "365",
  },
];

/* =========================================================
   TRUSTED BUSINESSES
   ========================================================= */

const trustedBusinesses = [
  {
    name: "Tokopedia",
    logo: tokopediaLogo,
  },
  {
    name: "Bukalapak",
    logo: bukalapakLogo,
  },
  {
    name: "Traveloka",
    logo: travelokaLogo,
  },
  {
    name: "Ruangguru",
    logo: ruangguruLogo,
  },
  {
    name: "J&T Express",
    logo: jntLogo,
  },
  {
    name: "Sociolla",
    logo: sociollaLogo,
  },
  {
    name: "Mekari",
    logo: mekariLogo,
  },
  {
    name: "BCA",
    logo: bcaLogo,
  },
];

function getSoftwareLogo(item, index) {
  if (item?.logo) {
    return item.logo;
  }

  const names = ["∞", "H", "☁", "odoo", "365"];

  return names[index] || item?.name?.slice(0, 2).toUpperCase() || "SW";
}

function getRating(item) {
  return Number(
    item?.rating ?? item?.average_rating ?? item?.ratings_avg_rating ?? 4.5,
  );
}

function getReviewCount(item) {
  return item?.reviews_count ?? item?.review_count ?? item?.reviews ?? 0;
}

function getPricing(item) {
  if (item?.pricing) return item.pricing;

  if (item?.first_pricing?.price) {
    return `$${item.first_pricing.price} / user / month`;
  }

  if (item?.pricings?.length) {
    const pricing = item.pricings[0];

    if (pricing?.price) {
      return `$${pricing.price} / user / month`;
    }
  }

  return "Contact vendor";
}

function RatingStars({ rating }) {
  return (
    <div className="home-rating">
      <span className="home-stars">★★★★★</span>

      <span className="home-rating-number">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function Home() {
  const popularSoftware =
    software?.length > 0 ? software.slice(0, 5) : fallbackSoftware;

  return (
    <PublicLayout>
      <main className="home-page">
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="home-hero">
          <div className="home-container home-hero-grid">
            {/* HERO COPY */}

            <div className="home-hero-copy">
              <span className="home-eyebrow">SOFTWARE DISCOVERY PLATFORM</span>

              <h1>
                Find the <span>Best Software</span>
                <br />
                for Your Business
              </h1>

              <p className="home-hero-description">
                Discover, compare, and choose the right software with
                confidence. 1000+ software, real reviews, and smart
                recommendations.
              </p>

              {/* SEARCH */}

              <button
                type="button"
                className="home-search"
                onClick={() => navigate("/software")}
              >
                <span className="home-search-placeholder">
                  Search software, category, or business need...
                </span>

                <span className="home-search-button">
                  <Icon name="search" />
                </span>
              </button>

              {/* POPULAR SEARCHES */}

              <div className="home-popular-searches">
                <span>Popular searches:</span>

                <div className="home-search-tags">
                  {popularSearches.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => navigate("/software")}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* HERO RECOMMENDATION */}

            <div className="home-hero-visual">
              {/* MATCH BADGE */}

              <div className="home-floating-badge home-match-badge">
                <div className="home-floating-icon">
                  <Icon name="shield" />
                </div>

                <div>
                  <strong>95%</strong>
                  <span>Match Score</span>
                </div>
              </div>

              {/* COMPARE BADGE */}

              <button
                type="button"
                className="home-compare-badge"
                onClick={() => navigate("/compare")}
              >
                <Icon name="scale" />

                <span>
                  <strong>Compare</strong>
                  <small>Side by side</small>
                </span>
              </button>

              {/* MAIN RECOMMENDATION CARD */}

              <div className="home-recommendation">
                <div className="home-recommendation-head">
                  <span>Top Recommendation for You</span>
                </div>

                <div className="home-recommendation-list">
                  {recommendations.map((item) => (
                    <div className="home-recommendation-item" key={item.rank}>
                      <span className="home-recommendation-rank">
                        {item.rank}
                      </span>

                      <div className="home-recommendation-logo">
                        {item.logo}
                      </div>

                      <div className="home-recommendation-info">
                        <strong>{item.name}</strong>

                        <RatingStars rating={Number(item.rating)} />
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate("/software")}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SOFTWARE BADGE */}

              <div className="home-floating-badge home-software-badge">
                <div className="home-floating-icon">
                  <Icon name="layers" />
                </div>

                <div>
                  <strong>1000+</strong>
                  <span>Software</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            VALUE PROPOSITION
        ====================================================== */}

        <section className="home-features">
          <div className="home-container home-feature-grid">
            {features.map((feature) => (
              <div className="home-feature" key={feature.title}>
                <div className="home-feature-icon">
                  <Icon name={feature.icon} />
                </div>

                <div className="home-feature-content">
                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            CATEGORIES + POPULAR SOFTWARE
        ====================================================== */}

        <section className="home-content-section">
          <div className="home-container">
            <div className="home-content-grid">
              {/* TOP CATEGORIES */}

              <div className="home-content-column">
                <div className="home-section-head">
                  <div>
                    <h2>Top Categories</h2>
                  </div>

                  <button
                    type="button"
                    className="home-view-all"
                    onClick={() => navigate("/software")}
                  >
                    View all categories
                    <Icon name="arrow" />
                  </button>
                </div>

                <div className="home-category-grid">
                  {categories.map((category) => (
                    <button
                      type="button"
                      className="home-category-card"
                      key={category.name}
                      onClick={() => navigate("/software")}
                    >
                      <div className="home-category-icon">
                        <Icon name={category.icon} />
                      </div>

                      <strong>{category.name}</strong>

                      <span>{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* POPULAR SOFTWARE */}

              <div className="home-content-column">
                <div className="home-section-head">
                  <div>
                    <h2>Popular Software</h2>
                  </div>

                  <button
                    type="button"
                    className="home-view-all"
                    onClick={() => navigate("/software")}
                  >
                    View all software
                    <Icon name="arrow" />
                  </button>
                </div>

                <div className="home-software-grid">
                  {popularSoftware.map((item, index) => {
                    const rating = getRating(item);
                    const reviews = getReviewCount(item);
                    const pricing = getPricing(item);

                    return (
                      <article
                        className="home-software-card"
                        key={item.id ?? item.name}
                      >
                        <div className="home-software-logo">
                          {getSoftwareLogo(item, index)}
                        </div>

                        <h3>{item.name}</h3>

                        <RatingStars rating={rating} />

                        <div className="home-software-price-label">
                          Starting from
                        </div>

                        <strong className="home-software-price">
                          {pricing}
                        </strong>

                        {reviews > 0 && (
                          <span className="home-software-reviews">
                            {reviews.toLocaleString()} reviews
                          </span>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            RECOMMENDATION CTA
        ====================================================== */}

        <section className="home-recommendation-cta">
          <div className="home-container">
            <div className="home-cta">
              <div className="home-cta-illustration">
                <div className="home-cta-plant">🌱</div>

                <div className="home-cta-board">
                  <div className="home-cta-board-head">
                    <span>✓</span>
                    <span>✓</span>
                    <span>✓</span>
                  </div>

                  <div className="home-cta-line" />
                  <div className="home-cta-line short" />
                  <div className="home-cta-line" />
                  <div className="home-cta-line short" />
                </div>
              </div>

              <div className="home-cta-copy">
                <h2>Not sure which software is right for you?</h2>

                <p>
                  Answer a few questions and get personalized recommendations.
                </p>
              </div>

              <button
                type="button"
                className="home-cta-button"
                onClick={() => navigate("/recommend")}
              >
                <span>Get Recommendation</span>
                <Icon name="arrow" />
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            TRUSTED BUSINESSES
        ====================================================== */}

        <section className="home-trusted">
          <div className="home-container">
            <p>Trusted by businesses worldwide</p>

            <div className="home-trusted-logos">
              {trustedBusinesses.map((business) => (
                <div className="home-trusted-logo" key={business.name}>
                  <img src={business.logo} alt={business.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
