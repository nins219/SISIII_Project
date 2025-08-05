import express from "express";
const user = express.Router();
import db from "../db/conn.js";

user.get("/", async (req, res, next) => {
  try {
    let queryResult = await db.allUsers();
    console.log("user route accessed");
    res.json(queryResult);
    next();
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

user.get("/:id", async (req, res, next) => {
  try {
    console.log(req);
    let queryResult = await db.oneUser(req.params.id);
    res.json(queryResult);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send({ error: "Failed to fetch user" });
  }
});

export default user;
