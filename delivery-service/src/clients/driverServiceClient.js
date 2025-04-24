import axios from 'axios';

// Create an axios instance configured for the driver service
const driverServiceClient = axios.create({
  baseURL: process.env.DRIVER_SERVICE_URL || 'http://driver-service:4000/driver',
  // For local development without Docker:
  // baseURL: process.env.DRIVER_SERVICE_URL || 'http://localhost:4000/driver',
  timeout: 10000, // Increased timeout for stability
  headers: {
    'Content-Type': 'application/json'
  },
  // Add retry logic
  retry: 3,
  retryDelay: 1000
});

// Add a request interceptor to handle retries
driverServiceClient.interceptors.response.use(undefined, async (err) => {
  const { config } = err;
  if (!config || !config.retry) {
    return Promise.reject(err);
  }
  
  config.retryCount = config.retryCount || 0;
  
  if (config.retryCount >= config.retry) {
    return Promise.reject(err);
  }
  
  config.retryCount += 1;
  console.log(`Retrying request to ${config.url}, attempt ${config.retryCount}/${config.retry}`);
  
  const delay = new Promise(resolve => setTimeout(resolve, config.retryDelay));
  await delay;
  return driverServiceClient(config);
});

/**
 * Get all available drivers
 * @param {Object} filters - Optional filters like vehicleType
 * @returns {Promise<Array>} List of available drivers
 */
export const getAvailableDrivers = async (filters = {}) => {
  try {
    // Add isAvailable=true to the filters
    const params = { isAvailable: true, ...filters };
    
    const response = await driverServiceClient.get('/all', { params });
    return response.data.drivers || [];
  } catch (error) {
    console.error('Error fetching available drivers:', error.message);
    // Return empty array instead of throwing to avoid crashing the service
    return [];
  }
};

/**
 * Get driver details by ID
 * @param {string} driverId - The driver's ID
 * @returns {Promise<Object>} Driver details
 */
export const getDriverById = async (driverId) => {
  try {
    const response = await driverServiceClient.get(`/${driverId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching driver with ID ${driverId}:`, error.message);
    throw new Error(`Failed to get driver details for ID: ${driverId}`);
  }
};

/**
 * Update driver availability
 * @param {string} driverId - The driver's ID
 * @param {boolean} isAvailable - Driver's availability status
 * @returns {Promise<Object>} Updated driver details
 */
export const updateDriverAvailability = async (driverId, isAvailable) => {
  try {
    const response = await driverServiceClient.put(`/${driverId}/availability`, { 
      isAvailable 
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating availability for driver ${driverId}:`, error.message);
    throw new Error(`Failed to update driver availability for ID: ${driverId}`);
  }
};

export default driverServiceClient;