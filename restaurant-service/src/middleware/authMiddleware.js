const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get restaurant from token
    const restaurant = await Restaurant.findById(decoded.id).select("-password");
    
    if (!restaurant) {
      return res.status(401).json({ message: "Not authorized, restaurant not found" });
    }

    req.restaurant = restaurant;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Middleware to check if restaurant is verified
exports.verifiedOnly = (req, res, next) => {
  if (!req.restaurant.isVerified) {
    return res.status(403).json({ 
      message: "Access denied. Restaurant not verified yet. Please contact support." 
    });
  }
  next();
};