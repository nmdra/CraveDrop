// src/models/product.model.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  restaurantId: {
    type: String,
    required: true,
    default: 'default-restaurant' // Default value for existing products
  },
  image: String,
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
