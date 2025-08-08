import express from "express";
import db from "../db/conn.js"; // Assuming you have a db module for database operations
import multer from "multer";

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

user.post("/", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await db.authUser(email);
    if (!user) return res.status(401).json({ error: "User not found" });

    // Compare plain password (for now no hashing)
    if (password !== user.password_hash) {
      return res.status(401).json({ error: "Wrong password" });
    }

    // res.json({
    //   message: "Login successful",
    //   user_id: user.id,
    //   name: user.name,
    //   account_type: user.account_type,
    //   picture: user.picture || null,
    // });
    const { password_hash, ...safeUser } = user; // Exclude password from response
    // cookie session here
    res.json({ message: "Login successful", user: safeUser });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default user;
