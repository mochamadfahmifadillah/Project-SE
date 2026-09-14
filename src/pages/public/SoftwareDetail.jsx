import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Heart,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";

import PublicLayout from "../../layouts/PublicLayout";
import { software } from "../../data/software";
import "../../styles/softwareDetail.css"
function SoftwareDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [saved, setSaved] = useState(false);

  const item = software[0];

  if (!item) {
    return (
      <PublicLayout>
        <main className="software-detail-page">
          <div className="software-empty">
            <h2>Software not found</h2>
            <p>The software you're looking for could not be found.</p>
          </div>
        </main>
      </PublicLayout>
    );
  }

  const tabs = [
    "Overview",
    "Features",
    "Pricing",
    "Integrations",
    "Reviews (2,456)",
    "Pros & Cons",
    "Alternatives (12)",
    "FAQ",
  ];

  const highlights = [
    {
      icon: "✥",
      color: "blue",
      title: "Sales Automation",
      text: "Automate your sales processes and close deals faster.",
    },
    {
      icon: "◉",
      color: "green",
      title: "Workflow Management",
      text: "Create custom workflows and approval processes without coding.",
    },
    {
      icon: "✦",
      color: "yellow",
      title: "AI Assistant",
      text: "Get insights, predictions, and recommendations powered by AI.",
    },
    {
      icon: "▣",
      color: "mint",
      title: "Omnichannel",
      text: "Engage customers via email, phone, live chat, and social media.",
    },
  ];

  const features = [
    {
      icon: "♧",
      color: "purple",
      title: "Leads & Contacts",
      text: "Capture, track and manage leads and customer information in one place.",
    },
    {
      icon: "▦",
      color: "green",
      title: "Deal Management",
      text: "Track deals across pipeline stages and forecast revenue accurately.",
    },
    {
      icon: "✉",
      color: "blue",
      title: "Email & Sequences",
      text: "Send personalized emails and automate follow-ups with sequences.",
    },
    {
      icon: "▧",
      color: "red",
      title: "Reports & Analytics",
      text: "Build custom reports and dashboards to monitor performance.",
    },
    {
      icon: "▥",
      color: "cyan",
      title: "Mobile CRM",
      text: "Access your CRM data and manage your business on the go.",
    },
    {
      icon: "✣",
      color: "blue",
      title: "Workflow Automation",
      text: "Automate repetitive tasks and streamline your business processes.",
    },
  ];

  const gallery = [
    "Dashboard",
    "Analytics",
    "Contacts",
    "Reports",
  ];

  return (
    <PublicLayout>
      <main className="software-detail-page">

        {/* =====================================================
            BREADCRUMB
        ===================================================== */}
        <div className="software-breadcrumb">
          <span>Home</span>
          <ChevronRight size={13} />
          <span>Software</span>
          <ChevronRight size={13} />
          <span>{item.category || "CRM"}</span>
          <ChevronRight size={13} />
          <strong>{item.name}</strong>
        </div>

        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="software-hero">

          {/* LEFT SIDE */}
          <div className="software-hero-left">

            <div className="software-logo-wrap">
              <div className="software-logo">
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={`${item.name} logo`}
                  />
                ) : (
                  <span>
                    {item.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <label className="compare-checkbox">
                <input type="checkbox" />
                <span>Add to Compare</span>
              </label>
            </div>

            <div className="software-hero-info">

              <div className="software-title">
                <h1>{item.name}</h1>

                <span className="verified">
                  <ShieldCheck size={13} />
                  Verified
                </span>
              </div>

              <p className="software-description">
                Complete CRM platform to attract, engage and delight
                customers across sales, marketing and support.
              </p>

              <div className="rating-row">

                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={15}
                      fill="#F5A623"
                      color="#F5A623"
                    />
                  ))}
                </div>

                <strong>{item.rating || "4.6"}</strong>

                <a href="#reviews">
                  (2,456 reviews)
                </a>
              </div>

              <div className="software-tags">
                <span>{item.category || "CRM"}</span>
                <span>Sales Automation</span>
                <span>Marketing Automation</span>
                <span>Help Desk</span>
                <span>+2</span>
              </div>

              <div className="hero-actions">

                <button
                  className="btn-primary"
                  onClick={() => {
                    if (item.website) {
                      window.open(item.website, "_blank");
                    }
                  }}
                >
                  Visit Website
                  <ExternalLink size={15} />
                </button>

                <button
                  className="btn-outline"
                  onClick={() => navigate("/implementation")}
                >
                  Request Demo
                </button>

                <button
                  className={`btn-save ${saved ? "saved" : ""}`}
                  onClick={() => setSaved(!saved)}
                >
                  <Heart
                    size={16}
                    fill={saved ? "currentColor" : "none"}
                  />
                  Save
                </button>

              </div>
            </div>
          </div>

          {/* RIGHT PRICING CARD */}
          <aside className="pricing-card">

            <div className="pricing-header">
              <strong>Pricing</strong>

              <button
                onClick={() => setActiveTab("Pricing")}
              >
                View all plans
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="pricing-body">

              <span className="pricing-label">
                Starting from
              </span>

              <div className="pricing-main">
                {item.price || "$14"}
              </div>

              <div className="pricing-period">
                / user / month
              </div>

              <span className="billing">
                Billed annually
              </span>

              <div className="pricing-list">

                <div>
                  <Check size={14} />
                  Free 15-day trial
                </div>

                <div>
                  <Check size={14} />
                  No credit card required
                </div>

                <div>
                  <Check size={14} />
                  Cancel anytime
                </div>

              </div>

              <button
                className="pricing-button"
                onClick={() => setActiveTab("Pricing")}
              >
                See Pricing Plans
              </button>

            </div>
          </aside>
        </section>

        {/* =====================================================
            TABS
        ===================================================== */}
        <nav className="software-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div className="software-content">

          {/* MAIN CONTENT */}
          <div className="software-main">

            {/* OVERVIEW */}
            <section className="overview-section">

              <div className="overview-copy">

                <h2>Overview</h2>

                <p>
                  {item.name} helps you build better relationships,
                  engage in meaningful conversations, and close more
                  deals. It brings your sales, marketing, and support
                  teams together on a single platform.
                </p>

                <div className="highlight-grid">

                  {highlights.map((item) => (
                    <div
                      className="highlight-card"
                      key={item.title}
                    >
                      <div
                        className={`highlight-icon ${item.color}`}
                      >
                        {item.icon}
                      </div>

                      <h3>{item.title}</h3>

                      <p>{item.text}</p>
                    </div>
                  ))}

                </div>

              </div>

              {/* PRODUCT PREVIEW */}
              <div className="product-gallery">

                <div className="gallery-main">

                  <div className="fake-browser">
                    <div className="browser-header">
                      <span />
                      <span />
                      <span />
                    </div>

                    <div className="dashboard-preview">

                      <div className="dashboard-sidebar">
                        <div className="dash-logo" />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>

                      <div className="dashboard-content">

                        <div className="dashboard-title">
                          Dashboard
                        </div>

                        <div className="dashboard-stats">
                          <div />
                          <div />
                          <div />
                        </div>

                        <div className="dashboard-chart">
                          <div className="chart-line line-1" />
                          <div className="chart-line line-2" />
                          <div className="chart-line line-3" />
                          <div className="chart-line line-4" />
                        </div>

                        <div className="dashboard-bottom">
                          <div />
                          <div />
                          <div />
                        </div>

                      </div>

                    </div>

                    <div className="play-button">
                      ▶
                    </div>
                  </div>

                </div>

                <div className="gallery-controls">

                  <button>‹</button>

                  {gallery.map((item, index) => (
                    <button
                      className={index === 0 ? "selected" : ""}
                      key={item}
                    >
                      <div className="thumbnail" />
                    </button>
                  ))}

                  <button>›</button>

                </div>

              </div>

            </section>

            {/* KEY FEATURES */}
            <section className="features-section">

              <div className="section-heading">
                <h2>Key Features</h2>
              </div>

              <div className="features-grid">

                {features.map((feature) => (
                  <article
                    className="feature-card"
                    key={feature.title}
                  >
                    <div
                      className={`feature-icon ${feature.color}`}
                    >
                      {feature.icon}
                    </div>

                    <div>
                      <h3>{feature.title}</h3>
                      <p>{feature.text}</p>
                    </div>
                  </article>
                ))}

              </div>

            </section>

          </div>

          {/* =================================================
              BEST FOR
          ================================================= */}
          <aside className="best-for-card">

            <h2>Best For</h2>

            <ul>
              <li>
                <Check size={14} />
                Small, Medium & Large Businesses
              </li>

              <li>
                <Check size={14} />
                Sales, Marketing & Support Teams
              </li>

              <li>
                <Check size={14} />
                Companies looking for scalable CRM
              </li>

              <li>
                <Check size={14} />
                Business growth and automation
              </li>
            </ul>

            <h3>Deployment</h3>

            <div className="deployment-options">

              <button className="selected">
                ☁ Cloud
              </button>

              <button>
                ▥ On-Premise
              </button>

              <button>
                ♧ Hybrid
              </button>

            </div>

          </aside>

        </div>

      </main>
    </PublicLayout>
  );
}

export default SoftwareDetail;