const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// 1. REGISTER NEW USER
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Quick check for existing user
    const existingUser = await User.findOne({ email }).maxTimeMS(2000);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create and save — Mongoose pre-save hook handles the hashing automatically
    const newUser = new User({ email, password });
    await newUser.save();
    
    console.log("✅ New secure user created:", email);
    res.status(201).json({ message: "Account created!" });
    
  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    res.status(500).json({ message: "Database is busy or invalid data. Try again." });
  }
});

// 2. LOGIN USER (With Bcrypt Verification)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email only (cannot query by plain-text password anymore)
    const user = await User.findOne({ email }).maxTimeMS(2000);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔒 THE SECURITY CHECK: Compare raw input password with encrypted cloud hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    console.log("🔓 User logged in successfully:", email);
    
    // Match your frontend fetch logic by returning the confirmed user details
    res.status(200).json({ 
      message: "Login successful", 
      email: user.email 
    });

  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ message: "Server connection timeout. Try again." });
  }
});

module.exports = router;