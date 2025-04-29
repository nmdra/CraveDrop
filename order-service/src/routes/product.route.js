// src/route/product.route.js

import express from 'express';
import { createProduct, getAllProducts, getProductsById, getProductsByRestaurant } from '../controller/product.controller.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/:id', getProductsById);
router.get('/', getAllProducts);
router.get('/restaurant/:restaurantId', getProductsByRestaurant); // New endpoint for restaurant products

export default router;
