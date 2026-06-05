require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const courtsRoutes = require("./routes/courts");
const reservationsRoutes = require("./routes/reservations");
const authRoutes = require("./routes/auth");
const facilitiesRoutes = require("./routes/facilities");
const reviewsRoutes = require("./routes/reviews");
const profileRoutes = require("./routes/profile");
const notificationsRoutes = require("./routes/notifications");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/courts", courtsRoutes);
app.use("/reservations", reservationsRoutes);
app.use("/auth", authRoutes);
app.use("/facilities", facilitiesRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/profile", profileRoutes);
app.use("/notifications", notificationsRoutes);

const reactBuildPath = path.join(__dirname, "../frontend/build");

app.use(express.static(reactBuildPath));

app.get(/^\/(?!auth|courts|reservations|facilities|reviews|profile|notifications).*/, (req, res) => {
  res.sendFile(path.join(reactBuildPath, "index.html"));
});

const PORT = process.env.PORT || 30024;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
