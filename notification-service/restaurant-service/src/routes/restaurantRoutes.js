const express = require("express");
const {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  setAvailability,
  viewOrders,
} = require("../controllers/restaurantController");

const router = express.Router();

router.post("/menu", addMenuItem);
router.put("/menu/:restaurantId/:itemId", updateMenuItem);
router.delete("/menu/:restaurantId/:itemId", deleteMenuItem);
router.post("/availability", setAvailability);
router.get("/orders", viewOrders);

module.exports = router;