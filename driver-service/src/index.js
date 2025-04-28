import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import driverRoutes from './routes/driverRoutes.js';

// Load environment variables
dotenv.config();

// Verify critical environment variables are set
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/driver/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/driver', driverRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Driver service running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
