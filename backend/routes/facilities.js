const express = require("express");
const router = express.Router();
const db = require("../db/connection");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", (req, res) => {
  const query = "SELECT * FROM facility";

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

// CREATE facility (admin only)
router.post("/", authMiddleware, adminMiddleware, (req, res) => {
  const { name, address, city, contact_email, phone_number, opening_hours } =
    req.body;

  if (!name || !address || !city) {
    return res.status(400).json({
      message: "Name, address and city are required",
    });
  }

  const query = `
      INSERT INTO facility (
        name,
        address,
        city,
        contact_email,
        phone_number,
        opening_hours
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

  db.query(
    query,
    [name, address, city, contact_email, phone_number, opening_hours],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Database error",
        });
      }

      res.status(201).json({
        message: "Facility created successfully",
      });
    },
  );
});

// UPDATE facility (admin only)
router.put("/:id", authMiddleware, adminMiddleware, (req, res) => {
  const facilityId = req.params.id;

  const { name, address, city, contact_email, phone_number, opening_hours } =
    req.body;

  if (!name || !address || !city) {
    return res.status(400).json({
      message: "Name, address and city are required",
    });
  }

  const query = `
      UPDATE facility
      SET
        name = ?,
        address = ?,
        city = ?,
        contact_email = ?,
        phone_number = ?,
        opening_hours = ?
      WHERE id = ?
    `;

  db.query(
    query,
    [
      name,
      address,
      city,
      contact_email,
      phone_number,
      opening_hours,
      facilityId,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Database error",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Facility not found",
        });
      }

      res.json({
        message: "Facility updated successfully",
      });
    },
  );
});

// DELETE facility (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, (req, res) => {
  const facilityId = req.params.id;

  const query = "DELETE FROM facility WHERE id = ?";

  db.query(query, [facilityId], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        error: "Cannot delete facility with existing courts",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Facility not found",
      });
    }

    res.json({
      message: "Facility deleted successfully",
    });
  });
});

module.exports = router;
