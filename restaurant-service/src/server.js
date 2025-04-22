require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const restaurantRoutes = require("./routes/restaurantRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/admin", adminRoutes);

// Connect to MongoDB
connectDB();

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));