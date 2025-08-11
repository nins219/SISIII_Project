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
        const posts = res.map(({ post_id, ...rest }) => ({
          id: post_id,
          ...rest,
        }));
        resolve(posts);
      }
    });
  });
};

dataPool.postByUser = (user_id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT post.*, user.name, user.surname FROM post JOIN user ON post.user_id = user.user_id WHERE post.user_id = ?`;
    conn.query(query, [user_id], (err, res) => {
      if (err) {
        reject(err);
      } else {
        const posts = res.map(({ post_id, ...rest }) => ({
          id: post_id,
          ...rest,
        }));
        resolve(posts);
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
dataPool.createPost = (postData) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO post (user_id, title, description, activity_type, location, picture, no_of_people, date_time, is_paid_event, ticket_price, people_joint, status, visibility_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      postData.user_id,
      postData.title,
      postData.description,
      postData.activity_type,
      postData.location,
      postData.picture,
      postData.no_of_people,
      postData.date_time,
      postData.is_paid_event,
      postData.ticket_price,
      postData.people_joint ?? 0,
      postData.status || "open",
      postData.visibility_type || "public",
    ];
    conn.query(query, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

dataPool.checkRequest = (user_id, post_id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT id FROM request WHERE user_id = ? AND post_id = ?";
    conn.query(query, [user_id, post_id], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.length > 0 ? res[0] : null);
      }
    });
  });
};

// Adds a request if one does not already exist for the given user and post.
// Always resolves to true when the request exists after calling.
dataPool.addRequest = (user_id, post_id) => {
  return new Promise((resolve, reject) => {
    const checkQuery =
      "SELECT id FROM request WHERE user_id = ? AND post_id = ?";
    conn.query(checkQuery, [user_id, post_id], (err, res) => {
      if (err) {
        return reject(err);
      }
      if (res.length > 0) {
        // Request already exists; nothing to insert
        resolve(true);
      } else {
        const now = new Date().toISOString().slice(0, 19).replace("T", " ");
        const insertQuery =
          "INSERT INTO request (user_id, post_id, status, status_updated_at, created_at) VALUES (?, ?, 'pending', ?, ?)";
        conn.query(insertQuery, [user_id, post_id, now, now], (err2) => {
          if (err2) reject(err2);
          else resolve(true);
        });
      }
    });
  });
};
dataPool.pendingRequestsForHost = (host_id) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT r.id, r.user_id, r.status, r.status_updated_at, u.name, u.surname FROM request r JOIN post p ON r.post_id = p.post_id JOIN user u ON r.user_id = u.user_id WHERE p.user_id = ? ORDER BY r.status_updated_at DESC";
    conn.query(query, [host_id], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

dataPool.updateRequestStatus = (request_id, status) => {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const query =
      "UPDATE request SET status = ?, status_updated_at = ? WHERE id = ?";
    conn.query(query, [status, now, request_id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

export default dataPool;
