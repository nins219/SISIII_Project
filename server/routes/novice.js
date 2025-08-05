import e from "express";
import express from "express";
const novice = express.Router();

novice.get("/", (req, res) => {
  console.log("novice route accessed");
  res.json({ message: "Welcome to the novice route!" });
});

export default novice;
