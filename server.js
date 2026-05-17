const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// 1. PRODUCTION-READY CORS MIDDLEWARE
app.use(cors({
  origin: [
    'http://127.0.0.1:5500', 
    'http://localhost:5500',
    /\.netlify\.app$/ // 🚀 This regex allows ANY netlify domain you generate to talk to your backend!
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. IMPORT ROUTES
const productsRouter = require('./routes/products');
const authRouter     = require('./routes/auth');
const userRouter     = require('./routes/user');

// 3. USE ROUTES
app.use('/products', productsRouter);
app.use('/user', authRouter); 
app.use('/user', userRouter);

// Root Route
app.get('/', (req, res) => {
  res.send('Atelier Production Backend is live and secure! ✦');
});

// 4. RESILIENT STARTUP LOGIC (Optimized for cloud environment ports)
const PORT = process.env.PORT || 5001;
const uri = process.env.MONGO_URI;

// Disable Mongoose buffering so we get instant error feedback
mongoose.set('bufferCommands', false);

// START SERVER IMMEDIATELY
// This prevents boot timeouts on cloud hosting providers like Render
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📡 Attempting to connect to MongoDB Cloud Cluster...`);
});

// CONNECT TO DATABASE IN BACKGROUND
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000, // Stop searching for the DB after 5 seconds
})
  .then(() => {
    console.log("✅ MongoDB Connection Established Successfully");
  })
  .catch(err => {
    console.log("❌ MongoDB Connection Error (Check IP Whitelist or Network):");
    console.error(err.message);
  });