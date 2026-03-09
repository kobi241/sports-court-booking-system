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

router.delete("/:id", (req, res) => {
  const reservationId = parseInt(req.params.id);

  const reservationIndex = reservations.findIndex(
    (reservation) => reservation.id === reservationId,
  );

  if (reservationIndex === -1) {
    return res.status(404).json({ message: "Reservation not found" });
  }

  const deletedReservation = reservations.splice(reservationIndex, 1);

  res.json({
    message: "Reservation deleted successfully",
    reservation: deletedReservation[0],
  });
});

module.exports = router;
