const router = require('express').Router();
let User = require('../models/user.model');

// 1. SYNC: Push local cart/wishlist to MongoDB
router.post('/sync', async (req, res) => {
  try {
    const { email, cart, wishlist } = req.body;
    await User.findOneAndUpdate(
      { email: email }, 
      { cart: cart, wishlist: wishlist }
    );
    res.status(200).json("Cloud Sync Successful");
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// 2. GET DATA: Pull cloud data for a specific user
router.post('/data', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");
    
    res.status(200).json({ cart: user.cart, wishlist: user.wishlist });
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// 3. CHECKOUT: Simulate Payment & Clear Cloud Cart
router.post('/checkout', async (req, res) => {
  try {
    const { email, total } = req.body;
    
    console.log(`--- Checkout Request Received ---`);
    console.log(`💳 Processing simulated payment of $${Number(total).toFixed(2)} for: ${email || 'Guest User'}`);

    // If the user is logged in, wipe their cart arrays clean in MongoDB Atlas
    if (email) {
      console.log(`🧹 Clearing saved cloud cart for ${email}...`);
      await User.findOneAndUpdate(
        { email: email },
        { cart: [] } // Overwrite the database cart array back to empty
      );
    }

    // Generate a secure-looking random receipt number
    const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    console.log(`✅ Order generated successfully: ${orderNumber}`);

    res.status(200).json({ 
      message: "Payment processed successfully", 
      orderId: orderNumber 
    });

  } catch (err) {
    console.error("❌ Checkout API Error:", err.message);
    res.status(500).json({ message: "Checkout failed: " + err.message });
  }
});

module.exports = router;