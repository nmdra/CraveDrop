import express from 'express';
import dotenv from 'dotenv';
import sequelize from './db/sequelize.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { logger, httpLogger } from './middleware/logger.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import notificationMessagesRoutes from './routes/notificationMessages.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(httpLogger);

const PORT = process.env.PORT || 3000;

app.get('/api/notify/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/notify/send', notificationRoutes);

app.use('/api/notify/message', notificationMessagesRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
    try {
        await sequelize.sync();
        app.listen(PORT, () =>
            logger.info(`Notification Service on port ${PORT}`)
        );
    } catch (err) {
        logger.error('Startup failed', err);

    }
};

start();
