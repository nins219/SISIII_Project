import express from "express";
import bodyParser from "body-parser";
// import mongoose from "mongoose";
import cors from "cors";
//import dotenv from "dotenv";  //u havent downloaded this,
//import multer from "multer"; //u havent downloaded this,
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

// const express = require("express");

// const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://88.200.63.148:3076", // Change to your frontend IP/port
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.get("/api", (req, res) => {
  res.send({ message: "API is working" });
});

// app.get("/api", (req, res) => {
//   res.json({ users: ["user1", "user2", "user3"] });
// });

app.listen(5433, "0.0.0.0", () => {
  console.log("Server started at: 5433");
});
