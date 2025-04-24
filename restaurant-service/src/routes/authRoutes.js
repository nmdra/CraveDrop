const express = require("express");
const { registerRestaurant, loginRestaurant } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerRestaurant);
router.post("/login", loginRestaurant);

module.exports = router;