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
  deleteMyRestaurant,
  getMenuItems,
  deleteRestaurantById,
  deleteAllMenuItems // Add this import
} = require("../controllers/restaurantController");
const { protect } = require("../middleware/authMiddleware"); // Assuming this exists

const router = express.Router();

// Add these new routes
router.get("/me", protect, getMyRestaurant);  // For owner to get their own restaurant
router.get("/:restaurantId", getRestaurantById);  // For getting restaurant by ID

// Add the new delete route (protected by authentication)
router.delete("/me", protect, deleteMyRestaurant);
router.delete("/:restaurantId", protect, deleteRestaurantById); // New route for deleting a restaurant by ID

// Existing routes
router.post("/menu", addMenuItem);
router.put("/menu/:restaurantId/:itemId", updateMenuItem);
router.delete("/menu/:restaurantId/all", protect, deleteAllMenuItems); // This should come FIRST
router.delete("/menu/:restaurantId/:itemId", deleteMenuItem); // This should come AFTER
router.get("/menu/:restaurantId", getMenuItems); // New route for getting menu items
router.post("/availability", setAvailability);
router.get("/orders", viewOrders);
router.put("/:restaurantId", updateRestaurantProfile);

module.exports = router;