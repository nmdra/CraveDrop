const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
});

const LocationSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  }
});

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telephoneNumber: { type: String, required: true },
  location: { type: LocationSchema, required: true },
  isVerified: { type: Boolean, default: false }, // Admin verification
  isOpen: { type: Boolean, default: true }, // Open/Closed status
  logo: { type: String },
  coverImage: { type: String },
  cuisine: [{ type: String }], // Types of cuisine offered
  menu: [MenuItemSchema], // Array of menu items
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);