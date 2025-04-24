const express = require("express");
const {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  setAvailability,
  viewOrders,
  updateRestaurantProfile,
  getRestaurantById,
  getMyRestaurant,
  deleteMyRestaurant
} = require("../controllers/restaurantController");
const { protect } = require("../middleware/authMiddleware"); // Assuming this exists

const router = express.Router();

// Add these new routes
router.get("/me", protect, getMyRestaurant);  // For owner to get their own restaurant
router.get("/:restaurantId", getRestaurantById);  // For getting restaurant by ID

// Add the new delete route (protected by authentication)
router.delete("/me", protect, deleteMyRestaurant);

// Existing routes
router.post("/menu", addMenuItem);
router.put("/menu/:restaurantId/:itemId", updateMenuItem);
router.delete("/menu/:restaurantId/:itemId", deleteMenuItem);
router.post("/availability", setAvailability);
router.get("/orders", viewOrders);
router.put("/:restaurantId", updateRestaurantProfile);

module.exports = router;