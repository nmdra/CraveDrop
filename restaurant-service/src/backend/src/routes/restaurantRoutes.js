const express = require("express");
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
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

const router = express.Router();

// Configure storage for menu item images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/menu");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
});

// Use upload.fields for multiple different file inputs
const profileUpload = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

// Update the route to use multer middleware
const uploadMiddleware = upload.single("image");
router.post("/menu", protect, (req, res, next) => {
  console.log("Before upload middleware, body:", req.body);
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error("Upload middleware error:", err);
      return res.status(400).json({ message: err.message });
    }
    console.log("After upload middleware, file:", req.file);
    next();
  });
}, addMenuItem);

router.get("/me", protect, getMyRestaurant);  // For owner to get their own restaurant
router.get("/:restaurantId", getRestaurantById);  // For getting restaurant by ID

// Add the new delete route (protected by authentication)
router.delete("/me", protect, deleteMyRestaurant);
router.delete("/:restaurantId", protect, deleteRestaurantById); // New route for deleting a restaurant by ID

// Existing routes
router.put("/menu/:restaurantId/:itemId", protect, upload.single("image"), updateMenuItem);
router.delete("/menu/:restaurantId/all", protect, deleteAllMenuItems); // This should come FIRST
router.delete("/menu/:restaurantId/:itemId", deleteMenuItem); // This should come AFTER
router.get("/menu/:restaurantId", getMenuItems); // New route for getting menu items
router.post("/availability", setAvailability);
router.get("/orders", viewOrders);
router.put("/:restaurantId", protect, profileUpload, updateRestaurantProfile); 

module.exports = router;