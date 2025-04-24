/**
 * Calculates the distance between two points using the Haversine formula
 * @param {Array} coords1 - [longitude, latitude] of first point
 * @param {Array} coords2 - [longitude, latitude] of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (coords1, coords2) => {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;
  
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  
  return distance;
};

/**
 * Converts degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} Radians
 */
const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

/**
 * Validates if coordinates are within valid ranges
 * @param {number} longitude - Longitude coordinate
 * @param {number} latitude - Latitude coordinate
 * @returns {boolean} True if coordinates are valid
 */
export const validateCoordinates = (longitude, latitude) => {
  return (
    longitude >= -180 && 
    longitude <= 180 && 
    latitude >= -90 && 
    latitude <= 90
  );
};

/**
 * Convert address to coordinates (placeholder for geocoding integration)
 * In a real implementation, this would call a geocoding service like Google Maps
 * @param {string} address - Physical address to convert
 * @returns {Promise<Array>} [longitude, latitude]
 */
export const geocodeAddress = async (address) => {
  // This is a placeholder - in a real app, you would implement
  // a call to a geocoding service (Google Maps, MapBox, etc.)
  console.log(`Geocoding requested for address: ${address}`);
  throw new Error('Geocoding not implemented');
};
