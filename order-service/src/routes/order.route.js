import express from 'express';
import {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getAllOrders,
  getOrdersByRestaurant
} from '../controller/order.controller.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.get('/', getAllOrders); // Fetch all orders
router.get('/restaurant/:restaurantId', getOrdersByRestaurant); // New endpoint for restaurant orders

export default router;
