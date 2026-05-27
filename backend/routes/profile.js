const express = require("express");
const router = express.Router();

const db = require("../db/connection");
const authMiddleware = require("../middleware/authMiddleware");

// GET logged-in user profile
router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT
      id,
      first_name,
      last_name,
      email,
      role,
      phone_number,
      bio,
      profile_image
    FROM users
    WHERE id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(results[0]);
  });
});

// UPDATE logged-in user profile
router.put("/", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { phone_number, bio, profile_image } = req.body;

  const query = `
    UPDATE users
    SET phone_number = ?, bio = ?, profile_image = ?
    WHERE id = ?
  `;

  db.query(query, [phone_number, bio, profile_image, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Database error",
      });
    }

    res.json({
      message: "Profile updated successfully",
    });
  });
});

module.exports = router;
