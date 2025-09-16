// server.js - This is your main server file

// Import required packages
// server.js (root of alumni-backend)
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // parses JSON body
app.use(cors());
app.use(express.static("public"));


// ✅ Serve static frontend files

app.use(express.static(path.join(__dirname, "public")));

// Connect DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./src/routes/auth"));

// ✅ For any unknown API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ For non-API routes, serve frontend (fallback to index or custom)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "testlogin5updated.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
