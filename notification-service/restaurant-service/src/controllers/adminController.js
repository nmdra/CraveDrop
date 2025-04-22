const Restaurant = require("../models/Restaurant");

// Verify restaurant registration
exports.verifyRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    restaurant.isVerified = true;
    await restaurant.save();

    res.json({ message: "Restaurant verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Manage restaurant accounts
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Handle financial transactions (mocked for now)
exports.viewTransactions = async (req, res) => {
  try {
    // Mocked transactions
    const transactions = [
      { transactionId: "txn_001", amount: 100.0, date: "2025-04-20" },
      { transactionId: "txn_002", amount: 50.0, date: "2025-04-21" },
    ];
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};