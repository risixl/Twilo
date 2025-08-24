import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to SQLite DB
const dbPath = path.join(__dirname, "messages.db");
const db = new sqlite3.Database(dbPath);

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// ---- Friendly root route ----
app.get("/", (req, res) => {
  res.send("🚀 Messaging API is running! Use /messages to fetch chat history.");
});

// ---- Get all messages ----
app.get("/messages", (req, res) => {
  db.all("SELECT * FROM messages ORDER BY timestamp ASC", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// ---- Post a new message ----
app.post("/messages", (req, res) => {
  const { username, message } = req.body;
  if (!username || !message) {
    return res.status(400).json({ error: "Missing username or message" });
  }

  db.run(
    "INSERT INTO messages (username, message) VALUES (?, ?)",
    [username, message],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, username, message });
    }
  );
});

// ---- Start server ----
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
