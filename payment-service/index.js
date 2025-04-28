import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import paymentRoutes from '.';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // frontend address
}));

app.use('/api/v1/payments', paymentRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});