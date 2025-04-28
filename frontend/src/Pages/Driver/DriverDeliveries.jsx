import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaTruck,
  FaMapMarkerAlt,
  FaStore,
  FaUser,
  FaFilter,
  FaCalendarAlt,
  FaSearch,
  FaExclamationTriangle
} from 'react-icons/fa';

const DriverDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Create API base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    document.title = "CraveDrop : My Deliveries";
    fetchDriverDeliveries();
  }, []);

  const fetchDriverDeliveries = async () => {
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
        setDeliveries(response.data);
      } else {
        setDeliveries([]);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError('Failed to load your deliveries');
      toast.error("Could not load deliveries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDelivery = (id) => {
    navigate(`/driver/deliveries/${id}`);
  };

  // Filter deliveries based on status and search query
  const filteredDeliveries = deliveries.filter(delivery => {
    // Filter by status
    if (statusFilter !== 'all' && delivery.status !== statusFilter) {
      return false;
    }
    
    // Filter by search query (case insensitive)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        delivery.orderID?.toLowerCase().includes(query) ||
        delivery.customername?.toLowerCase().includes(query) ||
        delivery.shopname?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Get status badge styling based on status
  const getStatusBadge = (status) => {
    let className = '';
    
    switch (status?.toUpperCase()) {
      case 'ASSIGNED':
        className = 'bg-yellow-100 text-yellow-800';
        break;
      case 'PICKED_UP':
        className = 'bg-blue-100 text-blue-800';
        break;
      case 'IN_TRANSIT':
        className = 'bg-purple-100 text-purple-800';
        break;
      case 'DELIVERED':
        className = 'bg-green-100 text-green-800';
        break;
      case 'FAILED':
      case 'CANCELLED':
        className = 'bg-red-100 text-red-800';
        break;
      default:
        className = 'bg-gray-100 text-gray-800';
    }
    
    return `px-3 py-1 rounded-full text-xs font-medium ${className}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Deliveries</h1>
        
        <button
          onClick={fetchDriverDeliveries}
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
      
      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Box */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer or shop name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>
          
          {/* Filter by Status */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              <option value="all">All Statuses</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="PICKED_UP">Picked Up</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          
          {/* Delivery Stats */}
          <div className="flex justify-end items-center">
            <div className="text-right">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Total:</span> {deliveries.length} deliveries
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Active:</span> {deliveries.filter(d => 
                  ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(d.status)
                ).length} deliveries
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Deliveries List */}
      {filteredDeliveries.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <FaTruck className="mx-auto text-gray-300 text-5xl mb-3" />
          <h3 className="text-xl font-medium text-gray-700 mb-1">No deliveries found</h3>
          <p className="text-gray-500">
            {deliveries.length > 0 
              ? "Try changing your search or filter criteria" 
              : "You don't have any assigned deliveries yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeliveries.map(delivery => (
            <div 
              key={delivery._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewDelivery(delivery._id)}
            >
              <div className="border-b border-gray-100 p-4 flex justify-between items-center">
                <div>
                  <h2 className="font-medium">Order #{delivery.orderID}</h2>
                  <p className="text-xs text-gray-500">
                    <FaCalendarAlt className="inline mr-1" />
                    {new Date(delivery.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={getStatusBadge(delivery.status)}>
                  {delivery.status}
                </span>
              </div>
              
              <div className="p-4">
                <div className="mb-3 flex items-start">
                  <div className="bg-lime-100 p-2 rounded-full mr-3">
                    <FaStore className="text-lime-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">From</p>
                    <h3 className="text-gray-800">{delivery.shopname}</h3>
                    <p className="text-xs text-gray-500 truncate">{delivery.shopaddress}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">To</p>
                    <h3 className="text-gray-800">{delivery.customername}</h3>
                    <p className="text-xs text-gray-500 truncate">{delivery.customeraddress}</p>
                  </div>
                </div>
                
                {delivery.distanceToShop && (
                  <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                    <span>
                      <FaMapMarkerAlt className="inline mr-1" />
                      Distance: {delivery.distanceToShop} km
                    </span>
                    
                    {delivery.estimatedDeliveryTime && (
                      <span>ETA: {delivery.estimatedDeliveryTime}</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-3 text-center">
                <button className="text-lime-600 font-medium hover:text-lime-700 text-sm">
                  View Details
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

export default DriverDeliveries;