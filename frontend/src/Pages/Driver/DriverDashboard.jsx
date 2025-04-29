import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Using direct axios import like in DriverProfile
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaToggleOn,
  FaToggleOff,
  FaDollarSign,
  FaRoute,
  FaListAlt
} from "react-icons/fa";
import DriverLocationMap from "../../Components/Driver/DriverLocationMap";

const DriverDashboard = () => {
  const [driver, setDriver] = useState(null);
  const [stats, setStats] = useState({
    completedDeliveries: 0,
    pendingDeliveries: 0,
    totalEarnings: 0,
    todayEarnings: 0,
    ongoingDelivery: null
  });
  const [ongoingDeliveries, setOngoingDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDeliveries, setIsLoadingDeliveries] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const navigate = useNavigate();
  
  // Create API base URL from environment variable
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    document.title = "CraveDrop : Driver Dashboard";
    
    // Check if driver is logged in
    const driverToken = localStorage.getItem("driverToken");
    const driverData = JSON.parse(localStorage.getItem("driverData") || "{}");
    
    // Get driver ID from stored data
    const driverId = driverData?.id || driverData?._id;
    
    if (!driverToken && !driverId) {
      navigate("/driver/login");
      return;
    }

    // Fetch driver profile using driver ID endpoint like in DriverProfile
    const fetchDriverData = async () => {
      try {
        let response;
        
        if (driverId) {
          // Using the driver/:id endpoint
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
        
        // Fetch driver stats in a separate call
        fetchDriverStats(driverToken);
        
        // Fetch ongoing deliveries for this driver
        fetchDriverDeliveries(driverId || response.data._id);
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

    // Fetch driver statistics
    const fetchDriverStats = async (token) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/driver/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching driver stats:", error);
        // Don't show error toast as this is secondary data
      }
    };
    
    // Fetch all deliveries for this driver
    const fetchDriverDeliveries = async (driverId) => {
      setIsLoadingDeliveries(true);
      try {
        // Use the delivery/driver/:driverId endpoint to fetch all deliveries
        const response = await axios.get(`${API_BASE_URL}/delivery/driver/${driverId}`);
        
        // Filter for only active/ongoing deliveries (not DELIVERED or CANCELLED)
        const activeDeliveries = response.data.filter(delivery => 
          ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(delivery.status)
        );
        
        setOngoingDeliveries(activeDeliveries);
      } catch (error) {
        console.error("Error fetching driver deliveries:", error);
        toast.error("Failed to load your delivery information");
      } finally {
        setIsLoadingDeliveries(false);
      }
    };

    fetchDriverData();
  }, [navigate, API_BASE_URL]);

  // Update driver availability status - using the same approach as DriverProfile
  const updateAvailability = async () => {
    setIsUpdatingStatus(true);
    
    try {
      const driverToken = localStorage.getItem("driverToken");
      const driverData = JSON.parse(localStorage.getItem("driverData") || "{}");
      const driverId = driverData?.id || driverData?._id || driver?._id;
      
      let response;
      
      if (driverId && !driverToken) {
        // If we have an ID but no token, use the ID-based endpoint
        response = await axios.put(
          `${API_BASE_URL}/driver/${driverId}/availability`, 
          { isAvailable: !isAvailable }
        );
      } else {
        // Use the protected endpoint with auth token
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
      toast.success(`You are now ${response.data.isAvailable ? "available" : "unavailable"} for deliveries`);
      
      // Update driver data in state with new availability
      if (driver) {
        setDriver({
          ...driver,
          isAvailable: response.data.isAvailable
        });
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle location update from the map component - same as in DriverProfile
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

  // Navigate to delivery details
  const viewDeliveryDetails = (deliveryId) => {
    navigate(`/driver/deliveries/${deliveryId}`);
  };
  
  // Function to get status style based on delivery status
  const getStatusStyle = (status) => {
    switch(status) {
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800';
      case 'PICKED_UP':
        return 'bg-purple-100 text-purple-800';
      case 'IN_TRANSIT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Convert status to display text
  const formatStatus = (status) => {
    return status.replace('_', ' ').replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Status and Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {driver?.firstName}!</h1>
            <p className="text-gray-600">Your current status is: 
              <span className={`font-semibold ml-2 ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </p>
          </div>
          
          <button
            onClick={updateAvailability}
            disabled={isUpdatingStatus}
            className={`flex items-center justify-center px-4 py-2 rounded-lg text-white ${
              isAvailable 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-green-500 hover:bg-green-600"
            } transition-colors`}
          >
            {isUpdatingStatus ? (
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isAvailable ? (
              <FaToggleOff className="mr-2" size={18} />
            ) : (
              <FaToggleOn className="mr-2" size={18} />
            )}
            {isAvailable ? "Go Offline" : "Go Online"}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Completed Deliveries */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-green-100 rounded-full p-3 mb-3">
            <FaCheckCircle className="text-green-600 text-xl" />
          </div>
          <p className="text-gray-500 text-sm">Completed Deliveries</p>
          <h3 className="text-2xl font-bold">{stats.completedDeliveries}</h3>
        </div>
        
        {/* Pending Deliveries */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-yellow-100 rounded-full p-3 mb-3">
            <FaClock className="text-yellow-600 text-xl" />
          </div>
          <p className="text-gray-500 text-sm">Pending Deliveries</p>
          <h3 className="text-2xl font-bold">{stats.pendingDeliveries}</h3>
        </div>
        
        {/* Total Earnings */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-blue-100 rounded-full p-3 mb-3">
            <FaDollarSign className="text-blue-600 text-xl" />
          </div>
          <p className="text-gray-500 text-sm">Total Earnings</p>
          <h3 className="text-2xl font-bold">Rs. {stats.totalEarnings}</h3>
        </div>
        
        {/* Today's Earnings */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-purple-100 rounded-full p-3 mb-3">
            <FaDollarSign className="text-purple-600 text-xl" />
          </div>
          <p className="text-gray-500 text-sm">Today's Earnings</p>
          <h3 className="text-2xl font-bold">Rs. {stats.todayEarnings}</h3>
        </div>
      </div>

      {/* Ongoing Deliveries Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-lime-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <FaTruck className="mr-2" />
            Ongoing Deliveries
          </h2>
        </div>
        
        <div className="p-6">
          {isLoadingDeliveries ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lime-500"></div>
            </div>
          ) : ongoingDeliveries.length > 0 ? (
            <div className="space-y-6">
              {ongoingDeliveries.map(delivery => (
                <div key={delivery._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-lg font-medium">Order #{delivery.orderID}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="mr-2 text-gray-500" />
                          From: {delivery.shopname}
                        </p>
                        <p className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="mr-2 text-gray-500" />
                          To: {delivery.customername}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(delivery.status)}`}>
                      {formatStatus(delivery.status)}
                    </span>
                  </div>
                  <button
                    onClick={() => viewDeliveryDetails(delivery._id)}
                    className="w-full bg-lime-500 text-white py-2 rounded-lg hover:bg-lime-600 transition-colors flex items-center justify-center"
                  >
                    <FaRoute className="mr-2" />
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaTruck className="mx-auto text-gray-300 text-5xl mb-3" />
              <p className="text-gray-500">No active deliveries at the moment</p>
              {!isAvailable && (
                <button 
                  onClick={updateAvailability} 
                  className="mt-4 bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors"
                >
                  Go Online to Accept Deliveries
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Location Map Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-100 px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Your Current Location</h2>
          <p className="text-gray-600 text-sm">Update your location to receive nearby delivery requests</p>
        </div>
        
        <div className="p-6">
          <DriverLocationMap 
            currentLocation={driver?.currentLocation}
            driverId={driver?._id}
            isCurrentUser={true}
            onLocationUpdate={handleLocationUpdate}
          />
        </div>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DriverDashboard;
