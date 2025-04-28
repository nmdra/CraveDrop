import Order from '../models/Order.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Create a new order in the system
 * @route POST /delivery/order
 * @access Public
 */
export const createOrder = async (req, res) => {
  try {
    const {
      orderID,
      customerID,
      customername,
      customercontact,
      customerlocatiocordinate,
      customerlocation,
      shopid,
      shopname,
      shopcontact,
      shoplocation,
      shoplocationtext,
      status = 'PENDING' // Default status
    } = req.body;

    // Validate required fields
    if (!orderID || !customerID || !customername || !customercontact ||
      !customerlocatiocordinate || !customerlocation || !shopid || !shopname ||
      !shopcontact || !shoplocation || !shoplocationtext) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields'
      });
    }

    // Validate coordinate formats
    if (!Array.isArray(customerlocatiocordinate) || customerlocatiocordinate.length !== 2 ||
      !Array.isArray(shoplocation) || shoplocation.length !== 2) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Location coordinates must be in [longitude, latitude] format'
      });
    }

    // Check for duplicate orderID
    const existingOrder = await Order.findOne({ orderID });
    if (existingOrder) {
      return res.status(StatusCodes.CONFLICT).json({
        message: 'An order with this ID already exists'
      });
    }

    // Create new order
    const order = await Order.create({
      orderID,
      customerID,
      customername,
      customercontact,
      customerlocatiocordinate,
      customerlocation,
      shopid,
      shopname,
      shopcontact,
      shoplocation,
      shoplocationtext,
      status
    });

    return res.status(StatusCodes.CREATED).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to create order',
      error: error.message
    });
  }
};

/**
 * Get order by ID
 * @route GET /delivery/order/:id
 * @access Private
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ orderID: id });
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Order not found'
      });
    }

    return res.status(StatusCodes.OK).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

/**
 * Update order status
 * @route PATCH /delivery/order/:id/status
 * @access Private
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = [
      'PENDING', 'ACCEPTED', 'PREPARING',
      'READY_FOR_PICKUP', 'PICKED_UP', 'DELIVERED', 'CANCELLED'
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Invalid status',
        validStatuses
      });
    }

    // Update order
    const order = await Order.findOneAndUpdate(
      { orderID: id },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Order not found'
      });
    }

    return res.status(StatusCodes.OK).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

/**
 * Get orders by customer ID
 * @route GET /delivery/orders/customer/:customerId
 * @access Private
 */
export const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.find({ customerID: customerId });

    return res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch customer orders',
      error: error.message
    });
  }
};