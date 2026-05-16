const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/product.model');

// This is the data you already created for your frontend
const products = [
  {
    name: "Misty Mountains, Abstract Painting",
    image: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&q=80",
    price: 54,
    category: "Abstract"
  },
  {
    name: "Retro Dots and Paper, Abstract Painting",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80",
    price: 54,
    category: "Abstract"
  },
  {
    name: "Pink and Yellow 1, Abstract Painting",
    image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&q=80",
    price: 54,
    category: "Abstract"
  },
  {
    name: "Sun Set, Abstract Painting",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&q=80",
    price: 54,
    category: "Abstract"
  }
];

// Connect to MongoDB and upload the data
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB for seeding...");
    
    // Clear out any old data so we don't get duplicates
    await Product.deleteMany({});
    
    // Insert the new products
    await Product.insertMany(products);
    
    console.log("✅ Database Seeded Successfully!");
    process.exit(); // Close the script
  })
  .catch(err => {
    console.log("❌ Seeding Error:", err);
    process.exit(1);
  });