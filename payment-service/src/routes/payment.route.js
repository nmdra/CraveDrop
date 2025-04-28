import express from 'express';
import { createPaymentIntent, confirmPayment } from '../controller/payment.controllers.js';

const router = express.Router();

router.post('/create-payment-intent', createPaymentIntent);
router.post('/confirm-payment', confirmPayment);

export default router;