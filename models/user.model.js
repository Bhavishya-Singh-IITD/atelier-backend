const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

// ── USER PROFILE BLUEPRINT: Structured for security and permanent analytics ──
const userSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },
  cart: { 
    type: Array, 
    default: [] // Local storage sync mirror for checkout tracking
  },       
  wishlist: { 
    type: Array, 
    default: [] // Saved collector items
  },    
  role: { 
    type: String, 
    default: "user" // "user" or "admin" privileges
  },
  orders: { 
    type: Array, 
    default: [] // 🚀 NEW: Permanent history repository for client receipts
  }
}, {
  timestamps: true, // Automatically manages tracking logs for user creation dates
});

// 🔒 SECURITY GATE: Hash password payloads dynamically on sign-up/modifications
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;