import Order from '../model/order.model.js';
import Product from '../model/product.model.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const createOrder = async (req, res) => {
  try {
    const { userId, items, paymentMethod, totalAmount, currency, deliveryAddress, phoneNumber } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0 || !paymentMethod || !deliveryAddress) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    let paymentClientSecret = null;
    let calculatedTotalAmount = 0;
    const enrichedItems = [];

    // Validate and enrich products
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      const itemTotal = product.price * item.quantity;
      calculatedTotalAmount += itemTotal;

      enrichedItems.push({
        productId: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
        restaurantId: product.restaurantId || 'default-restaurant' // Include restaurant ID from product
      });
    }

    // For card payments, we already processed the payment in the frontend
    // so we don't need to call the payment service again
    if (paymentMethod === 'card') {
      // If payment was already processed, we use the totalAmount from the request
      // and we don't need to generate a new client secret
    } else if (paymentMethod === 'cash') {
      // For cash payments, no need to process anything here
    }

    // Create the Order - use the provided totalAmount for card payments (already processed)
    // or use calculated amount for cash payments
    const finalAmount = paymentMethod === 'card' ? totalAmount : calculatedTotalAmount;

    const order = new Order({
      userId,
      items: enrichedItems,
      totalAmount: finalAmount,
      currency: currency || 'usd', // Use provided currency or default to 'usd'
      paymentMethod,
      paymentClientSecret,
      deliveryAddress,
      phoneNumber,
      status: paymentMethod === 'card' ? 'paid' : 'pending', // If card payment, it's already paid
    });

    await order.save();

    //TODO call notification

    res.status(201).json({
      message: 'Order created successfully',
      order,
      paymentClientSecret,
    });
  } catch (error) {
    console.error('Order creation failed:', error.message);
    res.status(500).json({ message: 'Something went wrong on the server' });
  }
};

// Add a new endpoint to get orders by restaurant ID
export const getOrdersByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' });
    }

    // Find orders that contain items from the specified restaurant
    const orders = await Order.find({
      'items.restaurantId': restaurantId
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Get restaurant orders failed:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Rest of your controller functions remain the same
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
    // Support filtering by restaurantId via query param
    const { restaurantId } = req.query;

    let query = {};
    if (restaurantId) {
      // Find orders with items from this restaurant
      query = { 'items.restaurantId': restaurantId };
    }

    const orders = await Order.find(query);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get all orders failed:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};