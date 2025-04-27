import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "../services/axios";
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [stats, setStats] = useState({
    menuCount: 0,
    isVerified: false
  });

  // Check authentication first
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load restaurant and menu data
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Get restaurant data from localStorage
      const storedRestaurant = JSON.parse(localStorage.getItem('restaurant'));
      
      if (!storedRestaurant || !storedRestaurant.id) {
        throw new Error("Restaurant information not found");
      }

      // Fetch restaurant details
      const restaurantResponse = await axios.get(`/api/restaurants/${storedRestaurant.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Fetch menu items
      const menuResponse = await axios.get(`/api/restaurants/menu/${storedRestaurant.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setRestaurantData(restaurantResponse.data);
      setMenuItems(menuResponse.data.menu || []);
      setStats({
        menuCount: menuResponse.data.menu?.length || 0,
        isVerified: restaurantResponse.data.isVerified
      });

      // Update localStorage with latest restaurant data
      localStorage.setItem('restaurant', JSON.stringify({
        ...storedRestaurant,
        _id: restaurantResponse.data._id,
        name: restaurantResponse.data.name,
        isOpen: restaurantResponse.data.isOpen,
        isVerified: restaurantResponse.data.isVerified,
        logo: restaurantResponse.data.logo,
        coverImage: restaurantResponse.data.coverImage
      }));

    } catch (err) {
      console.error("Dashboard initialization error:", err);
      setError("Failed to load restaurant data");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle restaurant status toggle
  const handleToggleStatus = async () => {
    try {
      const newStatus = !restaurantData.isOpen;
      
      // Call API to update restaurant status
      await axios.post("/api/restaurants/availability", {
        restaurantId: restaurantData._id,
        isOpen: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      // Update local state
      setRestaurantData({
        ...restaurantData,
        isOpen: newStatus
      });

      // Update localStorage
      const storedRestaurant = JSON.parse(localStorage.getItem('restaurant'));
      localStorage.setItem('restaurant', JSON.stringify({
        ...storedRestaurant,
        isOpen: newStatus
      }));
      
    } catch (err) {
      console.error("Error toggling restaurant status:", err);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!restaurantData || !restaurantData.name) return 'R';
    return restaurantData.name.charAt(0).toUpperCase();
  };
  
  if (isLoading) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading your restaurant dashboard...</p>
        </div>
      </div>
    );
  }

  // Show a basic error state
  if (error) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.errorMessage}>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.dashboardContainer}>
      {/* Cover Photo Banner */}
      <div className={styles.coverPhotoContainer}>
        {restaurantData?.coverImage ? (
          <img 
            src={`http://localhost:3000/${restaurantData.coverImage}`}
            alt={`${restaurantData.name} cover`}
            className={styles.coverPhoto}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/1200x300?text=No+Cover+Photo";
            }}
          />
        ) : (
          <div className={styles.coverPhotoPlaceholder}>
            <span>Add a cover photo to enhance your restaurant profile</span>
          </div>
        )}
        <Link to="/profile" state={{ initialTab: 'appearance' }} className={styles.editCoverButton}>
          <span className={styles.editIcon}>✏️</span> Edit Cover
        </Link>
      </div>
      
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <div className={styles.logo}>🍽️</div>
          <h1>Restaurant <span>Dashboard</span></h1>
        </div>
        <div className={styles.userInfo}>
          <button 
            className={styles.logoutButton}
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('restaurant');
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Profile Section */}
      <div className={styles.profileSection}>
        {restaurantData?.logo ? (
          <img 
            src={`http://localhost:3000/${restaurantData.logo}`} 
            alt={restaurantData.name}
            className={styles.userAvatar}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
              const fallback = document.createElement("div");
              fallback.className = styles.userAvatar;
              fallback.textContent = getUserInitials();
              e.target.parentNode.appendChild(fallback);
            }}
          />
        ) : (
          <div className={styles.userAvatar}>
            {getUserInitials()}
          </div>
        )}
        <div className={styles.welcomeInfo}>
          <div className={styles.welcomeHeader}>
            <h2>Welcome back, {restaurantData?.name || 'Restaurant'}!</h2>
            <div className={styles.verificationBadge}>
              {restaurantData?.isVerified ? 
                <span className={styles.verified}>✓ Verified Account</span> : 
                <span className={styles.pending}>Pending Verification</span>
              }
            </div>
          </div>
          <p>Manage your restaurant, update menu items, and track your business from here.</p>
        </div>
      </div>
      
      {/* Dashboard Cards */}
      <div className={styles.dashboardGrid}>
        {/* Restaurant Status Card */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h3>Restaurant Status</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.statusInfo}>
              <div className={`${styles.statusBadge} ${restaurantData?.isOpen ? styles.statusOpen : styles.statusClosed}`}>
                {restaurantData?.isOpen ? 'Currently Open' : 'Currently Closed'}
              </div>
              <p className={styles.statusHint}>
                {restaurantData?.isOpen 
                  ? 'Your restaurant is visible to customers and accepting orders.' 
                  : 'Your restaurant is hidden from customers and not accepting orders.'}
              </p>
            </div>
            <button 
              className={`${styles.statusToggleButton} ${restaurantData?.isOpen ? styles.closeButton : styles.openButton}`}
              onClick={handleToggleStatus}
            >
              {restaurantData?.isOpen ? 'Set as Closed' : 'Set as Open'}
            </button>
          </div>
        </div>

        {/* Menu Stats Card */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h3>Menu Items</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.menuStats}>
              <div className={styles.statCount}>{stats.menuCount}</div>
              <p className={styles.statLabel}>Total Items</p>
            </div>
            <Link to="/menu-management" className={styles.actionLink}>
              Manage Menu →
            </Link>
            {menuItems.length === 0 && (
              <div className={styles.emptyMenuHint}>
                You haven't added any menu items yet. Start building your menu!
              </div>
            )}
          </div>
        </div>
        
        {/* Location Card */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h3>Location</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.locationInfo}>
              {restaurantData?.location ? (
                <>
                  <p className={styles.address}>
                    {restaurantData?.location?.address || ''}
                  </p>
                  <p className={styles.cityInfo}>
                    {restaurantData?.location?.city || ''}{restaurantData?.location?.postalCode ? `, ${restaurantData.location.postalCode}` : ''}
                  </p>
                </>
              ) : (
                <p className={styles.noInfo}>No location information available</p>
              )}
            </div>
            <Link to="/profile" state={{ initialTab: 'location' }} className={styles.actionLink}>
              Update Location →
            </Link>
          </div>
        </div>
        
        {/* Appearance Card */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h3>Appearance</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cuisineTags}>
               <span className={styles.noCuisine}>Restaurant Logo/Cover Image</span>
            </div>
            <Link to="/profile" state={{ initialTab: 'appearance' }} className={styles.actionLink}>
              Update Appearance →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className={styles.quickActionsSection}>
        <h3 className={styles.sectionTitle}>Quick Actions</h3>
        <div className={styles.quickActionGrid}>
          <Link to="/menu-management" className={styles.quickActionCard}>
            <div className={styles.quickActionIcon}>📋</div>
            <div className={styles.quickActionText}>
              <h4>Menu Management</h4>
              <p>Add, edit, or remove menu items</p>
            </div>
          </Link>
          <Link to="/profile" className={styles.quickActionCard}>
            <div className={styles.quickActionIcon}>⚙️</div>
            <div className={styles.quickActionText}>
              <h4>Profile Settings</h4>
              <p>Update your restaurant details</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Menu Preview (if menu items exist) */}
      {menuItems.length > 0 && (
        <div className={styles.recentMenuSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent Menu Items</h3>
            <Link to="/menu-management" className={styles.viewAllLink}>View All</Link>
          </div>
          <div className={styles.recentMenuGrid}>
            {menuItems.slice(0, 3).map((item) => (
              <div key={item._id} className={styles.menuItemCard}>
                {item.image ? (
                  <div className={styles.menuItemImage}>
                    <img 
                      src={`http://localhost:3000/${item.image}`} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/80?text=Food";
                      }}
                    />
                  </div>
                ) : (
                  <div className={styles.menuItemImagePlaceholder}>
                    <span>No Image</span>
                  </div>
                )}
                <div className={styles.menuItemInfo}>
                  <h4>{item.name}</h4>
                  <p className={styles.menuItemPrice}>${parseFloat(item.price).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;