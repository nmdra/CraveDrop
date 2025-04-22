const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
});

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false }, // Admin verification
  isOpen: { type: Boolean, default: true }, // Open/Closed status
  menu: [MenuItemSchema], // Array of menu items
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);