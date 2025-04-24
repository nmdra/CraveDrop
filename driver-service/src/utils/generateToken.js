import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for authenticated users
 * @param {string} id - User's ID to encode in the token
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    throw new Error('JWT_SECRET is not configured');
  }
  
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

export default generateToken;
