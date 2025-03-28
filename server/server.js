const express = require("express");
const cors = require("cors");

const app = express();
app.get("/api", (req, res) => {
  res.json({ users: ["user1", "user2", "user3"] });
});

app.use(
  cors({
    origin: "http://88.200.63.148:3075", // Allow only from this origin
  })
);

app.listen(5000, () => {
  console.log("Server started at: 5000");
});
