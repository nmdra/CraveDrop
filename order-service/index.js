import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/service/db.js';
import orderRoutes from './src/routes/order.route.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Versioned API route
app.use('/api/v1/orders', orderRoutes);

// Connect MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
