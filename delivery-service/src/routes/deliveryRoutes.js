import express from 'express';
import {
  assignDriverToDelivery,
  getDeliveryDetails,
  manuallyAssignDrivers
} from '../controllers/deliveryController.js';

const router = express.Router();

// Routes
router.post('/assign-driver', assignDriverToDelivery);
router.get('/:id', getDeliveryDetails);
router.post('/assign-ready-orders', manuallyAssignDrivers);

export default router;