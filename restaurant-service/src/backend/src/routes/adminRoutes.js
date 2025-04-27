const express = require("express");
const {
  verifyRestaurant,
  getAllRestaurants,
  viewTransactions,
} = require("../controllers/adminController");

const router = express.Router();

router.put("/verify/:restaurantId", verifyRestaurant);
router.get("/restaurants", getAllRestaurants);
router.get("/transactions", viewTransactions);

module.exports = router;