import Driver from '../models/driver.js';
import { StatusCodes } from 'http-status-codes';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new driver
// @route   POST /api/drivers
// @access  Public
export const registerDriver = async (req, res, next) => {
    try {
        const {
            firstName, 
            lastName, 
            licenseNumber,
            email, 
            password,
            vehicleNumber,
            vehicleType,
            address,
            contactNumber,
            currentLocation = { coordinates: [0, 0] } // Default location if not provided
        } = req.body;

        // Basic check for required fields
        if (!firstName || !lastName || !email || !password || !licenseNumber || 
            !vehicleNumber || !vehicleType || !address || !contactNumber) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'All fields are required'
            });
        }

        // Check if driver already exists with that email or license
        const driverExists = await Driver.findOne({ 
            $or: [
                { email }, 
                { licenseNumber },
                { vehicleNumber }
            ] 
        });

        if (driverExists) {
            if (driverExists.email === email) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email already in use' });
            }
            if (driverExists.licenseNumber === licenseNumber) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'License number already registered' });
            }
            if (driverExists.vehicleNumber === vehicleNumber) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Vehicle number already registered' });
            }
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Driver already exists' });
        }

        // Create the driver
        const driver = await Driver.create({
            firstName,
            lastName,
            licenseNumber,
            email,
            password, // This will be hashed by the pre-save hook
            vehicleNumber,
            vehicleType,
            address,
            contactNumber,
            currentLocation
        });

        return res.status(StatusCodes.CREATED).json({
            message: 'Driver registration successful',
            driver: {
                id: driver._id,
                firstName: driver.firstName,
                lastName: driver.lastName,
                email: driver.email,
                licenseNumber: driver.licenseNumber
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login driver and get token
// @route   POST /driver/login
// @access  Public
export const loginDriver = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check for required fields
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Email and password are required'
            });
        }

        // Find driver by email
        const driver = await Driver.findOne({ email });
        console.log(`Login attempt for email: ${email}, driver found: ${!!driver}`);

        // Check if driver exists and password matches
        if (driver && (await driver.matchPassword(password))) {
            // Generate JWT token
            const token = generateToken(driver._id);
            console.log(`Login successful for driver: ${driver._id}, token: ${token.substring(0, 15)}...`);

            return res.status(StatusCodes.OK).json({
                id: driver._id,
                firstName: driver.firstName,
                lastName: driver.lastName,
                email: driver.email,
                licenseNumber: driver.licenseNumber,
                token
            });
        } else {
            console.log(`Login failed for email: ${email} - ${driver ? 'Invalid password' : 'Driver not found'}`);
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        console.error(`Login error: ${error.message}`);
        next(error);
    }
};

// @desc    Get driver profile
// @route   GET /driver/profile
// @access  Private
export const getDriverProfile = async (req, res, next) => {
    try {
        console.log(`Getting profile for driver id: ${req.driver?._id}`);
        
        // req.driver is set by the protect middleware
        const driver = await Driver.findById(req.driver._id).select('-password');
        
        if (driver) {
            console.log(`Profile found for driver: ${driver._id}`);
            return res.status(StatusCodes.OK).json(driver);
        } else {
            console.log(`Profile not found for driver id: ${req.driver._id}`);
            res.status(StatusCodes.NOT_FOUND);
            throw new Error('Driver not found');
        }
    } catch (error) {
        console.error(`Profile error: ${error.message}`);
        next(error);
    }
};

// @desc    Update driver location
// @route   PUT /driver/location
// @access  Private
export const updateDriverLocation = async (req, res, next) => {
    try {
        const { longitude, latitude } = req.body;

        // Validate coordinates
        if (longitude === undefined || latitude === undefined) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Longitude and latitude are required'
            });
        }

        // Validate coordinate values
        if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90'
            });
        }

        // Update driver location
        const driver = await Driver.findByIdAndUpdate(
            req.driver._id,
            { 
                currentLocation: {
                    type: 'Point',
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                }
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!driver) {
            res.status(StatusCodes.NOT_FOUND);
            return next(new Error('Driver not found'));
        }

        console.log(`Location updated for driver ${driver._id}: [${longitude}, ${latitude}]`);
        return res.status(StatusCodes.OK).json({
            message: 'Location updated successfully',
            location: driver.currentLocation
        });
    } catch (error) {
        console.error(`Location update error: ${error.message}`);
        next(error);
    }
};

