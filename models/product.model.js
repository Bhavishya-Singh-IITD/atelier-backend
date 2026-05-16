const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Updated blueprint to include descriptions and better constraints
const productSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true // Removes accidental spaces
  },
  image: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    default: 'Original Art' 
  },
  description: { 
    type: String, 
    default: '' 
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;