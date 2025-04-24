import { Router } from 'express';
import { 
    registerDriver, 
    loginDriver, 
    getDriverProfile,
    getAllDrivers, 
    updateDriverLocation, 
    updateDriverAvailability,
    getDriverById,
    updateDriverAvailabilityById
} from '../controllers/driverController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/register', registerDriver);
router.post('/login', loginDriver);
router.get('/all',  getAllDrivers);  // Added new route for getting all drivers

// Get driver by ID - accessible by other services
router.get('/:id', getDriverById);

// Update driver availability by ID - for use by other services
router.put('/:id/availability', updateDriverAvailabilityById);

// Protected routes
router.get('/profile', protect, getDriverProfile);
router.put('/location', protect, updateDriverLocation);
router.put('/availability', protect, updateDriverAvailability);

// Test authentication endpoint
router.get('/auth-test', protect, (req, res) => {
  res.status(200).json({ 
    message: 'Authentication successful', 
    driver: { 
      id: req.driver._id,
      name: `${req.driver.firstName} ${req.driver.lastName}`,
      email: req.driver.email
    }
  });
});

export default router;
