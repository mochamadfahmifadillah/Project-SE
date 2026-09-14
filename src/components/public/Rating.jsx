function Rating({ rating = 0, reviews = 1240 }) {
  const numericRating = Number(rating) || 0;
  const numericReviews = Number(reviews) || 0;

  return (
    <div className="rating" aria-label={`${numericRating} out of 5 stars`}>
      <span className="rating-stars" aria-hidden="true">
        ★
      </span>

      <strong className="rating-score">{numericRating.toFixed(1)}</strong>

      <span className="rating-divider">•</span>

      <span className="rating-reviews">
        {numericReviews.toLocaleString()} reviews
      </span>
    </div>
  );
}

export default Rating;
