import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import deliveryRoutes from './routes/deliveryRoutes.js';
import { autoAssignDriversToReadyOrders } from './controllers/deliveryController.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/delivery', deliveryRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Delivery Service API is running');
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 4003;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      
      // Initial check for ready orders when service starts
      autoAssignDriversToReadyOrders()
        .then(result => console.log('Initial assignment result:', result))
        .catch(err => console.error('Initial assignment error:', err));
      
      // Set up a recurring check every 1 minute (60000 ms)
      setInterval(() => {
        console.log('Running scheduled assignment check');
        autoAssignDriversToReadyOrders()
          .catch(err => console.error('Scheduled assignment error:', err));
      }, 60000); // Check every minute
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });