import express from "express";
import db from "../db/conn.js";
import sessions from "../sessions.js";

const request = express.Router();

request.use((req, res, next) => {
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

request.get("/status/:postId", async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const result = await db.checkRequest(
      req.session.user_id,
      req.params.postId
    );
    res.json({ requested: !!result });
  } catch (err) {
    console.error("Error checking request status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

request.post("/toggle", async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({ error: "Not authenticated here" });
    }
    const { postId } = req.body;
    const requested = await db.toggleRequest(req.session.user_id, postId);
    res.json({ requested });
  } catch (err) {
    console.error("Error toggling request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default request;
