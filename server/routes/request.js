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

request.post("/create", async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({ error: "Not authenticated here" });
    }
    const { postId } = req.body;
    if (postId == null) {
      return res.status(400).json({ error: "postId is required" });
    }
    await db.addRequest(req.session.user_id, postId);
    res.json({ requested: true });
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

request.get("/notifications", async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const requests = await db.pendingRequestsForHost(req.session.user_id);
    res.json(requests);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update request status to accept, decline
request.put("/:id", async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const { status } = req.body;
    if (!["accepted", "declined"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    await db.updateRequestStatus(req.params.id, status);
    res.json({ status });
  } catch (err) {
    console.error("Error updating request status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default request;
