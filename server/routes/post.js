import express from "express";
import db from "../db/conn.js";

const post = express.Router();

post.get("/", async (req, res) => {
  try {
    const posts = await db.allPosts();
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

post.get("/activities", async (req, res) => {
  try {
    const activities = await db.allActivities();
    res.json(activities);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default post;
