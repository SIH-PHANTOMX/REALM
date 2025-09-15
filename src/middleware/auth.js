// src/middleware/auth.js - Check if user is authenticated

// src/middleware/auth.js
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  // Check for token in Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded user info (id, role) to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = auth;
