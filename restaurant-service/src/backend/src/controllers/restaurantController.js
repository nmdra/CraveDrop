const Restaurant = require("../models/Restaurant");

// Add a new menu item
exports.addMenuItem = async (req, res) => {
  try {
    const { restaurantId, name, price, description } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // Create the new menu item
    const menuItem = {
      name, 
      price: parseFloat(price), 
      description: description || ""
    };

    // Handle image if it exists
    if (req.file) {
      console.log("File uploaded:", req.file);
      menuItem.image = req.file.path;
    }

    restaurant.menu.push(menuItem);
    await restaurant.save();

    res.status(201).json({ 
      message: "Menu item added successfully", 
      menuItem: restaurant.menu[restaurant.menu.length - 1] 
    });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Update or delete menu items
exports.updateMenuItem = async (req, res) => {
  try {
    const { restaurantId, itemId } = req.params;
    const { name, price, description } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const item = restaurant.menu.id(itemId);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    // Update fields
    if (name) item.name = name;
    if (price) item.price = parseFloat(price);
    if (description !== undefined) item.description = description;
    
    // Handle uploaded image if it exists
    if (req.file) {
      item.image = req.file.path;
    }

    await restaurant.save();
    res.json({ 
      message: "Menu item updated successfully", 
      menuItem: item 
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
    // Get text fields from req.body
    const { name, description, telephoneNumber, location, cuisine } = req.body; 

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // Update fields if provided
    if (name) restaurant.name = name;
    if (description) restaurant.description = description;
    if (telephoneNumber) restaurant.telephoneNumber = telephoneNumber;
    
    // Parse location if it's a string (might come from FormData)
    if (location) {
      try {
        restaurant.location = typeof location === 'string' ? JSON.parse(location) : location;
      } catch (parseError) {
        console.error("Error parsing location:", parseError);
        // Handle error or ignore if parsing fails
      }
    }
    
    // Parse cuisine if it's a string
    if (cuisine) {
       restaurant.cuisine = typeof cuisine === 'string' ? cuisine.split(",").map(item => item.trim()).filter(item => item !== "") : cuisine;
    }

    // Get file paths from req.files if they exist
    if (req.files?.logo?.[0]) {
      restaurant.logo = req.files.logo[0].path;
    }
    if (req.files?.coverImage?.[0]) {
      restaurant.coverImage = req.files.coverImage[0].path;
    }

    await restaurant.save();
    res.json({ message: "Restaurant profile updated successfully", restaurant });
  } catch (error) {
    console.error("Error updating profile:", error); // Log the error
    res.status(500).json({ message: "Server error updating profile", error: error.message });
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

