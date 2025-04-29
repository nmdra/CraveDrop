import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Create API base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    document.title = "CraveDrop : All Deliveries";
    
    // Fetch all deliveries from backend
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/delivery/all`);
        setDeliveries(response.data);
      } catch (err) {
        setError('Error fetching deliveries');
        toast.error("Failed to load deliveries");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [API_BASE_URL]);

  // View delivery details - Use delivery's _id instead of orderID
  const viewDetails = (id) => {
    navigate(`/deliveries/${id}`);
  };

  // Get status badge styling based on status
  const getStatusBadge = (status) => {
    let bgColor = 'bg-gray-100 text-gray-800';
    
    switch (status?.toUpperCase()) {
      case 'ASSIGNED':
        bgColor = 'bg-yellow-100 text-yellow-800';
        break;
      case 'PICKED_UP':
        bgColor = 'bg-blue-100 text-blue-800';
        break;
      case 'DELIVERED':
        bgColor = 'bg-green-100 text-green-800';
        break;
      case 'CANCELLED':
        bgColor = 'bg-red-100 text-red-800';
        break;
      default:
        bgColor = 'bg-gray-100 text-gray-800';
    }
    
    return `px-3 py-1 text-xs font-medium ${bgColor} rounded-full`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">All Deliveries</h1>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {deliveries.length === 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 text-center">
              <p className="text-gray-500">No deliveries found</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shop
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deliveries.map((delivery) => (
                    <tr key={delivery._id || delivery.orderID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {delivery.orderID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {delivery.customername}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {delivery.driverName || 'Not assigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {delivery.shopname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(delivery.status)}>
                          {delivery.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewDetails(delivery._id)}
                          className="text-lime-600 hover:text-lime-800 bg-lime-50 hover:bg-lime-100 px-3 py-1 rounded-md"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AllDeliveries;
