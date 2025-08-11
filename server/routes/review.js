import express from "express";
import db from "../db/conn.js";
import sessions from "../sessions.js";

const review = express.Router();

review.use((req, res, next) => {
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

// Reviews pending after attending an event
review.get("/pending", async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const pending = await db.pendingReviewsForUser(req.session.user_id);
    res.json(pending);
  } catch (err) {
    console.error("Error fetching pending reviews:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a review for a post
review.post("/create", async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const { to_post_id, rating, comment } = req.body;
    if (!to_post_id || !rating) {
      return res
        .status(400)
        .json({ error: "to_post_id and rating are required" });
    }
    await db.addReview({
      from_user_id: req.session.user_id,
      to_post_id,
      rating,
      comment,
    });
    res.status(201).json({ message: "Review saved" });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Average rating for a specific user
review.get("/average/:userId", async (req, res) => {
  try {
    const avg = await db.getAverageRating(req.params.userId);
    res.json({ average: avg });
  } catch (err) {
    console.error("Error fetching average rating:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Average rating for current logged user
review.get("/average/me", async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const avg = await db.getAverageRating(req.session.user_id);
    res.json({ average: avg });
  } catch (err) {
    console.error("Error fetching own average rating:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default review;
