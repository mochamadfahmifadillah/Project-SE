import { useState } from "react";
import { Star, MessageSquare, CalendarDays, Pencil } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Reviews() {
  const [reviews] = useState([
    {
      id: 1,
      software: "HubSpot CRM",
      category: "CRM",
      rating: 5,
      date: "September 12, 2026",
      title: "Easy to use and suitable for small teams",
      content:
        "HubSpot CRM has a clean interface and provides useful features for managing customers and sales activities.",
      status: "Published",
    },
    {
      id: 2,
      software: "Trello",
      category: "Project Management",
      rating: 4,
      date: "September 5, 2026",
      title: "Simple project management tool",
      content:
        "Trello is easy to understand and works well for organizing tasks and simple team projects.",
      status: "Published",
    },
  ]);

  function renderStars(rating) {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < rating ? "currentColor" : "none"}
        strokeWidth={index < rating ? 2 : 1.5}
      />
    ));
  }

  return (
    <main className="page reviews-page">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="page-head">
        <div>
          <span className="eyebrow">MY ACCOUNT</span>

          <h1>My Reviews</h1>

          <p>Manage the software reviews you have submitted.</p>
        </div>

        <NavLink
          to="/software-directory"
          className="button primary reviews-browse-button"
        >
          Browse Software
        </NavLink>
      </div>

      {/* =====================================================
          SUMMARY
      ====================================================== */}
      <div className="reviews-summary-grid">
        <div className="reviews-summary-card">
          <div className="reviews-summary-icon">
            <MessageSquare size={20} />
          </div>

          <div>
            <span>Total Reviews</span>
            <strong>{reviews.length}</strong>
          </div>
        </div>

        <div className="reviews-summary-card">
          <div className="reviews-summary-icon">
            <Star size={20} />
          </div>

          <div>
            <span>Average Rating</span>

            <strong>
              {reviews.length
                ? (
                    reviews.reduce(
                      (total, review) => total + review.rating,
                      0,
                    ) / reviews.length
                  ).toFixed(1)
                : "0.0"}
            </strong>
          </div>
        </div>
      </div>

      {/* =====================================================
          REVIEWS
      ====================================================== */}
      <section className="reviews-section">
        <div className="section-head">
          <div>
            <span className="eyebrow">YOUR ACTIVITY</span>

            <h2>Submitted Reviews</h2>

            <p>Reviews you have submitted to the Software Empire platform.</p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="empty reviews-empty">
            <div className="reviews-empty-icon">
              <MessageSquare size={24} />
            </div>

            <h3>No reviews yet</h3>

            <p>You haven't submitted any software reviews yet.</p>

            <NavLink to="/software-directory" className="button primary">
              Explore Software
            </NavLink>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <article className="review-card" key={review.id}>
                {/* TOP */}
                <div className="review-card-top">
                  <div className="review-software">
                    <div className="review-software-logo">
                      {review.software.charAt(0)}
                    </div>

                    <div>
                      <h3>{review.software}</h3>

                      <span>{review.category}</span>
                    </div>
                  </div>

                  <span
                    className={`review-status ${review.status.toLowerCase()}`}
                  >
                    {review.status}
                  </span>
                </div>

                {/* RATING */}
                <div className="review-rating-row">
                  <div className="review-stars">
                    {renderStars(review.rating)}
                  </div>

                  <strong>{review.rating}.0</strong>
                </div>

                {/* CONTENT */}
                <div className="review-content">
                  <h4>{review.title}</h4>

                  <p>{review.content}</p>
                </div>

                {/* FOOTER */}
                <div className="review-card-footer">
                  <div className="review-date">
                    <CalendarDays size={15} />

                    <span>{review.date}</span>
                  </div>

                  <button type="button" className="review-edit-button">
                    <Pencil size={15} />

                    <span>Edit Review</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
