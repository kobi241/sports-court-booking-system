const express = require("express");
const router = express.Router();

let users = [
  {
    id: 1,
    first_name: "Admin",
    last_name: "User",
    email: "admin@sports.com",
    password: "admin123",
    role: "admin",
  },
];

router.post("/register", (req, res) => {
  const { first_name, last_name, email, password, confirm_password } = req.body;

  if (!first_name || !last_name || !email || !password || !confirm_password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = {
    id: users.length + 1,
    first_name,
    last_name,
    email,
    password,
    role: "user",
  };

  users.push(newUser);

  res.status(201).json({
    message: "User registered successfully",
    user: newUser,
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(400).json({ message: "Invalid password" });
  }

  res.status(200).json({
    message: "Login successful",
    user,
  });
});

module.exports = router;
