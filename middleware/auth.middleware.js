const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // 🚀 NEW: Import the User model to check roles

// ── 1. BASE SECURITY GATEKEEPER (Checks if user is logged in) ──
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Splits "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied. Security token missing." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.userId; // Attach verified user ID to the request object
    next();
  } catch (err) {
    res.status(403).json({ message: "Session expired or invalid token. Please sign in again." });
  }
};

// ── 2. ADMIN PRIVILEGE GATEKEEPER (Checks if user has the crown) ──
// ⚠️ CRITICAL: Always place this right AFTER verifyToken in your routes!
const verifyAdmin = async (req, res, next) => {
  try {
    // req.userId was populated by verifyToken running right before this function
    const user = await User.findById(req.userId); 
    
    if (!user) {
      return res.status(404).json({ message: "User account not found." });
    }

    // Check if the role field matches exactly "admin"
    if (user.role === 'admin') {
      console.log(`👑 Admin access granted for: ${user.email}`);
      next(); // User is the administrator, let them through!
    } else {
      console.warn(`🚨 Unauthorized Admin Attempt by: ${user.email}`);
      res.status(403).json({ message: "Access denied. Administrative privileges required." });
    }
  } catch (err) {
    console.error("❌ Admin Verification Middleware Error:", err.message);
    res.status(500).json({ message: "Server error verifying administrative rights." });
  }
};

// 🚀 NEW: Export both functions as an object so they can be picked up selectively
module.exports = { verifyToken, verifyAdmin };