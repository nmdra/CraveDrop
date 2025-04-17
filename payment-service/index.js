import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import paymentRoutes from './src/routes/payment.route.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/payment', paymentRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});
