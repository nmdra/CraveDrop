import { getAvailableDrivers, getDriverById, updateDriverAvailability } from '../clients/driverServiceClient.js';
import Delivery from '../models/Delivery.js';
import Order from '../models/Order.js';

// Helper function to calculate distance between two coordinates
const calculateDistance = (coords1, coords2) => {
  // Using the Haversine formula to calculate distance
  const toRad = (value) => (value * Math.PI) / 180;

  const lon1 = coords1[0];
  const lat1 = coords1[1];
  const lon2 = coords2[0];
  const lat2 = coords2[1];

  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance; // returns distance in km
};

// @desc    Automatically check and assign drivers to ready orders
// @access  Private (internal function)
export const autoAssignDriversToReadyOrders = async () => {
  try {
    console.log('Checking for READY_FOR_PICKUP orders to assign drivers...');

    // Find all orders with status READY_FOR_PICKUP
    const readyOrders = await Order.find({ status: 'READY_FOR_PICKUP' });

    if (!readyOrders || readyOrders.length === 0) {
      console.log('No orders ready for pickup');
      return { assigned: 0, message: 'No orders ready for pickup' };
    }

    console.log(`Found ${readyOrders.length} orders ready for pickup`);

    // Get all available drivers
    const availableDrivers = await getAvailableDrivers();

    if (!availableDrivers || availableDrivers.length === 0) {
      console.log('No available drivers found');
      return { assigned: 0, message: 'No available drivers found' };
    }

    console.log(`Found ${availableDrivers.length} available drivers`);

    // Track assignment results
    let assignedCount = 0;
    const assignedDriverIds = new Set();

    // Process each order
    for (const order of readyOrders) {
      try {
        console.log(`Processing order: ${order.orderID}`);

        // Check if order already has a delivery assignment
        const existingDelivery = await Delivery.findOne({ orderID: order.orderID });

        if (existingDelivery) {
          console.log(`Order ${order.orderID} already assigned to a driver`);
          continue;
        }

        // Get shop location from order
        const shopLocation = order.shoplocation;

        if (!shopLocation || !Array.isArray(shopLocation) || shopLocation.length !== 2) {
          console.log(`Invalid shop location for order ${order.orderID}`);
          continue;
        }

        // Find the nearest available driver who hasn't been assigned in this batch
        let nearestDriver = null;
        let minDistance = Infinity;

        for (const driver of availableDrivers) {
          // Skip already assigned drivers
          if (assignedDriverIds.has(driver._id)) {
            continue;
          }

          // Skip drivers without valid location
          if (!driver.currentLocation || !driver.currentLocation.coordinates ||
            !Array.isArray(driver.currentLocation.coordinates) ||
            driver.currentLocation.coordinates.length !== 2) {
            continue;
          }

          const distance = calculateDistance(
            shopLocation,
            driver.currentLocation.coordinates
          );

          if (distance < minDistance) {
            minDistance = distance;
            nearestDriver = driver;
          }
        }

        if (!nearestDriver) {
          console.log(`No available unassigned driver found for order ${order.orderID}`);
          continue;
        }

        // Mark this driver as assigned in this batch
        assignedDriverIds.add(nearestDriver._id);

        console.log(`Assigning order ${order.orderID} to driver ${nearestDriver._id} (${nearestDriver.firstName} ${nearestDriver.lastName})`);

        // Create delivery entry with the new location text fields
        const delivery = await Delivery.create({
          orderID: order.orderID,
          customerID: order.customerID,
          customername: order.customername,
          customercontact: order.customercontact,
          customerlocationcordinate: order.customerlocatiocordinate, // Fix typo here
          customerlocation: order.customerlocation,
          driverid: nearestDriver._id,
          driverName: `${nearestDriver.firstName} ${nearestDriver.lastName}`,
          driverlocation: nearestDriver.currentLocation.coordinates,
          driverlocationtext: nearestDriver.currentLocationText || '',
          shopid: order.shopid,
          shopname: order.shopname,
          shopcontact: order.shopcontact,
          shoplocation: order.shoplocation,
          shoplocationtext: order.shoplocationtext,
          status: 'ASSIGNED',
          distanceToShop: minDistance.toFixed(2)
        });

        // Update order status
        order.status = 'ACCEPTED';
        await order.save();

        // Update driver availability to false
        try {
          await updateDriverAvailability(nearestDriver._id, false);
          console.log(`Updated driver ${nearestDriver._id} availability to false`);
        } catch (err) {
          console.error(`Failed to update driver availability: ${err.message}`);
          // Continue with the process even if this fails
        }

        assignedCount++;
        console.log(`Successfully assigned driver to order ${order.orderID}`);

      } catch (err) {
        console.error(`Error processing order ${order.orderID}:`, err);
      }
    }

    console.log(`Assignment complete: ${assignedCount} orders assigned to drivers`);
    return {
      assigned: assignedCount,
      message: `Successfully assigned ${assignedCount} orders to drivers`
    };

  } catch (error) {
    console.error('Error in automatic driver assignment:', error);
    return {
      assigned: 0,
      message: `Error in automatic assignment: ${error.message}`
    };
  }
};

