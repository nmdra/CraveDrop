import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaClock,
  FaMapMarkerAlt,
  FaRoute,
  FaStore,
  FaUser,
  FaTruck,
  FaExclamationTriangle,
  FaPhoneAlt
} from 'react-icons/fa';

const OngoingDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Create API base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    document.title = "CraveDrop : Ongoing Deliveries";
    fetchOngoingDeliveries();
  }, []);

  const fetchOngoingDeliveries = async () => {
    try {
      setLoading(true);
      
      // Get driver data from localStorage
      const driverData = JSON.parse(localStorage.getItem("driverData") || "{}");
      const driverId = driverData?._id || driverData?.id;
      
      if (!driverId) {
        toast.error("Driver information not found");
        navigate('/driver/login');
        return;
      }

      // Get the authentication token
      const driverToken = localStorage.getItem("driverToken");
      
      // Fetch deliveries using the driver ID
      const response = await axios.get(`${API_BASE_URL}/delivery/driver/${driverId}`, {
        headers: driverToken ? { Authorization: `Bearer ${driverToken}` } : {}
      });

      if (response.data) {
        // Filter to only include active deliveries (not delivered or cancelled)
        const ongoingDeliveries = response.data.filter(delivery => 
          ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(delivery.status)
        );
        setDeliveries(ongoingDeliveries);
      } else {
        setDeliveries([]);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching ongoing deliveries:', err);
      setError('Failed to load your ongoing deliveries');
      toast.error("Could not load deliveries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDelivery = (id) => {
    navigate(`/driver/deliveries/${id}`);
  };

  // Function to get status with icon
  const getStatusWithIcon = (status) => {
    switch(status) {
      case 'ASSIGNED':
        return (
          <div className="flex items-center">
            <div className="bg-yellow-100 p-1 rounded-full mr-2">
              <FaTruck className="text-yellow-600" size={14} />
            </div>
            <span>Going to pick up</span>
          </div>
        );
      case 'PICKED_UP':
        return (
          <div className="flex items-center">
            <div className="bg-blue-100 p-1 rounded-full mr-2">
              <FaStore className="text-blue-600" size={14} />
            </div>
            <span>Picked up, delivering</span>
          </div>
        );
      case 'IN_TRANSIT':
        return (
          <div className="flex items-center">
            <div className="bg-purple-100 p-1 rounded-full mr-2">
              <FaRoute className="text-purple-600" size={14} />
            </div>
            <span>In transit</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <div className="bg-gray-100 p-1 rounded-full mr-2">
              <FaClock className="text-gray-600" size={14} />
            </div>
            <span>{status}</span>
          </div>
        );
    }
  };

  // Handle actions for different delivery statuses
  const handleDeliveryAction = async (delivery) => {
    try {
      // Show loading toast
      const loadingToastId = toast.loading("Updating delivery status...");
  
      let newStatus;
      let actionMessage;
      let newLocation = null;
  
      // Determine the next status based on current status
      switch(delivery.status) {
        case 'ASSIGNED':
          newStatus = 'PICKED_UP';
          actionMessage = 'Marked as picked up from shop';
          // When changing to PICKED_UP, update driver location to shop coordinates
          if (delivery.shoplocation && delivery.shoplocation.length === 2) {
            newLocation = {
              longitude: delivery.shoplocation[0], // Longitude from shop
              latitude: delivery.shoplocation[1]   // Latitude from shop
            };
          }
          break;
        case 'PICKED_UP':
          newStatus = 'IN_TRANSIT';
          actionMessage = 'Delivery in transit to customer';
          break;
        case 'IN_TRANSIT':
          newStatus = 'DELIVERED';
          actionMessage = 'Delivery completed successfully';
          // When changing to DELIVERED, update driver location to customer coordinates
          if (delivery.customerlocationcordinate && delivery.customerlocationcordinate.length === 2) {
            newLocation = {
              longitude: delivery.customerlocationcordinate[0],
              latitude: delivery.customerlocationcordinate[1]
            };
          }
          break;
        default:
          toast.update(loadingToastId, {
            render: "No action available for current status",
            type: "warning",
            isLoading: false,
            autoClose: 3000
          });
          return;
      }
  
      // Get driver token
      const driverToken = localStorage.getItem("driverToken");
      if (!driverToken) {
        toast.update(loadingToastId, {
          render: "Authentication required. Please login again.",
          type: "error",
          isLoading: false,
          autoClose: 3000
        });
        navigate('/driver/login');
        return;
      }
  
      // First update the delivery status
      const updateUrl = `${API_BASE_URL}/delivery/${delivery._id}/status`;
      const response = await axios.patch(
        updateUrl, 
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${driverToken}` }
        }
      );
  
      // Then update driver's location if needed
      if (newLocation) {
        try {
          console.log(`Updating driver location to:`, newLocation);
  
          // 1. Update driver's location in driver service
          const driverLocationResponse = await axios.put(
            `${API_BASE_URL}/driver/location`, 
            newLocation,
            {
              headers: { Authorization: `Bearer ${driverToken}` }
            }
          );
          console.log(`Driver location updated successfully:`, driverLocationResponse.data);
          
          // 2. Update driver's location in the delivery record
          const deliveryLocationResponse = await axios.patch(
            `${API_BASE_URL}/delivery/${delivery._id}/driver-location`,
            { location: [newLocation.longitude, newLocation.latitude] },
            {
              headers: { Authorization: `Bearer ${driverToken}` }
            }
          );
          console.log(`Delivery driver location updated successfully:`, deliveryLocationResponse.data);
          
        } catch (locationError) {
          console.error("Failed to update location:", locationError);
          toast.warning("Delivery status updated but location could not be fully updated");
        }
      }
  
      // Update the toast with success message
      toast.update(loadingToastId, {
        render: actionMessage,
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
  
      // Log success for debugging
      console.log(`Delivery ${delivery._id} updated to ${newStatus}`, response.data);
  
      // Refresh the list after a short delay
      setTimeout(fetchOngoingDeliveries, 1000);
  
    } catch (error) {
      console.error("Error updating delivery status:", error);
  
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || 
                           "Failed to update delivery status. Please try again.";
  
      toast.error(errorMessage);
    }
  };
  
  

  // Function to get action button text based on status
  const getActionText = (status) => {
    switch(status) {
      case 'ASSIGNED':
        return 'Mark as Picked Up';
      case 'PICKED_UP':
        return 'Start Delivery';
      case 'IN_TRANSIT':
        return 'Mark as Delivered';
      default:
        return 'View Details';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ongoing Deliveries</h1>
        
        <button
          onClick={fetchOngoingDeliveries}
          className="bg-lime-500 text-white px-4 py-2 rounded-md hover:bg-lime-600 transition-colors flex items-center"
        >
          <FaTruck className="mr-2" /> Refresh
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {deliveries.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <FaTruck className="mx-auto text-gray-300 text-5xl mb-3" />
          <h3 className="text-xl font-medium text-gray-700 mb-1">No ongoing deliveries</h3>
          <p className="text-gray-500">
            You don't have any active deliveries at the moment
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {deliveries.map(delivery => (
            <div 
              key={delivery._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-gray-50 p-4 flex justify-between items-center border-b">
                <div className="flex items-center">
                  <span className="font-medium text-gray-800 mr-3">Order #{delivery.orderID}</span>
                  {getStatusWithIcon(delivery.status)}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(delivery.updatedAt || delivery.createdAt).toLocaleString()}
                </span>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shop Info */}
                  <div className="border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4">
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                      <FaStore className="text-lime-500 mr-2" />
                      Pickup from Shop
                    </h3>
                    <p className="font-medium">{delivery.shopname}</p>
                    <p className="text-sm text-gray-600">{delivery.shopaddress}</p>
                    
                    <div className="mt-3 flex items-center">
                      <a 
                        href={`tel:${delivery.shopcontact}`} 
                        className="mr-3 text-blue-600 flex items-center text-sm"
                      >
                        <FaPhoneAlt className="mr-1" size={12} />
                        Call Shop
                      </a>
                      
                      {delivery.shoplocation && (
                        <a 
                          href={`https://maps.google.com/?q=${delivery.shoplocation[1]},${delivery.shoplocation[0]}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 flex items-center text-sm"
                        >
                          <FaMapMarkerAlt className="mr-1" size={12} />
                          View on Map
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Customer Info */}
                  <div className="pt-4 md:pt-0 md:pl-4">
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                      <FaUser className="text-blue-500 mr-2" />
                      Deliver to Customer
                    </h3>
                    <p className="font-medium">{delivery.customername}</p>
                    <p className="text-sm text-gray-600">{delivery.customeraddress}</p>
                    
                    <div className="mt-3 flex items-center">
                      <a 
                        href={`tel:${delivery.customercontact}`} 
                        className="mr-3 text-blue-600 flex items-center text-sm"
                      >
                        <FaPhoneAlt className="mr-1" size={12} />
                        Call Customer
                      </a>
                      
                      {delivery.customerlocationcordinate && (
                        <a 
                          href={`https://maps.google.com/?q=${delivery.customerlocationcordinate[1]},${delivery.customerlocationcordinate[0]}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 flex items-center text-sm"
                        >
                          <FaMapMarkerAlt className="mr-1" size={12} />
                          View on Map
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 flex justify-between items-center border-t">
                <button
                  onClick={() => handleViewDelivery(delivery._id)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                >
                  <FaRoute className="mr-2" /> View Details
                </button>
                
                <button
                  onClick={() => handleDeliveryAction(delivery)}
                  className="bg-lime-500 text-white px-4 py-2 rounded-md hover:bg-lime-600 transition-colors"
                >
                  {getActionText(delivery.status)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default OngoingDeliveries;