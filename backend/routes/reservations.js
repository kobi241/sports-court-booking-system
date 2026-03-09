const express = require("express");
const router = express.Router();

let reservations = [
  {
    id: 1,
    court_id: 1,
    user_name: "Marko",
    date: "2024-06-01",
    start_time: "18:00",
    end_time: "19:00",
  },
];

router.get("/", (req, res) => {
  res.json(reservations);
});

router.post("/", (req, res) => {
  const newReservation = req.body;
  reservations.push(newReservation);
  res.json({ message: "Reservation created", reservation: newReservation });
});

module.exports = router;
