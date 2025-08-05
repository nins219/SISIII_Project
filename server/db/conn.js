import mysql2 from "mysql2";
import dotenv from "dotenv";
dotenv.config();
const conn = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

let dataPool = {};

// dataPool.allUsers = () => {
//   return new Promise((resolve, reject) => {
//     conn.query("SELECT * FROM user", (err, res) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(res);
//       }
//     });
//   });
// };

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

dataPool.oneUser = (id) => {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM user WHERE id = ?", id, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

conn.connect((err) => {
  if (err) {
    console.log("ERROR: " + err.message);
    return;
  }
  console.log("Connection established");
});

export default dataPool;
