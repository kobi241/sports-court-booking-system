const express = require("express");
const cors = require("cors");
const courtsRoutes = require("./routes/courts");
const reservationsRoutes = require("./routes/reservations");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Sports Court Booking API is running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/courts", courtsRoutes);
app.use("/reservations", reservationsRoutes);
app.use("/auth", authRoutes);
