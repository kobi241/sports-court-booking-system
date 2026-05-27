const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// GET reservations for logged-in user
router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const query = `
  SELECT 
    reservation.id,
    DATE_FORMAT(reservation.reservation_date, '%Y-%m-%d') AS reservation_date,
    reservation.reservation_time,
    reservation.status,
    court.name AS court_name,
    facility.name AS facility_name,
    facility.address AS facility_address,
    facility.city AS facility_city,
    users.first_name AS user_name
  FROM reservation
  JOIN court ON reservation.court_id = court.id
  JOIN facility ON court.facility_id = facility.id
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

// GET all reservations for admin
router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
  const query = `
  SELECT 
    reservation.id,
    reservation.user_id,
    DATE_FORMAT(reservation.reservation_date, '%Y-%m-%d') AS reservation_date,
    reservation.reservation_time,
    reservation.status,
    court.name AS court_name,
    facility.name AS facility_name,
    facility.address AS facility_address,
    facility.city AS facility_city,
    users.first_name AS user_name
  FROM reservation
  JOIN court ON reservation.court_id = court.id
  JOIN facility ON court.facility_id = facility.id
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

// UPDATE reservation status by admin
router.patch("/:id/status", authMiddleware, adminMiddleware, (req, res) => {
  const reservationId = req.params.id;
  const { status } = req.body;

  if (status !== "approved" && status !== "rejected") {
    return res.status(400).json({
      message: "Invalid status. Status must be approved or rejected.",
    });
  }

  const query = "UPDATE reservation SET status = ? WHERE id = ?";

  db.query(query, [status, reservationId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json({ message: `Reservation ${status}` });
  });
});

// CREATE reservation
router.post("/", authMiddleware, (req, res) => {
  const { reservation_date, reservation_time, court_id } = req.body;
  const userId = req.user.id;

  const reservationDateTime = new Date(
    `${reservation_date}T${reservation_time}`,
  );

  const currentDateTime = new Date();

  if (reservationDateTime < currentDateTime) {
    return res.status(400).json({
      message: "Reservation date and time cannot be in the past",
    });
  }

  const checkAvailabilityQuery = `
    SELECT * FROM reservation
    WHERE court_id = ?
    AND reservation_date = ?
    AND reservation_time = ?
    AND status IN ('pending', 'approved')
  `;

  db.query(
    checkAvailabilityQuery,
    [court_id, reservation_date, reservation_time],
    (err, existingReservations) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (existingReservations.length > 0) {
        return res.status(400).json({
          message:
            "This court is already reserved at the selected date and time",
        });
      }

      const insertReservationQuery = `
        INSERT INTO reservation (reservation_date, reservation_time, user_id, court_id)
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        insertReservationQuery,
        [reservation_date, reservation_time, userId, court_id],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
          }

          res.json({ message: "Reservation created" });
        },
      );
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
