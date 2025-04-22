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

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    restaurant.menu.id(itemId).remove();
    await restaurant.save();

    res.json({ message: "Menu item deleted successfully", menu: restaurant.menu });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Set restaurant availability
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