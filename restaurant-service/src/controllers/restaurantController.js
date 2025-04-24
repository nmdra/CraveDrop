const Restaurant = require("../models/Restaurant");

// Add a new menu item
exports.addMenuItem = async (req, res) => {
  try {
    const { restaurantId, name, price, description, image } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    restaurant.menu.push({ name, price, description, image });
    await restaurant.save();

    res.status(201).json({ message: "Menu item added successfully", menu: restaurant.menu });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update or delete menu items
exports.updateMenuItem = async (req, res) => {
  try {
    const { restaurantId, itemId } = req.params;
    const { name, price, description, image } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const item = restaurant.menu.id(itemId);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    // Update fields
    if (name) item.name = name;
    if (price) item.price = price;
    if (description) item.description = description;
    if (image) item.image = image;

    await restaurant.save();
    res.json({ message: "Menu item updated successfully", menu: restaurant.menu });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { restaurantId, itemId } = req.params;

    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // Find the index of the menu item by ID
    const menuItemIndex = restaurant.menu.findIndex(item => item._id.toString() === itemId);
    if (menuItemIndex === -1) return res.status(404).json({ message: "Menu item not found" });

    // Remove the menu item from the array
    restaurant.menu.pull({ _id: itemId });
    await restaurant.save();

    res.json({ message: "Menu item deleted successfully", menu: restaurant.menu });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteAllMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // Clear the entire menu array
    restaurant.menu = [];
    await restaurant.save();

    res.json({ 
      message: "All menu items deleted successfully", 
      menu: restaurant.menu 
    });
  } catch (error) {
    console.error("Error deleting all menu items:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Route: POST /api/restaurant/availability
exports.setAvailability = async (req, res) => {
  try {
    const { restaurantId, isOpen } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    restaurant.isOpen = isOpen;
    await restaurant.save();

    res.json({ message: `Restaurant is now ${isOpen ? "Open" : "Closed"}` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// View incoming orders (mocked for now)
exports.viewOrders = async (req, res) => {
  try {
    // Mocked orders
    const orders = [
      { orderId: "123", items: ["Burger", "Fries"], total: 15.99 },
      { orderId: "124", items: ["Pizza"], total: 12.99 },
    ];
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update restaurant profile
exports.updateRestaurantProfile = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name, description, telephoneNumber, location } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // Update fields if provided
    if (name) restaurant.name = name;
    if (description) restaurant.description = description;
    if (telephoneNumber) restaurant.telephoneNumber = telephoneNumber;
    if (location) restaurant.location = location;

    await restaurant.save();
    res.json({ message: "Restaurant profile updated successfully", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get restaurant details by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get menu items for a specific restaurant
exports.getMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.json({ menu: restaurant.menu });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get restaurant by owner (using authenticated user)
exports.getMyRestaurant = async (req, res) => {
  try {
    // Assuming req.user contains the authenticated user's email from auth middleware
    const userEmail = req.user.email;
    
    const restaurant = await Restaurant.findOne({ email: userEmail });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete restaurant (for restaurant owners)
exports.deleteMyRestaurant = async (req, res) => {
  try {
    // Check if req.user exists
    if (!req.user || !req.user.email) {
      return res.status(401).json({ 
        message: "Authentication required. User information missing." 
      });
    }
    
    // Get the authenticated user's email from the auth middleware
    const userEmail = req.user.email;
    
    // Find the restaurant by email
    const restaurant = await Restaurant.findOne({ email: userEmail });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    
    // Delete the restaurant
    await Restaurant.findByIdAndDelete(restaurant._id);
    
    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Delete restaurant error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete restaurant by ID
exports.deleteRestaurantById = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    await Restaurant.findByIdAndDelete(restaurantId);

    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

