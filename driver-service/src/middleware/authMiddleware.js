import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import Driver from '../models/driver.js';

// Protect routes - verify JWT token and set req.driver
const protect = async (req, res, next) => {
  let token;
  console.log('Auth middleware called');

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];
      console.log(`Token found: ${token.substring(0, 10)}...`);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`Token verified, driver id: ${decoded.id}`);

      // Get driver from token ID (exclude password)
      req.driver = await Driver.findById(decoded.id).select('-password');

      if (!req.driver) {
        console.log(`Driver not found for id: ${decoded.id}`);
        res.status(StatusCodes.UNAUTHORIZED);
        const error = new Error('Not authorized, driver not found');
        return next(error);
      }

      console.log(`Driver authenticated: ${req.driver._id}`);
      next();
    } catch (error) {
      console.error(`Auth error: ${error.message}`);
      res.status(StatusCodes.UNAUTHORIZED);
      return next(new Error('Not authorized, token failed'));
    }
  } else {
    console.log('No token provided in request');
    res.status(StatusCodes.UNAUTHORIZED);
    return next(new Error('Not authorized, no token provided'));
  }
};

export { protect };
