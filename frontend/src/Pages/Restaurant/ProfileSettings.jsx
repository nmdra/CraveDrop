// src/pages/ProfileSettings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import axios from "../services/axios";
import styles from "./ProfileSettings.module.css";

const ProfileSettings = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // Default tab
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    telephoneNumber: "",
    location: {
      address: "",
      city: "",
      postalCode: "",
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    },
    cuisine: "",
    logo: null,
    coverImage: null,
  });
  
  const navigate = useNavigate();
  const location = useLocation(); // Get location object

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Set initial tab based on navigation state, only on initial mount if desired
    if (location.state?.initialTab) {
      setActiveTab(location.state.initialTab);
      // Optional: Clear the state after using it to prevent re-triggering on refresh/re-render
      // navigate(location.pathname, { replace: true, state: {} });
    }

    // Fetch restaurant data
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        // Get restaurant ID from localStorage
        const storedRestaurant = JSON.parse(localStorage.getItem("restaurant"));
        if (!storedRestaurant || !storedRestaurant.id) {
          throw new Error("Restaurant information not found");
        }

        // Use getRestaurantById instead of /me endpoint
        const response = await axios.get(`/api/restaurants/${storedRestaurant.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setRestaurant(response.data);
        
        // Populate form with restaurant data
        setFormData({
          name: response.data.name || "",
          description: response.data.description || "",
          telephoneNumber: response.data.telephoneNumber || "",
          location: {
            address: response.data.location?.address || "",
            city: response.data.location?.city || "",
            postalCode: response.data.location?.postalCode || "",
            coordinates: {
              latitude: response.data.location?.coordinates?.latitude || 0,
              longitude: response.data.location?.coordinates?.longitude || 0
            }
          },
          cuisine: response.data.cuisine?.join(", ") || "",
          logo: null,
          coverImage: null,
        });
      } catch (err) {
        console.error("Error fetching restaurant data:", err);
        setError("Failed to load restaurant data. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
    // Add location.state?.initialTab to dependency array if you want it to react to state changes
  }, [navigate]); // Keep dependencies minimal if you only want this on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      
      if (!validTypes.includes(file.type)) {
        setMessage(`Error: Only JPEG, JPG, PNG, and GIF images are allowed.`);
        e.target.value = ''; // Reset the file input
        return;
      }
      
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    try {
      const storedRestaurant = JSON.parse(localStorage.getItem("restaurant"));
      if (!storedRestaurant || !storedRestaurant.id) {
        throw new Error("Restaurant information not found");
      }
      
      const restaurantId = storedRestaurant.id;
      
      // Create FormData to send all data including files
      const profileFormData = new FormData();
      
      // Append text fields
      profileFormData.append("name", formData.name);
      profileFormData.append("description", formData.description);
      profileFormData.append("telephoneNumber", formData.telephoneNumber);
      // Stringify location object before appending
      profileFormData.append("location", JSON.stringify(formData.location)); 
      profileFormData.append("cuisine", formData.cuisine); // Send as comma-separated string

      // Append files only if they exist in the state
      if (formData.logo instanceof File) {
        profileFormData.append("logo", formData.logo);
      }
      if (formData.coverImage instanceof File) {
        profileFormData.append("coverImage", formData.coverImage);
      }

      // Update restaurant profile using PUT with FormData
      const response = await axios.put(`/api/restaurants/${restaurantId}`, profileFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // Content-Type is set automatically by browser for FormData
        }
      });
      
      setMessage("Profile updated successfully!");
      
      // Update local state and storage with potentially new image paths from response
      setRestaurant(response.data.restaurant); // Update local restaurant state
      if (storedRestaurant) {
        storedRestaurant.name = response.data.restaurant.name;
        storedRestaurant.logo = response.data.restaurant.logo; // Update logo path
        storedRestaurant.coverImage = response.data.restaurant.coverImage; // Update cover image path
        localStorage.setItem("restaurant", JSON.stringify(storedRestaurant));
      }
      
      // Reset file inputs in state after successful upload
      setFormData(prev => ({
        ...prev,
        logo: null, 
        coverImage: null 
      }));
      // Optionally clear file input elements visually if needed (though state reset is key)
      // document.getElementById('logo').value = null;
      // document.getElementById('coverImage').value = null;

      // No need to manually refresh, response data updates state
      
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Failed to update profile. " + (err.response?.data?.message || "Please try again."));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const storedRestaurant = JSON.parse(localStorage.getItem("restaurant"));
      if (!storedRestaurant || !storedRestaurant.id) {
        throw new Error("Restaurant information not found");
      }
      
      await axios.delete(`/api/restaurants/${storedRestaurant.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      // Clear localStorage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("restaurant");
      navigate("/login", { state: { message: "Your restaurant account has been deleted successfully." } });
      
    } catch (err) {
      console.error("Error deleting account:", err);
      setMessage("Failed to delete account. " + (err.response?.data?.message || "Please try again."));
      setConfirmDelete(false);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const newStatus = !restaurant.isOpen;
      
      await axios.post("/api/restaurants/availability", 
        { 
          restaurantId: restaurant._id,
          isOpen: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      // Update local state
      setRestaurant({
        ...restaurant,
        isOpen: newStatus
      });
      
      setMessage(`Restaurant is now ${newStatus ? "Open" : "Closed"} for orders.`);
      
    } catch (err) {
      console.error("Error toggling availability:", err);
      setMessage("Failed to update restaurant availability. Please try again.");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading profile settings...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button className={styles.button} onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Profile Settings</h1>
          <button 
            className={styles.backButton}
            onClick={() => navigate("/dashboard")}
          >
            <span className={styles.backIcon}>←</span> Back to Dashboard
          </button>
        </div>
      </header>

      {message && (
        <div className={`${styles.notification} ${message.includes("success") || message.includes("Open") || message.includes("Closed") 
          ? styles.success : styles.error}`}>
          <span className={styles.notificationIcon}>
            {message.includes("success") || message.includes("Open") || message.includes("Closed") ? "✓" : "!"}
          </span>
          <span>{message}</span>
          <button className={styles.closeNotification} onClick={() => setMessage("")}>×</button>
        </div>
      )}

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <div className={styles.profileSummary}>
            {restaurant?.logo ? (
              <img 
                src={`http://localhost:3000/${restaurant.logo}`} 
                alt={restaurant.name}
                className={styles.profileAvatar}
              />
            ) : (
              <div className={styles.profileAvatarPlaceholder}>
                {restaurant?.name?.charAt(0) || "R"}
              </div>
            )}
            <h3 className={styles.profileName}>{restaurant?.name}</h3>
            <div className={`${styles.profileStatus} ${restaurant?.isOpen ? styles.statusOpen : styles.statusClosed}`}>
              {restaurant?.isOpen ? "Open" : "Closed"}
            </div>
          </div>
          
          <nav className={styles.settingsNav}>
            <button
              className={`${styles.navButton} ${activeTab === 'profile' ? styles.active : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className={styles.navIcon}>👤</span> Profile Information
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'appearance' ? styles.active : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <span className={styles.navIcon}>🖼️</span> Restaurant Appearance
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'location' ? styles.active : ''}`}
              onClick={() => setActiveTab('location')}
            >
              <span className={styles.navIcon}>📍</span> Location Details
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'account' ? styles.active : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <span className={styles.navIcon}>⚙️</span> Account Settings
            </button>
          </nav>
          
          <div className={styles.statusToggleContainer}>
            <span className={styles.statusToggleLabel}>Restaurant Status:</span>
            <button 
              className={`${styles.statusToggleButton} ${restaurant?.isOpen ? styles.openButton : styles.closedButton}`}
              onClick={handleToggleAvailability}
            >
              {restaurant?.isOpen ? "Set as Closed" : "Set as Open"}
            </button>
          </div>
        </aside>

        <main className={styles.mainContent}>
          {/* Conditional rendering based on activeTab */}
          {activeTab === 'profile' && (
            <section className={styles.settingsSection}>
              <h2 className={styles.sectionTitle}>Profile Information</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Restaurant Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description" className={styles.label}>Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={styles.textarea}
                    rows="4"
                    placeholder="Describe your restaurant, specialties, and unique offerings..."
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="telephoneNumber" className={styles.label}>Telephone Number</label>
                  <input
                    type="tel"
                    id="telephoneNumber"
                    name="telephoneNumber"
                    value={formData.telephoneNumber}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="e.g., +1 (555) 123-4567"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="cuisine" className={styles.label}>Cuisine Types</label>
                  <input
                    type="text"
                    id="cuisine"
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="e.g., Italian, Chinese, Indian (comma separated)"
                  />
                  <div className={styles.inputHint}>Current cuisines: {formData.cuisine || "None specified"}</div>
                </div>

                <button type="submit" className={styles.saveButton}>
                  Save Profile Information
                </button>
              </form>
            </section>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <section className={styles.settingsSection}>
              <h2 className={styles.sectionTitle}>Restaurant Appearance</h2>
              {/* Use the main handleSubmit for this section's button too */}
              <form onSubmit={handleSubmit}> 
                <div className={styles.imagesPreview}>
                  <div className={styles.previewSection}>
                    <h3 className={styles.previewTitle}>Cover Image</h3>
                    <div className={styles.coverImageContainer}>
                      {restaurant?.coverImage ? (
                        <img 
                          src={`http://localhost:3000/${restaurant.coverImage}`} 
                          alt="Restaurant cover"
                          className={styles.coverImage}
                        />
                      ) : (
                        <div className={styles.coverPlaceholder}>
                          No Cover Image
                        </div>
                      )}
                    </div>
                    <div className={styles.imageUploadContainer}>
                      <input
                        type="file"
                        id="coverImage"
                        name="coverImage"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                        accept="image/jpeg,image/jpg,image/png,image/gif" // Specify exact MIME types
                      />
                      <label htmlFor="coverImage" className={styles.fileLabel}>
                        {formData.coverImage ? formData.coverImage.name : "Choose New Cover Image"}
                      </label>
                    </div>
                  </div>
                  
                  <div className={styles.previewSection}>
                    <h3 className={styles.previewTitle}>Restaurant Logo</h3>
                    <div className={styles.logoImageContainer}>
                      {restaurant?.logo ? (
                        <img 
                          src={`http://localhost:3000/${restaurant.logo}`} 
                          alt={restaurant.name}
                          className={styles.logoImage}
                        />
                      ) : (
                        <div className={styles.logoPlaceholder}>
                          {restaurant?.name?.charAt(0) || "R"}
                        </div>
                      )}
                    </div>
                    <div className={styles.imageUploadContainer}>
                      <input
                        type="file"
                        id="logo"
                        name="logo"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                        accept="image/jpeg,image/jpg,image/png,image/gif" // Specify exact MIME types
                      />
                      <label htmlFor="logo" className={styles.fileLabel}>
                        {/* Show file name if selected, otherwise prompt */}
                        {formData.logo instanceof File ? formData.logo.name : "Choose New Logo"}
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className={styles.appearanceHint}>
                  <p>Recommended dimensions:</p>
                  <ul>
                    <li>Cover Image: 1200×300 pixels</li>
                    <li>Logo: 500×500 pixels</li>
                  </ul>
                </div>
                
                {/* Button triggers the form's onSubmit */}
                <button type="submit" className={styles.saveButton}> 
                  Save Appearance Settings
                </button>
              </form>
            </section>
          )}
          
          {activeTab === 'location' && (
            <section className={styles.settingsSection}>
              <h2 className={styles.sectionTitle}>Location Details</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="location.address" className={styles.label}>Street Address</label>
                  <input
                    type="text"
                    id="location.address"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="location.city" className={styles.label}>City</label>
                    <input
                      type="text"
                      id="location.city"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="location.postalCode" className={styles.label}>Postal Code</label>
                    <input
                      type="text"
                      id="location.postalCode"
                      name="location.postalCode"
                      value={formData.location.postalCode}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>
                </div>
                
                <div className={styles.mapPlaceholder}>
                  <p>Map feature coming soon. Your restaurant will be displayed at the provided address.</p>
                </div>
                
                <button type="submit" className={styles.saveButton}>
                  Save Location Details
                </button>
              </form>
            </section>
          )}
          
          {activeTab === 'account' && (
            <section className={styles.settingsSection}>
              <h2 className={styles.sectionTitle}>Account Settings</h2>
              
              <div className={styles.accountInfo}>
                <div className={styles.infoItem}>
                  <h3 className={styles.infoTitle}>Account Status</h3>
                  <span className={`${styles.infoValue} ${restaurant?.isVerified ? styles.verified : styles.pending}`}>
                    {restaurant?.isVerified ? "Verified Account" : "Pending Verification"}
                  </span>
                </div>
                
                <div className={styles.infoItem}>
                  <h3 className={styles.infoTitle}>Restaurant ID</h3>
                  <span className={styles.infoValue}>{restaurant?._id}</span>
                </div>
              </div>
              
              <div className={styles.dangerZone}>
                <h3 className={styles.dangerTitle}>Danger Zone</h3>
                <p className={styles.dangerDescription}>
                  Permanently delete your restaurant account and all associated data. This action cannot be undone.
                </p>
                
                {!confirmDelete ? (
                  <button 
                    onClick={() => setConfirmDelete(true)} 
                    className={styles.deleteButton}
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className={styles.confirmDelete}>
                    <div className={styles.confirmMessage}>
                      <span className={styles.warningIcon}>⚠️</span>
                      <p>Are you absolutely sure you want to delete your account? All your data will be permanently removed.</p>
                    </div>
                    <div className={styles.confirmButtons}>
                      <button 
                        onClick={handleDeleteAccount} 
                        className={styles.confirmDeleteButton}
                      >
                        Yes, Delete My Account
                      </button>
                      <button 
                        onClick={() => setConfirmDelete(false)} 
                        className={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfileSettings;