import express from 'express';
import dotenv from 'dotenv';
import connectDB from './service/db.js';
import orderRoutes from './routes/order.route.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/orders/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Versioned API route
app.use('/api/orders', orderRoutes);

// Connect MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1); // Exit the app with failure
  }
};

startServer();
