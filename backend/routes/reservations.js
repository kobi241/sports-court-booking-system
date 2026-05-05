const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// GET all reservations
router.get("/", (req, res) => {
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
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

// CREATE reservation
router.post("/", (req, res) => {
  const { reservation_date, reservation_time, user_id, court_id } = req.body;

  const query = `
    INSERT INTO reservation (reservation_date, reservation_time, user_id, court_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [reservation_date, reservation_time, user_id, court_id],
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
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM reservation WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Reservation deleted" });
  });
});

module.exports = router;
