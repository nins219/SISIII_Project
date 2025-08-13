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
import user from "./routes/user.js";
import post from "./routes/post.js";
import request from "./routes/request.js";
// import auth from "./routes/auth.js";
import review from "./routes/review.js";

const app = express();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // Serve static files from the uploads directory

// file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../uploads"); // inside my project root
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// app.use(
//   "/uploads",
//   express.static(
//     path.join(path.dirname(fileURLToPath(import.meta.url)), "../uploads")
//   )
// );

dotenv.config();
console.log("DB_USER", process.env.DB_USER);
console.log("DB_USER", process.env.DB_PASS);
console.log("Connecting to:", process.env.DB_HOST);

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
app.use("/api/post", post);
app.use("/api/request", request);
app.use("/api/review", review);

//FOR PICTURE UPLOADS
// app.use("/uploads", express.static("uploads"));

const port = 5474 || process.env.PORT;

app.listen(process.env.PORT || port, () => {
  console.log(`Server started at: ${port || process.env.PORT}`);
});
