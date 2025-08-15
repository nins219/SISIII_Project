import express from "express";
import multer from "multer";
import db from "../db/conn.js";
import sessions from "../sessions.js";

const post = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

post.use((req, res, next) => {
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

post.get("/mine", async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const posts = await db.postByUser(req.session.user_id);
    res.json(posts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

post.post("/create", upload.single("picture"), async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const {
      title,
      description,
      activity_type,
      location,
      no_of_people,
      date_time,
      is_paid_event,
      ticket_price,
      status = "open",
      visibility_type = "public",
    } = req.body;

    const picturePath = req.file ? req.file.path : null;

    if (date_time && new Date(date_time) <= new Date()) {
      return res
        .status(400)
        .json({ error: "Date and time must be in the future" });
    }

    const formattedDate = date_time
      ? new Date(date_time).toISOString().slice(0, 19).replace("T", " ")
      : null;

    const postData = {
      user_id: req.session.user_id,
      title,
      description,
      activity_type: activity_type ? parseInt(activity_type, 10) : null,
      location,
      picture: picturePath,
      no_of_people: no_of_people ? parseInt(no_of_people, 10) : null,
      date_time: formattedDate,
      is_paid_event: is_paid_event ? 1 : 0,
      ticket_price: ticket_price ? parseFloat(ticket_price) : 0,
      people_joint: 0,
      status,
      visibility_type,
    };

    const result = await db.createPost(postData);
    res.status(201).json({
      message: "Post created successfully",
      postId: result.insertId,
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Internal server error" });
    console.log(req.body);
  }
});

post.put("/update/:id", upload.single("picture"), async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const postId = req.params.id;
    const existing = await db.getPostById(postId);
    if (!existing || existing.user_id !== req.session.user_id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const {
      title,
      description,
      activity_type,
      location,
      no_of_people,
      date_time,
      is_paid_event,
      ticket_price,
      status = "open",
      visibility_type = "public",
      existingPicture,
    } = req.body;

    const picturePath = req.file ? req.file.path : existingPicture || null;

    const formattedDate = date_time
      ? new Date(date_time).toISOString().slice(0, 19).replace("T", " ")
      : null;

    const postData = {
      title,
      description,
      activity_type: activity_type ? parseInt(activity_type, 10) : null,
      location,
      picture: picturePath,
      no_of_people: no_of_people ? parseInt(no_of_people, 10) : null,
      date_time: formattedDate,
      is_paid_event: is_paid_event ? 1 : 0,
      ticket_price: ticket_price ? parseFloat(ticket_price) : 0,
      status,
      visibility_type,
    };

    await db.updatePost(postId, req.session.user_id, postData);
    res.json({ message: "Post updated successfully" });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

post.delete("/:id", async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const postId = req.params.id;
    const existing = await db.getPostById(postId);
    if (!existing || existing.user_id !== req.session.user_id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await db.deletePost(postId, req.session.user_id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default post;
