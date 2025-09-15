// index.js
const express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🎉 Alumni Backend is running!");
});

// Example API route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express backend 👋" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
