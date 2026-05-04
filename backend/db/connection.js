const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "court_booking_system",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to DB:", err);
    return;
  }
  console.log("Connected to MySQL");
});

module.exports = db;
