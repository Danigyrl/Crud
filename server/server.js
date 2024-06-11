const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = 5000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Your MySQL password
  database: "students",
});

// Handle database connection errors
db.connect((err) => {
  if (err) {
    console.error("Database connection failed: ", err);
    return;
  }
  console.log("Connected to the database");
});

// Error handler middleware
const errorHandler = (res, err) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Server error" });
};

app.post("/students", (req, res) => {
  const { name, email, age, gender } = req.body;
  const sql = "INSERT INTO students_info (name, email, age, gender) VALUES (?, ?, ?, ?)";
  const values = [name, email, age, gender];

  db.query(sql, values, (err, result) => {
    if (err) return errorHandler(res, err);
    res.json({ success: "Student added successfully", id: result.insertId });
  });
});

app.get("/students", (req, res) => {
  const sql = "SELECT * FROM students_info";

  db.query(sql, (err, result) => {
    if (err) return errorHandler(res, err);
    res.json(result);
  });
});

app.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, age, gender } = req.body;
  const sql = "UPDATE students_info SET name=?, email=?, age=?, gender=? WHERE id=?";
  const values = [name, email, age, gender, id];

  db.query(sql, values, (err, result) => {
    if (err) return errorHandler(res, err);
    res.json({ success: "Student updated successfully" });
  });
});

app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM students_info WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return errorHandler(res, err);
    res.json({ success: "Student deleted successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
