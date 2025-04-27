const express = require("express");
const { registerRestaurant, loginRestaurant } = require("../controllers/authController");

const router = express.Router();

// Apply the middleware array as separate arguments
router.post("/register", registerRestaurant[0], registerRestaurant[1]);

router.post("/login", loginRestaurant);

module.exports = router;