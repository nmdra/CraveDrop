import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../services/axios";
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/login');
      return;
    }
    
    // Load restaurants data
    fetchRestaurants();
  }, [navigate]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/restaurants', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      setRestaurants(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Failed to load restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRestaurant = async (restaurantId) => {
    try {
      await axios.put(`/api/admin/verify/${restaurantId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      setMessage('Restaurant verified successfully');
      
      // Update the restaurants list to reflect the change
      setRestaurants(prevRestaurants => 
        prevRestaurants.map(restaurant => 
          restaurant._id === restaurantId 
            ? { ...restaurant, isVerified: true } 
            : restaurant
        )
      );
    } catch (err) {
      console.error('Error verifying restaurant:', err);
      setMessage('Failed to verify restaurant. Please try again.');
    }
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    if (!window.confirm('Are you sure you want to delete this restaurant? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Use the admin route for deletion
      await axios.delete(`/api/admin/restaurants/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      setMessage('Restaurant deleted successfully');
      
      // Remove the deleted restaurant from the list
      setRestaurants(prevRestaurants => 
        prevRestaurants.filter(restaurant => restaurant._id !== restaurantId)
      );
    } catch (err) {
      console.error('Error deleting restaurant:', err);
      setMessage('Failed to delete restaurant. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </header>

      {message && (
        <div className={`${styles.message} ${message.includes('successfully') ? styles.success : styles.error}`}>
          {message}
          <button className={styles.closeMessage} onClick={() => setMessage('')}>×</button>
        </div>
      )}

      <div className={styles.content}>
        <h2>Restaurant Management</h2>
        
        {error && <p className={styles.error}>{error}</p>}
        
        {restaurants.length === 0 ? (
          <p className={styles.noData}>No restaurants found.</p>
        ) : (
          <div className={styles.restaurantsTable}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map(restaurant => (
                  <tr key={restaurant._id}>
                    <td>{restaurant.name}</td>
                    <td>{restaurant.email}</td>
                    <td>{restaurant.telephoneNumber}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${restaurant.isVerified ? styles.verified : styles.pending}`}>
                        {restaurant.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className={styles.actions}>
                      {!restaurant.isVerified && (
                        <button 
                          onClick={() => handleVerifyRestaurant(restaurant._id)}
                          className={styles.verifyButton}
                        >
                          Verify
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteRestaurant(restaurant._id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;