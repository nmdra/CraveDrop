import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Using NavLink for active link detection
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    FaTachometerAlt,
    FaTruck,
    FaClipboardList,
    FaUser,
    FaCog,
    FaSignOutAlt,
    FaDollarSign,
} from 'react-icons/fa'; // Importing icons from react-icons

const DeliverySidebar = ({ driver }) => {
    const navigate = useNavigate(); // Using useNavigate to redirect

    const handleLogout = () => {
        // Confirm logout
        if (window.confirm("Are you sure you want to logout?")) {
            // Remove authentication data
            localStorage.removeItem("driverToken");
            localStorage.removeItem("driverData");
            
            // Show success message
            toast.success("Logged out successfully");
            
            // Navigate to login page after a short delay
            setTimeout(() => {
                navigate('/driver/login');
            }, 1000);
        }
    };

    // Get driver data from localStorage if not passed as prop
    const driverData = driver || JSON.parse(localStorage.getItem("driverData") || "{}");
    
    // Use first letter of name for avatar if no image available
    const driverInitial = driverData?.firstName ? driverData.firstName.charAt(0).toUpperCase() : "D";

    return (
        <aside className="bg-white rounded-lg shadow-lg p-4">
            {/* Driver Avatar and Welcome Message */}
            <div className="mb-6 text-center">
                {driverData?.profileImage ? (
                    <img
                        src={driverData.profileImage}
                        alt="Driver Avatar"
                        className="w-16 h-16 rounded-full mx-auto border-2 border-lime-500 object-cover"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full mx-auto bg-lime-500 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">{driverInitial}</span>
                    </div>
                )}
                <p className="mt-2 text-gray-700 font-medium">
                    Hello, {driverData?.firstName || "Driver"}
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                    Driver ID: {driverData?._id?.substring(0, 8) || "N/A"}
                </span>
            </div>

            {/* Navigation Links */}
            <nav>
                <ul className="space-y-2">
                    <li>
                        <NavLink
                            to="/driver/dashboard"
                            className={({ isActive }) =>
                                `flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 ${
                                    isActive
                                        ? 'bg-gray-100 border-l-4 border-lime-500 pl-1'
                                        : ''
                                }`
                            }
                        >
                            <FaTachometerAlt className="w-5 h-5 mr-3 text-lime-500" />
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/driver/ongoing"
                            className={({ isActive }) =>
                                `flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 ${
                                    isActive
                                        ? 'bg-gray-100 border-l-4 border-lime-500 pl-1'
                                        : ''
                                }`
                            }
                        >
                            <FaTruck className="w-5 h-5 mr-3 text-lime-500" />
                            Ongoing Deliveries
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/driver/deliveries"
                            className={({ isActive }) =>
                                `flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 ${
                                    isActive
                                        ? 'bg-gray-100 border-l-4 border-lime-500 pl-1'
                                        : ''
                                }`
                            }
                        >
                            <FaClipboardList className="w-5 h-5 mr-3 text-lime-500" />
                            Deliveries
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/driver/profile"
                            className={({ isActive }) =>
                                `flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 ${
                                    isActive
                                        ? 'bg-gray-100 border-l-4 border-lime-500 pl-1'
                                        : ''
                                }`
                            }
                        >
                            <FaUser className="w-5 h-5 mr-3 text-lime-500" />
                            Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/driver/income"
                            className={({ isActive }) =>
                                `flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 ${
                                    isActive
                                        ? 'bg-gray-100 border-l-4 border-lime-500 pl-1'
                                        : ''
                                }`
                            }
                        >
                            <FaDollarSign className="w-5 h-5 mr-3 text-lime-500" />
                            Income
                        </NavLink>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="flex items-center p-2 w-full text-left text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600"
                        >
                            <FaSignOutAlt className="w-5 h-5 mr-3 text-red-500" />
                            Log-out
                        </button>
                    </li>
                </ul>
            </nav>
            <ToastContainer position="top-right" autoClose={2000} />
        </aside>
    );
};

export default DeliverySidebar;
