import { useEffect, useState } from "react";
import {
  getEligibleReviewCourts,
  createReview,
  updateReview,
  deleteReview,
} from "../services/api";

import styles from "./MyReviewsPage.module.css";

function MyReviewsPage() {
  const [reviewCourts, setReviewCourts] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    rating: "",
    comment: "",
  });
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    loadReviewCourts();
  }, []);

  const loadReviewCourts = async () => {
    try {
      const data = await getEligibleReviewCourts();
      setReviewCourts(data);
    } catch (error) {
      console.error("Failed to load review courts:", error);
      alert("Failed to load review courts.");
    }
  };

  const handleCreateReview = async (e, courtId) => {
    e.preventDefault();

    try {
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
    } catch (error) {
      console.error("Failed to create review:", error);
      alert("Failed to create review.");
    }
  };

  const handleEditReview = (court) => {
    setEditingReviewId(court.review_id);

    setReviewForm({
      rating: String(court.rating),
      comment: court.comment,
    });
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();

    try {
      const result = await updateReview(editingReviewId, {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });

      if (result.message !== "Review updated successfully") {
        alert(result.message || "Review could not be updated");
        return;
      }

      setEditingReviewId(null);
      setReviewForm({
        rating: "",
        comment: "",
      });

      await loadReviewCourts();

      alert("Review updated successfully!");
    } catch (error) {
      console.error("Failed to update review:", error);
      alert("Failed to update review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const result = await deleteReview(reviewId);

      if (result.message !== "Review deleted successfully") {
        alert(result.message || "Review could not be deleted");
        return;
      }

      await loadReviewCourts();

      alert("Review deleted successfully!");
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert("Failed to delete review.");
    }
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setReviewForm({
      rating: "",
      comment: "",
    });
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
            const isEditing = editingReviewId === court.review_id;

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
                  isEditing ? (
                    <form
                      className={styles.reviewForm}
                      onSubmit={handleUpdateReview}
                    >
                      <p className={styles.label}>✏️ Edit Review</p>

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
                        placeholder="Update your review..."
                      />

                      <div className={styles.actions}>
                        <button
                          type="submit"
                          className={`${styles.button} ${styles.reviewButton}`}
                          disabled={!reviewForm.rating || !reviewForm.comment}
                        >
                          Save Changes
                        </button>

                        <button
                          type="button"
                          className={styles.cancelButton}
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className={styles.reviewBox}>
                      <p className={styles.label}>⭐ Your Review</p>

                      <p className={styles.rating}>⭐ {court.rating}/5</p>

                      <p>{court.comment}</p>

                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={`${styles.button} ${styles.reviewButton}`}
                          onClick={() => handleEditReview(court)}
                        >
                          Edit Review
                        </button>

                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() => handleDeleteReview(court.review_id)}
                        >
                          Delete Review
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <form
                    className={styles.reviewForm}
                    onSubmit={(e) => handleCreateReview(e, court.court_id)}
                  >
                    <p className={styles.label}>⭐ Add Review</p>

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
