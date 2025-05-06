const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const users = []; // replace with a real DB later

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) return res.status(409).send("User already exists");

  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed });

  res.status(201).send("User registered");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).send("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(403).send("Incorrect password");

  res.json({ user, token: "mock-token" });
});

module.exports = router;