// @desc    Assign driver to delivery
// @route   POST /assign-driver
// @access  Private
export const assignDriverToDelivery = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Validate request
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // Find order
    const order = await Order.findOne({ orderID: orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order is already assigned
    const existingDelivery = await Delivery.findOne({ orderID: orderId });
    if (existingDelivery) {
      return res.status(400).json({
        message: 'Order is already assigned to a driver',
        delivery: existingDelivery
      });
    }

    // Get available drivers
    const availableDrivers = await getAvailableDrivers();
    if (!availableDrivers || availableDrivers.length === 0) {
      return res.status(404).json({ message: 'No available drivers found' });
    }

    // For simplicity, assign the first available driver
    // In a production app, you'd implement a matching algorithm based on proximity, etc.
    const selectedDriver = availableDrivers[0];

    // Create delivery entry with the new location text fields
    const delivery = await Delivery.create({
      orderID: order.orderID,
      customerID: order.customerID,
      customername: order.customername,
      customercontact: order.customercontact,
      customerlocationcordinate: order.customerlocatiocordinate, // Fix typo here
      customerlocation: order.customerlocation,
      driverid: selectedDriver._id,
      driverName: `${selectedDriver.firstName} ${selectedDriver.lastName}`,
      driverlocation: selectedDriver.currentLocation.coordinates,
      driverlocationtext: selectedDriver.currentLocationText || '',
      shopid: order.shopid,
      shopname: order.shopname,
      shopcontact: order.shopcontact,
      shoplocation: order.shoplocation,
      shoplocationtext: order.shoplocationtext,
      status: 'ASSIGNED'
    });

    // Update order status
    order.status = 'ACCEPTED';
    await order.save();

    // Update driver availability to false
    try {
      await updateDriverAvailability(selectedDriver._id, false);
      console.log(`Updated driver ${selectedDriver._id} availability to false`);
    } catch (err) {
      console.error(`Failed to update driver availability: ${err.message}`);
      // Continue with the process even if this fails
    }

    return res.status(201).json({
      message: 'Driver assigned successfully',
      delivery
    });
  } catch (error) {
    console.error('Error assigning driver:', error);
    return res.status(500).json({
      message: 'Failed to assign driver',
      error: error.message
    });
  }
};

// @desc    Get delivery details
// @route   GET /delivery/:id
// @access  Private
export const getDeliveryDetails = async (req, res) => {
  try {
    const deliveryId = req.params.id;

    // Find delivery
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // Get driver details if needed
    let driverDetails = null;
    try {
      driverDetails = await getDriverById(delivery.driverid);
    } catch (err) {
      console.error('Error fetching driver details:', err);
      // Continue even if driver details fetch fails
    }

    // Return delivery with driver details if available
    return res.status(200).json({
      delivery,
      driver: driverDetails || { id: delivery.driverid, name: delivery.driverName }
    });
  } catch (error) {
    console.error('Error fetching delivery details:', error);
    return res.status(500).json({
      message: 'Failed to get delivery details',
      error: error.message
    });
  }
};

/**
 * Get all deliveries
 * @route GET /delivery/all
 * @access Private
 */
export const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    return res.status(200).json(deliveries);
  } catch (error) {
    console.error('Error fetching all deliveries:', error);
    return res.status(500).json({
      message: 'Failed to fetch deliveries',
      error: error.message
    });
  }
};

/**
 * Get delivery by order ID
 * @route GET /delivery/order/:orderId
 * @access Private
 */
export const getDeliveryByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const delivery = await Delivery.findOne({ orderID: orderId });

    if (!delivery) {
      return res.status(404).json({ message: 'No delivery found for this order' });
    }

    return res.status(200).json(delivery);
  } catch (error) {
    console.error('Error fetching delivery by order ID:', error);
    return res.status(500).json({
      message: 'Failed to fetch delivery',
      error: error.message
    });
  }
};

