import mysql2 from "mysql2";
import dotenv from "dotenv";
dotenv.config();
const conn = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

conn.connect((err) => {
  if (err) {
    console.log("ERROR: " + err.message);
    return;
  }
  console.log("Connection established");
});

let dataPool = {};

dataPool.authUser = (email) => {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM user WHERE email = ?", [email], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.length > 0) {
        resolve(res[0]);
      } else {
        resolve(null);
      }
    });
  });
};

dataPool.allUsers = () => {
  console.log("🔍 allUsers() called");
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM user", (err, res) => {
      if (err) {
        console.log("❌ Error in allUsers:", err.message);
        reject(err);
      } else {
        console.log("✅ allUsers query succeeded");
        resolve(res);
      }
    });
  });
};

dataPool.oneUser = (user_id) => {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM user WHERE user_id = ?", user_id, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

export default dataPool;
