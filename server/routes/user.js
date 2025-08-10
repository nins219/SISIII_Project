import express from "express";
import db from "../db/conn.js"; // Assuming you have a db module for database operations␊
import multer from "multer";
import crypto from "crypto";

// const upload = multer();

//picture upload that I will setup later when on server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../uploads/"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const sessions = {};
const user = express.Router();

user.use((req, res, next) => {
  const cookie = req.headers.cookie;
  if (cookie) {
    const match = cookie.match(/sessionId=([^;]+)/);
    if (match && sessions[match[1]]) {
      req.session = sessions[match[1]];
      req.sessionId = match[1];
    }
  }
  next();
});

user.post("/register", upload.single("picture"), async (req, res) => {
  // check if email already exists
  const existingUser = await db.authUser(req.body.email);
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }
  try {
    const {
      name,
      surname,
      email,
      password,
      city,
      language,
      bio,
      account_type = "unverified",
    } = req.body;

    const picturePath = req.file ? req.file.path : null;

    const userData = {
      name,
      surname,
      email,
      password,
      city,
      language,
      bio,
      account_type,
      picture: picturePath,
    };
    const result = await db.registerUser(userData);
    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

user.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await db.authUser(email);
    if (!user) return res.status(401).json({ error: "User not found" });

    if (password !== user.password_hash) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const { password_hash, user_id, ...safeUser } = user; // Exclude password and id from response
    const sessionId = crypto.randomBytes(16).toString("hex");
    sessions[sessionId] = { user_id, ...safeUser };
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
    });
    res.json({ message: "Login successful", user: safeUser });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

user.get("/me", (req, res) => {
  if (req.session) {
    const { user_id, ...safeUser } = req.session;
    res.json(safeUser);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

user.get("/:id", async (req, res) => {
  try {
    const result = await db.oneUser(req.params.id);
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password_hash, ...safeUser } = result[0];
    res.json(safeUser);
  } catch (err) {
    console.error("Fetch user error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default user;
