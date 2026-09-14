import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getAdminReviews,
  updateAdminReview,
  deleteAdminReview,
} from "../../services/adminService";

const STATUS_OPTIONS = ["all", "pending", "approved", "published", "rejected"];

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReviews() {
    try {
      setLoading(true);
      setError("");

      const params = status !== "all" ? { status } : {};

      const response = await getAdminReviews(params);

      setReviews(response.data ?? []);
      setStats(
        response.stats ?? {
          pending: 0,
          approved: 0,
          rejected: 0,
          total: 0,
        },
      );
    } catch (err) {
      console.error(err);

      setError(err?.response?.data?.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, [status]);

  async function handleStatusChange(review, newStatus) {
    try {
      await updateAdminReview(review.id, {
        status: newStatus,
      });

      await loadReviews();
    } catch (err) {
      console.error(err);

      alert(err?.response?.data?.message || "Failed to update review.");
    }
  }

  async function handleDelete(review) {
    const confirmed = window.confirm(
      `Delete review from ${review?.user?.name ?? "this user"}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminReview(review.id);

      await loadReviews();
    } catch (err) {
      console.error(err);

      alert(err?.response?.data?.message || "Failed to delete review.");
    }
  }

  function renderStars(rating) {
    return (
      <span className="review-stars">
        {"★".repeat(Number(rating || 0))}
        {"☆".repeat(5 - Number(rating || 0))}
      </span>
    );
  }

  function renderStatus(reviewStatus) {
    const normalized = reviewStatus?.toLowerCase();

    return (
      <span className={`review-status review-status-${normalized}`}>
        {normalized
          ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
          : "Unknown"}
      </span>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-content reviews-page">
        <div className="page-head">
          <div>
            <span className="eyebrow">ADMIN PORTAL</span>

            <h1>Reviews</h1>

            <p>Manage and moderate software reviews submitted by users.</p>
          </div>
        </div>

        {/* Stats */}

        <div className="review-stats">
          <div className="review-stat-card">
            <span className="review-stat-label">Pending Reviews</span>

            <strong>{stats.pending}</strong>
          </div>

          <div className="review-stat-card">
            <span className="review-stat-label">Approved Reviews</span>

            <strong>{stats.approved}</strong>
          </div>

          <div className="review-stat-card">
            <span className="review-stat-label">Rejected Reviews</span>

            <strong>{stats.rejected}</strong>
          </div>
        </div>

        {/* Filters */}

        <div className="reviews-toolbar">
          <div className="review-filters">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={
                  status === option ? "review-filter active" : "review-filter"
                }
                onClick={() => setStatus(option)}
              >
                {option === "all"
                  ? "All Status"
                  : option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}

        {error && <div className="reviews-error">{error}</div>}

        {/* Table */}

        <div className="admin-card reviews-card">
          <div className="reviews-card-header">
            <div>
              <h2>Reviews</h2>

              <p>Review and moderate user submissions.</p>
            </div>

            <span className="review-total">{stats.total} total</span>
          </div>

          {loading ? (
            <div className="reviews-empty">
              <p>Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="reviews-empty">
              <div className="reviews-empty-icon">★</div>

              <h3>No reviews found</h3>

              <p>There are no reviews matching the selected status.</p>
            </div>
          ) : (
            <div className="reviews-table-wrapper">
              <table className="reviews-table">
                <thead>
                  <tr>
                    <th>Review</th>
                    <th>User</th>
                    <th>Software</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td>
                        <div className="review-content">
                          <p>{review.content}</p>
                        </div>
                      </td>

                      <td>
                        <div className="review-user">
                          <strong>
                            {review?.user?.name ?? "Unknown User"}
                          </strong>

                          {review?.user?.email && (
                            <span>{review.user.email}</span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className="software-name">
                          {review?.software?.name ?? "Unknown Software"}
                        </span>
                      </td>

                      <td>
                        <div className="rating-cell">
                          {renderStars(review.rating)}

                          <span>{review.rating}/5</span>
                        </div>
                      </td>

                      <td>{renderStatus(review.status)}</td>

                      <td>
                        <div className="review-actions">
                          {review.status === "pending" && (
                            <>
                              <button
                                type="button"
                                className="review-action approve"
                                onClick={() =>
                                  handleStatusChange(review, "approved")
                                }
                              >
                                Approve
                              </button>

                              <button
                                type="button"
                                className="review-action reject"
                                onClick={() =>
                                  handleStatusChange(review, "rejected")
                                }
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {review.status === "approved" && (
                            <button
                              type="button"
                              className="review-action publish"
                              onClick={() =>
                                handleStatusChange(review, "published")
                              }
                            >
                              Publish
                            </button>
                          )}

                          <button
                            type="button"
                            className="review-action delete"
                            onClick={() => handleDelete(review)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Reviews;
