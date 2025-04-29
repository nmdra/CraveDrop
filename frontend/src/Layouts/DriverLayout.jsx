import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DriverHeader from "../Components/Driver/DriverHeader";
import DeliverySidebar from "../Components/Driver/DeliverySidebar";
import Footer from "../Components/Home/Footer";

function DriverLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  // Public paths that don't require authentication
  const publicPaths = ['/driver/login', '/register-driver'];
  const isPublicPath = publicPaths.includes(location.pathname);
  
  useEffect(() => {
    // Check for driver authentication
    const driverToken = localStorage.getItem("driverToken");
    setIsAuthenticated(!!driverToken);
    setIsLoading(false);
  }, [location]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  // If not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated && !isPublicPath) {
    return <Navigate to="/driver/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white shadow-md bg-opacity-70 backdrop-blur-md z-50">
        <DriverHeader />
      </div>
      
      {/* Main content with sidebar for authenticated routes */}
      <main className="flex-grow flex">
        {isAuthenticated && !isPublicPath && (
          <div className="hidden md:block w-64 p-4">
            <div className="sticky top-24">
              <DeliverySidebar />
            </div>
          </div>
        )}
        <div className={`flex-grow ${isAuthenticated && !isPublicPath ? 'p-4' : ''}`}>
          <Outlet />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default DriverLayout;
