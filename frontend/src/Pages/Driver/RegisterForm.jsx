import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FaInfoCircle } from "react-icons/fa";

const DriverRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    vehicleNumber: "",
    vehicleType: "",
    address: "",
    contactNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "CraveDrop : Driver Registration";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate license number
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "License number is required";
    }

    // Validate vehicle number
    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = "Vehicle number is required";
    }

    // Validate vehicle type
    if (!formData.vehicleType.trim()) {
      newErrors.vehicleType = "Vehicle type is required";
    }

    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // Validate contact number
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      

      toast.success("Registration successful! You can now log in.");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/driver/login");
      }, 2000);
      
    } catch (error) {
      console.error("Registration error:", error);
      
      let errorMessage = "Registration failed. Please try again.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg border-2 border-lime-600">
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="CraveDrop Logo" className="w-auto h-12" />
        </div>
        
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Driver Registration</h2>
          <p className="mt-2 text-gray-600">Join our delivery team and start earning today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 mt-1 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 mt-1 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 mt-1 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="driver@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 mt-1 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="10-digit phone number"
                />
                {errors.contactNumber && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.contactNumber}
                  </p>
                )}
              </div>

              {/* Address - Full width */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 mt-1 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="Your full address"
                />
                {errors.address && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Vehicle Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              {/* License Number */}
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                  License Number *
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 mt-1 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="DL12345678"
                />
                {errors.licenseNumber && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.licenseNumber}
                  </p>
                )}
              </div>

              {/* Vehicle Type */}
              <div>
                <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                  Vehicle Type *
                </label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 mt-1 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                >
                  <option value="">Select a vehicle type</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Car">Car</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Van">Van</option>
                </select>
                {errors.vehicleType && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.vehicleType}
                  </p>
                )}
              </div>

              {/* Vehicle Number */}
              <div>
                <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700">
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 mt-1 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="AB1234CD"
                />
                {errors.vehicleNumber && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.vehicleNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Account Security</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 mt-1 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="Min. 8 characters"
                />
                {errors.password && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 mt-1 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 text-white rounded-lg bg-lime-500 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-400"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-3 text-white animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </div>
              ) : (
                "Register as Driver"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have a driver account?{" "}
            <Link to="/driver/login" className="text-lime-600 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DriverRegister;
