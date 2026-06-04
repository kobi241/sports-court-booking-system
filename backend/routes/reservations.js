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
    reservation.rejection_reason,
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
  const { status, rejection_reason } = req.body;

  if (status !== "approved" && status !== "rejected") {
    return res.status(400).json({
      message: "Invalid status. Status must be approved or rejected.",
    });
  }

  if (status === "rejected" && !rejection_reason) {
    return res.status(400).json({
      message: "Rejection reason is required when rejecting a reservation.",
    });
  }

  const getReservationQuery = `
    SELECT
      reservation.user_id,
      court.name AS court_name
    FROM reservation
    JOIN court ON reservation.court_id = court.id
    WHERE reservation.id = ?
  `;

  db.query(getReservationQuery, [reservationId], (err, reservations) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (reservations.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const reservation = reservations[0];

    const updateQuery = `
      UPDATE reservation
      SET status = ?, rejection_reason = ?
      WHERE id = ?
    `;

    const reasonToSave = status === "rejected" ? rejection_reason : null;

    db.query(
      updateQuery,
      [status, reasonToSave, reservationId],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database error" });
        }

        const notificationTitle =
          status === "approved"
            ? "Reservation Approved"
            : "Reservation Rejected";

        const notificationMessage =
          status === "approved"
            ? `Congratulations! Your reservation for ${reservation.court_name} has been approved. Enjoy your time at the court.`
            : `We are sorry, but your reservation for ${reservation.court_name} could not be approved. Reason: ${rejection_reason}`;

        const insertNotificationQuery = `
          INSERT INTO notification (title, message, user_id)
          VALUES (?, ?, ?)
        `;

        db.query(
          insertNotificationQuery,
          [notificationTitle, notificationMessage, reservation.user_id],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({
                error: "Database error",
              });
            }

            res.json({
              message: `Reservation ${status}`,
            });
          },
        );
      },
    );
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
        INSERT INTO reservation (
          reservation_date,
          reservation_time,
          user_id,
          court_id
        )
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

          const getCourtQuery = `
            SELECT name
            FROM court
            WHERE id = ?
          `;

          db.query(getCourtQuery, [court_id], (err, courtResults) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Database error" });
            }

            const courtName =
              courtResults.length > 0 ? courtResults[0].name : "a court";

            const getAdminsQuery = `
              SELECT id
              FROM users
              WHERE role = 'admin'
            `;

            db.query(getAdminsQuery, (err, admins) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
              }

              if (admins.length === 0) {
                return res.json({ message: "Reservation created" });
              }

              const notificationValues = admins.map((admin) => [
                "New Reservation Request",
                `A new reservation request has been submitted for ${courtName} on ${reservation_date} at ${reservation_time}.`,
                admin.id,
              ]);

              const insertNotificationQuery = `
                INSERT INTO notification (title, message, user_id)
                VALUES ?
              `;

              db.query(insertNotificationQuery, [notificationValues], (err) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ error: "Database error" });
                }

                res.json({ message: "Reservation created" });
              });
            });
          });
        },
      );
    },
  );
});

// DELETE reservation
router.delete("/:id", authMiddleware, (req, res) => {
  const reservationId = req.params.id;
  const userId = req.user.id;

  const getReservationQuery = `
    SELECT
      DATE_FORMAT(reservation.reservation_date, '%Y-%m-%d') AS reservation_date,
      reservation.reservation_time,
      court.name AS court_name,
      users.first_name AS user_name
    FROM reservation
    JOIN court ON reservation.court_id = court.id
    JOIN users ON reservation.user_id = users.id
    WHERE reservation.id = ? AND reservation.user_id = ?
  `;

  db.query(
    getReservationQuery,
    [reservationId, userId],
    (err, reservations) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (reservations.length === 0) {
        return res.status(404).json({ message: "Reservation not found" });
      }

      const reservation = reservations[0];

      const deleteQuery =
        "DELETE FROM reservation WHERE id = ? AND user_id = ?";

      db.query(deleteQuery, [reservationId, userId], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database error" });
        }

        const getAdminsQuery = `
          SELECT id
          FROM users
          WHERE role = 'admin'
        `;

        db.query(getAdminsQuery, (err, admins) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
          }

          if (admins.length === 0) {
            return res.json({ message: "Reservation deleted" });
          }

          const notificationValues = admins.map((admin) => [
            "Reservation Cancelled",
            `${reservation.user_name} cancelled a reservation for ${reservation.court_name} on ${reservation.reservation_date} at ${reservation.reservation_time}.`,
            admin.id,
          ]);

          const insertNotificationQuery = `
            INSERT INTO notification (title, message, user_id)
            VALUES ?
          `;

          db.query(insertNotificationQuery, [notificationValues], (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Database error" });
            }

            res.json({ message: "Reservation deleted" });
          });
        });
      });
    },
  );
});

module.exports = router;
