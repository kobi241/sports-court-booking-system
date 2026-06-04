import styles from "./ReviewModal.module.css";

function ReviewModal({
  selectedReviewsCourt,
  courtReviews,
  handleCloseReviews,
}) {
  return (
    <div className={styles.overlay} onClick={handleCloseReviews}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <p className={styles.label}>Reviews for</p>
            <h2>{selectedReviewsCourt.name}</h2>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={handleCloseReviews}
          >
            ×
          </button>
        </div>

        {!courtReviews ? (
          <p>Loading reviews...</p>
        ) : courtReviews.reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className={styles.reviewsList}>
            <div className={styles.reviewStats}>
              <strong>⭐ {courtReviews.averageRating}/5</strong>
              <span>{courtReviews.reviewCount} reviews</span>
            </div>

            {courtReviews.reviews.map((review) => (
              <div key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewItemHeader}>
                  <strong>{review.user_name}</strong>

                  <span className={styles.rating}>⭐ {review.rating}/5</span>
                </div>

                <p>{review.comment}</p>

                <small>{review.created_at}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewModal;
