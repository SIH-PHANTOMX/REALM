// server.js - This is your main server file

// Import required packages
// server.js (root of alumni-backend)
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");   // ✅ added

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // parses JSON body
app.use(cors());

// ✅ Serve static frontend files from "public" folder
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

// ✅ Serve index page if someone visits root "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "testlogin5updated.html"));
});

// Fallback if route not found
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
