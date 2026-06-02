const express = require("express");
const router = express.Router();

const db = require("../db/connection");
const authMiddleware = require("../middleware/authMiddleware");

// GET notifications for logged-in user
router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT
      id,
      title,
      message,
      is_read,
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS created_at
    FROM notification
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

module.exports = router;

// MARK notification as read
router.patch("/:id/read", authMiddleware, (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user.id;

  const query = `
    UPDATE notification
    SET is_read = true
    WHERE id = ? AND user_id = ?
  `;

  db.query(query, [notificationId, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.json({
      message: "Notification marked as read",
    });
  });
});

// MARK all notifications as read
router.patch("/read-all", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const query = `
    UPDATE notification
    SET is_read = true
    WHERE user_id = ?
  `;

  db.query(query, [userId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "All notifications marked as read",
    });
  });
});
