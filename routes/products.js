const router = require('express').Router();
const Product = require('../models/product.model');
const { upload } = require('../config/cloudinary');

// 1. GET ALL PRODUCTS
router.get('/', (req, res) => {
  Product.find()
    .then(products => res.json(products))
    .catch(err => res.status(400).json('Error: ' + err));
});

// 2. GET SINGLE PRODUCT
router.get('/:id', (req, res) => {
    Product.findById(req.params.id)
      .then(product => res.json(product))
      .catch(err => res.status(400).json('Error: ' + err));
});

// 3. POST: ADD NEW PRODUCT
router.post('/add', upload.single('image'), async (req, res) => {
  console.log("--- New Upload Request ---");
  try {
    const { name, price, category, description } = req.body;
    
    // Cloudinary path or body string
    const imagePath = req.file ? req.file.path : req.body.image; 

    console.log(`Received: ${name}, Price: ${price}`);

    if (!imagePath) {
      console.log("❌ Upload failed: No image path found.");
      return res.status(400).json({ message: "Image is required" });
    }

    const newProduct = new Product({
      name,
      image: imagePath,
      price: Number(price),
      category,
      description
    });

    console.log("Saving to MongoDB...");
    
    // This is where the buffering timeout usually happens
    await newProduct.save();

    console.log("✅ Success: Product saved to database.");
    res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    
  } catch (err) {
    console.error("❌ Database Error:", err.message);
    res.status(400).json({ message: 'Error: ' + err.message });
  }
});

module.exports = router;