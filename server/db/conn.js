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

dataPool.registerUser = (userData) => {
  return new Promise((resolve, reject) => {
    const query =
      `INSERT INTO user (name, surname, email, password_hash, city, language, bio, account_type)` +
      ` VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      userData.name,
      userData.surname,
      userData.email,
      userData.password, // For now, no hashing, but you should hash passwords in production
      userData.city || null, // Default to null if city is not provided
      userData.language || null, // Default to null if language is not provided
      userData.bio || null, // Default to null if bio is not provided
      userData.account_type || "unverified", // Default to 'unverified' if not provided
    ];
    //idk if this will work
    conn.query(query, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
    // idk if this will work
  });
};

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

dataPool.allPosts = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT post.*, user.name, user.surname FROM post JOIN user ON post.user_id = user.user_id`;
    conn.query(query, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

dataPool.allActivities = () => {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM activity_type", (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

export default dataPool;
