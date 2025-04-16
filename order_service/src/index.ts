import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db';
import orderRoutes from './routes/order.routes';
import { connectRabbitMQ } from './service/rabbitmq'; 

dotenv.config();

const app = express();
app.use(express.json());

connectDB();
connectRabbitMQ();

app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});
