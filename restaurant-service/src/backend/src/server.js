require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path"); // Add this line

const restaurantRoutes = require("./routes/restaurantRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files - add this line 
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/restaurant", restaurantRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "restaurant-service" });
});

// Connect to MongoDB
connectDB();

// Start the server
app.listen(PORT, () => console.log(`🚀 Restaurant service running on port ${PORT}`));