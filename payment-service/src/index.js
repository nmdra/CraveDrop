import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import paymentRoutes from './routes/payment.route.js';

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration with frontend URL from environment
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_URL,
}));

app.get('/api/payments/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Payment routes
app.use('/api/payments', paymentRoutes);

// Start server with error handling
const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Payment service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
