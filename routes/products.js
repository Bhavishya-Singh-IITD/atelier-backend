const router = require('express').Router();
const Product = require('../models/product.model');
const { upload } = require('../config/cloudinary');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware'); // 🚀 NEW: Import both security middleware guards

// 1. GET ALL PRODUCTS (Publicly accessible to everyone browsing)
router.get('/', (req, res) => {
  Product.find()
    .then(products => res.json(products))
    .catch(err => res.status(400).json('Error: ' + err));
});

// 2. GET SINGLE PRODUCT (Publicly accessible to see item details)
router.get('/:id', (req, res) => {
    Product.findById(req.params.id)
      .then(product => res.json(product))
      .catch(err => res.status(400).json('Error: ' + err));
});

// 3. POST: ADD NEW PRODUCT (🔒 SECURED: Restricted strictly to logged-in Admin accounts)
// We add 'verifyToken' and 'verifyAdmin' as cascading blockers before the file parser triggers
router.post('/add', verifyToken, verifyAdmin, upload.single('image'), async (req, res) => {
  console.log("--- New Secure Upload Request ---");
  try {
    const { name, price, category, description } = req.body;
    
    // Cloudinary path or body fallback string
    const imagePath = req.file ? req.file.path : req.body.image; 

    console.log(`Received Product Request: ${name}, Price: $${price}`);

    if (!imagePath) {
      console.log("❌ Upload failed: No image file or path resolved.");
      return res.status(400).json({ message: "Image asset upload is required" });
    }

    const newProduct = new Product({
      name,
      image: imagePath,
      price: Number(price),
      category,
      description
    });

    console.log("Saving new inventory data to MongoDB...");
    await newProduct.save();

    console.log("✅ Success: New product listed in global inventory.");
    res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    
  } catch (err) {
    console.error("❌ Database Error on Product Upload:", err.message);
    res.status(400).json({ message: 'Error: ' + err.message });
  }
});

module.exports = router;