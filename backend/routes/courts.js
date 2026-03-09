const express = require("express");
const router = express.Router();

const courts = [
  {
    id: 1,
    name: "Tennis Court A",
    location: "City Center",
    sport_type: "Tennis",
    price_per_hour: 20,
  },
  {
    id: 2,
    name: "Basketball Court",
    location: "Arena Hall",
    sport_type: "Basketball",
    price_per_hour: 30,
  },
  {
    id: 3,
    name: "Football Court",
    location: "Johnson Park",
    sport_type: "Football",
    price_per_hour: 25,
  },
];

router.get("/", (req, res) => {
  res.json(courts);
});

module.exports = router;
