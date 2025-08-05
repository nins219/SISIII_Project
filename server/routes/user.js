import express from "express";
import db from "../db/conn.js"; // Assuming you have a db module for database operations
const user = express.Router();
// GET /api/user/1 - fetch user with id 1 for testing
user.get("/1", async (req, res) => {
  try {
    const user = await db.oneUser(1);
    if (!user || user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user[0] || user);
  } catch (err) {
    console.error("Error fetching user with id 1:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

user.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await db.authUser(email);
    if (!user) return res.status(401).json({ error: "User not found" });

    // Compare plain password (for now, no hashing)
    if (password !== user.password_hash) {
      return res.status(401).json({ error: "Wrong password" });
    }

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default user;
