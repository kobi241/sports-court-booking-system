const express = require("express");
const router = express.Router();

const db = require("../db/connection");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/my-eligible-courts", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT DISTINCT
      court.id AS court_id,
      court.name AS court_name,
      facility.name AS facility_name,
      facility.address AS facility_address,
      facility.city AS facility_city,
      review.id AS review_id,
      review.rating,
      review.comment
    FROM reservation
    JOIN court ON reservation.court_id = court.id
    JOIN facility ON court.facility_id = facility.id
    LEFT JOIN review
      ON review.court_id = court.id
      AND review.user_id = ?
    WHERE reservation.user_id = ?
      AND reservation.status = 'approved'
  `;

  db.query(query, [userId, userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

// CREATE review
router.post("/", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { court_id, rating, comment } = req.body;

  if (!court_id || !rating || !comment) {
    return res.status(400).json({
      message: "Court, rating and comment are required",
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "Rating must be between 1 and 5",
    });
  }

  const checkApprovedReservationQuery = `
    SELECT id
    FROM reservation
    WHERE user_id = ?
      AND court_id = ?
      AND status = 'approved'
    LIMIT 1
  `;

  db.query(
    checkApprovedReservationQuery,
    [userId, court_id],
    (err, reservations) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (reservations.length === 0) {
        return res.status(403).json({
          message: "You can only review courts with approved reservations",
        });
      }

      const insertReviewQuery = `
        INSERT INTO review (rating, comment, user_id, court_id)
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        insertReviewQuery,
        [rating, comment, userId, court_id],
        (err, result) => {
          if (err) {
            console.error(err);

            if (err.code === "ER_DUP_ENTRY") {
              return res.status(400).json({
                message: "You have already reviewed this court",
              });
            }

            return res.status(500).json({ error: "Database error" });
          }

          res.status(201).json({
            message: "Review created successfully",
          });
        },
      );
    },
  );
});

// GET reviews for one court
router.get("/court/:courtId", (req, res) => {
  const courtId = req.params.courtId;

  const query = `
    SELECT
      review.id,
      review.rating,
      review.comment,
      DATE_FORMAT(review.created_at, '%Y-%m-%d') AS created_at,
      users.first_name AS user_name
    FROM review
    JOIN users ON review.user_id = users.id
    WHERE review.court_id = ?
    ORDER BY review.created_at DESC
  `;

  db.query(query, [courtId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    const reviewCount = results.length;

    const averageRating =
      reviewCount === 0
        ? null
        : (
            results.reduce((sum, review) => sum + review.rating, 0) /
            reviewCount
          ).toFixed(1);

    res.json({
      averageRating,
      reviewCount,
      reviews: results,
    });
  });
});

module.exports = router;
