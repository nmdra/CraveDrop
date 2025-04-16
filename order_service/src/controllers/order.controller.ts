import { Request, Response } from 'express';
import axios from 'axios';
import Order from '../models/order.model';

export const createOrder = async (req: Request, res: Response) => {
 /*  try {
    const { userId, restaurantId, itemIds } = req.body;

    // Fetch items from the restaurant API
    const restaurantApiUrl = `https://restaurant-api.example.com/restaurants/${restaurantId}/items`;
    //update this url after done restuarant
    
    const response = await axios.post(restaurantApiUrl, { itemIds });

    if (response.status !== 200 || !response.data.items) {
      return res.status(400).json({ message: 'Failed to fetch items from the restaurant API' });
    }

    const items = response.data.items;

    // Create the order with the fetched items
    const order = new Order({ userId, items });
    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
 */
  //Mock one
  try {
    const { userId, restaurantId, itemIds } = req.body;

    // TEMP: Mock items instead of real API call
    const items = itemIds.map((id: string) => ({
      productId: id,
      name: `Mock Item ${id}`,
      price: 100,
      quantity: 1,
    }));

    // Create the order
    const order = new Order({ userId, items });
    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const updateData = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};