// @desc    Update driver availability status
// @route   PUT /driver/availability
// @access  Private
export const updateDriverAvailability = async (req, res, next) => {
    try {
        const { isAvailable } = req.body;

        // Validate availability status
        if (isAvailable === undefined) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Availability status is required'
            });
        }

        // Update driver availability
        const driver = await Driver.findByIdAndUpdate(
            req.driver._id,
            { isAvailable: Boolean(isAvailable) },
            { new: true, runValidators: true }
        ).select('-password');

        if (!driver) {
            res.status(StatusCodes.NOT_FOUND);
            return next(new Error('Driver not found'));
        }

        console.log(`Availability status updated for driver ${driver._id}: ${driver.isAvailable}`);
        return res.status(StatusCodes.OK).json({
            message: 'Availability status updated successfully',
            isAvailable: driver.isAvailable
        });
    } catch (error) {
        console.error(`Availability update error: ${error.message}`);
        next(error);
    }
};

// @desc    Get all drivers
// @route   GET /driver/all
// @access  Private (could be restricted to admin in a production environment)
export const getAllDrivers = async (req, res, next) => {
    try {
        // Optional query parameters for filtering
        const { isAvailable, vehicleType } = req.query;
        
        // Build filter object
        const filter = {};
        
        // Add filters if provided
        if (isAvailable !== undefined) {
            filter.isAvailable = isAvailable === 'true';
        }
        
        if (vehicleType) {
            filter.vehicleType = vehicleType;
        }
        
        console.log(`Getting all drivers with filters:`, filter);
        
        // Find drivers with optional filters, excluding password field
        const drivers = await Driver.find(filter).select('-password');
        
        console.log(`Found ${drivers.length} drivers`);
        
        return res.status(StatusCodes.OK).json({
            count: drivers.length,
            drivers
        });
    } catch (error) {
        console.error(`Error fetching drivers: ${error.message}`);
        next(error);
    }
};

// @desc    Get driver by ID
// @route   GET /driver/:id
// @access  Public (for other services) or Private depending on your security requirements
export const getDriverById = async (req, res, next) => {
  try {
    const driverId = req.params.id;
    
    if (!driverId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Driver ID is required'
      });
    }
    
    // Find driver by ID, excluding password field
    const driver = await Driver.findById(driverId).select('-password');
    
    if (!driver) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Driver not found'
      });
    }
    
    return res.status(StatusCodes.OK).json(driver);
  } catch (error) {
    console.error(`Error fetching driver by ID: ${error.message}`);
    next(error);
  }
};


// Add this function to c:\Users\LKsnj\Desktop\New folder\sCraveDrop\driver-service\src\controllers\driverController.js

// @desc    Update driver availability by ID (for other services)
// @route   PUT /driver/:id/availability
// @access  Public (for internal services)
export const updateDriverAvailabilityById = async (req, res, next) => {
    try {
        const driverId = req.params.id;
        const { isAvailable } = req.body;

        // Validate availability status
        if (isAvailable === undefined) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Availability status is required'
            });
        }

        // Update driver availability
        const driver = await Driver.findByIdAndUpdate(
            driverId,
            { isAvailable: Boolean(isAvailable) },
            { new: true, runValidators: true }
        ).select('-password');

        if (!driver) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Driver not found'
            });
        }

        console.log(`Availability status updated for driver ${driver._id} to ${driver.isAvailable} by external service`);
        return res.status(StatusCodes.OK).json({
            message: 'Availability status updated successfully',
            isAvailable: driver.isAvailable
        });
    } catch (error) {
        console.error(`Availability update error: ${error.message}`);
        next(error);
    }
};