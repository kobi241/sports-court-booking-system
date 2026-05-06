const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const authMiddleware = require("../middleware/authMiddleware");

// GET reservations for logged-in user
router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT 
      reservation.id,
      reservation.reservation_date,
      reservation.reservation_time,
      reservation.status,
      court.name AS court_name,
      users.first_name AS user_name
    FROM reservation
    JOIN court ON reservation.court_id = court.id
    JOIN users ON reservation.user_id = users.id
    WHERE reservation.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

// CREATE reservation
router.post("/", authMiddleware, (req, res) => {
  const { reservation_date, reservation_time, court_id } = req.body;
  const userId = req.user.id;

  const query = `
    INSERT INTO reservation (reservation_date, reservation_time, user_id, court_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [reservation_date, reservation_time, userId, court_id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ message: "Reservation created" });
    },
  );
});

// DELETE reservation
router.delete("/:id", authMiddleware, (req, res) => {
  const reservationId = req.params.id;
  const userId = req.user.id;

  const query = "DELETE FROM reservation WHERE id = ? AND user_id = ?";

  db.query(query, [reservationId, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json({ message: "Reservation deleted" });
  });
});

module.exports = router;
