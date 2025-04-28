import express from 'express';
import {
  assignDriverToDelivery,
  getDeliveryDetails,
  manuallyAssignDrivers,
  getAllDeliveries,
  getDeliveryByOrderId,
  getDeliveriesByDriverId,
  getDeliveriesByShopId,
  getDeliveriesByCustomerId,
  updateDeliveryStatus,
  updateDriverLocation
} from '../controllers/deliveryController.js';

const router = express.Router();

// Define the specific routes BEFORE the generic /:id route
// New delivery query routes
router.get('/all', getAllDeliveries);
router.get('/order/:orderId', getDeliveryByOrderId);
router.get('/driver/:driverId', getDeliveriesByDriverId);
router.get('/shop/:shopId', getDeliveriesByShopId);
router.get('/customer/:customerId', getDeliveriesByCustomerId);

// Existing routes - generic /:id route MUST come AFTER more specific routes
router.post('/assign-driver', assignDriverToDelivery);
router.get('/:id', getDeliveryDetails);
router.post('/assign-ready-orders', manuallyAssignDrivers);

// Status dupdate route
router.patch('/:id/status', updateDeliveryStatus);

// New driver location update route
router.patch('/:id/driver-location', updateDriverLocation);

export default router;