import Product from '../model/product.model.js';
import dotenv from 'dotenv';

dotenv.config();

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, restaurantId } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const newProduct = new Product({ 
      name, 
      description, 
      price, 
      image,
      restaurantId: restaurantId || 'default-restaurant'
    });
    
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Product creation failed:', error.message);
    res.status(500).json({ message: 'Something went wrong on the server' });
  }
};

export const getProductsById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'product not found' });

    res.status(200).json(product);
  } catch (error) {
    console.error('Get product failed:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get products by restaurant ID
export const getProductsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    if (!restaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' });
    }
    
    const products = await Product.find({ restaurantId });
    res.status(200).json(products);
  } catch (error) {
    console.error('Get restaurant products failed:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    // Support filtering by restaurantId via query param
    const { restaurantId } = req.query;
    
    let query = {};
    if (restaurantId) {
      query.restaurantId = restaurantId;
    }
    
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    console.error('Get all products failed:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};