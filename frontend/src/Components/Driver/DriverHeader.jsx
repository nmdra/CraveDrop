import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FaUser, FaCar, FaSignOutAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

const DriverHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  // Check authentication on load
  useEffect(() => {
    const driverToken = localStorage.getItem("driverToken");
    const driverData = localStorage.getItem("driverData");
    setIsLoggedIn(!!driverToken && !!driverData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("driverToken");
    localStorage.removeItem("driverData");
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/driver/login"), 1000);
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img src={logo} alt="CraveDrop Logo" className="h-10 w-auto" />
            </Link>
            <span className="ml-3 text-lg font-semibold text-gray-700 hidden md:block">
              Driver Portal
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-lime-600 flex items-center text-sm font-medium"
            >
              Home
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link 
                  to="/driver/profile" 
                  className="text-gray-600 hover:text-lime-600 flex items-center text-sm font-medium"
                >
                  <FaUser className="mr-1" /> Profile
                </Link>
                <Link 
                  to="/driver/deliveries" 
                  className="text-gray-600 hover:text-lime-600 flex items-center text-sm font-medium"
                >
                  <FaCar className="mr-1" /> Deliveries
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 flex items-center text-sm font-medium"
                >
                  <FaSignOutAlt className="mr-1" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/driver/login" 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register-driver" 
                  className="bg-lime-500 hover:bg-lime-600 text-white py-2 px-4 rounded-lg text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </header>
  );
};

export default DriverHeader;
