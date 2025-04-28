import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCar, FaIdCard, FaMapMarkerAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { MdDateRange, MdEmail, MdPhone } from "react-icons/md";
import DriverLocationMap from "../../Components/Driver/DriverLocationMap";

const DriverProfile = () => {
  const [driver, setDriver] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get driver ID from URL params
  
  // Create API base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  useEffect(() => {
    document.title = "CraveDrop : Driver Profile";
    
    // Check if driver is logged in
    const driverToken = localStorage.getItem("driverToken");
    const driverData = JSON.parse(localStorage.getItem("driverData") || "{}");
    
    // Get driver ID either from URL params or from stored data
    const driverId = id || driverData?.id;
    
    if (!driverToken && !driverId) {
      navigate("/driver/login");
      return;
    }

    // Fetch driver profile using driver ID endpoint
    const fetchProfile = async () => {
      try {
        let response;
        
        if (driverId) {
          // Add /api prefix to match your API gateway configuration 
          response = await axios.get(`${API_BASE_URL}/driver/${driverId}`);
        } else {
          // Fallback to protected profile endpoint with auth token
          response = await axios.get(`${API_BASE_URL}/driver/profile`, {
            headers: {
              Authorization: `Bearer ${driverToken}`
            }
          });
        }
        
        setDriver(response.data);
        setIsAvailable(response.data.isAvailable || false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        
        if (error.response && error.response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("driverToken");
          localStorage.removeItem("driverData");
          toast.error("Session expired. Please login again.");
          navigate("/driver/login");
        } else {
          toast.error("Failed to load profile data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, id, API_BASE_URL]);

  const updateAvailability = async () => {
    setIsUpdatingStatus(true);
    
    try {
      const driverToken = localStorage.getItem("driverToken");
      
      let response;
      
      if (id) {
        // If viewing another driver's profile
        response = await axios.put(
          `${API_BASE_URL}/driver/${id}/availability`, 
          { isAvailable: !isAvailable }
        );
      } else {
        // If viewing own profile
        response = await axios.put(
          `${API_BASE_URL}/driver/availability`, 
          { isAvailable: !isAvailable },
          {
            headers: {
              Authorization: `Bearer ${driverToken}`
            }
          }
        );
      }
      
      setIsAvailable(response.data.isAvailable);
      toast.success(`Driver is now ${response.data.isAvailable ? "available" : "unavailable"} for deliveries`);
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("driverToken");
    localStorage.removeItem("driverData");
    toast.success("Logged out successfully");
    
    setTimeout(() => {
      navigate("/driver/login");
    }, 1000);
  };

  // Handle location update from the map component
  const handleLocationUpdate = (coordinates) => {
    // Update the driver state with the new location
    if (driver && coordinates) {
      setDriver(prev => ({
        ...prev,
        currentLocation: {
          ...prev.currentLocation,
          coordinates: coordinates
        }
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-semibold mb-4">Unable to load profile</p>
        <button 
          onClick={() => navigate("/driver/login")} 
          className="px-4 py-2 bg-lime-500 text-white rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Check if viewing own profile or another driver's profile
  const isOwnProfile = !id || id === driver._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {isOwnProfile ? "Driver Dashboard" : "Driver Profile"}
          </h1>
          {isOwnProfile && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="bg-lime-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-lime-500 text-2xl font-bold">
                  {driver.firstName ? driver.firstName.charAt(0) + (driver.lastName ? driver.lastName.charAt(0) : "") : "DR"}
                </div>
                <div className="ml-4 text-white">
                  <h2 className="text-xl font-semibold">{driver.firstName} {driver.lastName}</h2>
                  <p className="text-lime-50">Driver ID: {driver._id?.substring(0, 8) || "N/A"}</p>
                </div>
              </div>
              {isOwnProfile && (
                <div>
                  <button
                    onClick={updateAvailability}
                    disabled={isUpdatingStatus}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                      isAvailable 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isUpdatingStatus ? (
                      <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : isAvailable ? (
                      <FaToggleOn className="mr-2" size={18} />
                    ) : (
                      <FaToggleOff className="mr-2" size={18} />
                    )}
                    {isAvailable ? "Available" : "Unavailable"}
                  </button>
                </div>
              )}
              {!isOwnProfile && (
                <div>
                  <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                    isAvailable 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                  }`}>
                    {isAvailable ? (
                      <FaToggleOn className="mr-2" size={18} />
                    ) : (
                      <FaToggleOff className="mr-2" size={18} />
                    )}
                    {isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MdEmail className="mr-2" size={18} />
                  <span className="font-medium mr-2">Email:</span>
                  <span>{driver.email}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MdPhone className="mr-2" size={18} />
                  <span className="font-medium mr-2">Contact:</span>
                  <span>{driver.contactNumber || "Not provided"}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <FaIdCard className="mr-2" size={18} />
                  <span className="font-medium mr-2">License:</span>
                  <span>{driver.licenseNumber || "Not provided"}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2" size={18} />
                  <span className="font-medium mr-2">Address:</span>
                  <span>{driver.address || "Not provided"}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MdDateRange className="mr-2" size={18} />
                  <span className="font-medium mr-2">Joined:</span>
                  <span>{driver.createdAt ? new Date(driver.createdAt).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            </div>
            
            {/* Vehicle Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Information</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <FaCar size={24} className="text-lime-500 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {driver.vehicleType || "Vehicle type not specified"}
                    </p>
                    <p className="text-gray-600">
                      {driver.vehicleNumber || "No vehicle number"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Map */}
          <div className="p-6 pt-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Location</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <DriverLocationMap 
                currentLocation={driver.currentLocation}
                driverId={driver._id}
                isCurrentUser={isOwnProfile}
                onLocationUpdate={handleLocationUpdate}
              />
              
              {driver.currentLocation && driver.currentLocation.coordinates && (
                <div className="mt-3 text-sm text-gray-600">
                  <p className="font-medium">Coordinates:</p>
                  <p>Longitude: {driver.currentLocation.coordinates[0].toFixed(6)}</p>
                  <p>Latitude: {driver.currentLocation.coordinates[1].toFixed(6)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Delivery History Section - Only shown for own profile */}
        {isOwnProfile && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Recent Deliveries</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-500 text-center py-8">No recent delivery history available</p>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DriverProfile;