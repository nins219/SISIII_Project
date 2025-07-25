import express from "express";
import bodyParser from "body-parser";
// import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"; //to load .env file into process.env
import multer from "multer"; //file upload middleware
import helmet from "helmet"; //security headers in express
import morgan from "morgan"; //HTTP request logger (but i think i dont need this) (for debugging)
import path from "path";
import { fileURLToPath } from "url";
import conn from "./db/conn.js";

dotenv.config();
console.log("DB_USER", process.env.DB_USER);
console.log("DB_USER", process.env.DB_PASS);
console.log("Connecting to:", process.env.DB_HOST);

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

app.listen(5433, "0.0.0.0", () => {
  console.log("Server started at: 5433");
});
