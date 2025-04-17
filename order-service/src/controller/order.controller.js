import Order from '../model/order.model.js';
import axios from 'axios';

export const createOrder = async (req, res) => {
  try {
    const { userId, items, amount, currency } = req.body;

    if (!userId || !Array.isArray(items) || !amount || !currency) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Call the Payment Service
    const paymentResponse = await axios.post('http://payment-service:5002/api/v1/payment/create-payment-intent', {
      amount,
      currency,
    });

    const clientSecret = paymentResponse.data.clientSecret;

    // Create the Order
    const order = new Order({ 
      userId, 
      items, 
      paymentClientSecret: clientSecret // <<<<<< add this
    });
    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order creation failed:', error.message);
    res.status(500).json({ message: 'Something went wrong on the server' });
  }
};

  

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json(order);
  } catch (error) {
    console.error('Get order failed:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json(updated);
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete failed:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find(); // Fetch all orders from the database
      res.status(200).json(orders);
    } catch (error) {
      console.error('Get all orders failed:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
};