import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaMoneyBillWave,
  FaCalendar,
  FaChartLine,
  FaExclamationTriangle
} from 'react-icons/fa';

const DriverIncome = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [incomeData, setIncomeData] = useState({
    totalEarnings: 0,
    todayEarnings: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    recentPayments: []
  });
  
  const navigate = useNavigate();
  
  // Create API base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    document.title = "CraveDrop : Driver Income";
    fetchIncomeData();
  }, []);

  const fetchIncomeData = async () => {
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

      // Get the authentication token (currently unused, can be removed)
      
      // For demo purposes, let's create some mock data
      // In a real application, you would fetch this from your API
      setTimeout(() => {
        setIncomeData({
          totalEarnings: 12500,
          todayEarnings: 1200,
          weeklyEarnings: 5600,
          monthlyEarnings: 12500,
          recentPayments: [
            { id: 1, date: '2025-04-24', amount: 1200, status: 'completed', deliveries: 6 },
            { id: 2, date: '2025-04-23', amount: 950, status: 'completed', deliveries: 5 },
            { id: 3, date: '2025-04-22', amount: 1100, status: 'completed', deliveries: 5 },
            { id: 4, date: '2025-04-21', amount: 850, status: 'completed', deliveries: 4 },
            { id: 5, date: '2025-04-20', amount: 1500, status: 'completed', deliveries: 7 }
          ]
        });
        setLoading(false);
      }, 1000);

    } catch (err) {
      console.error('Error fetching income data:', err);
      setError('Failed to load your income data');
      toast.error("Could not load income information. Please try again.");
      setLoading(false);
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
        <h1 className="text-2xl font-bold text-gray-800">Income Dashboard</h1>
        
        <button
          onClick={fetchIncomeData}
          className="bg-lime-500 text-white px-4 py-2 rounded-md hover:bg-lime-600 transition-colors flex items-center"
        >
          <FaChartLine className="mr-2" /> Update
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
      
      {/* Income Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Earnings */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <FaMoneyBillWave className="text-green-600" />
            </div>
            <p className="text-gray-500">Total Earnings</p>
          </div>
          <h3 className="text-2xl font-bold">Rs. {incomeData.totalEarnings}</h3>
          <p className="text-xs text-gray-500 mt-1">Lifetime earnings</p>
        </div>
        
        {/* Today's Earnings */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <FaMoneyBillWave className="text-blue-600" />
            </div>
            <p className="text-gray-500">Today's Earnings</p>
          </div>
          <h3 className="text-2xl font-bold">Rs. {incomeData.todayEarnings}</h3>
          <p className="text-xs text-gray-500 mt-1">Updated hourly</p>
        </div>
        
        {/* Weekly Earnings */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <div className="bg-purple-100 rounded-full p-2 mr-3">
              <FaCalendar className="text-purple-600" />
            </div>
            <p className="text-gray-500">This Week</p>
          </div>
          <h3 className="text-2xl font-bold">Rs. {incomeData.weeklyEarnings}</h3>
          <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
        </div>
        
        {/* Monthly Earnings */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <div className="bg-orange-100 rounded-full p-2 mr-3">
              <FaCalendar className="text-orange-600" />
            </div>
            <p className="text-gray-500">This Month</p>
          </div>
          <h3 className="text-2xl font-bold">Rs. {incomeData.monthlyEarnings}</h3>
          <p className="text-xs text-gray-500 mt-1">April 2025</p>
        </div>
      </div>
      
      {/* Recent Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Payments</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deliveries
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {incomeData.recentPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.deliveries} deliveries
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rs. {payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {incomeData.recentPayments.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No recent payments found
          </div>
        )}
      </div>
      
      {/* Note about payments */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Payments are processed daily at midnight. Your earnings will be transferred to your registered account within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DriverIncome;