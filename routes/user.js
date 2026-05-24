const router = require('express').Router();
const User = require('../models/user.model');
const { verifyToken } = require('../middleware/auth.middleware'); 

// ── 1. SECURE SYNC: Push local cart/wishlist to MongoDB ──
router.post('/sync', verifyToken, async (req, res) => {
  try {
    const { cart, wishlist } = req.body;

    // Use req.userId (extracted from token) to update arrays atomically via $set
    await User.findByIdAndUpdate(
      req.userId, 
      { $set: { cart: cart, wishlist: wishlist } },
      { new: true }
    );

    res.status(200).json("Cloud Sync Successful");
  } catch (err) {
    console.error("❌ Sync Error:", err.message);
    res.status(400).json('Error: ' + err.message);
  }
});

// ── 2. SECURE FETCH DATA: Pull cloud data for a specific user ──
router.post('/data', verifyToken, async (req, res) => {
  try {
    // Find user directly by their authenticated token ID, only fetching cart, wishlist, and orders fields
    const user = await User.findById(req.userId).select('cart wishlist orders');
    if (!user) return res.status(404).json("User not found");
    
    // 🚀 UPDATED: Now returns orders array alongside cart and wishlist data
    res.status(200).json({ cart: user.cart, wishlist: user.wishlist, orders: user.orders || [] });
  } catch (err) {
    console.error("❌ Data Fetch Error:", err.message);
    res.status(400).json('Error: ' + err.message);
  }
});

// ── 3. SECURE CHECKOUT: Save to History, Generate Receipt & Clear Cloud Cart ──
router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const { total } = req.body;
    
    // 1. Pull the authentic user account to grab data before modification
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log(`--- Checkout Request Received ---`);
    console.log(`💳 Processing payment of $${Number(total).toFixed(2)} for: ${user.email}`);

    // 2. Generate a unique receipt sequence number
    const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    
    // 3. Construct the permanent order data object
    const newOrder = {
      orderId: orderNumber,
      date: new Date(),
      items: user.cart,       // 📦 Archive a copy of everything currently being purchased
      totalAmount: Number(total),
      status: "Processing"   // Tracking tag for delivery pipelines
    };

    console.log(`🧹 Saving transaction history and wiping active cloud cart for ${user.email}...`);
    
    // 4. Atomically push order record into user history array while resetting the cart array
    await User.findByIdAndUpdate(
      req.userId,
      { 
        $push: { orders: newOrder }, // Append historical structural object
        $set: { cart: [] }           // Empty the shopping cart
      }
    );

    console.log(`✅ Transaction fully processed and logged: ${orderNumber}`);
    res.status(200).json({ 
      message: "Payment processed successfully and archived.", 
      orderId: orderNumber 
    });

  } catch (err) {
    console.error("❌ Checkout API Error:", err.message);
    res.status(500).json({ message: "Checkout failed: " + err.message });
  }
});

module.exports = router;