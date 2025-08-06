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
import dataPool from "./db/conn.js";
import user from "./routes/user.js"; // Importing user routes
// import auth from "./routes/auth.js"; // Importing auth routes

dotenv.config();
console.log("DB_USER", process.env.DB_USER);
console.log("DB_USER", process.env.DB_PASS);
console.log("Connecting to:", process.env.DB_HOST);

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3067", // Change to your frontend IP/port
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.get("/api", (req, res) => {
  res.send({ message: "API is working" });
});

// auth.get("/", (req, res) => {
//   res.send({ message: "Auth API is working" });
// });

//routes
app.use("/api/user", user);

//FOR PICTURE UPLOADS
// app.use("/uploads", express.static("uploads"));

const port = 5433 || process.env.PORT;

app.listen(process.env.PORT || port, () => {
  console.log(`Server started at: ${port || process.env.PORT}`);
});
