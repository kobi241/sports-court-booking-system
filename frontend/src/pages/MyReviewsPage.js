import { useEffect, useState } from "react";
import { getEligibleReviewCourts, createReview } from "../services/api";

import styles from "./MyReviewsPage.module.css";

function MyReviewsPage() {
  const [reviewCourts, setReviewCourts] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    rating: "",
    comment: "",
  });

  useEffect(() => {
    loadReviewCourts();
  }, []);

  const loadReviewCourts = async () => {
    const data = await getEligibleReviewCourts();
    setReviewCourts(data);
  };

  const handleCreateReview = async (e, courtId) => {
    e.preventDefault();

    const result = await createReview({
      court_id: courtId,
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment,
    });

    if (result.message !== "Review created successfully") {
      alert(result.message || "Review could not be created");
      return;
    }

    setReviewForm({
      rating: "",
      comment: "",
    });

    await loadReviewCourts();

    alert("Review created successfully!");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Reviews</h1>

      {reviewCourts.length === 0 ? (
        <p className={styles.emptyMessage}>
          You do not have any approved courts available for review yet.
        </p>
      ) : (
        <div className={styles.list}>
          {reviewCourts.map((court) => {
            return (
              <div key={court.court_id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <p className={styles.label}>Court</p>
                    <h2>{court.court_name}</h2>
                  </div>
                </div>

                <div className={styles.facilityBox}>
                  <p className={styles.label}>Facility</p>
                  <h3>{court.facility_name}</h3>

                  <p className={styles.label}>Address</p>
                  <p>
                    📍 {court.facility_address}, {court.facility_city}
                  </p>
                </div>

                {court.review_id ? (
                  <div className={styles.reviewBox}>
                    <p className={styles.label}>Your Review</p>
                    <p className={styles.rating}>⭐ {court.rating}/5</p>
                    <p>{court.comment}</p>
                  </div>
                ) : (
                  <form
                    className={styles.reviewForm}
                    onSubmit={(e) => handleCreateReview(e, court.court_id)}
                  >
                    <p className={styles.label}>Add Review</p>

                    <select
                      value={reviewForm.rating}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          rating: e.target.value,
                        })
                      }
                      className={styles.input}
                    >
                      <option value="">Select rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>

                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          comment: e.target.value,
                        })
                      }
                      className={styles.input}
                      placeholder="Write your review..."
                    />

                    <button
                      type="submit"
                      className={`${styles.button} ${styles.reviewButton}`}
                      disabled={!reviewForm.rating || !reviewForm.comment}
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyReviewsPage;
