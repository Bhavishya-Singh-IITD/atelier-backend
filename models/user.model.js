const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  cart: { type: Array, default: [] },       // Stores cart items
  wishlist: { type: Array, default: [] }    // Stores wishlist items
}, {
  timestamps: true,
});

// 🔒 MIDDLEWARE HOOK: Automatically hash passwords on registration/change
userSchema.pre('save', async function (next) {
  // If the password field hasn't been modified (e.g., user just updated their cart), skip hashing
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a secure cryptographic salt
    const salt = await bcrypt.genSalt(10);
    // Hash the plain text password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;