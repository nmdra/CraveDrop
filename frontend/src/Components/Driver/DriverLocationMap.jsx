import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from '../../axios.jsx';
import { toast } from 'react-toastify';

// Use the Mapbox API key from environment variables
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const DriverLocationMap = ({ 
  currentLocation, 
  isCurrentUser = false,
  onLocationUpdate = null 
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [coordinates, setCoordinates] = useState(
    currentLocation?.coordinates || [77.2090, 28.6139] // Default to Delhi if no location
  );
  const [zoom] = useState(13);
  const [updating, setUpdating] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    if (map.current) return; // Skip if map is already initialized

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [coordinates[0], coordinates[1]],
      zoom: zoom
    });

    // Add navigation controls (zoom, rotation)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add marker at current position
    marker.current = new mapboxgl.Marker({ color: '#99DD05' })
      .setLngLat([coordinates[0], coordinates[1]])
      .addTo(map.current);

    // Cleanup function
    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  // Update marker position when coordinates change
  useEffect(() => {
    if (marker.current && coordinates && coordinates.length === 2) {
      marker.current.setLngLat([coordinates[0], coordinates[1]]);
    }
  }, [coordinates]);

  // Enable click-to-update if this is the current user's map
  useEffect(() => {
    if (!map.current || !isCurrentUser) return;

    const handleMapClick = (e) => {
      const { lng, lat } = e.lngLat;
      setCoordinates([lng, lat]);
      marker.current.setLngLat([lng, lat]);
    };

    map.current.on('click', handleMapClick);

    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
      }
    };
  }, [isCurrentUser]);

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setUpdating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setCoordinates([longitude, latitude]);
          
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 15,
              essential: true
            });
          }
          
          setUpdating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your current location");
          setUpdating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  // Update driver location in database
  const updateDriverLocation = async () => {
    if (!isCurrentUser || !coordinates) return;
    
    setUpdating(true);
    try {
      const token = localStorage.getItem("driverToken");
      await axios.put(
        '/driver/location',
        { 
          longitude: coordinates[0], 
          latitude: coordinates[1] 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast.success("Location updated successfully");
      
      // Call the parent component's update function if provided
      if (onLocationUpdate) onLocationUpdate(coordinates);
      
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update your location");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        className="map-container rounded-lg"
        style={{ height: '300px', width: '100%' }}
      />
      
      {isCurrentUser && (
        <div className="absolute bottom-3 right-3 flex space-x-2">
          <button
            onClick={getCurrentLocation}
            disabled={updating}
            className="bg-white px-3 py-1 rounded-md shadow-md text-gray-700 hover:bg-gray-100 text-sm font-medium flex items-center"
          >
            {updating ? (
              <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
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
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            Current Location
          </button>
          <button
            onClick={updateDriverLocation}
            disabled={updating}
            className="bg-lime-500 px-3 py-1 rounded-md shadow-md text-white hover:bg-lime-600 text-sm font-medium"
          >
            {updating ? 'Updating...' : 'Update Location'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DriverLocationMap;