/**
 * Get all deliveries by driver ID
 * @route GET /delivery/driver/:driverId
 * @access Private
 */
export const getDeliveriesByDriverId = async (req, res) => {
  try {
    const { driverId } = req.params;

    const deliveries = await Delivery.find({ driverid: driverId });

    return res.status(200).json(deliveries);
  } catch (error) {
    console.error('Error fetching deliveries by driver ID:', error);
    return res.status(500).json({
      message: 'Failed to fetch deliveries',
      error: error.message
    });
  }
};

/**
 * Get all deliveries by shop ID
 * @route GET /delivery/shop/:shopId
 * @access Private
 */
export const getDeliveriesByShopId = async (req, res) => {
  try {
    const { shopId } = req.params;

    const deliveries = await Delivery.find({ shopid: shopId });

    return res.status(200).json(deliveries);
  } catch (error) {
    console.error('Error fetching deliveries by shop ID:', error);
    return res.status(500).json({
      message: 'Failed to fetch deliveries',
      error: error.message
    });
  }
};

/**
 * Get all deliveries by customer ID
 * @route GET /delivery/customer/:customerId
 * @access Private
 */
export const getDeliveriesByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;

    const deliveries = await Delivery.find({ customerID: customerId });

    return res.status(200).json(deliveries);
  } catch (error) {
    console.error('Error fetching deliveries by customer ID:', error);
    return res.status(500).json({
      message: 'Failed to fetch deliveries',
      error: error.message
    });
  }
};

/**
 * Update delivery status
 * @route PATCH /delivery/:id/status
 * @access Private
 */
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELLED'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
        validStatuses
      });
    }

    // Find and update delivery
    const delivery = await Delivery.findById(id);

    if (!delivery) {
      return res.status(404).json({
        message: 'Delivery not found'
      });
    }

    // Update delivery status
    delivery.status = status;
    await delivery.save();

    // If delivery is marked as DELIVERED, update the corresponding order status
    if (status === 'DELIVERED') {
      const order = await Order.findOne({ orderID: delivery.orderID });
      if (order) {
        order.status = 'DELIVERED';
        await order.save();
        console.log(`Order ${delivery.orderID} marked as delivered`);
      }
    }

    // If delivery is marked as FAILED or CANCELLED, update driver availability
    if (status === 'FAILED' || status === 'CANCELLED') {
      try {
        await updateDriverAvailability(delivery.driverid, true);
        console.log(`Driver ${delivery.driverid} availability updated to true`);
      } catch (err) {
        console.error(`Failed to update driver availability: ${err.message}`);
        // Continue with the process even if this fails
      }
    }

    return res.status(200).json({
      message: 'Delivery status updated successfully',
      delivery
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    return res.status(500).json({
      message: 'Failed to update delivery status',
      error: error.message
    });
  }
};

/**
 * Update driver location for a delivery
 * @route PATCH /delivery/:id/driver-location
 * @access Private
 */
export const updateDriverLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, locationText } = req.body;

    // Validate location data
    if (!location || !Array.isArray(location) || location.length !== 2 ||
      typeof location[0] !== 'number' || typeof location[1] !== 'number') {
      return res.status(400).json({
        message: 'Invalid location format. Expected [longitude, latitude] array of numbers'
      });
    }

    // Find the delivery
    const delivery = await Delivery.findById(id);

    if (!delivery) {
      return res.status(404).json({
        message: 'Delivery not found'
      });
    }

    // Update driver location
    delivery.driverlocation = location;

    // Update driver location text if provided
    if (locationText) {
      delivery.driverlocationtext = locationText;
    }

    await delivery.save();

    return res.status(200).json({
      message: 'Driver location updated successfully',
      delivery
    });
  } catch (error) {
    console.error('Error updating driver location:', error);
    return res.status(500).json({
      message: 'Failed to update driver location',
      error: error.message
    });
  }
};

// @desc    Manually trigger driver assignment for ready orders
// @route   POST /assign-ready-orders
// @access  Private
export const manuallyAssignDrivers = async (req, res) => {
  try {
    const result = await autoAssignDriversToReadyOrders();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in manual assignment trigger:', error);
    return res.status(500).json({
      message: 'Failed to assign drivers to ready orders',
      error: error.message
    });
  }
};