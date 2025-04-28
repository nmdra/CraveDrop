import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import internalRoutes from './routes/internalRoutes.js'
import sequelize from './db/sequelize.js';
import { logger, httpLogger } from './middleware/logger.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);
app.use(cookieParser());

// Healthcheck route
app.get('/api/user/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    logger.error('Healthcheck failed:', err);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// API Versioning
app.use(`/api/user/`, userRoutes);
app.use(`/internal/user`, internalRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.sync({ alter: true }); // or { force: true } for dev resets
    logger.info('Database synced');

    app.listen(PORT, () => {
      logger.info(`User Service running at port: ${PORT}`);
    });
  } catch (err) {
    logger.error('DB sync failed:', err);
    process.exit(1); // Optional: exit on failure
  }
}

startServer();