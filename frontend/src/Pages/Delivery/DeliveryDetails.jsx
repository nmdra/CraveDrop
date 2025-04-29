import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  FaArrowLeft, 
  FaCar, 
  FaStore, 
  FaUser, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaClock,
  FaRoute
} from "react-icons/fa";

// Use Mapbox API key from environment variables
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const DeliveryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRoute, setActiveRoute] = useState('driver-to-shop'); // or 'shop-to-customer'
  
  // Map refs
  const mapContainer = useRef(null);
  const map = useRef(null);
  
  // Create API base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    document.title = "CraveDrop : Delivery Details";
    
    const fetchDeliveryDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/delivery/${id}`);
        
        // Check if we got valid data
        if (response.data) {
          // Use delivery data from response - handle different API response structures
          const deliveryData = response.data.delivery || response.data;
          setDelivery(deliveryData);
          
          // Update document title with order ID if available
          if (deliveryData.orderID) {
            document.title = `CraveDrop : Order #${deliveryData.orderID}`;
          }
          
          setError(null);
        } else {
          setError('No delivery data returned from server');
          toast.error("Failed to load delivery details");
        }
      } catch (err) {
        console.error('Error fetching delivery details:', err);
        setError('Failed to load delivery details');
        toast.error("Failed to load delivery details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryDetails();
  }, [id, API_BASE_URL]);

  // Initialize map when delivery data is available
  useEffect(() => {
    if (!delivery || !mapContainer.current) return;
    
    // Check if we have all the location data needed
    const hasDriverLocation = delivery.driverlocation && 
      Array.isArray(delivery.driverlocation) && 
      delivery.driverlocation.length === 2;
      
    const hasShopLocation = delivery.shoplocation && 
      Array.isArray(delivery.shoplocation) && 
      delivery.shoplocation.length === 2;
      
    const hasCustomerLocation = delivery.customerlocationcordinate && 
      Array.isArray(delivery.customerlocationcordinate) && 
      delivery.customerlocationcordinate.length === 2;
    
    // If we don't have required locations, don't initialize the map
    if (!hasShopLocation || !hasCustomerLocation) {
      return;
    }
    
    // Initialize map
    if (!map.current) {
      // Determine center point
      let centerPoint = hasShopLocation 
        ? delivery.shoplocation 
        : delivery.customerlocationcordinate;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: centerPoint,
        zoom: 12
      });
      
      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add markers after map loads
      map.current.on('load', () => {
        // Add markers
        addMarkers();
        
        // Draw initial route
        if (hasDriverLocation && hasShopLocation) {
          drawRoute(delivery.driverlocation, delivery.shoplocation, 'driver-to-shop');
        } else if (hasShopLocation && hasCustomerLocation) {
          drawRoute(delivery.shoplocation, delivery.customerlocationcordinate, 'shop-to-customer');
        }
      });
    } else {
      // If map already initialized, just add markers
      addMarkers();
    }
    
    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [delivery]);

  // Add markers for shop, customer, and driver
  const addMarkers = () => {
    if (!map.current || !delivery) return;
    
    // Clear any existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while(markers[0]) {
      markers[0].parentNode.removeChild(markers[0]);
    }
    
    // Add shop marker
    if (delivery.shoplocation && Array.isArray(delivery.shoplocation) && delivery.shoplocation.length === 2) {
      const shopMarker = document.createElement('div');
      shopMarker.className = 'marker-shop';
      shopMarker.style.backgroundImage = 'url(https://img.icons8.com/color/48/000000/shop.png)';
      shopMarker.style.width = '32px';
      shopMarker.style.height = '32px';
      shopMarker.style.backgroundSize = '100%';
      
      new mapboxgl.Marker(shopMarker)
        .setLngLat(delivery.shoplocation)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${delivery.shopname || 'Shop'}</strong>`))
        .addTo(map.current);
    }
    
    // Add customer marker
    if (delivery.customerlocationcordinate && Array.isArray(delivery.customerlocationcordinate) && delivery.customerlocationcordinate.length === 2) {
      const customerMarker = document.createElement('div');
      customerMarker.className = 'marker-customer';
      customerMarker.style.backgroundImage = 'url(https://img.icons8.com/color/48/000000/marker.png)';
      customerMarker.style.width = '32px';
      customerMarker.style.height = '32px';
      customerMarker.style.backgroundSize = '100%';
      
      new mapboxgl.Marker(customerMarker)
        .setLngLat(delivery.customerlocationcordinate)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${delivery.customername || 'Customer'}</strong>`))
        .addTo(map.current);
    }
    
    // Add driver marker if available
    if (delivery.driverlocation && Array.isArray(delivery.driverlocation) && delivery.driverlocation.length === 2) {
      const driverMarker = document.createElement('div');
      driverMarker.className = 'marker-driver';
      driverMarker.style.backgroundImage = 'url(https://img.icons8.com/color/48/000000/motorcycle.png)';
      driverMarker.style.width = '32px';
      driverMarker.style.height = '32px';
      driverMarker.style.backgroundSize = '100%';
      
      new mapboxgl.Marker(driverMarker)
        .setLngLat(delivery.driverlocation)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${delivery.driverName || 'Driver'}</strong>`))
        .addTo(map.current);
    }
  };

  // Draw route between two points
  const drawRoute = async (start, end, routeType) => {
    if (!map.current || !start || !end) return;
    
    try {
      // Remove existing route if any
      if (map.current.getSource('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }
      
      // Get route from Mapbox Directions API
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      
      // Set the route type
      setActiveRoute(routeType);
      
      // Create a GeoJSON source for the route
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        }
      });
      
      // Add a layer for the route line
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': routeType === 'driver-to-shop' ? '#3887be' : '#42b983',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
      
      // Fit the map to the route
      const bounds = new mapboxgl.LngLatBounds();
      route.forEach(point => {
        bounds.extend(point);
      });
      
      map.current.fitBounds(bounds, {
        padding: 60
      });
      
      // Calculate distance and ETA
      const distance = (data.distance / 1000).toFixed(2); // Convert to km
      const duration = Math.round(data.duration / 60); // Convert to minutes
      
      // Show info toast
      toast.info(`Distance: ${distance} km, Est. Time: ${duration} min`);
      
    } catch (error) {
      console.error('Error generating route:', error);
      toast.error('Could not generate route directions');
    }
  };

  // Toggle between routes
  const toggleRoute = () => {
    if (!delivery) return;
    
    const hasDriverLocation = delivery.driverlocation && Array.isArray(delivery.driverlocation);
    const hasShopLocation = delivery.shoplocation && Array.isArray(delivery.shoplocation);
    const hasCustomerLocation = delivery.customerlocationcordinate && Array.isArray(delivery.customerlocationcordinate);
    
    if (activeRoute === 'driver-to-shop' && hasShopLocation && hasCustomerLocation) {
      drawRoute(delivery.shoplocation, delivery.customerlocationcordinate, 'shop-to-customer');
    } else if (activeRoute === 'shop-to-customer' && hasDriverLocation && hasShopLocation) {
      drawRoute(delivery.driverlocation, delivery.shoplocation, 'driver-to-shop');
    }
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

  if (error || !delivery) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <p className="text-red-500 text-center mb-4">{error || "Delivery not found"}</p>
          <button 
            onClick={() => navigate('/deliveries')}
            className="w-full bg-lime-500 text-white py-2 rounded-lg hover:bg-lime-600"
          >
            Go Back to All Deliveries
          </button>
        </div>
      </div>
    );
  }

  // Check if we have locations to show the map
  const hasDriverLocation = delivery.driverlocation && 
    Array.isArray(delivery.driverlocation) && 
    delivery.driverlocation.length === 2;
    
  const hasShopLocation = delivery.shoplocation && 
    Array.isArray(delivery.shoplocation) && 
    delivery.shoplocation.length === 2;
    
  const hasCustomerLocation = delivery.customerlocationcordinate && 
    Array.isArray(delivery.customerlocationcordinate) && 
    delivery.customerlocationcordinate.length === 2;
  
  const canShowMap = (hasShopLocation && hasCustomerLocation) || 
                     (hasDriverLocation && hasShopLocation);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Navigation button */}
        <button 
          onClick={() => navigate('/deliveries')}
          className="flex items-center text-gray-600 hover:text-lime-600 mb-6 transition duration-150"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to All Deliveries</span>
        </button>
        
        {/* Main content card */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          {/* Header Section with Order ID and Status */}
          <div className="bg-lime-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-white">
                Order #{delivery.orderID}
              </h1>
              <div className="flex items-center space-x-3">
                {delivery.createdAt && (
                  <span className="text-white text-sm opacity-90">
                    {new Date(delivery.createdAt).toLocaleString()}
                  </span>
                )}
                <span className={getStatusBadge(delivery.status)}>
                  {delivery.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Map section - if we have the coordinates */}
            {canShowMap && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FaRoute className="mr-2 text-lime-500" />
                    Delivery Route
                  </h2>
                  {hasDriverLocation && hasShopLocation && hasCustomerLocation && (
                    <button 
                      onClick={toggleRoute}
                      className="bg-lime-500 hover:bg-lime-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                    >
                      <FaRoute className="mr-2" />
                      {activeRoute === 'driver-to-shop' 
                        ? 'Show Shop to Customer' 
                        : 'Show Driver to Shop'
                      }
                    </button>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {/* Map container */}
                  <div 
                    ref={mapContainer}
                    className="w-full h-[300px] rounded-lg"
                  />
                  
                  {/* Route information */}
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                      <span className="text-sm text-gray-600 mr-4">Driver to Shop</span>
                      
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                      <span className="text-sm text-gray-600">Shop to Customer</span>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Current view:</span> {activeRoute === 'driver-to-shop' ? 'Driver to Shop' : 'Shop to Customer'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaUser className="mr-2 text-lime-500" />
                Customer Information
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Name:</span> {delivery.customername || 'N/A'}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <FaPhone className="mr-2 text-gray-400" size={14} />
                      <span className="font-medium">Contact:</span> {delivery.customercontact || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 flex items-start">
                      <FaMapMarkerAlt className="mr-2 mt-1 text-gray-400" size={14} />
                      <span>
                        <span className="font-medium">Delivery Address:</span> <br />
                        {delivery.customerlocation || 'Address not available'}
                        {delivery.customerlocationcordinate && (
                          <span className="block text-xs text-gray-500 mt-1">
                            Coordinates: {delivery.customerlocationcordinate.join(', ')}
                          </span>
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shop Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaStore className="mr-2 text-lime-500" />
                Shop Information
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Shop:</span> {delivery.shopname || 'N/A'}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <FaPhone className="mr-2 text-gray-400" size={14} />
                      <span className="font-medium">Contact:</span> {delivery.shopcontact || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 flex items-start">
                      <FaMapMarkerAlt className="mr-2 mt-1 text-gray-400" size={14} />
                      <span>
                        <span className="font-medium">Shop Address:</span> <br />
                        {delivery.shoplocationtext || 'Address not available'}
                        {delivery.shoplocation && (
                          <span className="block text-xs text-gray-500 mt-1">
                            Coordinates: {delivery.shoplocation.join(', ')}
                          </span>
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Driver Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaCar className="mr-2 text-lime-500" />
                Driver Information
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                {delivery.driverid ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Driver:</span> {delivery.driverName || 'N/A'}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <FaPhone className="mr-2 text-gray-400" size={14} />
                        <span className="font-medium">Contact:</span> {delivery.driverPhone || 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-600 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" size={14} />
                        <span className="font-medium">Current Location:</span> 
                        {delivery.driverlocation?.join(', ') || 'Location not available'}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <FaClock className="mr-2 text-gray-400" size={14} />
                        <span className="font-medium">Estimated Delivery:</span> 
                        {delivery.estimatedDeliveryTime || 'Not available'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 py-2">No driver has been assigned to this delivery yet.</p>
                )}
              </div>
            </div>
            
            {/* Payment Information - Add if available */}
            {delivery.paymentMethod && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Payment Information</h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="text-gray-600">
                      <span className="font-medium">Payment Method:</span> {delivery.paymentMethod}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Payment Status:</span> {delivery.paymentStatus || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Delivery Summary */}
            {delivery.items && delivery.items.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {delivery.items.map((item, index) => (
                      <li key={index} className="py-3 flex justify-between">
                        <span>{item.name} x {item.quantity}</span>
                        <span>Rs. {item.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">Rs. {delivery.totalAmount || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DeliveryDetails;