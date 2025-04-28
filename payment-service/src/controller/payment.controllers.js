import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment Intent creation failed:', error);
    res.status(500).send({ error: error.message });
  }
};

// NEW: CONFIRM and SAVE payment
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Fetch the latest payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful yet.' });
    }

    await Payment.create({
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
    createdAt: new Date(),
    });

    res.status(200).json({ message: 'Payment confirmed and saved successfully.' });
  } catch (error) {
    console.error('Payment confirmation failed:', error);
    res.status(500).send({ error: error.message });
  }
};
