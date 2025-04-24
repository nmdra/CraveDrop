import { Router } from 'express';
import { 
  createOrder, 
  getOrderById, 
  updateOrderStatus, 
  getOrdersByCustomer 
} from '../controllers/orderController.js';

const router = Router();

// Order routes
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.get('/customer/:customerId', getOrdersByCustomer);

export default router;