const express = require("express");
const router = express.Router();
const db = require("../db/connection");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// GET all courts with facility information and review statistics
router.get("/", (req, res) => {
  const query = `
    SELECT
      court.id,
      court.name,
      court.description,
      court.sport_type,
      court.indoor_outdoor,
      court.capacity,
      court.hourly_price,
      court.facility_id,
      facility.name AS facility_name,
      facility.address,
      facility.city,
      facility.opening_hours,
      ROUND(AVG(review.rating), 1) AS average_rating,
      COUNT(review.id) AS review_count
    FROM court
    JOIN facility ON court.facility_id = facility.id
    LEFT JOIN review ON review.court_id = court.id
    GROUP BY
      court.id,
      court.name,
      court.description,
      court.sport_type,
      court.indoor_outdoor,
      court.capacity,
      court.hourly_price,
      court.facility_id,
      facility.name,
      facility.address,
      facility.city,
      facility.opening_hours
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

// CREATE court (admin only)
router.post("/", authMiddleware, adminMiddleware, (req, res) => {
  const {
    name,
    description,
    facility_id,
    sport_type,
    indoor_outdoor,
    capacity,
    hourly_price,
  } = req.body;

  if (
    !name ||
    !facility_id ||
    !sport_type ||
    !indoor_outdoor ||
    !hourly_price
  ) {
    return res.status(400).json({
      message:
        "Name, facility, sport type, indoor/outdoor and hourly price are required",
    });
  }

  const query = `
    INSERT INTO court (
      name,
      description,
      facility_id,
      sport_type,
      indoor_outdoor,
      capacity,
      hourly_price
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      name,
      description,
      facility_id,
      sport_type,
      indoor_outdoor,
      capacity,
      hourly_price,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Database error",
        });
      }

      res.status(201).json({
        message: "Court created successfully",
      });
    },
  );
});

// UPDATE court (admin only)
router.put("/:id", authMiddleware, adminMiddleware, (req, res) => {
  const courtId = req.params.id;

  const {
    name,
    description,
    facility_id,
    sport_type,
    indoor_outdoor,
    capacity,
    hourly_price,
  } = req.body;

  if (!name || !facility_id || !sport_type || !hourly_price) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  const query = `
      UPDATE court
      SET
        name = ?,
        description = ?,
        facility_id = ?,
        sport_type = ?,
        indoor_outdoor = ?,
        capacity = ?,
        hourly_price = ?
      WHERE id = ?
    `;

  db.query(
    query,
    [
      name,
      description,
      facility_id,
      sport_type,
      indoor_outdoor,
      capacity,
      hourly_price,
      courtId,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Database error",
        });
      }

      res.json({
        message: "Court updated successfully",
      });
    },
  );
});

// DELETE court (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, (req, res) => {
  const courtId = req.params.id;

  const query = "DELETE FROM court WHERE id = ?";

  db.query(query, [courtId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Database error",
      });
    }

    res.json({
      message: "Court deleted successfully",
    });
  });
});

module.exports = router;
