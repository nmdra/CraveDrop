// src/pages/MenuManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import styles from "./MenuManagement.module.css";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null
  });
  const [message, setMessage] = useState("");

  // Get restaurant ID from localStorage
  const getRestaurantId = () => {
    const restaurant = JSON.parse(localStorage.getItem("restaurant"));
    return restaurant?.id;
  };

  // Fetch menu items
  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const restaurantId = getRestaurantId();
      if (!restaurantId) {
        throw new Error("Restaurant ID not found");
      }

      const response = await axios.get(`/api/restaurants/menu/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      setMenuItems(response.data.menu || []);
      setError("");
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError("Failed to load menu items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    try {
      const restaurantId = getRestaurantId();
      if (!restaurantId) {
        throw new Error("Restaurant ID not found");
      }

      // Create FormData object for file upload
      const form = new FormData();
      form.append("restaurantId", restaurantId);
      form.append("name", formData.name);
      form.append("description", formData.description || "");
      form.append("price", formData.price);
      
      // Add image if it exists
      if (formData.image) {
        form.append("image", formData.image);
        console.log("Image attached:", formData.image.name);
      }

      let response;
      if (editingItem) {
        // Update existing item
        response = await axios.put(
          `/api/restaurants/menu/${restaurantId}/${editingItem._id}`, 
          form, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
              // Don't set Content-Type manually - axios will set it for FormData
            }
          }
        );
        console.log("Update response:", response.data);
        setMessage("Menu item updated successfully");
      } else {
        // Add new item
        response = await axios.post(
          "/api/restaurants/menu", 
          form, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
              // Don't set Content-Type manually - axios will set it for FormData
            }
          }
        );
        console.log("Create response:", response.data);
        setMessage("Menu item added successfully");
      }

      // Reset form and fetch updated menu items
      setFormData({ name: "", description: "", price: "", image: null });
      document.getElementById("image").value = ""; // Reset file input
      setEditingItem(null);
      fetchMenuItems();
    } catch (err) {
      console.error("Error with menu item:", err);
      console.error("Error details:", err.response?.data);
      setMessage(err.response?.data?.message || "Failed to save menu item");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price,
      image: null // Can't pre-populate file input
    });
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      const restaurantId = getRestaurantId();
      await axios.delete(`/api/restaurants/menu/${restaurantId}/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      setMessage("Menu item deleted successfully");
      fetchMenuItems();
    } catch (err) {
      console.error("Error deleting menu item:", err);
      setMessage("Failed to delete menu item");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL menu items? This cannot be undone.")) {
      return;
    }

    try {
      const restaurantId = getRestaurantId();
      await axios.delete(`/api/restaurants/menu/${restaurantId}/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      setMessage("All menu items deleted successfully");
      fetchMenuItems();
    } catch (err) {
      console.error("Error deleting all menu items:", err);
      setMessage("Failed to delete all menu items");
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFormData({ name: "", description: "", price: "", image: null });
    document.getElementById("image").value = ""; // Reset file input
  };

  // If loading
  if (loading && menuItems.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading menu items...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Menu Management</h1>
      
      {message && (
        <div className={message.includes("success") ? styles.success : styles.error}>
          {message}
        </div>
      )}
      
      <div className={styles.content}>
        <div className={styles.formSection}>
          <h2>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Item Name*</label>
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
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.textarea}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="price">Price*</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="image">Image</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              <label htmlFor="image" className={styles.fileLabel}>
                {formData.image ? formData.image.name : 'Choose an image'}
              </label>
            </div>
            
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.button}>
                {editingItem ? "Update Item" : "Add Item"}
              </button>
              
              {editingItem && (
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className={styles.menuSection}>
          <div className={styles.menuHeader}>
            <h2>Menu Items ({menuItems.length})</h2>
            {menuItems.length > 0 && (
              <button onClick={handleDeleteAll} className={styles.dangerButton}>
                Delete All
              </button>
            )}
          </div>
          
          {error && <p className={styles.error}>{error}</p>}
          
          {menuItems.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No menu items found. Add your first menu item using the form.</p>
            </div>
          ) : (
            <div className={styles.menuItemsList}>
              {menuItems.map((item) => (
                <div key={item._id} className={styles.menuItemCard}>
                  {item.image && (
                    <div className={styles.imageContainer}>
                      <img 
                        src={`http://localhost:3000/${item.image}`} 
                        alt={item.name}
                        className={styles.itemImage}
                        onError={(e) => {
                          console.error("Image failed to load:", item.image);
                          e.target.src = "https://via.placeholder.com/100?text=No+Image";
                          e.target.style.background = 'var(--input-background)';
                          e.target.style.color = 'var(--text-color)';
                          e.target.style.padding = '10px';
                          e.target.style.textAlign = 'center';
                          e.target.style.fontSize = '12px';
                        }}
                      />
                    </div>
                  )}
                  <div className={styles.itemContent}>
                    <h3>{item.name}</h3>
                    <p className={styles.description}>{item.description || "No description"}</p>
                    <p className={styles.price}>Rs. {parseFloat(item.price).toFixed(2)}</p>
                  </div>
                  <div className={styles.itemActions}>
                    <button 
                      onClick={() => handleEdit(item)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;