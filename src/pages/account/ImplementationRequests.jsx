import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Handshake,
  Wrench,
} from "lucide-react";

import Button from "../../components/common/Button";

export default function ImplementationRequests() {
  const navigate = useNavigate();

  /*
   * Temporary data.
   * Nanti bisa langsung diganti dengan response dari API.
   */
  const requests = [
    {
      id: 1,
      software: "Zoho CRM",
      status: "In Progress",
      date: "May 12, 2024",
      description:
        "Implementation partner is currently working on your project.",
    },
    {
      id: 2,
      software: "HubSpot CRM",
      status: "Partner Matching",
      date: "May 10, 2024",
      description:
        "We're finding an implementation partner that fits your needs.",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "In Progress":
        return <Wrench size={16} />;

      case "Partner Matching":
        return <Handshake size={16} />;

      case "Completed":
        return <CheckCircle2 size={16} />;

      default:
        return <Clock3 size={16} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "In Progress":
        return "status-progress";

      case "Partner Matching":
        return "status-matching";

      case "Completed":
        return "status-completed";

      default:
        return "status-pending";
    }
  };

  return (
    <main className="implementation-page">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="implementation-hero">
        <div>
          <span className="eyebrow">
            MY ACCOUNT
          </span>

          <h1>
            Implementation requests
          </h1>

          <p>
            Track your software implementation
            requests and see what happens next.
          </p>
        </div>

        <Button
          onClick={() =>
            navigate("/implementation")
          }
        >
          Request implementation
          <ArrowRight size={17} />
        </Button>
      </section>

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <section className="implementation-summary">
        <div className="implementation-summary-icon">
          <Wrench size={21} />
        </div>

        <div>
          <span className="eyebrow">
            YOUR REQUESTS
          </span>

          <h2>
            {requests.length}{" "}
            {requests.length === 1
              ? "request"
              : "requests"}
          </h2>

          <p>
            Keep track of your active and
            completed implementation projects.
          </p>
        </div>
      </section>

      {/* =====================================================
          EMPTY
      ====================================================== */}

      {requests.length === 0 && (
        <section className="implementation-empty">
          <div className="implementation-empty-icon">
            <Wrench
              size={30}
              strokeWidth={1.8}
            />
          </div>

          <span className="eyebrow">
            IMPLEMENTATION
          </span>

          <h2>
            No implementation requests yet
          </h2>

          <p>
            Need help setting up your software?
            Submit an implementation request and
            we'll help connect you with a suitable
            partner.
          </p>

          <Button
            onClick={() =>
              navigate("/implementation")
            }
          >
            Request implementation
            <ArrowRight size={17} />
          </Button>
        </section>
      )}

      {/* =====================================================
          REQUEST LIST
      ====================================================== */}

      {requests.length > 0 && (
        <section className="implementation-list-section">
          <div className="implementation-section-head">
            <div>
              <span className="eyebrow">
                REQUEST HISTORY
              </span>

              <h2>
                Your implementation activity
              </h2>
            </div>
          </div>

          <div className="implementation-list">
            {requests.map((request) => (
              <article
                className="implementation-card"
                key={request.id}
              >
                {/* =================================================
                    TOP
                ================================================== */}

                <div className="implementation-card-top">
                  <div className="implementation-software">
                    <div className="implementation-logo">
                      {request.software
                        .split(" ")
                        .slice(0, 2)
                        .map((word) =>
                          word.charAt(0),
                        )
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div>
                      <span className="implementation-label">
                        SOFTWARE
                      </span>

                      <h3>
                        {request.software}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`implementation-status ${getStatusClass(
                      request.status,
                    )}`}
                  >
                    {getStatusIcon(
                      request.status,
                    )}

                    <span>
                      {request.status}
                    </span>
                  </div>
                </div>

                {/* =================================================
                    META
                ================================================== */}

                <div className="implementation-meta">
                  <div>
                    <CalendarDays size={15} />

                    <span>
                      Requested {request.date}
                    </span>
                  </div>
                </div>

                {/* =================================================
                    DESCRIPTION
                ================================================== */}

                <p className="implementation-description">
                  {request.description}
                </p>

                {/* =================================================
                    PROGRESS
                ================================================== */}

                <div className="implementation-progress">
                  <div className="progress-step completed">
                    <span>1</span>
                    <small>
                      Request submitted
                    </small>
                  </div>

                  <div
                    className={
                      request.status ===
                      "Partner Matching"
                        ? "progress-line"
                        : "progress-line active"
                    }
                  />

                  <div
                    className={
                      request.status ===
                      "Partner Matching"
                        ? "progress-step current"
                        : "progress-step completed"
                    }
                  >
                    <span>2</span>

                    <small>
                      Partner matching
                    </small>
                  </div>

                  <div
                    className={
                      request.status ===
                      "In Progress"
                        ? "progress-line active"
                        : "progress-line"
                    }
                  />

                  <div
                    className={
                      request.status ===
                      "In Progress"
                        ? "progress-step current"
                        : "progress-step"
                    }
                  >
                    <span>3</span>

                    <small>
                      Implementation
                    </small>
                  </div>
                </div>

                {/* =================================================
                    FOOTER
                ================================================== */}

                <div className="implementation-card-footer">
                  <span>
                    Request #
                    {String(request.id).padStart(
                      3,
                      "0",
                    )}
                  </span>

                  <button
                    type="button"
                    className="implementation-view-button"
                    onClick={() =>
                      navigate(
                        `/implementation/${request.id}`,
                      )
                    }
                  >
                    View request

                    <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}