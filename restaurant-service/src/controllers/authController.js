const Restaurant = require("../models/Restaurant");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new restaurant
exports.registerRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      email,
      password,
      telephoneNumber,
      location,
      cuisine,
      logo,
      coverImage
    } = req.body;

    // Check if restaurant already exists with this email
    const existingRestaurant = await Restaurant.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Restaurant with this email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new restaurant
    const restaurant = new Restaurant({
      name,
      description,
      email,
      password: hashedPassword,
      telephoneNumber,
      location,
      cuisine: cuisine || [],
      logo,
      coverImage
    });

    await restaurant.save();

    // Generate token for auto login
    const token = jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(201).json({
      message: "Restaurant registered successfully. Awaiting verification.",
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        email: restaurant.email,
        isVerified: restaurant.isVerified
      },
      token
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// Login restaurant
exports.loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find restaurant
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(200).json({
      message: "Login successful",
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        email: restaurant.email,
        isVerified: restaurant.isVerified
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

