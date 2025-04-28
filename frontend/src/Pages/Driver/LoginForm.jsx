import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import axios from "../../axios.jsx";
import logo from "../../assets/logo.png";

const DriverLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "CraveDrop : Driver Login";
    
    // Check if already logged in
    const token = localStorage.getItem("driverToken");
    if (token) {
      navigate("/driver/profile");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/driver/login", {
        email,
        password,
      });

      // Extract driver data and token
      const { token, ...driverData } = response.data;

      // Save to localStorage
      localStorage.setItem("driverToken", token);
      localStorage.setItem("driverData", JSON.stringify(driverData));

      toast.success("Login successful!");
      
      // Redirect to driver profile after toast is shown
      setTimeout(() => {
        navigate("/driver/profile");
      }, 2000);

    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white border-2 border-lime-600 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="CraveDrop Logo" className="w-auto h-12" />
        </div>
        
        <div className="mb-5 text-left">
          <h2 className="text-3xl font-bold text-gray-800">Driver Login</h2>
          <p className="mt-2 text-gray-600">Sign in to your driver account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="block w-full px-4 py-3 mt-1 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lime-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="driver@example.com"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="block w-full px-4 py-3 mt-1 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lime-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <div className="mt-1 text-right">
              <Link to="/driver/forgot-password" className="text-sm text-lime-600 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
          
          <button
            disabled={isLoading}
            type="submit"
            className="w-full px-4 py-3 text-white rounded-lg bg-lime-500 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-400"
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
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have a driver account?{" "}
            <Link to="/register-driver" className="text-lime-600 hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DriverLogin;